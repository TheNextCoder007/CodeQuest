import { languageBySlug, languageLessonSequence, lessonXp, moduleById } from '@/content';
import type { Language, Lesson, Module } from '@/types/content';

/**
 * Regras de desbloqueio da trilha.
 *
 * - Um modulo so abre quando **todas** as licoes do modulo anterior estao
 *   concluidas (progressao bloqueada, como pedido no projeto).
 * - Dentro de um modulo aberto, a licao N so abre quando a N-1 esta concluida.
 */

export type ItemStatus = 'locked' | 'available' | 'completed';

export interface ModuleProgress {
  module: Module;
  status: ItemStatus;
  completedLessons: number;
  totalLessons: number;
  /** 0 a 1 */
  ratio: number;
  xpAvailable: number;
}

const orderedModules = (language: Language): Module[] =>
  [...language.modules].sort((a, b) => a.orderIndex - b.orderIndex);

const orderedLessons = (module: Module): Lesson[] =>
  [...module.lessons].sort((a, b) => a.orderIndex - b.orderIndex);

export const moduleIsComplete = (module: Module, completed: Set<string>): boolean =>
  module.lessons.length > 0 && module.lessons.every((lesson) => completed.has(lesson.id));

/** Progresso de cada modulo da linguagem, ja com o status de bloqueio. */
export const languageProgress = (
  languageSlug: string,
  completedLessonIds: string[],
): ModuleProgress[] => {
  const language = languageBySlug(languageSlug);
  if (!language) return [];

  const completed = new Set(completedLessonIds);
  let previousComplete = true; // o primeiro modulo comeca sempre aberto

  return orderedModules(language).map((module) => {
    const lessons = orderedLessons(module);
    const completedLessons = lessons.filter((lesson) => completed.has(lesson.id)).length;
    const isComplete = lessons.length > 0 && completedLessons === lessons.length;

    const status: ItemStatus = isComplete
      ? 'completed'
      : previousComplete
        ? 'available'
        : 'locked';

    previousComplete = isComplete;

    return {
      module,
      status,
      completedLessons,
      totalLessons: lessons.length,
      ratio: lessons.length === 0 ? 0 : completedLessons / lessons.length,
      xpAvailable: lessons.reduce((total, lesson) => total + lessonXp(lesson), 0),
    };
  });
};

/** Status de uma licao especifica (considerando o bloqueio do modulo). */
export const lessonStatus = (
  lesson: Lesson,
  completedLessonIds: string[],
): ItemStatus => {
  const completed = new Set(completedLessonIds);
  if (completed.has(lesson.id)) return 'completed';

  const module = moduleById(lesson.moduleId);
  if (!module) return 'locked';

  const language = languageBySlug(
    // descobre a linguagem pelo modulo
    module.languageId,
  );
  if (language) {
    const progress = languageProgress(language.slug, completedLessonIds).find(
      (item) => item.module.id === module.id,
    );
    if (progress?.status === 'locked') return 'locked';
  }

  const lessons = orderedLessons(module);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  if (index <= 0) return 'available';
  return completed.has(lessons[index - 1].id) ? 'available' : 'locked';
};

/** Proxima licao que o aluno deve fazer na linguagem (ou null se acabou). */
export const nextLesson = (languageSlug: string, completedLessonIds: string[]): Lesson | null => {
  const completed = new Set(completedLessonIds);
  return (
    languageLessonSequence(languageSlug).find((lesson) => !completed.has(lesson.id)) ?? null
  );
};

export interface TrackSummary {
  totalLessons: number;
  completedLessons: number;
  ratio: number;
  totalXp: number;
  earnedXp: number;
  finished: boolean;
}

/** Resumo da trilha inteira, usado no dashboard. */
export const trackSummary = (
  languageSlug: string,
  completedLessonIds: string[],
): TrackSummary => {
  const sequence = languageLessonSequence(languageSlug);
  const completed = new Set(completedLessonIds);
  const completedLessons = sequence.filter((lesson) => completed.has(lesson.id));
  const totalXp = sequence.reduce((total, lesson) => total + lessonXp(lesson), 0);

  return {
    totalLessons: sequence.length,
    completedLessons: completedLessons.length,
    ratio: sequence.length === 0 ? 0 : completedLessons.length / sequence.length,
    totalXp,
    earnedXp: completedLessons.reduce((total, lesson) => total + lessonXp(lesson), 0),
    finished: sequence.length > 0 && completedLessons.length === sequence.length,
  };
};
