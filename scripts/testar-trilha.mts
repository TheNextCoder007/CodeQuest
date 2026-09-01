/**
 * Testes da reestruturacao da trilha de Python (migracao 0014), num
 * PostgreSQL real (PGlite/WASM).
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA EM JOGO
 *
 * Listas e Dicionarios entraram no MEIO da trilha. Quem ja tinha "concluido"
 * a trilha nao concluiu mais - faltam dois modulos. A medalha e a tag de
 * trilha completa precisam voltar para o banco, e SO elas: mexer no XP, no
 * nivel ou nas licoes ja feitas seria apagar trabalho de verdade.
 *
 * O que se confere aqui:
 *
 *   1. a ordem dos modulos no banco e a pedida;
 *   2. quem tinha a trilha completa perde a medalha e a tag;
 *   3. XP, nivel, progresso das licoes e as OUTRAS conquistas ficam intactos;
 *   4. quem completar os modulos novos recupera as duas;
 *   5. quem nunca teve nao ganha nada;
 *   6. a migracao se recusa a rodar sem o seed novo (senao puniria inocentes);
 *   7. rodar duas vezes nao muda nada.
 *
 * Rodar com: npm run test:trilha
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

const VETERANO = '11111111-1111-1111-1111-111111111111';
const NOVATO = '22222222-2222-2222-2222-222222222222';
const APLICADO = '33333333-3333-3333-3333-333333333333';

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
]) {
  await db.exec(ler(arquivo));
}

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

const criarConta = async (id: string, nome: string, username: string) => {
  await db.query(
    `insert into auth.users (id, email, raw_user_meta_data)
     values ($1, $2, jsonb_build_object('name', $3::text))`,
    [id, `${username}@codequest.dev`, nome],
  );
  await db.query('update public.profiles set username = $2 where id = $1', [id, username]);
};

/** Todas as licoes de uma linguagem, na ordem da trilha. */
const licoesDe = async (linguagem: string): Promise<string[]> =>
  (
    await linhas<{ id: string }>(
      `select l.id
         from public.lessons l
         join public.modules m on m.id = l.module_id
         join public.languages la on la.id = m.language_id
        where la.slug = $1
        order by m.order_index, l.order_index`,
      [linguagem],
    )
  ).map((r) => r.id);

/**
 * Marca licoes como concluidas.
 *
 * Nao ha coluna "completed" em `user_progress`: a propria linha ja significa
 * que a licao foi concluida.
 */
const concluir = async (jogador: string, ids: string[]) => {
  for (const id of ids) {
    await db.query(
      `insert into public.user_progress (user_id, lesson_id, xp_earned)
       values ($1, $2, 30)
       on conflict (user_id, lesson_id) do nothing`,
      [jogador, id],
    );
  }
};

const medalhasDe = async (id: string): Promise<string[]> =>
  (
    await linhas<{ achievement_id: string }>(
      'select achievement_id from public.user_achievements where user_id = $1 order by 1',
      [id],
    )
  ).map((l) => l.achievement_id);

const tagsDe = async (id: string): Promise<string[]> =>
  (
    await linhas<{ tag_id: string }>(
      'select tag_id from public.user_tags where user_id = $1 order by 1',
      [id],
    )
  ).map((l) => l.tag_id);

await criarConta(VETERANO, 'Veterano', 'veterano');
await criarConta(NOVATO, 'Novato', 'novato');
await criarConta(APLICADO, 'Aplicado', 'aplicado');

/* =========================================================================
 * 1. A ordem dos modulos
 * ====================================================================== */
secao('a trilha de Python esta na ordem pedida');

const modulos = (
  await linhas<{ title: string }>(
    `select m.title
       from public.modules m
       join public.languages la on la.id = m.language_id
      where la.slug = 'python'
      order by m.order_index`,
  )
).map((r) => r.title);

const ESPERADA = [
  'Fundamentos',
  'Variáveis',
  'Condicionais',
  'Repetições',
  'Listas',
  'Dicionários',
  'Funções',
  'Desafios',
  'Projeto Final',
];

ok(
  JSON.stringify(modulos) === JSON.stringify(ESPERADA),
  `a ordem e ${ESPERADA.join(' > ')}`,
);
if (JSON.stringify(modulos) !== JSON.stringify(ESPERADA)) {
  console.error(`       obtido: ${modulos.join(' > ')}`);
}

const todasAsLicoes = await licoesDe('python');
ok(todasAsLicoes.length === 32, `a trilha tem 32 licoes (${todasAsLicoes.length})`);

const novas = todasAsLicoes.filter((id) => id.startsWith('py-lis-') || id.startsWith('py-dic-'));
ok(novas.length === 8, `8 licoes novas de Listas e Dicionarios (${novas.length})`);

/* =========================================================================
 * 2. O veterano: tinha a trilha completa pela regra antiga
 * ====================================================================== */
secao('quem concluiu a trilha antiga perde a medalha e a tag');

// Ele fez tudo, MENOS os modulos novos - que e a situacao real de quem
// terminou a trilha antes desta mudanca.
const antigas = todasAsLicoes.filter((id) => !novas.includes(id));
await concluir(VETERANO, antigas);
ok(antigas.length === 24, `o veterano fez as 24 licoes que existiam (${antigas.length})`);

// A medalha e a tag foram concedidas na epoca, quando o criterio batia.
await db.query(
  `insert into public.user_achievements (user_id, achievement_id)
   values ($1, 'trilha-python'), ($1, 'modulo-fundamentos'), ($1, 'modulo-repeticoes')`,
  [VETERANO],
);
await db.query(
  `insert into public.user_tags (user_id, tag_id) values ($1, 'pythonista'), ($1, 'nivel-10')`,
  [VETERANO],
);
// `guard_profile_update` (migracao 0003) recusa um salto grande de XP - e faz
// bem. Aqui so estamos montando o cenario, entao usamos a mesma escotilha do
// SQL Editor.
await db.exec("select set_config('codequest.reconciliando', 'on', false)");
await db.query(
  'update public.profiles set xp_total = 1480, level = 15, streak_count = 9 where id = $1',
  [VETERANO],
);
await db.exec("select set_config('codequest.reconciliando', 'off', false)");

// O aplicado ja fez a trilha INTEIRA, incluindo os modulos novos.
await concluir(APLICADO, todasAsLicoes);
await db.query(
  `insert into public.user_achievements (user_id, achievement_id) values ($1, 'trilha-python')`,
  [APLICADO],
);
await db.query(`insert into public.user_tags (user_id, tag_id) values ($1, 'pythonista')`, [
  APLICADO,
]);

const antesDaMigracao = {
  medalhas: await medalhasDe(VETERANO),
  tags: await tagsDe(VETERANO),
  perfil: await um<{ xp_total: number; level: number; streak_count: number }>(
    'select xp_total, level, streak_count from public.profiles where id = $1',
    [VETERANO],
  ),
  licoes: (
    await linhas<{ n: number }>(
      'select count(*)::int as n from public.user_progress where user_id = $1',
      [VETERANO],
    )
  )[0].n,
};

await db.exec(ler('supabase/migrations/0014_trilha_python_listas_dicionarios.sql'));

const depois = { medalhas: await medalhasDe(VETERANO), tags: await tagsDe(VETERANO) };

ok(!depois.medalhas.includes('trilha-python'), 'a medalha de trilha completa foi devolvida');
ok(!depois.tags.includes('pythonista'), 'a tag Pythonista tambem');

/* =========================================================================
 * 3. E SO isso pode ter mudado
 * ====================================================================== */
secao('nada mais foi tocado');

const perfilDepois = await um<{ xp_total: number; level: number; streak_count: number }>(
  'select xp_total, level, streak_count from public.profiles where id = $1',
  [VETERANO],
);
ok(perfilDepois.xp_total === antesDaMigracao.perfil.xp_total, `o XP continua ${perfilDepois.xp_total}`);
ok(perfilDepois.level === antesDaMigracao.perfil.level, `o nivel continua ${perfilDepois.level}`);
ok(
  perfilDepois.streak_count === antesDaMigracao.perfil.streak_count,
  `o streak continua ${perfilDepois.streak_count}`,
);

const licoesDepois = (
  await linhas<{ n: number }>(
    'select count(*)::int as n from public.user_progress where user_id = $1',
    [VETERANO],
  )
)[0].n;
ok(
  licoesDepois === antesDaMigracao.licoes,
  `as ${licoesDepois} licoes ja feitas continuam feitas`,
);

const outrasAntes = antesDaMigracao.medalhas.filter((id) => id !== 'trilha-python');
const outrasDepois = depois.medalhas;
ok(
  JSON.stringify(outrasAntes) === JSON.stringify(outrasDepois),
  `as outras medalhas ficaram (${outrasDepois.join(', ')})`,
);
ok(depois.tags.includes('nivel-10'), 'e as outras tags tambem');

/* =========================================================================
 * 4. Quem ja fez os modulos novos nao perde nada
 * ====================================================================== */
secao('quem completou a trilha NOVA fica com a medalha');

ok(
  (await medalhasDe(APLICADO)).includes('trilha-python'),
  'quem ja fez Listas e Dicionarios mantem a medalha',
);
ok((await tagsDe(APLICADO)).includes('pythonista'), 'e a tag');

/* =========================================================================
 * 5. Recuperar depois de fazer os modulos novos
 * ====================================================================== */
secao('a medalha volta ao concluir os modulos novos');

ok(
  (await um<{ n: number }>('select public.licoes_faltando($1, $2)::int as n', [VETERANO, 'python']))
    .n === 8,
  'faltam exatamente as 8 licoes novas',
);

await concluir(VETERANO, novas);
ok(
  (await um<{ n: number }>('select public.licoes_faltando($1, $2)::int as n', [VETERANO, 'python']))
    .n === 0,
  'depois de fazer as 8, nao falta nenhuma',
);

// A reavaliacao da 0010 confere o criterio contra as licoes de HOJE.
await db.query("select set_config('request.jwt.claim.sub', $1, false)", [VETERANO]);
const concedidas = (
  await linhas<{ conquista: string }>('select conquista from public.conquistas_reavaliar()')
).map((l) => l.conquista);

ok(concedidas.includes('trilha-python'), 'a reavaliacao devolve a medalha da trilha');
ok(
  concedidas.includes('modulo-listas') && concedidas.includes('modulo-dicionarios'),
  'e concede as medalhas dos modulos novos',
);

/* =========================================================================
 * 6. Quem nunca teve nao ganha nada
 * ====================================================================== */
secao('conta nova nao e afetada');

ok((await medalhasDe(NOVATO)).length === 0, 'o novato continua sem medalha');
ok((await tagsDe(NOVATO)).length === 0, 'e sem tag');

/* =========================================================================
 * 7. A migracao se recusa a rodar sem o seed novo
 * ====================================================================== */
secao('sem as licoes novas, a migracao recusa');

const semSeed = await PGlite.create();
await semSeed.exec(BASE_SUPABASE);
for (const arquivo of [
  'supabase/migrations/0001_init.sql',
  'supabase/migrations/0002_amigos.sql',
  'supabase/migrations/0003_protecao_progresso.sql',
  'supabase/migrations/0004_perfis_publicos.sql',
]) {
  await semSeed.exec(ler(arquivo));
}
const recusa = await erroDe(() =>
  semSeed.exec(ler('supabase/migrations/0014_trilha_python_listas_dicionarios.sql')),
);
ok(
  recusa !== null && /seed\.sql/i.test(recusa),
  'ela avisa para aplicar o seed antes, em vez de punir quem esta em dia',
);

/* =========================================================================
 * 8. Rodar de novo nao muda nada
 * ====================================================================== */
secao('reaplicar e inofensivo');

const antesDeRepetir = {
  veterano: await medalhasDe(VETERANO),
  aplicado: await medalhasDe(APLICADO),
};
await db.exec(ler('supabase/migrations/0014_trilha_python_listas_dicionarios.sql'));
ok(
  JSON.stringify(await medalhasDe(VETERANO)) === JSON.stringify(antesDeRepetir.veterano),
  'quem recuperou a medalha nao a perde de novo',
);
ok(
  JSON.stringify(await medalhasDe(APLICADO)) === JSON.stringify(antesDeRepetir.aplicado),
  'e quem sempre esteve em dia continua igual',
);

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
