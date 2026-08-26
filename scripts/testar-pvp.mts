/**
 * Testes do modo 1v1, num PostgreSQL real (PGlite/WASM).
 *
 * Duas coisas sao verificadas aqui:
 *
 *   1. **A partida inteira**, jogada pelas mesmas funcoes que o aplicativo
 *      chama - inclusive as tentativas de trapaca (responder duas vezes,
 *      pular pergunta, mexer em partida alheia, forjar o placar).
 *   2. **A paridade das regras**: a pontuacao existe em SQL (que manda) e em
 *      TypeScript (usada no modo demonstracao e, depois, pelos bots). As duas
 *      sao comparadas entrada por entrada; se alguem mexer numa e esquecer da
 *      outra, este teste quebra.
 *
 * Rodar com: npm run test:pvp
 */

import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { normalizarResposta, pontuar, desfecho, sortearPerguntas } from '../src/lib/pvp/regras';
import { embaralhar, embaralharComSemente } from '../src/lib/embaralhar';
import { pvpQuestions } from '../src/content/pvp-questions';

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
const ler = (caminho: string) => readFileSync(caminho, 'utf8');

const BASE_SUPABASE = `
  create schema if not exists auth;
  do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  end $$;
  create table if not exists auth.users (
    id uuid primary key default gen_random_uuid(),
    email text,
    raw_user_meta_data jsonb not null default '{}'::jsonb
  );
  create or replace function auth.uid() returns uuid
    language sql stable
    as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
`;

const ANFITRIAO = '11111111-1111-1111-1111-111111111111';
const CONVIDADO = '22222222-2222-2222-2222-222222222222';
const ESTRANHO = '33333333-3333-3333-3333-333333333333';

const db = await PGlite.create();
await db.exec(BASE_SUPABASE);
for (const arquivo of [
  'supabase/migrations/0001_init.sql',
  'supabase/migrations/0002_amigos.sql',
  'supabase/migrations/0003_protecao_progresso.sql',
  'supabase/migrations/0004_perfis_publicos.sql',
  'supabase/migrations/0005_pvp.sql',
  // A 0006 troca `pvp_estado` e `pvp_finalizar` por versoes que tambem sabem
  // lidar com bot. Ela entra aqui de proposito: o duelo entre amigos precisa
  // continuar passando nestes testes DEPOIS da mudanca.
  'supabase/migrations/0006_ranqueado.sql',
  'supabase/migrations/0007_embaralhar_alternativas.sql',
  'supabase/migrations/0008_desafios_diarios.sql',
  'supabase/migrations/0009_ranqueado_elite.sql',
  'supabase/seed.sql',
]) {
  await db.exec(ler(arquivo));
}

/** Passa a "logar" como esse usuario nas proximas chamadas. */
const como = async (id: string | null) => {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
};

const criarConta = async (id: string, nome: string, username: string) => {
  await db.query(
    `insert into auth.users (id, email, raw_user_meta_data)
     values ($1, $2, jsonb_build_object('name', $3::text))`,
    [id, `${username}@codequest.dev`, nome],
  );
  await db.query('update public.profiles set username = $2 where id = $1', [id, username]);
};

const erroDe = async (fn: () => Promise<unknown>): Promise<string | null> => {
  try {
    await fn();
    return null;
  } catch (falha) {
    return falha instanceof Error ? falha.message : String(falha);
  }
};

/* =========================================================================
 * Preparo
 * ====================================================================== */
secao('preparo');
await criarConta(ANFITRIAO, 'Anfitriao', 'anfitriao');
await criarConta(CONVIDADO, 'Convidado', 'convidado');
await criarConta(ESTRANHO, 'Estranho', 'estranho');

const banco = await db.query<{ n: number }>('select count(*)::int as n from public.pvp_questions');
// Derivado do curriculo, e nao de um numero fixo: o banco de perguntas cresce
// junto com as trilhas, e uma constante aqui envelhece a cada lote novo.
ok(
  banco.rows[0].n === pvpQuestions.length,
  `o seed populou o banco de perguntas (${banco.rows[0].n} de ${pvpQuestions.length})`,
);

const temas = await db.query<{ language_slug: string; n: number }>(
  'select language_slug, count(*)::int as n from public.pvp_questions group by 1 order by 1',
);
ok(temas.rows.length === 6, `existem perguntas de ${temas.rows.length} temas`);
ok(
  temas.rows.every((linha) => linha.n >= 5),
  'todo tema tem pelo menos 5 perguntas (o minimo de uma partida)',
);

/* =========================================================================
 * Convite
 * ====================================================================== */
secao('convite');
await como(ANFITRIAO);

const semAmizade = await erroDe(() => db.query("select public.pvp_convidar('convidado', 'python')"));
ok(
  semAmizade !== null && /amigos confirmados/i.test(semAmizade),
  'nao da para convidar quem nao e amigo confirmado',
);

await db.query(
  `insert into public.friendships (user_id, friend_id, status) values ($1, $2, 'accepted')`,
  [ANFITRIAO, CONVIDADO],
);

const contraSiMesmo = await erroDe(() => db.query("select public.pvp_convidar('anfitriao', 'todas')"));
ok(contraSiMesmo !== null, 'nao da para duelar consigo mesmo');

const inexistente = await erroDe(() => db.query("select public.pvp_convidar('ninguem', 'todas')"));
ok(inexistente !== null, 'convidar username inexistente da erro');

const criada = await db.query<{ pvp_convidar: string }>(
  "select public.pvp_convidar('convidado', 'python') as pvp_convidar",
);
const partida = criada.rows[0].pvp_convidar;
ok(Boolean(partida), 'convite criado');

const duplicado = await erroDe(() => db.query("select public.pvp_convidar('convidado', 'python')"));
ok(
  duplicado !== null && /andamento/i.test(duplicado),
  'nao da para abrir dois convites com a mesma pessoa',
);

const perguntas = await db.query<{ n: number; temas: number }>(
  `select count(*)::int as n, count(distinct q.language_slug)::int as temas
     from public.match_questions mq
     join public.pvp_questions q on q.id = mq.question_id
    where mq.match_id = $1`,
  [partida],
);
ok(perguntas.rows[0].n === 5, 'a partida sorteou 5 perguntas');
ok(perguntas.rows[0].temas === 1, 'e todas sao do tema escolhido (python)');

/* =========================================================================
 * Quem pode responder o convite
 * ====================================================================== */
secao('quem pode o que');
await como(ESTRANHO);
const bisbilhotando = await erroDe(() => db.query('select * from public.pvp_estado($1)', [partida]));
ok(
  bisbilhotando !== null && /nao participa/i.test(bisbilhotando),
  'quem nao esta na partida nao consegue nem ver o estado',
);

await como(ANFITRIAO);
const anfitriaoAceitando = await erroDe(() =>
  db.query('select public.pvp_responder_convite($1, true)', [partida]),
);
ok(
  anfitriaoAceitando !== null && /convidado/i.test(anfitriaoAceitando),
  'o anfitriao nao aceita o proprio convite',
);

await como(CONVIDADO);
const aceite = await db.query<{ pvp_responder_convite: string }>(
  'select public.pvp_responder_convite($1, true) as pvp_responder_convite',
  [partida],
);
ok(aceite.rows[0].pvp_responder_convite === 'ativa', 'o convidado aceita e a partida comeca');

const segundaResposta = await erroDe(() =>
  db.query('select public.pvp_responder_convite($1, false)', [partida]),
);
ok(segundaResposta !== null, 'o convite nao pode ser respondido duas vezes');

/* =========================================================================
 * A partida
 * ====================================================================== */
secao('perguntas e respostas');
await como(ANFITRIAO);

const primeira = await db.query<{ num: number; tipo: string; enunciado: string; total: number }>(
  'select * from public.pvp_pergunta($1, 1)',
  [partida],
);
ok(primeira.rows.length === 1, 'a pergunta 1 e entregue');
ok(primeira.rows[0].total === 5, 'a partida tem 5 perguntas');
ok(
  !Object.keys(primeira.rows[0]).includes('answer'),
  'a pergunta entregue NAO traz o gabarito junto',
);

const pulando = await erroDe(() => db.query('select * from public.pvp_pergunta($1, 3)', [partida]));
ok(
  pulando !== null && /anterior/i.test(pulando),
  'nao da para pular direto para a pergunta 3',
);

const foraDoIntervalo = await erroDe(() =>
  db.query('select * from public.pvp_pergunta($1, 99)', [partida]),
);
ok(foraDoIntervalo !== null, 'pergunta fora do intervalo da erro');

/** Responde a pergunta `n` com o gabarito (ou errado de proposito). */
const responder = async (jogador: string, n: number, acertando: boolean) => {
  await como(jogador);
  await db.query('select * from public.pvp_pergunta($1, $2)', [partida, n]);

  const gabarito = await db.query<{ answer: string }>(
    `select q.answer from public.match_questions mq
       join public.pvp_questions q on q.id = mq.question_id
      where mq.match_id = $1 and mq.ordem = $2`,
    [partida, n],
  );

  const resposta = acertando ? gabarito.rows[0].answer : 'resposta claramente errada';
  const r = await db.query<{ correta: boolean; pontos: number; ms: number; gabarito: string }>(
    'select * from public.pvp_responder($1, $2, $3)',
    [partida, n, resposta],
  );
  return r.rows[0];
};

const r1 = await responder(ANFITRIAO, 1, true);
ok(r1.correta === true, 'resposta certa e reconhecida');
ok(r1.pontos > 100, `acerto rapido vale mais de 100 pontos (${r1.pontos})`);
ok(typeof r1.gabarito === 'string' && r1.gabarito.length > 0, 'o gabarito volta DEPOIS de responder');

await como(ANFITRIAO);
const respondeuDeNovo = await erroDe(() =>
  db.query('select * from public.pvp_responder($1, 1, $2)', [partida, 'outra coisa']),
);
ok(
  respondeuDeNovo !== null && /ja foi respondida/i.test(respondeuDeNovo),
  'nao da para responder a mesma pergunta duas vezes',
);

const semPedir = await erroDe(() =>
  db.query('select * from public.pvp_responder($1, 4, $2)', [partida, 'chute']),
);
ok(
  semPedir !== null && /peca a pergunta/i.test(semPedir),
  'nao da para responder uma pergunta que nunca foi entregue',
);

// Anfitriao acerta tudo; convidado erra duas.
for (let n = 2; n <= 5; n += 1) await responder(ANFITRIAO, n, true);
for (let n = 1; n <= 5; n += 1) await responder(CONVIDADO, n, n <= 3);

/* =========================================================================
 * Placar durante a partida
 * ====================================================================== */
secao('placar');
await como(CONVIDADO);
const estadoParcial = await db.query<{
  host_respondidas: number;
  guest_respondidas: number;
  host_pontos: number;
  guest_pontos: number;
}>('select * from public.pvp_estado($1)', [partida]);
ok(estadoParcial.rows[0].host_respondidas === 5, 'o estado mostra o avanco do adversario');
ok(
  estadoParcial.rows[0].host_pontos === 0,
  'mas NAO mostra os pontos do adversario antes do fim',
);
ok(estadoParcial.rows[0].guest_pontos > 0, 'o proprio placar aparece normalmente');

/* =========================================================================
 * Resultado
 * ====================================================================== */
secao('resultado');
const fim = await db.query<{
  status: string;
  winner_id: string | null;
  pontos_host: number;
  pontos_guest: number;
}>('select * from public.pvp_finalizar($1)', [partida]);

ok(fim.rows[0].status === 'encerrada', 'a partida encerra quando os dois terminam');
ok(fim.rows[0].winner_id === ANFITRIAO, 'quem acertou mais venceu');
ok(
  fim.rows[0].pontos_host > fim.rows[0].pontos_guest,
  `o placar bate (${fim.rows[0].pontos_host} x ${fim.rows[0].pontos_guest})`,
);

const somaReal = await db.query<{ soma: number }>(
  'select coalesce(sum(pontos),0)::int as soma from public.match_answers where match_id = $1 and user_id = $2',
  [partida, ANFITRIAO],
);
ok(
  somaReal.rows[0].soma === fim.rows[0].pontos_host,
  'o placar gravado e a soma real das respostas (nada veio do cliente)',
);

const denovo = await db.query<{ status: string; winner_id: string }>(
  'select * from public.pvp_finalizar($1)',
  [partida],
);
ok(denovo.rows[0].status === 'encerrada', 'finalizar de novo nao quebra nada');

const statsDepois = await db.query<{ n: number }>(
  'select count(*)::int as n from public.pvp_stats',
);
ok(statsDepois.rows[0].n === 2, 'as estatisticas dos dois jogadores foram criadas');

const statsAnfitriao = await db.query<{
  vitorias: number;
  derrotas: number;
  partidas: number;
  vitorias_por_tema: Record<string, number>;
}>('select vitorias, derrotas, partidas, vitorias_por_tema from public.pvp_stats where user_id = $1', [
  ANFITRIAO,
]);
ok(statsAnfitriao.rows[0].vitorias === 1, 'o vencedor ganhou uma vitoria');
ok(statsAnfitriao.rows[0].derrotas === 0, 'e nenhuma derrota');
ok(statsAnfitriao.rows[0].partidas === 1, 'a partida foi contada');
ok(
  statsAnfitriao.rows[0].vitorias_por_tema.python === 1,
  'a vitoria foi contada no tema jogado (python)',
);

const statsConvidado = await db.query<{ vitorias: number; derrotas: number }>(
  'select vitorias, derrotas from public.pvp_stats where user_id = $1',
  [CONVIDADO],
);
ok(statsConvidado.rows[0].derrotas === 1, 'o perdedor levou uma derrota');
ok(statsConvidado.rows[0].vitorias === 0, 'e nenhuma vitoria');

// O placar so aparece inteiro depois do fim.
await como(CONVIDADO);
const estadoFinal = await db.query<{ host_pontos: number; guest_pontos: number }>(
  'select * from public.pvp_estado($1)',
  [partida],
);
ok(estadoFinal.rows[0].host_pontos > 0, 'terminada a partida, o placar do adversario aparece');

/* =========================================================================
 * Empate
 * ====================================================================== */
secao('empate');
await db.query(
  `insert into public.friendships (user_id, friend_id, status) values ($1, $2, 'accepted')`,
  [ANFITRIAO, ESTRANHO],
);
await como(ANFITRIAO);
const segunda = (
  await db.query<{ pvp_convidar: string }>(
    "select public.pvp_convidar('estranho', 'geral') as pvp_convidar",
  )
).rows[0].pvp_convidar;
await como(ESTRANHO);
await db.query('select public.pvp_responder_convite($1, true)', [segunda]);

// Os dois erram tudo: 0 a 0.
for (const jogador of [ANFITRIAO, ESTRANHO]) {
  for (let n = 1; n <= 5; n += 1) {
    await como(jogador);
    await db.query('select * from public.pvp_pergunta($1, $2)', [segunda, n]);
    await db.query('select * from public.pvp_responder($1, $2, $3)', [segunda, n, 'errado']);
  }
}
const empate = await db.query<{ winner_id: string | null; pontos_host: number }>(
  'select * from public.pvp_finalizar($1)',
  [segunda],
);
ok(empate.rows[0].winner_id === null, 'empate nao tem vencedor');
ok(empate.rows[0].pontos_host === 0, 'errar tudo da 0 ponto');

const empateStats = await db.query<{ empates: number }>(
  'select empates from public.pvp_stats where user_id = $1',
  [ANFITRIAO],
);
ok(empateStats.rows[0].empates === 1, 'o empate foi contado nas estatisticas');

/* =========================================================================
 * Recusar e cancelar
 * ====================================================================== */
secao('recusar e cancelar');
await como(ANFITRIAO);
const terceira = (
  await db.query<{ pvp_convidar: string }>(
    "select public.pvp_convidar('convidado', 'todas') as pvp_convidar",
  )
).rows[0].pvp_convidar;
await como(CONVIDADO);
const recusa = await db.query<{ pvp_responder_convite: string }>(
  'select public.pvp_responder_convite($1, false) as pvp_responder_convite',
  [terceira],
);
ok(recusa.rows[0].pvp_responder_convite === 'recusada', 'da para recusar um convite');

await como(ANFITRIAO);
const quarta = (
  await db.query<{ pvp_convidar: string }>(
    "select public.pvp_convidar('convidado', 'todas') as pvp_convidar",
  )
).rows[0].pvp_convidar;
const cancelamento = await db.query<{ pvp_cancelar: string }>(
  'select public.pvp_cancelar($1) as pvp_cancelar',
  [quarta],
);
ok(cancelamento.rows[0].pvp_cancelar === 'cancelada', 'o anfitriao pode cancelar o convite');

/* =========================================================================
 * Seguranca declarada no schema
 * ====================================================================== */
secao('seguranca');
const policiesQuestoes = await db.query<{ n: number }>(
  `select count(*)::int as n from pg_policies
    where schemaname = 'public' and tablename = 'pvp_questions'`,
);
ok(
  policiesQuestoes.rows[0].n === 0,
  'pvp_questions nao tem policy nenhuma - o gabarito nao sai do banco',
);

const rlsQuestoes = await db.query<{ relrowsecurity: boolean }>(
  `select relrowsecurity from pg_class where oid = 'public.pvp_questions'::regclass`,
);
ok(rlsQuestoes.rows[0].relrowsecurity === true, 'e o RLS esta ligado nela');

for (const tabela of ['matches', 'match_answers']) {
  const cmds = await db.query<{ cmd: string }>(
    `select cmd from pg_policies where schemaname = 'public' and tablename = $1`,
    [tabela],
  );
  const lista = cmds.rows.map((linha) => linha.cmd.toUpperCase());
  ok(lista.includes('SELECT'), `${tabela}: leitura permitida so para participantes`);
  ok(
    !lista.includes('INSERT') && !lista.includes('UPDATE') && !lista.includes('DELETE'),
    `${tabela}: nenhuma escrita direta pelo cliente (so pelas funcoes)`,
  );
}

const podeChamar = async (assinatura: string) =>
  (
    await db.query<{ tem: boolean }>('select has_function_privilege($1, $2, $3) as tem', [
      'authenticated',
      assinatura,
      'execute',
    ])
  ).rows[0].tem;

ok(await podeChamar('public.pvp_convidar(text, text)'), 'o cliente pode chamar pvp_convidar');
ok(await podeChamar('public.pvp_responder(uuid, int, text)'), 'o cliente pode chamar pvp_responder');
ok(
  !(await podeChamar('public.pvp_registrar_stats(uuid, uuid, int, text)')),
  'mas NAO pode escrever nas estatisticas direto',
);

/* =========================================================================
 * Paridade: as regras em SQL x as regras em TypeScript
 * ====================================================================== */
secao('paridade SQL x TypeScript');
{
  const casos: { correta: boolean; ms: number }[] = [];
  for (const correta of [true, false]) {
    for (const ms of [0, 1, 199, 200, 999, 1000, 5000, 9999, 19_800, 19_999, 20_000, 25_000, -50]) {
      casos.push({ correta, ms });
    }
  }

  let divergencias = 0;
  for (const caso of casos) {
    const noBanco = (
      await db.query<{ pvp_pontuar: number }>('select public.pvp_pontuar($1, $2) as pvp_pontuar', [
        caso.correta,
        caso.ms,
      ])
    ).rows[0].pvp_pontuar;
    const noCodigo = pontuar(caso.correta, caso.ms);
    if (noBanco !== noCodigo) {
      divergencias += 1;
      console.error(
        `   divergencia: correta=${caso.correta} ms=${caso.ms} -> SQL ${noBanco} x TS ${noCodigo}`,
      );
    }
  }
  ok(divergencias === 0, `a pontuacao bate em ${casos.length} combinacoes de acerto e tempo`);

  const textos = [
    'int', '  INT  ', 'Console.ReadLine', 'console.readline;', 'a   b', 'A B',
    '=>', ' => ', 'endl;;', '', '   ',
  ];
  let divergenciasTexto = 0;
  for (const texto of textos) {
    const noBanco = (
      await db.query<{ pvp_normalizar: string }>('select public.pvp_normalizar($1) as pvp_normalizar', [
        texto,
      ])
    ).rows[0].pvp_normalizar;
    const noCodigo = normalizarResposta(texto);
    if (noBanco !== noCodigo) {
      divergenciasTexto += 1;
      console.error(`   divergencia: "${texto}" -> SQL "${noBanco}" x TS "${noCodigo}"`);
    }
  }
  ok(divergenciasTexto === 0, `a normalizacao da resposta bate em ${textos.length} textos`);
}

secao('regras puras (TypeScript)');
{
  ok(pontuar(false, 0) === 0, 'errar vale 0, mesmo respondendo na hora');
  ok(pontuar(true, 0) === 200, 'acertar instantaneamente vale 200');
  ok(pontuar(true, 20_000) === 0, 'acertar depois do tempo limite vale 0');
  ok(pontuar(true, 10_000) === 150, 'na metade do tempo, 150');
  ok(desfecho(300, 200) === 'anfitriao', 'mais pontos vence');
  ok(desfecho(200, 300) === 'convidado', 'do outro lado tambem');
  ok(desfecho(200, 200) === 'empate', 'placar igual e empate');

  const sorteadas = sortearPerguntas([1, 2, 3, 4, 5, 6, 7, 8], 5, () => 0.5);
  ok(sorteadas.length === 5, 'o sorteio devolve a quantidade pedida');
  ok(new Set(sorteadas).size === 5, 'e nunca repete pergunta na mesma partida');
  ok(sortearPerguntas([1, 2], 5).length === 2, 'com poucas perguntas, devolve o que tem');
}

/* =========================================================================
 * Embaralhamento das alternativas
 *
 * O banco de perguntas foi escrito com a resposta certa SEMPRE na primeira
 * posicao (49 de 49). Sem embaralhar, dava para vencer um duelo inteiro
 * clicando na primeira opcao cinco vezes.
 *
 * Quem embaralha e o servidor, em `pvp_pergunta` (0007). O que se verifica
 * aqui e que (a) a posicao do gabarito varia entre exibicoes, (b) nenhuma
 * alternativa some ou aparece do nada, (c) reentregar a MESMA exibicao devolve
 * a mesma ordem e (d) a correcao da resposta continua certa depois disso.
 * ====================================================================== */
secao('alternativas embaralhadas');
{
  const pergunta = (
    await db.query<{ id: string; answer: string; options: string[] }>(
      `select id, answer, options from public.pvp_questions
        where kind = 'multiple_choice' and jsonb_array_length(options) = 4
        limit 1`,
    )
  ).rows[0];

  const posicoes = new Map<number, number>();
  const EXIBICOES = 40;
  let permutacaoQuebrada = 0;
  let respostaErrada = 0;

  for (let i = 0; i < EXIBICOES; i += 1) {
    await como(ANFITRIAO);
    const partidaN = (
      await db.query<{ id: string }>('select public.ranked_iniciar() as id')
    ).rows[0].id;

    // Forca a MESMA pergunta, para a comparacao ser entre exibicoes dela.
    await db.query(
      'update public.match_questions set question_id = $2 where match_id = $1 and ordem = 1',
      [partidaN, pergunta.id],
    );

    const entrega = await db.query<{ alternativas: string[] }>(
      'select * from public.pvp_pergunta($1, 1)',
      [partidaN],
    );
    const mostradas = entrega.rows[0].alternativas;

    posicoes.set(
      mostradas.indexOf(pergunta.answer),
      (posicoes.get(mostradas.indexOf(pergunta.answer)) ?? 0) + 1,
    );

    // Mesmas opcoes, so que em outra ordem - nada sumiu nem foi inventado.
    if (
      JSON.stringify([...mostradas].sort()) !== JSON.stringify([...pergunta.options].sort())
    ) {
      permutacaoQuebrada += 1;
    }

    // Reentrega (recarregar a pagina) devolve a MESMA ordem.
    const denovo = await db.query<{ alternativas: string[] }>(
      'select * from public.pvp_pergunta($1, 1)',
      [partidaN],
    );
    if (JSON.stringify(denovo.rows[0].alternativas) !== JSON.stringify(mostradas)) {
      permutacaoQuebrada += 1;
    }

    // E a correcao continua olhando o texto, nao a posicao.
    const r = await db.query<{ correta: boolean }>(
      'select * from public.pvp_responder($1, 1, $2::text)',
      [partidaN, pergunta.answer],
    );
    if (r.rows[0].correta !== true) respostaErrada += 1;

    await db.query(
      "update public.matches set started_at = now() - interval '6 minutes' where id = $1",
      [partidaN],
    );
  }

  ok(permutacaoQuebrada === 0, 'a ordem muda, mas as alternativas sao sempre as mesmas');
  ok(
    posicoes.size > 1,
    `a resposta certa NAO fica presa numa posicao (${[...posicoes.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([p, n]) => `pos ${p + 1}: ${n}x`)
      .join(', ')})`,
  );
  ok(
    (posicoes.get(0) ?? 0) < EXIBICOES,
    `e nao cai sempre na primeira (${posicoes.get(0) ?? 0} de ${EXIBICOES})`,
  );
  ok(
    posicoes.size === pergunta.options.length,
    `em ${EXIBICOES} exibicoes ela passou por todas as ${pergunta.options.length} posicoes`,
  );
  ok(respostaErrada === 0, 'e responder com o texto certo continua acertando sempre');

  // Cada jogador tem a propria exibicao: a ordem de um nao vaza para o outro.
  await como(ANFITRIAO);
  const dupla = (
    await db.query<{ id: string }>("select public.pvp_convidar('convidado', 'python') as id")
  ).rows[0].id;
  await como(CONVIDADO);
  await db.query('select public.pvp_responder_convite($1, true)', [dupla]);
  await db.query(
    'update public.match_questions set question_id = $2 where match_id = $1 and ordem = 1',
    [dupla, pergunta.id],
  );

  await como(ANFITRIAO);
  const doHost = (
    await db.query<{ alternativas: string[] }>('select * from public.pvp_pergunta($1, 1)', [dupla])
  ).rows[0].alternativas;
  await como(CONVIDADO);
  const doGuest = (
    await db.query<{ alternativas: string[] }>('select * from public.pvp_pergunta($1, 1)', [dupla])
  ).rows[0].alternativas;

  const linhasGravadas = await db.query<{ n: number }>(
    'select count(distinct alternativas)::int as n from public.match_answers where match_id = $1 and ordem = 1',
    [dupla],
  );
  ok(
    JSON.stringify([...doHost].sort()) === JSON.stringify([...doGuest].sort()),
    'os dois jogadores veem as mesmas alternativas',
  );
  ok(
    linhasGravadas.rows[0].n >= 1,
    'cada jogador tem a propria ordem gravada (uma linha por exibicao)',
  );

  // Pergunta de completar nao tem alternativa nenhuma para embaralhar.
  const semOpcoes = await db.query<{ n: number }>(
    `select count(*)::int as n from public.pvp_questions where kind = 'fill_blank' and options is not null`,
  );
  ok(semOpcoes.rows[0].n === 0, 'pergunta de completar nao carrega alternativas');
}

secao('embaralhamento em TypeScript (modo demonstracao e trilha)');
{
  const lista = ['a', 'b', 'c', 'd', 'e'];

  const mesmaSemente =
    JSON.stringify(embaralharComSemente(lista, 12345)) ===
    JSON.stringify(embaralharComSemente(lista, 12345));
  ok(mesmaSemente, 'a mesma semente da sempre a mesma ordem (o React pode recalcular a vontade)');

  const sementesDiferentes = new Set(
    Array.from({ length: 50 }, (_, i) => JSON.stringify(embaralharComSemente(lista, i + 1))),
  );
  ok(sementesDiferentes.size > 1, `sementes diferentes dao ordens diferentes (${sementesDiferentes.size})`);

  const original = ['a', 'b', 'c'];
  embaralhar(original);
  ok(JSON.stringify(original) === JSON.stringify(['a', 'b', 'c']), 'embaralhar nao mexe na lista original');

  const posicaoDoPrimeiro = new Set(
    Array.from({ length: 100 }, (_, i) => embaralharComSemente(lista, i + 1).indexOf('a')),
  );
  ok(
    posicaoDoPrimeiro.size === lista.length,
    `o primeiro item passa por todas as posicoes (${posicaoDoPrimeiro.size} de ${lista.length})`,
  );
}

await db.close();

console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
