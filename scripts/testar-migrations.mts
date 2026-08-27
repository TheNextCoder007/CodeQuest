/**
 * Roda as migrations de verdade, num PostgreSQL real (PGlite/WASM), e prova
 * que rodar tudo mais de uma vez NAO apaga progresso de aluno.
 *
 * O relato que originou este teste: "rodei a mesma migration duas vezes sem
 * querer e depois meu progresso tinha sumido". Em vez de responder por
 * leitura de codigo, o teste executa:
 *
 *   0001 -> 0002 -> seed -> cria um aluno com progresso ->
 *   0001 -> 0002 -> seed de novo (e mais uma vez) -> confere que nada mudou.
 *
 * Rodar com: npm run test:migrations
 */

import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { tags } from '../src/content/tags';

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

const ler = (caminho: string) => readFileSync(caminho, 'utf8');

/**
 * O Supabase ja traz o schema `auth`, os papeis e `auth.uid()`. Num Postgres
 * cru precisamos recriar o minimo para as migrations rodarem iguais.
 */
const BASE_SUPABASE = `
  create schema if not exists auth;

  do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then
      create role authenticated;
    end if;
    if not exists (select 1 from pg_roles where rolname = 'anon') then
      create role anon;
    end if;
  end $$;

  create table if not exists auth.users (
    id                 uuid primary key default gen_random_uuid(),
    email              text,
    raw_user_meta_data jsonb not null default '{}'::jsonb
  );

  create or replace function auth.uid() returns uuid
    language sql stable
    as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
`;

const ALUNO = '11111111-1111-1111-1111-111111111111';

const LICOES = [
  'py-fund-01', 'py-fund-02', 'py-fund-03', 'py-fund-04', 'py-fund-05',
  'py-var-01', 'py-var-02', 'py-var-03',
];

const db = await PGlite.create();

console.log('--- preparando o banco ---');
await db.exec(BASE_SUPABASE);

const migration0001 = ler('supabase/migrations/0001_init.sql');
const migration0002 = ler('supabase/migrations/0002_amigos.sql');
const migration0003 = ler('supabase/migrations/0003_protecao_progresso.sql');
const migration0004 = ler('supabase/migrations/0004_perfis_publicos.sql');
const migration0005 = ler('supabase/migrations/0005_pvp.sql');
const migration0006 = ler('supabase/migrations/0006_ranqueado.sql');
const migration0007 = ler('supabase/migrations/0007_embaralhar_alternativas.sql');
const migration0008 = ler('supabase/migrations/0008_desafios_diarios.sql');
const migration0009 = ler('supabase/migrations/0009_ranqueado_elite.sql');
const migration0010 = ler('supabase/migrations/0010_empates_leaderboard_abandono.sql');
const seed = ler('supabase/seed.sql');

await db.exec(migration0001);
await db.exec(migration0002);
await db.exec(migration0003);
await db.exec(migration0004);
await db.exec(migration0005);
await db.exec(migration0006);
await db.exec(migration0007);
await db.exec(migration0008);
await db.exec(migration0009);
await db.exec(migration0010);
await db.exec(seed);
console.log('ok     primeira aplicacao (0001..0010 + seed)');

/* -------------------------------------------------------------------------
 * Um aluno com progresso, igual ao caso relatado
 * ---------------------------------------------------------------------- */
await db.query(
  `insert into auth.users (id, email, raw_user_meta_data)
   values ($1, 'aluno@codequest.dev', '{"name":"TheNextOne"}'::jsonb)`,
  [ALUNO],
);

const perfilCriadoPeloGatilho = await db.query<{ n: number }>(
  'select count(*)::int as n from public.profiles where id = $1',
  [ALUNO],
);
ok(perfilCriadoPeloGatilho.rows[0].n === 1, 'o gatilho handle_new_user criou o perfil');

await db.query(
  `update public.profiles
      set xp_total = 445, level = 5, streak_count = 2,
          username = 'thenextone', name = 'TheNextOne',
          last_study_date = current_date
    where id = $1`,
  [ALUNO],
);

for (const licao of LICOES) {
  await db.query(
    `insert into public.user_progress (user_id, lesson_id, xp_earned, flawless)
     values ($1, $2, 40, false)`,
    [ALUNO, licao],
  );
}

await db.query(
  `insert into public.user_achievements (user_id, achievement_id)
   select $1, id from public.achievements limit 4`,
  [ALUNO],
);

const antes = await db.query<{
  xp_total: number;
  username: string;
  name: string;
  licoes: number;
  conquistas: number;
  xp_somado: number;
}>(
  `select p.xp_total, p.username, p.name,
          (select count(*)::int from public.user_progress     where user_id = p.id) as licoes,
          (select count(*)::int from public.user_achievements  where user_id = p.id) as conquistas,
          (select coalesce(sum(xp_earned), 0)::int from public.user_progress where user_id = p.id) as xp_somado
     from public.profiles p where p.id = $1`,
  [ALUNO],
);
const inicial = antes.rows[0];
ok(inicial.xp_total === 445 && inicial.licoes === 8, `estado inicial: ${inicial.xp_total} XP, ${inicial.licoes} licoes`);

/* -------------------------------------------------------------------------
 * O teste de verdade: rodar tudo de novo, duas vezes
 * ---------------------------------------------------------------------- */
console.log('\n--- reaplicando as migrations (2x) ---');
for (const rodada of [2, 3]) {
  await db.exec(migration0001);
  await db.exec(migration0002);
  await db.exec(migration0003);
  await db.exec(migration0004);
  await db.exec(migration0005);
  await db.exec(migration0006);
  await db.exec(migration0007);
  await db.exec(migration0008);
  await db.exec(migration0009);
  await db.exec(migration0010);
  await db.exec(seed);
  console.log(`ok     aplicacao ${rodada} concluida sem erro`);
}

const depois = await db.query<typeof inicial>(
  `select p.xp_total, p.username, p.name,
          (select count(*)::int from public.user_progress     where user_id = p.id) as licoes,
          (select count(*)::int from public.user_achievements  where user_id = p.id) as conquistas,
          (select coalesce(sum(xp_earned), 0)::int from public.user_progress where user_id = p.id) as xp_somado
     from public.profiles p where p.id = $1`,
  [ALUNO],
);
const final = depois.rows[0];

console.log('\n--- conferindo o progresso ---');
ok(final !== undefined, 'o perfil continua existindo');
ok(final?.xp_total === 445, `XP intacto (${final?.xp_total})`);
ok(final?.licoes === 8, `licoes concluidas intactas (${final?.licoes})`);
ok(final?.conquistas === inicial.conquistas, `conquistas intactas (${final?.conquistas})`);
ok(final?.username === 'thenextone', 'username intacto');
ok(final?.name === 'TheNextOne', 'nome de exibicao intacto');
ok(final?.xp_somado === inicial.xp_somado, 'soma de xp_earned intacta');

/* -------------------------------------------------------------------------
 * Os gatilhos de protecao continuam de pe depois de reaplicar tudo
 * ---------------------------------------------------------------------- */
console.log('\n--- protecoes do banco ---');
let bloqueou = false;
try {
  await db.query('update public.profiles set xp_total = 0 where id = $1', [ALUNO]);
} catch {
  bloqueou = true;
}
ok(bloqueou, 'o gatilho guard_profile_update impede o XP de diminuir');

const aindaTem = await db.query<{ xp_total: number }>(
  'select xp_total from public.profiles where id = $1',
  [ALUNO],
);
ok(aindaTem.rows[0].xp_total === 445, 'o XP continua 445 depois da tentativa bloqueada');

const policies = await db.query<{ cmd: string }>(
  `select cmd from pg_policies where schemaname = 'public' and tablename = 'user_progress'`,
);
const comandos = policies.rows.map((linha) => linha.cmd.toUpperCase());
ok(!comandos.includes('DELETE'), 'user_progress nao tem policy de DELETE (cliente nao apaga progresso)');
ok(comandos.includes('SELECT') && comandos.includes('INSERT'), 'as policies de leitura/escrita existem');

const rls = await db.query<{ relrowsecurity: boolean }>(
  `select relrowsecurity from pg_class where oid = 'public.user_progress'::regclass`,
);
ok(rls.rows[0].relrowsecurity === true, 'RLS continua ligado em user_progress apos reaplicar');

/* -------------------------------------------------------------------------
 * Protecoes da migration 0003
 * ---------------------------------------------------------------------- */
console.log('\n--- migration 0003 ---');

await db.query(
  `update public.user_progress set xp_earned = 0, flawless = false
    where user_id = $1 and lesson_id = 'py-fund-01'`,
  [ALUNO],
);
const naoRebaixou = await db.query<{ xp_earned: number }>(
  `select xp_earned from public.user_progress where user_id = $1 and lesson_id = 'py-fund-01'`,
  [ALUNO],
);
ok(naoRebaixou.rows[0].xp_earned === 40, 'refazer licao nao rebaixa xp_earned (continua 40)');

// Conta cujo perfil ficou com menos XP do que as licoes ja registradas.
const OUTRO = '22222222-2222-2222-2222-222222222222';
await db.query(
  `insert into auth.users (id, email, raw_user_meta_data)
   values ($1, 'perdido@codequest.dev', '{"name":"Perdido"}'::jsonb)`,
  [OUTRO],
);
for (const licao of LICOES) {
  await db.query(
    `insert into public.user_progress (user_id, lesson_id, xp_earned, flawless)
     values ($1, $2, 40, false)`,
    [OUTRO, licao],
  );
}
const reconciliado = await db.query<{ xp_anterior: number; xp_atual: number; licoes: number }>(
  'select * from public.reconciliar_xp($1)',
  [OUTRO],
);
ok(reconciliado.rows[0].xp_anterior === 0, 'perfil estava com 0 XP');
ok(reconciliado.rows[0].xp_atual === 320, 'reconciliar_xp reconstruiu 320 XP a partir das licoes');
ok(reconciliado.rows[0].licoes === 8, 'reconciliar_xp contou as 8 licoes');

const semMudanca = await db.query<{ xp_anterior: number; xp_atual: number }>(
  'select * from public.reconciliar_xp($1)',
  [ALUNO],
);
ok(
  semMudanca.rows[0].xp_atual === 445,
  'reconciliar_xp nunca REBAIXA quem ja tem mais XP que a soma (445 continua 445)',
);

let aindaBloqueia = false;
try {
  await db.query('update public.profiles set xp_total = 10 where id = $1', [ALUNO]);
} catch {
  aindaBloqueia = true;
}
ok(aindaBloqueia, 'depois da 0003 o XP continua sem poder diminuir');

/* -------------------------------------------------------------------------
 * Migration 0004: tags, @username e perfil publico
 * ---------------------------------------------------------------------- */
console.log('\n--- migration 0004 ---');

// Conferido contra o catalogo TypeScript, e nao contra um numero escrito a
// mao: senao toda tag nova (Fase 3 trouxe 6, a Fase 4 pode trazer mais) quebra
// este teste sem que nada esteja errado de fato.
const catalogo = await db.query<{ n: number }>('select count(*)::int as n from public.tags');
ok(
  catalogo.rows[0].n === tags.length,
  `o seed populou o catalogo de tags (${catalogo.rows[0].n} de ${tags.length})`,
);

// --- palavras bloqueadas ---------------------------------------------------
const filtro = await db.query<{ alvo: string; proibido: boolean }>(
  `select alvo, public.username_proibido(alvo) as proibido
     from unnest(array[
       'cu','cu_123','puta','puta_99','pornolandia','sexo','xxsexo',
       'curioso','escuro','documento','disputa','reputacao','davi123','s3x0','thenextone'
     ]) as alvo`,
);
const bloqueado = (alvo: string) =>
  filtro.rows.find((linha) => linha.alvo === alvo)?.proibido === true;

ok(bloqueado('cu'), 'bloqueia "cu" (nome inteiro)');
ok(bloqueado('cu_123'), 'bloqueia "cu_123" (pedaco separado)');
ok(bloqueado('puta'), 'bloqueia "puta"');
ok(bloqueado('pornolandia'), 'bloqueia palavra longa no meio do nome');
ok(bloqueado('sexo'), 'bloqueia "sexo"');
ok(!bloqueado('curioso'), 'NAO bloqueia "curioso" (conteria "cu")');
ok(!bloqueado('escuro'), 'NAO bloqueia "escuro"');
ok(!bloqueado('documento'), 'NAO bloqueia "documento"');
ok(!bloqueado('disputa'), 'NAO bloqueia "disputa" (conteria "puta")');
ok(!bloqueado('reputacao'), 'NAO bloqueia "reputacao"');
ok(!bloqueado('s3x0'), 'NAO bloqueia disfarce com numero (decisao deliberada)');
ok(!bloqueado('thenextone'), 'NAO bloqueia nome comum');

let recusouPalavrao = false;
try {
  await db.query(`update public.profiles set username = 'putaria' where id = $1`, [ALUNO]);
} catch {
  recusouPalavrao = true;
}
ok(recusouPalavrao, 'o banco recusa @username com palavrao');

// --- a primeira escolha do @username nao inicia a contagem -----------------
const NOVATO = '33333333-3333-3333-3333-333333333333';
await db.query(
  `insert into auth.users (id, email, raw_user_meta_data)
   values ($1, 'novato@codequest.dev', '{"name":"Novato"}'::jsonb)`,
  [NOVATO],
);
await db.query(`update public.profiles set username = 'novato' where id = $1`, [NOVATO]);
const primeiraEscolha = await db.query<{ username_changed_at: string | null }>(
  'select username_changed_at from public.profiles where id = $1',
  [NOVATO],
);
ok(
  primeiraEscolha.rows[0].username_changed_at === null,
  'a primeira escolha do @username nao inicia a espera de 24h',
);
await db.query(`update public.profiles set username = 'novato2' where id = $1`, [NOVATO]);
const aposCorrecao = await db.query<{ username_changed_at: string | null }>(
  'select username_changed_at from public.profiles where id = $1',
  [NOVATO],
);
ok(
  aposCorrecao.rows[0].username_changed_at !== null,
  'corrigir logo depois e permitido, e AI a contagem comeca',
);
let novatoBloqueado = false;
try {
  await db.query(`update public.profiles set username = 'novato3' where id = $1`, [NOVATO]);
} catch {
  novatoBloqueado = true;
}
ok(novatoBloqueado, 'a partir da segunda troca, a espera vale');

// --- espera de 24h ---------------------------------------------------------
await db.query(
  `update public.profiles set username_changed_at = now() - interval '48 hours' where id = $1`,
  [ALUNO],
);
await db.query(`update public.profiles set username = 'thenextone2' where id = $1`, [ALUNO]);
const trocou = await db.query<{ username: string; username_changed_at: string }>(
  'select username, username_changed_at from public.profiles where id = $1',
  [ALUNO],
);
ok(trocou.rows[0].username === 'thenextone2', 'troca permitida depois de 24h');
ok(trocou.rows[0].username_changed_at !== null, 'o gatilho carimbou username_changed_at');

let recusouCedo = false;
try {
  await db.query(`update public.profiles set username = 'thenextone3' where id = $1`, [ALUNO]);
} catch {
  recusouCedo = true;
}
ok(recusouCedo, 'segunda troca dentro de 24h e recusada pelo banco');

// --- tag exibida -----------------------------------------------------------
let recusouTagNaoDesbloqueada = false;
try {
  await db.query(`update public.profiles set equipped_tag_id = 'nivel-50' where id = $1`, [ALUNO]);
} catch {
  recusouTagNaoDesbloqueada = true;
}
ok(recusouTagNaoDesbloqueada, 'nao da para exibir tag que nao foi desbloqueada');

await db.query(`insert into public.user_tags (user_id, tag_id) values ($1, 'nivel-05')`, [ALUNO]);
await db.query(`update public.profiles set equipped_tag_id = 'nivel-05' where id = $1`, [ALUNO]);
const equipada = await db.query<{ equipped_tag_id: string }>(
  'select equipped_tag_id from public.profiles where id = $1',
  [ALUNO],
);
ok(equipada.rows[0].equipped_tag_id === 'nivel-05', 'tag desbloqueada pode ser exibida');

// --- selo de desenvolvedor -------------------------------------------------
let recusouDev = false;
try {
  await db.query('update public.profiles set is_developer = true where id = $1', [ALUNO]);
} catch {
  recusouDev = true;
}
ok(recusouDev, 'o usuario nao consegue ligar is_developer sozinho');

const concedido = await db.query<{ is_developer: boolean }>(
  `select is_developer from public.definir_desenvolvedor('thenextone2', true)`,
);
ok(concedido.rows[0].is_developer === true, 'definir_desenvolvedor concede o selo');
const tagDev = await db.query<{ n: number }>(
  `select count(*)::int as n from public.user_tags where user_id = $1 and tag_id = 'dev'`,
  [ALUNO],
);
ok(tagDev.rows[0].n === 1, 'e entrega a tag Desenvolvedor junto');

// --- posicao no ranking ----------------------------------------------------
const posicao = await db.query<{ posicao_no_ranking: number }>(
  'select public.posicao_no_ranking($1)',
  [ALUNO],
);
ok(posicao.rows[0].posicao_no_ranking === 1, 'quem tem mais XP fica em 1o lugar');
const posicaoOutro = await db.query<{ posicao_no_ranking: number }>(
  'select public.posicao_no_ranking($1)',
  [OUTRO],
);
ok(posicaoOutro.rows[0].posicao_no_ranking === 2, 'o segundo colocado fica em 2o');

// --- RLS das tabelas novas -------------------------------------------------
const policiesTags = await db.query<{ cmd: string }>(
  `select cmd from pg_policies where schemaname = 'public' and tablename = 'user_tags'`,
);
const cmdsTags = policiesTags.rows.map((linha) => linha.cmd.toUpperCase());
ok(cmdsTags.includes('SELECT') && cmdsTags.includes('INSERT'), 'user_tags tem policies de leitura e escrita');
ok(!cmdsTags.includes('DELETE'), 'user_tags nao tem policy de DELETE (tag nao se perde)');

await db.close();

console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
