/**
 * Despeja os exercicios de codigo em JSON, para o verificador em Python
 * (`scripts/verificar_saidas.py`) conferir se as saidas esperadas realmente
 * batem com o que o interpretador produz.
 */
import { allLessons } from '../src/content/index';

const exercises = allLessons().flatMap((lesson) =>
  lesson.exercises
    .filter((exercise) => exercise.validationType === 'output_match')
    .map((exercise) => ({
      id: exercise.id,
      lessonId: lesson.id,
      expected: exercise.expectedAnswer,
      stdin: exercise.stdin ?? [],
    })),
);

process.stdout.write(JSON.stringify(exercises, null, 2));
