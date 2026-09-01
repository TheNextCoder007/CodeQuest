/**
 * Testes da migracao 0010, num PostgreSQL real (PGlite/WASM).
 *
 * O que e verificado aqui:
 *
 *   1. **Empate conta nos dois modos.** O empate da ranqueada vai para
 *      `ranked_stats` e o do duelo para `pvp_stats`; a conquista precisa somar
 *      os dois. Era exatamente o buraco que deixou um jogador com 2 empates de
 *      ranqueada sem a medalha.
 *   2. **A reavaliacao retroativa.** `conquistas_reavaliar()` confere cada
 *      criterio contra o historico real e concede o que faltou - sem conceder
 *      nada que a pessoa nao fez, e sem repetir o que ela ja tinha.
 *   3. **O leaderboard historico.** `ranked_ranking_topo()` ordena pelo maior
 *      pico de todas as temporadas, nao pelo elo de agora.
 *   4. **O abandono.** `pvp_abandonar()` encerra como derrota de quem saiu,
 *      mesmo que ele estivesse na frente, e cobra o elo normalmente. E so
 *      consegue penalizar a si proprio.
 *   5. **A saudacao de conta nova.** `marcar_boas_vindas()` responde `true`
 *      uma unica vez.
 *
 * Rodar com: npm run test:conquistas
 */

import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { achievements } from '../src/content/achievements';
import { evaluateAchievements } from '../src/lib/gamification';

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

const DONO = '11111111-1111-1111-1111-111111111111';
const AMIGO = '22222222-2222-2222-2222-222222222222';
const ESTRANHO = '33333333-3333-3333-3333-333333333333';

const db = await PGlite.create();
await db.exec(BASE_SUPABASE);
for (const arquivo of [
  'supabase/migrations/0001_init.sql',
  'supabase/migrations/0002_amigos.sql',
  'supabase/migrations/0003_protecao_progresso.sql',
  'supabase/migrations/0004_perfis_publicos.sql',
  'supabase/migrations/0005_pvp.sql',
  'supabase/migrations/0006_ranqueado.sql',
  'supabase/migrations/0007_embaralhar_alternativas.sql',
  'supabase/migrations/0008_desafios_diarios.sql',
  'supabase/migrations/0009_ranqueado_elite.sql',
  'supabase/migrations/0010_empates_leaderboard_abandono.sql',
  'supabase/migrations/0011_cronometro_e_abandono.sql',
  'supabase/migrations/0012_relogio_do_servidor.sql',
  'supabase/migrations/0013_empate_zero_a_zero.sql',
  'supabase/seed.sql',
  // Depois do seed: a 0014 exige as licoes novas ja no banco.
  'supabase/migrations/0014_trilha_python_listas_dicionarios.sql',
]) {
  await db.exec(ler(arquivo));
}

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

const um = async <T,>(sql: string, params: unknown[] = []): Promise<T> =>
  (await db.query<T>(sql, params)).rows[0];

const linhas = async <T,>(sql: string, params: unknown[] = []): Promise<T[]> =>
  (await db.query<T>(sql, params)).rows;

const erroDe = async (fn: () => Promise<unknown>): Promise<string | null> => {
  try {
    await fn();
    return null;
  } catch (falha) {
    return falha instanceof Error ? falha.message : String(falha);
  }
};

/** Conquistas que a pessoa tem agora. */
const medalhasDe = async (id: string): Promise<string[]> =>
  (
    await linhas<{ achievement_id: string }>(
      'select achievement_id from public.user_achievements where user_id = $1 order by 1',
      [id],
    )
  ).map((l) => l.achievement_id);

await criarConta(DONO, 'Dona da Conta', 'dono');
await criarConta(AMIGO, 'Amiga', 'amiga');
await criarConta(ESTRANHO, 'Estranho', 'estranho');
// O selo de dono so e ligado pelo SQL Editor (ver `guard_profile_update`).
await db.exec("select set_config('codequest.admin', 'on', false)");
await db.query('update public.profiles set is_developer = true where id = $1', [DONO]);
await db.exec("select set_config('codequest.admin', 'off', false)");

/* =========================================================================
 * 1. O empate precisa somar os dois modos - e o 0 a 0 nao pode contar
 * ====================================================================== */
secao('empate conta na ranqueada e no duelo');

// A temporada e criada preguicosamente, na primeira consulta - nao ha cron.
await como(DONO);
const temporada = await um<{ numero: number }>(
  'select (public.ranked_temporada_atual()).numero::int as numero',
);

/**
 * Grava uma partida ja encerrada direto no historico.
 *
 * Desde a 0013 e daqui que sai a conta de empates: o contador de
 * `ranked_stats` / `pvp_stats` nao guarda placar, e sem placar nao da para
 * separar um empate de verdade de um 0 a 0.
 */
let sequencia = 0;
const partidaEncerrada = async (opcoes: {
  desfecho: 'vitoria' | 'derrota' | 'empate';
  pontos: number;
  modo?: 'amistoso' | 'ranqueado';
  host?: string;
  convidado?: string | null;
}) => {
  sequencia += 1;
  const id = `00000000-0000-4000-8000-${String(sequencia).padStart(12, '0')}`;
  const modo = opcoes.modo ?? 'ranqueado';
  const host = opcoes.host ?? DONO;
  const convidado = opcoes.convidado ?? null;
  // No empate os dois placares sao iguais por definicao; na vitoria/derrota o
  // valor exato nao importa para esta conta.
  const pontosGuest = opcoes.desfecho === 'empate' ? opcoes.pontos : opcoes.pontos + 10;

  await db.query(
    `insert into public.matches
       (id, tema, status, host_id, guest_id, total_perguntas, winner_id,
        pontos_host, pontos_guest, modo, desfecho_host, season_numero, bot_nome,
        started_at, ended_at)
     values ($1, 'python', 'encerrada', $2, $3, 5, $4, $5, $6, $7, $8, $9, $10, now(), now())`,
    [
      id,
      host,
      convidado,
      opcoes.desfecho === 'vitoria' ? host : null,
      opcoes.pontos,
      pontosGuest,
      modo,
      opcoes.desfecho,
      modo === 'ranqueado' ? temporada.numero : null,
      convidado === null ? 'Bot de teste' : null,
    ],
  );
  return id;
};

const empatesDe = async (id: string): Promise<number> =>
  (await um<{ n: number }>('select public.conquistas_empates($1)::int as n', [id])).n;

// Os contadores continuam registrando TUDO - inclusive o 0 a 0. Eles nao
// mudaram; o que mudou e que a medalha deixou de olhar para eles.
await db.query(
  `insert into public.ranked_stats (season_numero, user_id, elo, pico_elo, vitorias, derrotas, empates, partidas)
   values ($1, $2, 120, 160, 3, 1, 2, 6)`,
  [temporada.numero, DONO],
);
await db.query(
  `insert into public.pvp_stats (user_id, vitorias, derrotas, empates, partidas, pontos_totais)
   values ($1, 1, 0, 1, 2, 300)`,
  [DONO],
);

ok(await empatesDe(DONO) === 0, 'contador cheio, historico vazio: nenhum empate vale');

// Dois empates de ranqueada COM placar, como os que o jogador ja tinha.
await partidaEncerrada({ desfecho: 'empate', pontos: 180 });
await partidaEncerrada({ desfecho: 'empate', pontos: 240 });
ok(await empatesDe(DONO) === 2, 'os 2 empates de ranqueada sao contabilizados');

// Um empate de duelo entre amigos, no outro modo.
await partidaEncerrada({ desfecho: 'empate', pontos: 150, modo: 'amistoso', convidado: AMIGO });
ok(await empatesDe(DONO) === 3, 'e somados aos do duelo (2 + 1 = 3)');
ok(await empatesDe(AMIGO) === 1, 'o empate do duelo vale para os DOIS jogadores');

/*
 * O 0 a 0 - o motivo da 0013.
 *
 * "Empate tecnico" se propoe a ser a medalha mais rara do jogo. Empatar em
 * 0 a 0, porem, e o resultado mais facil que existe: contra o bot da ranqueada
 * basta nao responder nada por dois minutos. A medalha mais rara era a mais
 * farmavel do jogo.
 */
await partidaEncerrada({ desfecho: 'empate', pontos: 0 });
ok(await empatesDe(DONO) === 3, 'empate em 0 a 0 NAO entra na conta');

await partidaEncerrada({ desfecho: 'empate', pontos: 0, modo: 'amistoso', convidado: AMIGO });
ok(await empatesDe(AMIGO) === 1, 'nem no duelo entre amigos');

// Derrota e vitoria nunca contaram - e o 0013 nao pode ter mudado isso.
await partidaEncerrada({ desfecho: 'derrota', pontos: 90 });
await partidaEncerrada({ desfecho: 'vitoria', pontos: 300 });
ok(await empatesDe(DONO) === 3, 'vitoria e derrota continuam fora da conta');

ok(await empatesDe(ESTRANHO) === 0, 'quem nunca empatou continua em zero');

// A tela usa a versao sem argumento, que so responde sobre quem chamou.
await como(DONO);
ok(
  (await um<{ n: number }>('select public.conquistas_empates_meus()::int as n')).n === 3,
  'e `conquistas_empates_meus` devolve o mesmo numero para quem chamou',
);
await como(ESTRANHO);
ok(
  (await um<{ n: number }>('select public.conquistas_empates_meus()::int as n')).n === 0,
  'sem vazar o de outra pessoa',
);
await como(DONO);

/* =========================================================================
 * 2. Reavaliacao retroativa
 * ====================================================================== */
secao('conquistas_reavaliar concede o que faltou');

const antes = await medalhasDe(DONO);
ok(antes.length === 0, 'a conta comeca sem nenhuma medalha');

await como(DONO);
const concedidas = await linhas<{ conquista: string }>(
  'select conquista from public.conquistas_reavaliar()',
);
const idsConcedidos = concedidas.map((l) => l.conquista);

ok(idsConcedidos.includes('duelo-empate'), 'a conquista de empate foi concedida retroativamente');

const conquistaDeEmpate = achievements.find((a) => a.criteria.kind === 'pvp_draws');
ok(conquistaDeEmpate?.id === 'duelo-empate', 'e o id confere com o do conteudo em TypeScript');

// Nada de inventar medalha: quem tem 3 empates e 1 vitoria de duelo nao pode
// receber conquista de licao, de XP nem de patamar alto.
const proibidas = idsConcedidos.filter((id) => {
  const definicao = achievements.find((a) => a.id === id);
  if (!definicao) return true;
  return !['pvp_draws', 'pvp_wins', 'ranked_tier'].includes(definicao.criteria.kind);
});
ok(
  proibidas.length === 0,
  `so concedeu o que o historico sustenta (extras: ${proibidas.join(', ') || 'nenhum'})`,
);

// Rodar de novo nao concede nada (nem duplica).
const segundaVez = await linhas('select conquista from public.conquistas_reavaliar()');
ok(segundaVez.length === 0, 'rodar de novo nao concede nada duas vezes');

const depois = await medalhasDe(DONO);
ok(
  new Set(depois).size === depois.length,
  'e nao existe conquista duplicada na tabela',
);

/* =========================================================================
 * 2b. A 0013 tira a medalha de quem so tem 0 a 0
 * ====================================================================== */
secao('a medalha ganha pela regra antiga e devolvida');

/*
 * Quem ja tinha a medalha por um 0 a 0 continuaria com ela: `conquistas_
 * reavaliar` so concede, nunca tira - de proposito, porque quase todo criterio
 * e "ja fez alguma vez" e o banco nem sempre guarda o historico inteiro (o
 * streak, por exemplo, so tem o valor corrente).
 *
 * Este criterio e a excecao: o historico de partidas esta completo em
 * `matches`, entao da para afirmar com certeza quem nunca empatou com placar.
 * A 0013 faz essa limpeza uma vez, e reaplica-la nao pode machucar quem
 * empatou de verdade - e o que se confere aqui.
 */
await db.query(
  `insert into public.user_achievements (user_id, achievement_id) values ($1, 'duelo-empate')`,
  [ESTRANHO],
);
// ESTRANHO so tem um 0 a 0 no historico.
await partidaEncerrada({ desfecho: 'empate', pontos: 0, host: ESTRANHO });

ok(
  (await medalhasDe(ESTRANHO)).includes('duelo-empate'),
  'a conta comeca com a medalha que a regra antiga concedeu',
);

await db.exec(ler('supabase/migrations/0013_empate_zero_a_zero.sql'));

ok(
  !(await medalhasDe(ESTRANHO)).includes('duelo-empate'),
  'reaplicar a 0013 tira a medalha de quem so empatou em 0 a 0',
);
ok(
  (await medalhasDe(DONO)).includes('duelo-empate'),
  'e nao encosta em quem empatou com placar',
);

// E, tirada a medalha, a reavaliacao NAO pode devolve-la.
await como(ESTRANHO);
const devolvidas = await linhas<{ conquista: string }>(
  'select conquista from public.conquistas_reavaliar()',
);
ok(
  !devolvidas.map((l) => l.conquista).includes('duelo-empate'),
  'e a reavaliacao nao a devolve na sequencia',
);
await como(DONO);

/* =========================================================================
 * 3. Paridade com a avaliacao em TypeScript
 * ====================================================================== */
secao('o SQL e o TypeScript concordam sobre o empate');

const noAplicativo = evaluateAchievements(
  {
    completedLessonIds: [],
    xpTotal: 0,
    streak: 0,
    unlockedTagIds: [],
    pvpEmpates: 3,
  },
  [],
).map((c) => c.id);

ok(
  noAplicativo.includes('duelo-empate'),
  'com 3 empates, o avaliador do aplicativo tambem libera a medalha',
);

ok(
  evaluateAchievements(
    { completedLessonIds: [], xpTotal: 0, streak: 0, unlockedTagIds: [], pvpEmpates: 0 },
    [],
  )
    .map((c) => c.id)
    .includes('duelo-empate') === false,
  'e com 0 empates nao libera',
);

/* =========================================================================
 * 4. Reavaliar outra pessoa exige ser dono
 * ====================================================================== */
secao('reavaliar a conta dos outros e restrito');

await como(ESTRANHO);
const negado = await erroDe(() =>
  db.query('select * from public.conquistas_reavaliar($1)', [AMIGO]),
);
ok(negado !== null && /permiss/i.test(negado), 'jogador comum nao reavalia a conta de outro');

await como(DONO);
const permitido = await erroDe(() =>
  db.query('select * from public.conquistas_reavaliar($1)', [AMIGO]),
);
ok(permitido === null, 'a conta com is_developer consegue');

/* =========================================================================
 * 5. Leaderboard historico
 * ====================================================================== */
secao('ranked_ranking_topo ordena pelo pico de todas as temporadas');

// A amiga esta com elo alto AGORA; o estranho ja chegou mais alto no passado.
await db.query(
  `insert into public.ranked_stats (season_numero, user_id, elo, pico_elo, vitorias, derrotas, empates, partidas)
   values ($1, $2, 950, 950, 12, 3, 0, 15)`,
  [temporada.numero, AMIGO],
);

await db.query(
  `insert into public.seasons (numero, comeca_em, termina_em)
   values ($1, now() - interval '40 days', now() - interval '25 days')
   on conflict (numero) do nothing`,
  [temporada.numero - 1],
);
await db.query(
  `insert into public.ranked_stats (season_numero, user_id, elo, pico_elo, vitorias, derrotas, empates, partidas)
   values ($1, $2, 300, 1850, 40, 20, 1, 61)`,
  [temporada.numero - 1, ESTRANHO],
);

await como(DONO);
const atual = await linhas<{ user_id: string; elo: number }>(
  "select user_id, elo from public.ranked_ranking('global', 50)",
);
const topo = await linhas<{ user_id: string; elo: number; temporadas: number }>(
  "select user_id, elo, temporadas from public.ranked_ranking_topo('global', 50)",
);

ok(atual[0]?.user_id === AMIGO, 'na temporada atual quem lidera e quem tem mais elo agora');
ok(
  atual.every((l) => l.user_id !== ESTRANHO),
  'e quem so jogou temporada passada nem aparece nessa lista',
);
ok(topo[0]?.user_id === ESTRANHO, 'no historico quem lidera e o maior pico de sempre (1850)');
ok(topo[0]?.elo === 1850, 'e a coluna de elo traz o pico, nao o elo de hoje');
ok(
  topo.some((l) => l.user_id === AMIGO),
  'quem joga a temporada atual tambem entra no historico',
);

const soAmigos = await linhas<{ user_id: string }>(
  "select user_id from public.ranked_ranking_topo('amigos', 50)",
);
ok(
  soAmigos.every((l) => l.user_id === DONO),
  'sem amizade aceita, a lista de amigos traz so o proprio jogador',
);

/* =========================================================================
 * 6. Abandono
 * ====================================================================== */
secao('pvp_abandonar encerra como derrota de quem saiu');

await como(AMIGO);
const partidaId = (await um<{ ranked_iniciar: string }>('select public.ranked_iniciar()'))
  .ranked_iniciar;

const eloAntes = (
  await um<{ elo: number }>(
    'select elo from public.ranked_stats where user_id = $1 and season_numero = $2',
    [AMIGO, temporada.numero],
  )
).elo;

// Responde as 5 perguntas certas: estaria GANHANDO com folga.
for (let n = 1; n <= 5; n += 1) {
  await db.query('select * from public.pvp_pergunta($1, $2)', [partidaId, n]);
  const gabarito = await um<{ answer: string }>(
    `select q.answer from public.match_questions mq
       join public.pvp_questions q on q.id = mq.question_id
      where mq.match_id = $1 and mq.ordem = $2`,
    [partidaId, n],
  );
  await db.query('select * from public.pvp_responder($1, $2, $3::text)', [
    partidaId,
    n,
    gabarito.answer,
  ]);
}

const abandono = await um<{ status: string; winner_id: string | null }>(
  'select status, winner_id from public.pvp_abandonar($1)',
  [partidaId],
);

ok(abandono.status === 'encerrada', 'a partida encerra na hora');
ok(abandono.winner_id === null, 'contra bot nao ha perfil vencedor para apontar');

const desfecho = await um<{ desfecho_host: string; abandonada_por: string | null }>(
  'select desfecho_host, abandonada_por from public.matches where id = $1',
  [partidaId],
);
ok(desfecho.desfecho_host === 'derrota', 'o desfecho e derrota, mesmo com o placar a favor');
ok(desfecho.abandonada_por === AMIGO, 'e fica registrado quem abandonou');

const eloDepois = (
  await um<{ elo: number; derrotas: number }>(
    'select elo, derrotas from public.ranked_stats where user_id = $1 and season_numero = $2',
    [AMIGO, temporada.numero],
  )
).elo;
ok(eloDepois < eloAntes, `o elo caiu (${eloAntes} -> ${eloDepois})`);

secao('o cronometro nao volta cheio (0011)');

await como(AMIGO);
const partidaRelogio = (await um<{ ranked_iniciar: string }>('select public.ranked_iniciar()'))
  .ranked_iniciar;

const entrega1 = await um<{ comecou_em: string; alternativas: unknown }>(
  'select comecou_em, alternativas from public.pvp_pergunta($1, 1)',
  [partidaRelogio],
);
ok(Boolean(entrega1.comecou_em), 'a pergunta devolve quando o cronometro comecou');

// Sair da tela e voltar reentrega a pergunta. O carimbo NAO pode mudar - se
// mudasse, bastaria trocar de aba para ganhar 20 s a cada pergunta.
await new Promise((r) => setTimeout(r, 1100));
const entrega2 = await um<{ comecou_em: string; alternativas: unknown }>(
  'select comecou_em, alternativas from public.pvp_pergunta($1, 1)',
  [partidaRelogio],
);
// `timestamptz` volta como `Date`: comparar os objetos direto nunca da igual.
const instante = (valor: string | Date) => new Date(valor).getTime();
ok(
  instante(entrega1.comecou_em) === instante(entrega2.comecou_em),
  'e reentregar a mesma pergunta devolve o MESMO carimbo (sem tempo extra)',
);
ok(
  JSON.stringify(entrega1.alternativas) === JSON.stringify(entrega2.alternativas),
  'a ordem das alternativas tambem se mantem entre reentregas',
);

secao('o servidor devolve o proprio relogio (0012)');

const comRelogio = await um<{ comecou_em: Date; agora: Date }>(
  'select comecou_em, agora from public.pvp_pergunta($1, 1)',
  [partidaRelogio],
);
ok(Boolean(comRelogio.agora), 'a pergunta devolve o "agora" do servidor');

/*
 * O que importa e a DIFERENCA entre os dois, que e o tempo ja decorrido - e
 * ela precisa sair inteira do relogio do servidor. Foi por comparar o carimbo
 * do servidor com o relogio do navegador que a v1.10 zerou a pergunta em
 * computador com a hora adiantada.
 */
const decorrido = new Date(comRelogio.agora).getTime() - new Date(comRelogio.comecou_em).getTime();
ok(decorrido >= 0, `o decorrido nunca e negativo (${decorrido} ms)`);
ok(decorrido < 20_000, 'e cabe dentro do tempo da pergunta numa entrega recente');

secao('o estado diz quem abandonou (0011)');

const antesDoAbandono = await um<{ abandonada_por: string | null }>(
  'select abandonada_por from public.pvp_estado($1)',
  [partidaRelogio],
);
ok(antesDoAbandono.abandonada_por === null, 'partida em andamento nao tem abandono registrado');

await db.query('select * from public.pvp_abandonar($1)', [partidaRelogio]);
const depoisDoAbandono = await um<{ abandonada_por: string | null }>(
  'select abandonada_por from public.pvp_estado($1)',
  [partidaRelogio],
);
ok(
  depoisDoAbandono.abandonada_por === AMIGO,
  'depois de abandonar, o estado aponta quem largou',
);

secao('abandono so penaliza quem chama');

await como(AMIGO);
const outraPartida = (await um<{ ranked_iniciar: string }>('select public.ranked_iniciar()'))
  .ranked_iniciar;

await como(ESTRANHO);
const alheio = await erroDe(() => db.query('select * from public.pvp_abandonar($1)', [outraPartida]));
ok(alheio !== null, 'quem nao esta na partida nao consegue abandona-la por outro');

/* =========================================================================
 * 7. Saudacao de conta nova
 * ====================================================================== */
secao('marcar_boas_vindas responde true uma unica vez');

await como(ESTRANHO);
const primeira = await um<{ marcar_boas_vindas: boolean }>('select public.marcar_boas_vindas()');
const segunda = await um<{ marcar_boas_vindas: boolean }>('select public.marcar_boas_vindas()');
const terceira = await um<{ marcar_boas_vindas: boolean }>('select public.marcar_boas_vindas()');

ok(primeira.marcar_boas_vindas === true, 'a primeira visita responde true');
ok(segunda.marcar_boas_vindas === false, 'a segunda ja responde false');
ok(terceira.marcar_boas_vindas === false, 'e continua false');

const carimbo = await um<{ boas_vindas_em: string | null }>(
  'select boas_vindas_em from public.profiles where id = $1',
  [ESTRANHO],
);
ok(carimbo.boas_vindas_em !== null, 'o carimbo ficou gravado no perfil');

secao('e ninguem consegue voltar a ser novato');

const trapaca = await erroDe(() =>
  db.query('update public.profiles set boas_vindas_em = null where id = $1', [ESTRANHO]),
);
const aindaCarimbado = await um<{ boas_vindas_em: string | null }>(
  'select boas_vindas_em from public.profiles where id = $1',
  [ESTRANHO],
);
ok(
  trapaca !== null || aindaCarimbado.boas_vindas_em !== null,
  'apagar o carimbo pela tabela nao funciona',
);

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
