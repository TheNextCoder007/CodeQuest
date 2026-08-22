import type { Exercise } from '@/types/content';
import { runPython } from '@/lib/python/runner';

/**
 * Validacao das respostas.
 *
 * Nenhum servico externo e usado: Python roda no proprio dispositivo via
 * Pyodide e os demais tipos de exercicio sao comparados localmente.
 */

export interface ValidationResult {
  correct: boolean;
  /** Saida real produzida pelo codigo (apenas output_match). */
  stdout?: string;
  /** Erro do interpretador, se houve. */
  error?: string | null;
  /** Mensagem curta mostrada em destaque. */
  message: string;
}

/**
 * Normaliza a saida antes de comparar: quebras de linha do Windows, espacos
 * no fim das linhas e linhas em branco no final nao devem reprovar o aluno.
 */
export const normalizeOutput = (value: string): string =>
  value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '')
    .trim();

const normalizeAnswer = (value: string): string =>
  value
    .trim()
    .replace(/^[`'"]+|[`'"]+$/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();

export const checkMultipleChoice = (selected: string, exercise: Exercise): ValidationResult => {
  const correct = normalizeAnswer(selected) === normalizeAnswer(exercise.expectedAnswer);
  return {
    correct,
    message: correct ? 'Resposta correta!' : 'Não é essa. Leia a explicação e tente de novo.',
  };
};

export const checkFillBlank = (answer: string, exercise: Exercise): ValidationResult => {
  const accepted = exercise.expectedAnswer.split('|').map(normalizeAnswer);
  const correct = accepted.includes(normalizeAnswer(answer));
  return {
    correct,
    message: correct ? 'Resposta correta!' : 'Ainda não. Confira a dica e tente de novo.',
  };
};

export const checkOutputMatch = async (code: string, exercise: Exercise): Promise<ValidationResult> => {
  const result = await runPython(code, exercise.stdin ?? []);

  if (!result.ok) {
    return {
      correct: false,
      stdout: result.stdout,
      error: result.error,
      message: result.timedOut ? 'O programa não terminou.' : 'Seu código parou com um erro.',
    };
  }

  const correct = normalizeOutput(result.stdout) === normalizeOutput(exercise.expectedAnswer);

  return {
    correct,
    stdout: result.stdout,
    error: null,
    message: correct
      ? 'Resposta correta!'
      : 'O programa rodou, mas a saída não é a esperada. Compare linha a linha.',
  };
};

/** Executa o codigo sem julgar a resposta (botao "Executar"). */
export const justRun = async (code: string, exercise: Exercise) => {
  const result = await runPython(code, exercise.stdin ?? []);
  return result;
};

export const validateExercise = async (
  exercise: Exercise,
  answer: string,
): Promise<ValidationResult> => {
  switch (exercise.validationType) {
    case 'multiple_choice':
      return checkMultipleChoice(answer, exercise);
    case 'fill_blank':
      return checkFillBlank(answer, exercise);
    case 'output_match':
      return checkOutputMatch(answer, exercise);
    default:
      return { correct: false, message: 'Tipo de exercício desconhecido.' };
  }
};
