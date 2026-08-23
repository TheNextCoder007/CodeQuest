/**
 * Testes da leitura do progresso do aluno.
 *
 * Motivo de existir: um perfil com 445 XP e 8 licoes apareceu zerado na tela
 * e a tela de escolher @username voltou a aparecer para uma conta que ja
 * tinha username. A causa nao foi apagar dado nenhum - foi a leitura tratar
 * "nao consegui ler" como "essa conta e nova".
 *
 * Estes testes travam a regra: **falha de leitura nunca vira estado zerado**.
 *
 * Rodar com: npm run test:progresso
 */

import { readFileSync } from 'node:fs';
import { lerEstadoDoServidor } from '../src/lib/player/loadPlayerState';

let passaram = 0;
let falharam = 0;

const ok = (condicao: boolean, titulo: string) => {
  if (condicao) {
    passaram += 1;
    console.log(`ok     ${titulo}`);
  } else {
    falharam += 1;
    console.error(`FALHOU ${titulo}`);
  }
};

const secao = (titulo: string) => console.log(`\n--- ${titulo} ---`);

/* -------------------------------------------------------------------------
 * Dublê do supabase-js
 * ---------------------------------------------------------------------- */

interface Resposta {
  data: unknown;
  error: unknown;
}

interface Config {
  /** Resposta do primeiro SELECT em profiles. */
  profiles?: Resposta;
  /** Resposta do SELECT em profiles feito DEPOIS de um insert conflitante. */
  profilesRelido?: Resposta;
  progress?: Resposta;
  achievements?: Resposta;
  insertProfile?: Resposta;
  getUser?: { data: { user: unknown } | null; error: unknown };
  /** Simula o cliente estourando uma excecao (rede caiu no meio). */
  excecao?: boolean;
}

const criarCliente = (config: Config) => {
  const chamadas: string[] = [];
  let leiturasDeProfiles = 0;

  const construtor = (tabela: string) => {
    let operacao = 'select';

    const resolver = (): Promise<Resposta> => {
      if (config.excecao) return Promise.reject(new Error('rede caiu'));

      if (tabela === 'profiles' && operacao === 'insert') {
        return Promise.resolve(
          config.insertProfile ?? {
            data: null,
            error: { code: '23505', message: 'duplicate key value' },
          },
        );
      }
      if (tabela === 'profiles') {
        leiturasDeProfiles += 1;
        return Promise.resolve(
          leiturasDeProfiles === 1
            ? (config.profiles ?? { data: null, error: null })
            : (config.profilesRelido ?? { data: null, error: null }),
        );
      }
      if (tabela === 'user_progress') return Promise.resolve(config.progress ?? { data: [], error: null });
      if (tabela === 'user_achievements') {
        return Promise.resolve(config.achievements ?? { data: [], error: null });
      }
      return Promise.resolve({ data: null, error: null });
    };

    const construtorEncadeado: Record<string, unknown> = {
      select: () => construtorEncadeado,
      eq: () => construtorEncadeado,
      insert: () => {
        operacao = 'insert';
        chamadas.push(`insert:${tabela}`);
        return construtorEncadeado;
      },
      upsert: () => {
        operacao = 'upsert';
        chamadas.push(`upsert:${tabela}`);
        return construtorEncadeado;
      },
      update: () => {
        operacao = 'update';
        chamadas.push(`update:${tabela}`);
        return construtorEncadeado;
      },
      maybeSingle: () => resolver(),
      // Torna o construtor "aguardavel": `await supabase.from(x).select().eq()`
      then: (aoResolver: unknown, aoRejeitar: unknown) =>
        resolver().then(aoResolver as never, aoRejeitar as never),
    };
    return construtorEncadeado;
  };

  return {
    chamadas,
    cliente: {
      from: construtor as never,
      auth: {
        getUser: async () =>
          config.getUser ?? { data: { user: { id: 'u1' } }, error: null },
      },
    },
  };
};

const usuario = { id: 'u1', name: 'TheNextOne', avatarUrl: null };

const perfilReal = {
  id: 'u1',
  name: 'TheNextOne',
  username: 'thenextone',
  avatar_url: null,
  xp_total: 445,
  level: 5,
  streak_count: 2,
  last_study_date: '2026-08-22',
  current_language: 'python',
};

const oitoLicoes = [
  'py-fund-01', 'py-fund-02', 'py-fund-03', 'py-fund-04', 'py-fund-05',
  'py-var-01', 'py-var-02', 'py-var-03',
].map((lesson_id) => ({ lesson_id, flawless: false }));

/* -------------------------------------------------------------------------
 * 1. Caminho feliz
 * ---------------------------------------------------------------------- */
secao('leitura normal');
{
  const { cliente } = criarCliente({
    profiles: { data: perfilReal, error: null },
    progress: { data: oitoLicoes, error: null },
    achievements: { data: [{ achievement_id: 'primeira-licao' }], error: null },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'ok', 'perfil existente e lido com sucesso');
  if (r.tipo === 'ok') {
    ok(r.state.profile.xp_total === 445, 'XP vem do servidor (445)');
    ok(r.state.profile.username === 'thenextone', 'username preservado');
    ok(r.state.completedLessonIds.length === 8, 'as 8 licoes concluidas voltam');
    ok(r.state.unlockedAchievementIds.length === 1, 'conquistas voltam');
  }
}

/* -------------------------------------------------------------------------
 * 2. O bug relatado: falha de leitura NAO pode virar perfil zerado
 * ---------------------------------------------------------------------- */
secao('falha de leitura nunca zera o progresso');
{
  const { cliente, chamadas } = criarCliente({
    profiles: { data: null, error: { message: 'network error' } },
    progress: { data: null, error: { message: 'network error' } },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'erro no SELECT de profiles devolve erro (nao perfil novo)');
  ok(!chamadas.includes('insert:profiles'), 'nao cria perfil quando a leitura falhou');
  ok(!chamadas.includes('upsert:profiles'), 'nunca faz upsert em profiles');
}
{
  const { cliente } = criarCliente({
    profiles: { data: perfilReal, error: null },
    progress: { data: null, error: { message: 'timeout' } },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'erro só em user_progress ja invalida a leitura inteira');
}
{
  const { cliente } = criarCliente({
    profiles: { data: perfilReal, error: null },
    achievements: { data: null, error: { message: 'timeout' } },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'erro em user_achievements tambem invalida a leitura');
}
{
  const { cliente } = criarCliente({ excecao: true });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'excecao do cliente vira erro, nao estado vazio');
}

/* -------------------------------------------------------------------------
 * 3. RLS barrado devolve LISTA VAZIA, sem erro - o caso mais traicoeiro
 * ---------------------------------------------------------------------- */
secao('sessao nao confirmada (token expirado / logo apos o Google)');
{
  const { cliente, chamadas } = criarCliente({
    profiles: { data: null, error: null },          // vazio, sem erro
    getUser: { data: null, error: { message: 'invalid JWT' } },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'lista vazia + sessao nao confirmada = erro');
  ok(!chamadas.includes('insert:profiles'), 'nao cria perfil zerado nesse caso');
}
{
  const { cliente } = criarCliente({
    profiles: { data: null, error: null },
    getUser: { data: { user: null }, error: null },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'getUser sem usuario tambem e tratado como erro');
}

/* -------------------------------------------------------------------------
 * 4. Conta realmente nova
 * ---------------------------------------------------------------------- */
secao('conta nova de verdade');
{
  const novo = { ...perfilReal, username: null, xp_total: 0, level: 1, streak_count: 2 };
  const { cliente, chamadas } = criarCliente({
    profiles: { data: null, error: null },
    getUser: { data: { user: { id: 'u1' } }, error: null },
    insertProfile: { data: { ...novo, streak_count: 0 }, error: null },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'ok', 'conta nova recebe um perfil');
  ok(chamadas.includes('insert:profiles'), 'usa INSERT');
  ok(!chamadas.includes('upsert:profiles'), 'nunca usa UPSERT (upsert sobrescreveria perfil existente)');
  if (r.tipo === 'ok') ok(r.state.profile.xp_total === 0, 'perfil novo comeca com 0 XP');
}

/* -------------------------------------------------------------------------
 * 5. Corrida com o gatilho handle_new_user
 * ---------------------------------------------------------------------- */
secao('corrida com o gatilho do banco');
{
  const { cliente } = criarCliente({
    profiles: { data: null, error: null },
    getUser: { data: { user: { id: 'u1' } }, error: null },
    insertProfile: { data: null, error: { code: '23505', message: 'duplicate key' } },
    profilesRelido: { data: perfilReal, error: null },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'ok', 'conflito no insert nao quebra a leitura');
  if (r.tipo === 'ok') {
    ok(r.state.profile.xp_total === 445, 'apos o conflito lemos a linha REAL (445 XP), nao o rascunho zerado');
    ok(r.state.profile.username === 'thenextone', 'e o username existente e preservado');
  }
}
{
  const { cliente } = criarCliente({
    profiles: { data: null, error: null },
    getUser: { data: { user: { id: 'u1' } }, error: null },
    insertProfile: { data: null, error: { message: 'permission denied' } },
    profilesRelido: { data: null, error: { message: 'permission denied' } },
  });
  const r = await lerEstadoDoServidor(cliente, usuario);
  ok(r.tipo === 'erro', 'se nem o insert nem a releitura funcionam, e erro');
}

/* -------------------------------------------------------------------------
 * 6. Guardas no codigo-fonte (evita a regressao voltar por outro caminho)
 * ---------------------------------------------------------------------- */
secao('guardas no codigo-fonte');
{
  const provider = readFileSync('src/lib/player/PlayerProvider.tsx', 'utf8');
  const leitura = readFileSync('src/lib/player/loadPlayerState.ts', 'utf8');

  ok(
    !/from\('profiles'\)\s*\n?\s*\.upsert\(/.test(provider + leitura),
    'ninguem faz upsert em profiles',
  );
  ok(
    !/setState\(emptyState\(/.test(provider),
    'nenhum caminho de erro troca o estado por emptyState()',
  );
  ok(
    !/name:\s*profile\.name,/.test(provider),
    'a conclusao de licao nao regrava o nome de exibicao',
  );
  ok(
    /alreadyCompleted\s*\n?\s*\?\s*supabase/.test(provider),
    'refazer licao nao regrava xp_earned (nao rebaixa o historico)',
  );

  const gate = readFileSync('src/components/UsernameGate.tsx', 'utf8');
  ok(
    /origem !== 'nenhum'/.test(gate),
    'a tela de @username so aparece com o perfil confirmado pelo servidor',
  );
}

/* -------------------------------------------------------------------------
 * 7. As migrations nao podem apagar progresso
 * ---------------------------------------------------------------------- */
secao('migrations idempotentes');
{
  const arquivos = ['supabase/migrations/0001_init.sql', 'supabase/migrations/0002_amigos.sql'];
  for (const arquivo of arquivos) {
    const sql = readFileSync(arquivo, 'utf8')
      // ignora comentarios: o que importa e o SQL que roda de verdade
      .split('\n')
      .filter((linha) => !linha.trim().startsWith('--'))
      .join('\n')
      .toLowerCase();

    ok(!/\bdrop\s+table\b/.test(sql), `${arquivo}: nenhum DROP TABLE`);
    ok(!/\btruncate\b/.test(sql), `${arquivo}: nenhum TRUNCATE`);
    ok(
      !/\bdelete\s+from\s+public\.(user_progress|profiles|user_achievements)\b/.test(sql),
      `${arquivo}: nenhum DELETE em tabela de aluno`,
    );
    ok(
      !/create\s+table\s+public\./.test(sql),
      `${arquivo}: todo CREATE TABLE usa "if not exists"`,
    );
  }

  const init = readFileSync('supabase/migrations/0001_init.sql', 'utf8').toLowerCase();
  ok(
    !/create\s+policy\s+"[^"]*"\s*\n?\s*on\s+public\.user_progress\s+for\s+delete/.test(init),
    'user_progress nao tem policy de DELETE (o cliente nao consegue apagar progresso)',
  );
}

/* ---------------------------------------------------------------------- */
console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
