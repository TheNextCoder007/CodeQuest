/**
 * O que uma pessoa consegue ver no perfil de OUTRA, num PostgreSQL real
 * (PGlite/WASM) e com o RLS realmente ligado.
 *
 * ---------------------------------------------------------------------------
 * O BUG QUE ISTO FECHA
 *
 * A secao "Conquistas" do perfil publico sempre mostrou "0 de 45", para todo
 * mundo. `user_tags` ganhou leitura publica na 0004, quando o perfil publico
 * foi criado; `user_achievements` ficou com a policy da 0001, que devolve
 * apenas as proprias linhas.
 *
 * O que fez isso durar tanto: **RLS filtra linhas, nao levanta erro**. A
 * consulta volta com sucesso e uma lista vazia, e lista vazia e
 * indistinguivel de "essa pessoa nao tem conquista nenhuma". Nenhum teste
 * daqui rodava como `authenticated` - todos rodavam como superusuario, que
 * ignora RLS - entao nenhum deles conseguia ver a diferenca.
 *
 * Por isso este arquivo faz questao de `set role authenticated`: e a unica
 * forma de a policy realmente valer.
 *
 * ---------------------------------------------------------------------------
 * O QUE E CONFERIDO
 *
 *   1. as conquistas do outro aparecem (o bug);
 *   2. as tags do outro continuam aparecendo (nao pode ter quebrado);
 *   3. o proprio dono continua vendo as suas;
 *   4. ninguem concede conquista nem tag para outra pessoa;
 *   5. o progresso licao a licao continua privado;
 *   6. o e-mail nao esta ao alcance de ninguem.
 *
 * Rodar com: npm run test:perfil-publico
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

/**
 * O Supabase concede isto ao papel `authenticated` por padrao; o harness
 * precisa fazer o mesmo, senao `set role authenticated` esbarra em
 * "permission denied" antes de o RLS sequer entrar em cena - e o teste
 * passaria a medir a coisa errada.
 */
const GRANTS = `
  grant usage on schema public to authenticated;
  grant select, insert, update, delete on all tables in schema public to authenticated;
  grant usage, select on all sequences in schema public to authenticated;
`;

const DONO = '11111111-1111-1111-1111-111111111111';
const VISITANTE = '22222222-2222-2222-2222-222222222222';

const MIGRACOES_ATE_0014 = [
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
  'supabase/migrations/0014_trilha_python_listas_dicionarios.sql',
];

const db = await PGlite.create();
await db.exec(BASE_SUPABASE);
for (const arquivo of MIGRACOES_ATE_0014) await db.exec(ler(arquivo));
await db.exec(GRANTS);

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

const criarConta = async (id: string, nome: string, username: string) => {
  await db.query(
    `insert into auth.users (id, email, raw_user_meta_data)
     values ($1, $2, jsonb_build_object('name', $3::text))`,
    [id, `${username}@codequest.dev`, nome],
  );
  await db.query('update public.profiles set username = $2 where id = $1', [id, username]);
};

/**
 * Roda `consulta` como o papel `authenticated`, no lugar de `quem`.
 *
 * Sem `set role` o PGlite roda como superusuario, que ignora RLS - e o teste
 * inteiro perderia o sentido.
 */
async function como<T>(quem: string, consulta: () => Promise<T>): Promise<T> {
  // `false` (nao `true`): `is_local = true` valeria so pela transacao corrente,
  // e cada consulta do PGlite abre a sua - `auth.uid()` voltaria nulo dentro do
  // bloco e as policies que dependem dele nao seriam exercidas de verdade.
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [quem]);
  await db.exec('set role authenticated');
  try {
    return await consulta();
  } finally {
    await db.exec('reset role');
  }
}

await criarConta(DONO, 'Dona da Conta', 'dono');
await criarConta(VISITANTE, 'Visitante', 'visitante');

// O dono tem feitos para mostrar.
await db.query(
  `insert into public.user_achievements (user_id, achievement_id)
   values ($1, 'primeiro-desafio'), ($1, 'modulo-fundamentos'), ($1, 'trilha-python')`,
  [DONO],
);
await db.query(
  `insert into public.user_tags (user_id, tag_id) values ($1, 'pythonista'), ($1, 'nivel-10')`,
  [DONO],
);
await db.query(
  `insert into public.user_progress (user_id, lesson_id, xp_earned)
   values ($1, 'py-fund-01', 30), ($1, 'py-fund-02', 30)`,
  [DONO],
);

/** O que o visitante enxerga do perfil do dono. */
const oQueOVisitanteVe = () =>
  como(VISITANTE, async () => ({
    conquistas: (
      await linhas<{ achievement_id: string }>(
        'select achievement_id from public.user_achievements where user_id = $1 order by 1',
        [DONO],
      )
    ).map((l) => l.achievement_id),
    tags: (
      await linhas<{ tag_id: string }>(
        'select tag_id from public.user_tags where user_id = $1 order by 1',
        [DONO],
      )
    ).map((l) => l.tag_id),
    progresso: (
      await linhas<{ lesson_id: string }>(
        'select lesson_id from public.user_progress where user_id = $1',
        [DONO],
      )
    ).length,
  }));

/* =========================================================================
 * 1. O bug, antes da correcao
 * ====================================================================== */
secao('antes da 0015: o bug esta la');

const antes = await oQueOVisitanteVe();

ok(antes.tags.length === 2, `as tags do outro ja apareciam (${antes.tags.length})`);
ok(
  antes.conquistas.length === 0,
  'e as conquistas vinham VAZIAS - o bug do perfil publico',
);
console.log(
  '       (a consulta nao falha: o RLS filtra as linhas em silencio, e a tela\n' +
    '        mostra "Nenhuma conquista desbloqueada ainda")',
);

/* =========================================================================
 * 2. Depois da correcao
 * ====================================================================== */
secao('depois da 0015: as conquistas aparecem');

await db.exec(ler('supabase/migrations/0015_conquistas_no_perfil_publico.sql'));

const depois = await oQueOVisitanteVe();

ok(
  depois.conquistas.length === 3,
  `o visitante ve as 3 conquistas do dono (${depois.conquistas.join(', ')})`,
);
ok(
  JSON.stringify(depois.tags) === JSON.stringify(antes.tags),
  'e as tags continuam aparecendo, como antes',
);

const noProprio = await como(DONO, async () =>
  (
    await linhas<{ achievement_id: string }>(
      'select achievement_id from public.user_achievements where user_id = $1',
      [DONO],
    )
  ).length,
);
ok(noProprio === 3, 'o dono continua vendo as proprias no perfil dele');

/* =========================================================================
 * 3. Ler nao virou escrever
 * ====================================================================== */
secao('ninguem concede conquista para os outros');

const tentouConceder = await como(VISITANTE, () =>
  erroDe(() =>
    db.query(
      `insert into public.user_achievements (user_id, achievement_id)
       values ($1, 'trilha-javascript')`,
      [DONO],
    ),
  ),
);
ok(
  tentouConceder !== null && /row-level security|policy/i.test(tentouConceder),
  'inserir conquista no nome de outra pessoa e recusado',
);

const tentouTag = await como(VISITANTE, () =>
  erroDe(() =>
    db.query(`insert into public.user_tags (user_id, tag_id) values ($1, 'pythonista')`, [
      VISITANTE,
    ]),
  ),
);
ok(tentouTag === null, 'mas conceder a SI mesmo continua permitido (e como a tela grava)');

const tentouApagar = await como(VISITANTE, async () => {
  await db.query('delete from public.user_achievements where user_id = $1', [DONO]);
  return (
    await linhas<{ n: number }>(
      'select count(*)::int as n from public.user_achievements where user_id = $1',
      [DONO],
    )
  )[0].n;
});
ok(tentouApagar === 3, 'e apagar as conquistas de outro nao remove nada');

/* =========================================================================
 * 4. O que continua privado
 * ====================================================================== */
secao('o que a correcao NAO abriu');

ok(
  depois.progresso === 0,
  'o progresso licao a licao continua invisivel para os outros',
);
ok(
  (await como(DONO, async () =>
    (
      await linhas<{ lesson_id: string }>(
        'select lesson_id from public.user_progress where user_id = $1',
        [DONO],
      )
    ).length,
  )) === 2,
  'e continua visivel para o proprio dono',
);

const email = await como(VISITANTE, () =>
  erroDe(() => db.query('select email from public.profiles where id = $1', [DONO])),
);
ok(
  email !== null && /column .*email.* does not exist/i.test(email),
  'e-mail nao existe em `profiles` - nao ha o que expor',
);

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
