/**
 * Gera `supabase/seed.sql` a partir do curriculo em `src/content`.
 *
 * O curriculo TypeScript e a fonte da verdade (ele tambem e embarcado no
 * .apk/.exe para funcionar offline); este script mantem o banco em sincronia
 * com ele. Rode `npm run seed:gen` sempre que criar ou editar uma licao.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { languages } from '../src/content/index';
import { achievements } from '../src/content/achievements';
import { tags } from '../src/content/tags';
import { pvpQuestions } from '../src/content/pvp-questions';

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(here, '..', 'supabase', 'seed.sql');

/** Texto -> literal SQL, com aspas simples escapadas. */
const sql = (value: string | null | undefined): string =>
  value === null || value === undefined ? 'null' : `'${value.replace(/'/g, "''")}'`;

/** Objeto -> literal jsonb. */
const json = (value: unknown): string =>
  value === null || value === undefined ? 'null' : `${sql(JSON.stringify(value))}::jsonb`;

const lines: string[] = [
  '-- ===========================================================================',
  '-- CodeQuest - conteudo das trilhas (ARQUIVO GERADO)',
  '--',
  '-- Nao edite este arquivo a mao: ele e produzido por `npm run seed:gen` a',
  '-- partir de `src/content`. Para mudar uma licao, edite o TypeScript e gere',
  '-- de novo.',
  '--',
  '-- Como aplicar: Supabase Studio > SQL Editor > cole > Run.',
  '-- Rodar mais de uma vez e seguro (usa ON CONFLICT DO UPDATE).',
  '-- ===========================================================================',
  '',
  'begin;',
  '',
];

/* --------------------------------------------------------------------------
 * Linguagens
 * ----------------------------------------------------------------------- */
lines.push('-- Linguagens ---------------------------------------------------------------');
languages.forEach((language, index) => {
  lines.push(
    `insert into public.languages (id, name, slug, icon, description, available, order_index) values (${sql(
      language.id,
    )}, ${sql(language.name)}, ${sql(language.slug)}, ${sql(language.icon)}, ${sql(
      language.description,
    )}, ${language.available}, ${index + 1})`,
    '  on conflict (id) do update set name = excluded.name, slug = excluded.slug, icon = excluded.icon,',
    '  description = excluded.description, available = excluded.available, order_index = excluded.order_index;',
  );
});
lines.push('');

/* --------------------------------------------------------------------------
 * Modulos, licoes e exercicios
 * ----------------------------------------------------------------------- */
languages.forEach((language) => {
  if (language.modules.length === 0) return;

  lines.push(
    `-- Trilha de ${language.name} ${'-'.repeat(Math.max(0, 58 - language.name.length))}`,
  );

  language.modules.forEach((module) => {
    lines.push(
      `insert into public.modules (id, language_id, title, description, icon, order_index) values (${sql(
        module.id,
      )}, ${sql(module.languageId)}, ${sql(module.title)}, ${sql(module.description)}, ${sql(
        module.icon,
      )}, ${module.orderIndex})`,
      '  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,',
      '  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;',
    );

    module.lessons.forEach((lesson) => {
      lines.push(
        `insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values (${sql(
          lesson.id,
        )}, ${sql(lesson.moduleId)}, ${sql(lesson.title)}, ${sql(lesson.subtitle)}, ${sql(
          lesson.content,
        )}, ${json(lesson.polyglot ?? null)}, ${lesson.orderIndex})`,
        '  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,',
        '  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,',
        '  order_index = excluded.order_index;',
      );

      lesson.exercises.forEach((exercise) => {
        lines.push(
          'insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,',
          '  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (',
          `  ${sql(exercise.id)}, ${sql(exercise.lessonId)}, ${sql(exercise.prompt)},`,
          `  ${sql(exercise.starterCode)}, ${sql(exercise.validationType)}, ${sql(exercise.expectedAnswer)},`,
          `  ${json(exercise.options ?? null)}, ${json(exercise.stdin ?? null)}, ${sql(exercise.hint ?? null)},`,
          `  ${sql(exercise.explanation)}, ${exercise.xpReward}, ${exercise.orderIndex})`,
          '  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,',
          '  starter_code = excluded.starter_code, validation_type = excluded.validation_type,',
          '  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,',
          '  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,',
          '  order_index = excluded.order_index;',
        );
      });
    });

    lines.push('');
  });
});

/* --------------------------------------------------------------------------
 * Conquistas
 * ----------------------------------------------------------------------- */
lines.push('-- Conquistas ---------------------------------------------------------------');
achievements.forEach((achievement) => {
  lines.push(
    `insert into public.achievements (id, title, description, icon, criteria) values (${sql(
      achievement.id,
    )}, ${sql(achievement.title)}, ${sql(achievement.description)}, ${sql(achievement.icon)}, ${json(
      achievement.criteria,
    )})`,
    '  on conflict (id) do update set title = excluded.title, description = excluded.description,',
    '  icon = excluded.icon, criteria = excluded.criteria;',
  );
});

/* --------------------------------------------------------------------------
 * Tags de perfil
 *
 * Depende da migration 0004 (tabela `public.tags`). O bloco fica dentro de um
 * `if` para o seed continuar rodando em bancos que ainda nao aplicaram a 0004.
 * ----------------------------------------------------------------------- */
lines.push('', '-- Tags de perfil -----------------------------------------------------------');
lines.push("do $seed$", 'begin', "  if to_regclass('public.tags') is null then",
  "    raise notice 'tabela public.tags ausente - rode a migration 0004 antes';", '    return;', '  end if;', '');
tags.forEach((tag) => {
  lines.push(
    `  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values (${sql(
      tag.id,
    )}, ${sql(tag.name)}, ${sql(tag.description)}, ${sql(tag.icon)}, ${sql(tag.rarity)}, ${json(
      tag.criteria,
    )}, ${tag.secret}, ${tag.orderIndex})`,
    '    on conflict (id) do update set name = excluded.name, description = excluded.description,',
    '    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,',
    '    secret = excluded.secret, order_index = excluded.order_index;',
  );
});
lines.push('end', '$seed$;');

/* --------------------------------------------------------------------------
 * Perguntas do duelo 1v1
 *
 * Depende da migration 0005. Assim como as tags, fica dentro de um `if` para
 * o seed continuar rodando em bancos que ainda nao aplicaram a migration.
 * ----------------------------------------------------------------------- */
lines.push('', '-- Perguntas do duelo 1v1 ---------------------------------------------------');
lines.push('do $seed$', 'begin', "  if to_regclass('public.pvp_questions') is null then",
  "    raise notice 'tabela public.pvp_questions ausente - rode a migration 0005 antes';", '    return;', '  end if;', '');
pvpQuestions.forEach((questao) => {
  lines.push(
    `  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values (${sql(
      questao.id,
    )}, ${sql(questao.languageSlug)}, ${sql(questao.kind)}, ${sql(questao.prompt)}, ${json(
      questao.options ?? null,
    )}, ${sql(questao.answer)}, ${sql(questao.explanation)}, ${questao.difficulty})`,
    '    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,',
    '    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,',
    '    explanation = excluded.explanation, difficulty = excluded.difficulty;',
  );
});
lines.push('end', '$seed$;');

lines.push('', 'commit;', '');

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join('\n'), 'utf8');

const totalLessons = languages.reduce(
  (total, language) =>
    total + language.modules.reduce((sum, module) => sum + module.lessons.length, 0),
  0,
);
const totalExercises = languages.reduce(
  (total, language) =>
    total +
    language.modules.reduce(
      (sum, module) =>
        sum + module.lessons.reduce((count, lesson) => count + lesson.exercises.length, 0),
      0,
    ),
  0,
);

console.log(
  `seed.sql gerado: ${languages.length} linguagens, ${totalLessons} licoes, ${totalExercises} exercicios, ${achievements.length} conquistas, ${tags.length} tags, ${pvpQuestions.length} perguntas de duelo.`,
);
