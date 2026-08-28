/**
 * Testes do desafio diario, num PostgreSQL real (PGlite/WASM).
 *
 * O que e verificado aqui:
 *
 *   1. **Paridade SQL x TypeScript.** A escolha do exercicio do dia existe
 *      duas vezes - no banco (que manda) e em TypeScript (modo demonstracao).
 *      As duas sao comparadas dia a dia ao longo de mais de um ano.
 *   2. **O desafio e o mesmo para todo mundo** e troca sozinho de dia, sem
 *      cron, criado na primeira pergunta daquele dia.
 *   3. **O rodizio nao repete** antes de passar por todos os exercicios.
 *   4. **Nao da para ganhar XP duas vezes**, nem marcar conclusao em nome de
 *      outra pessoa, nem escolher a data.
 *   5. **O fechamento do banco**: as tabelas novas nao aceitam escrita direta.
 *
 * Rodar com: npm run test:desafios
 */

import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import {
  MULTIPLICADOR_DO_SORTEIO,
  XP_DESAFIO_DIARIO,
  desafioDaData,
  diasDesdeEpoca,
  poolDeDesafios,
  posicaoDoDia,
} from '../src/lib/desafios/regras';

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

const EU = '11111111-1111-1111-1111-111111111111';
const AMIGO = '22222222-2222-2222-2222-222222222222';
const ESTRANHO = '33333333-3333-3333-3333-333333333333';

const ARQUIVOS = [
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
];

const db = await PGlite.create();
await db.exec(BASE_SUPABASE);
for (const arquivo of ARQUIVOS) await db.exec(ler(arquivo));

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

const um = async <T,>(sql: string, params: unknown[] = []): Promise<T> =>
  (await db.query<T>(sql, params)).rows[0];

await criarConta(EU, 'Eu', 'jogador');
await criarConta(AMIGO, 'Amigo', 'colega');
await criarConta(ESTRANHO, 'Estranho', 'estranho');

/* =========================================================================
 * 1. O pool: o SQL e o TypeScript precisam ver os mesmos exercicios
 * ====================================================================== */
secao('pool de exercicios (SQL x TypeScript)');

const poolSql = (
  await db.query<{ exercise_id: string }>('select * from public.desafio_pool()')
).rows.map((linha) => linha.exercise_id);
const poolTs = poolDeDesafios().map((exercicio) => exercicio.id);

ok(poolSql.length > 0, `o banco tem exercicios elegiveis (${poolSql.length})`);
ok(
  poolSql.length === poolTs.length,
  `o pool tem o mesmo tamanho nos dois lados (SQL ${poolSql.length} / TS ${poolTs.length})`,
);
ok(
  JSON.stringify(poolSql) === JSON.stringify(poolTs),
  'e exatamente os mesmos exercicios, na mesma ordem',
);
ok(
  poolSql.every((id) => !id.includes('proj')),
  'o Projeto Final ficou de fora (os exercicios dele sao etapas encadeadas)',
);

const tiposNoPool = await db.query<{ n: number }>(
  `select count(*)::int as n from public.exercises e
    where e.id = any ($1::text[]) and e.validation_type <> 'output_match'`,
  [poolSql],
);
ok(tiposNoPool.rows[0].n === 0, 'so entram exercicios de codigo (output_match)');

/* =========================================================================
 * 2. A escolha do dia, dia a dia
 * ====================================================================== */
secao('escolha do dia (SQL x TypeScript)');

const DIAS_TESTADOS = 400;
const inicio = Date.parse('2026-01-01T00:00:00Z');
let divergencias = 0;
const vistos: string[] = [];

for (let i = 0; i < DIAS_TESTADOS; i += 1) {
  const dia = new Date(inicio + i * 86_400_000).toISOString().slice(0, 10);
  const doSql = await um<{ desafio_sortear: string }>('select public.desafio_sortear($1::date)', [dia]);
  const doTs = desafioDaData(dia);
  if (doSql.desafio_sortear !== doTs?.id) divergencias += 1;
  vistos.push(doSql.desafio_sortear);
}

ok(divergencias === 0, `o SQL e o TypeScript escolhem o mesmo exercicio em ${DIAS_TESTADOS} dias seguidos`);

// O rodizio: em `pool.length` dias seguidos, cada exercicio aparece uma vez.
const umCiclo = vistos.slice(0, poolSql.length);
ok(
  new Set(umCiclo).size === poolSql.length,
  `em ${poolSql.length} dias seguidos nenhum exercicio se repete (o pool inteiro roda antes de voltar)`,
);

// E o dia seguinte ao fim do ciclo volta ao primeiro.
ok(
  vistos[poolSql.length] === vistos[0],
  'o ciclo fecha: o dia seguinte ao fim do rodizio repete o primeiro',
);

ok(
  posicaoDoDia('2026-01-01', poolSql.length) ===
    (diasDesdeEpoca('2026-01-01') * MULTIPLICADOR_DO_SORTEIO) % poolSql.length,
  'a conta da posicao e a documentada (dias * 7919 mod tamanho)',
);

/* =========================================================================
 * 3. Criacao preguicosa: ninguem agenda nada
 * ====================================================================== */
secao('o desafio do dia nasce sozinho');

const antes = await um<{ n: number }>('select count(*)::int as n from public.daily_challenges');
ok(antes.n === 0, 'nenhum desafio existe antes de alguem perguntar');

await como(EU);
const primeiro = await um<{ dia: string; exercise_id: string; xp: number }>(
  'select * from public.desafio_do_dia()',
);
ok(Boolean(primeiro.exercise_id), `a primeira pergunta cria o desafio de hoje (${primeiro.exercise_id})`);
ok(primeiro.xp === XP_DESAFIO_DIARIO, `o XP do desafio e ${XP_DESAFIO_DIARIO}`);

const hojeNoBanco = await um<{ desafio_hoje: string }>('select public.desafio_hoje()');
ok(
  String(primeiro.dia).slice(0, 10) === String(hojeNoBanco.desafio_hoje).slice(0, 10),
  'e o dia dele e o de hoje no fuso de Sao Paulo',
);

await como(AMIGO);
const segundo = await um<{ exercise_id: string }>('select * from public.desafio_do_dia()');
ok(segundo.exercise_id === primeiro.exercise_id, 'outra pessoa recebe o MESMO desafio');

const quantas = await um<{ n: number }>('select count(*)::int as n from public.daily_challenges');
ok(quantas.n === 1, 'e nao foi criada uma segunda linha para o mesmo dia');

/* =========================================================================
 * 4. Jogar o desafio
 * ====================================================================== */
secao('concluir o desafio');

await como(EU);
const xpInicial = await um<{ xp_total: number; level: number }>(
  'select xp_total, level from public.profiles where id = $1',
  [EU],
);

const estadoAntes = await um<{ ja_completou: boolean; total: number }>(
  'select * from public.desafio_estado()',
);
ok(estadoAntes.ja_completou === false, 'antes de jogar, o estado diz que ainda nao foi feito');
ok(estadoAntes.total === 0, 'e o contador esta zerado');

const conclusao = await um<{
  xp_ganho: number;
  ja_tinha: boolean;
  total: number;
  novo_xp: number;
  novo_nivel: number;
}>('select * from public.desafio_concluir()');

ok(conclusao.xp_ganho === XP_DESAFIO_DIARIO, `concluir paga ${XP_DESAFIO_DIARIO} XP`);
ok(conclusao.ja_tinha === false, 'e informa que e a primeira vez');
ok(conclusao.total === 1, 'o contador foi para 1');
ok(
  conclusao.novo_xp === xpInicial.xp_total + XP_DESAFIO_DIARIO,
  `o XP do perfil subiu no servidor (${xpInicial.xp_total} -> ${conclusao.novo_xp})`,
);
ok(
  conclusao.novo_nivel === Math.floor(conclusao.novo_xp / 100) + 1,
  `o nivel foi recalculado pela mesma formula do app (nivel ${conclusao.novo_nivel})`,
);

const estadoDepois = await um<{ ja_completou: boolean; total: number }>(
  'select * from public.desafio_estado()',
);
ok(estadoDepois.ja_completou === true, 'o estado passa a dizer que ja foi feito');
ok(estadoDepois.total === 1, 'e o contador acompanha');

/* =========================================================================
 * 5. Nao da para ganhar duas vezes
 * ====================================================================== */
secao('o mesmo dia nao paga duas vezes');

const repetida = await um<{ xp_ganho: number; ja_tinha: boolean; total: number; novo_xp: number }>(
  'select * from public.desafio_concluir()',
);
ok(repetida.xp_ganho === 0, 'a segunda chamada paga 0 XP');
ok(repetida.ja_tinha === true, 'e avisa que ja tinha sido feito');
ok(repetida.total === 1, 'o contador nao sobe');
ok(repetida.novo_xp === conclusao.novo_xp, 'e o XP do perfil nao muda');

// Nem chamando dez vezes seguidas.
for (let i = 0; i < 10; i += 1) await db.query('select * from public.desafio_concluir()');
const xpDepoisDoSpam = await um<{ xp_total: number }>(
  'select xp_total from public.profiles where id = $1',
  [EU],
);
ok(
  xpDepoisDoSpam.xp_total === conclusao.novo_xp,
  'dez chamadas seguidas continuam sem mexer no XP',
);

const linhas = await um<{ n: number }>(
  'select count(*)::int as n from public.daily_challenge_completions where user_id = $1',
  [EU],
);
ok(linhas.n === 1, 'e existe uma unica linha de conclusao');

/* =========================================================================
 * 6. O desafio de ontem expira
 * ====================================================================== */
secao('o desafio expira e nao acumula');

// Cria a mao a linha de ontem, como se o app tivesse sido aberto la.
const ontem = await um<{ dia: string }>(
  `insert into public.daily_challenges (dia, exercise_id)
   values (public.desafio_hoje() - 1, public.desafio_sortear(public.desafio_hoje() - 1))
   returning dia`,
);
ok(Boolean(ontem.dia), 'existe um desafio registrado para ontem');

const totalAntesDeOntem = await um<{ total: number }>('select * from public.desafio_total()');
await db.query('select * from public.desafio_concluir()');
const totalDepoisDeOntem = await um<{ total: number }>('select * from public.desafio_total()');
ok(
  totalAntesDeOntem.total === totalDepoisDeOntem.total,
  'chamar concluir hoje nao completa o desafio de ontem',
);

const conclusoesDeOntem = await um<{ n: number }>(
  `select count(*)::int as n from public.daily_challenge_completions
    where dia = public.desafio_hoje() - 1`,
);
ok(conclusoesDeOntem.n === 0, 'e o de ontem continua sem nenhuma conclusao - nao ha como voltar nele');

/* =========================================================================
 * 7. Nao da para marcar em nome de outro, nem escolher a data
 * ====================================================================== */
secao('o cliente nao escolhe usuario nem data');

const assinaturas = await um<{ n: number }>(
  `select count(*)::int as n
     from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'desafio_concluir' and p.pronargs > 0`,
);
ok(assinaturas.n === 0, 'desafio_concluir() nao aceita NENHUM parametro');

await como(null);
const semSessao = await erroDe(() => db.query('select * from public.desafio_concluir()'));
ok(
  semSessao !== null && /conta/i.test(semSessao),
  'sem sessao, concluir e recusado',
);

await como(AMIGO);
const doAmigo = await um<{ total: number }>('select * from public.desafio_estado()');
ok(doAmigo.total === 0, 'o contador do amigo continua zerado (o meu nao vazou para ele)');

/* =========================================================================
 * 8. Comparacao com amigos
 * ====================================================================== */
secao('comparar com amigos');

await db.query(
  `insert into public.friendships (user_id, friend_id, status) values ($1, $2, 'accepted')`,
  [EU, AMIGO],
);

await como(EU);
const amigos = await db.query<{ user_id: string; name: string; concluido: boolean; total: number }>(
  'select * from public.desafio_amigos()',
);
ok(amigos.rows.length === 1, 'a lista traz so quem e amigo aceito');
ok(amigos.rows[0]?.user_id === AMIGO, 'e o amigo certo');
ok(amigos.rows[0]?.concluido === false, 'que ainda nao fez o desafio de hoje');

await como(AMIGO);
await db.query('select * from public.desafio_concluir()');
await como(EU);
const amigosDepois = await db.query<{ concluido: boolean; total: number }>(
  'select * from public.desafio_amigos()',
);
ok(amigosDepois.rows[0]?.concluido === true, 'depois que ele joga, a lista mostra concluido');
ok(amigosDepois.rows[0]?.total === 1, 'e o total dele aparece');

const naoAmigo = amigosDepois.rows.some((linha) => linha.total === undefined);
ok(!naoAmigo && amigosDepois.rows.length === 1, 'o estranho nao aparece na lista');

/* =========================================================================
 * 9. Fechamento do banco
 * ====================================================================== */
secao('as tabelas novas nao aceitam escrita direta');

const rls = await db.query<{ tabela: string; ligado: boolean }>(
  `select relname as tabela, relrowsecurity as ligado
     from pg_class
    where relname in ('daily_challenges', 'daily_challenge_completions')
    order by relname`,
);
ok(rls.rows.length === 2, 'as duas tabelas existem');
ok(rls.rows.every((linha) => linha.ligado), 'e as duas estao com Row Level Security ligado');

const policies = await db.query<{ tabela: string; cmd: string }>(
  `select tablename as tabela, cmd
     from pg_policies
    where schemaname = 'public'
      and tablename in ('daily_challenges', 'daily_challenge_completions')`,
);
ok(
  policies.rows.every((linha) => linha.cmd === 'SELECT'),
  'nao existe UMA policy de INSERT, UPDATE ou DELETE - so as funcoes escrevem',
);
ok(
  policies.rows.some((l) => l.tabela === 'daily_challenge_completions' && l.cmd === 'SELECT'),
  'a leitura das conclusoes tem policy (limitada ao proprio usuario)',
);

const politicaDaLeitura = await um<{ qual: string }>(
  `select qual from pg_policies
    where tablename = 'daily_challenge_completions' and cmd = 'SELECT'`,
);
ok(
  /auth\.uid\(\)/.test(politicaDaLeitura.qual),
  'e essa policy compara com auth.uid() - ninguem le a conclusao de outro',
);

const internas = await db.query<{ proname: string; permitido: boolean }>(
  `select p.proname,
          has_function_privilege('authenticated', p.oid, 'execute') as permitido
     from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('desafio_pool', 'desafio_sortear')`,
);
ok(
  internas.rows.every((linha) => linha.permitido === false),
  'desafio_pool e desafio_sortear estao fora do alcance do cliente (nao da para espiar o de amanha)',
);

/* =========================================================================
 * 10. Reaplicar a migracao e seguro
 * ====================================================================== */
secao('reaplicar a migracao e seguro');

const antesDeReaplicar = await um<{ n: number }>(
  'select count(*)::int as n from public.daily_challenge_completions',
);
const reaplicar = await erroDe(() => db.exec(ler('supabase/migrations/0008_desafios_diarios.sql')));
ok(reaplicar === null, 'o arquivo inteiro roda de novo sem erro');

const depoisDeReaplicar = await um<{ n: number }>(
  'select count(*)::int as n from public.daily_challenge_completions',
);
ok(
  antesDeReaplicar.n === depoisDeReaplicar.n,
  `nenhuma conclusao foi perdida (${depoisDeReaplicar.n} linha(s))`,
);

await db.close();

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
