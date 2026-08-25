/**
 * Despeja os exercicios de codigo em JSON, para os verificadores conferirem se
 * a saida esperada bate com o que o interpretador realmente produz.
 *
 *   npm run content:verify-python  ->  scripts/verificar_saidas.py
 *   npm run content:verify-js      ->  scripts/verificar-saidas-js.mjs
 *
 * Recebe o slug da linguagem como argumento (padrao: python). Sem esse filtro,
 * o verificador de Python tentaria rodar os exercicios de JavaScript e
 * reprovaria todos por "sem solucao de referencia".
 */
import { languages } from '../src/content/index';

const slug = process.argv[2] ?? 'python';

const language = languages.find((item) => item.slug === slug);
if (!language) {
  console.error(`Linguagem desconhecida: ${slug}`);
  process.exit(1);
}

const exercises = language.modules.flatMap((module) =>
  module.lessons.flatMap((lesson) =>
    lesson.exercises
      .filter((exercise) => exercise.validationType === 'output_match')
      .map((exercise) => ({
        id: exercise.id,
        lessonId: lesson.id,
        expected: exercise.expectedAnswer,
        stdin: exercise.stdin ?? [],
      })),
  ),
);

process.stdout.write(JSON.stringify(exercises, null, 2));
