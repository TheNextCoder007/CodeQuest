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
const seed = ler('supabase/seed.sql');

await db.exec(migration0001);
await db.exec(migration0002);
await db.exec(migration0003);
await db.exec(seed);
console.log('ok     primeira aplicacao (0001 + 0002 + 0003 + seed)');

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

await db.close();

console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
