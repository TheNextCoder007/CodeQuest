import { achievements, type AchievementDefinition } from '@/content/achievements';
import { tagDoSegredo } from '@/content/tags';
import { languageLessonSequence, moduleById } from '@/content';

/* -------------------------------------------------------------------------
 * XP e niveis
 * ---------------------------------------------------------------------- */

/** XP necessario para avancar cada nivel. Formula simples e previsivel. */
export const XP_PER_LEVEL = 100;

/** Nivel = xp // 100 + 1 (todo mundo comeca no nivel 1). */
export const levelFromXp = (xp: number): number =>
  Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;

/** Quanto XP falta para o proximo nivel. */
export const xpToNextLevel = (xp: number): number =>
  XP_PER_LEVEL - (Math.max(0, xp) % XP_PER_LEVEL);

/** Progresso dentro do nivel atual, de 0 a 1. */
export const levelProgress = (xp: number): number =>
  (Math.max(0, xp) % XP_PER_LEVEL) / XP_PER_LEVEL;

/** Titulo exibido ao lado do nivel, so para dar sabor. */
export const levelTitle = (level: number): string => {
  if (level >= 20) return 'Lenda do código';
  if (level >= 15) return 'Arquiteto';
  if (level >= 10) return 'Desenvolvedor';
  if (level >= 6) return 'Programador';
  if (level >= 3) return 'Aprendiz';
  return 'Iniciante';
};

/* -------------------------------------------------------------------------
 * Datas e streak
 * ---------------------------------------------------------------------- */

/** Data local no formato YYYY-MM-DD (o fuso do aluno e o que importa aqui). */
export const todayISO = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dayDifference = (fromISO: string, toISO: string): number => {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
};

export interface StreakResult {
  streak: number;
  /** true quando este e o primeiro estudo do dia (usado para animacao). */
  isNewDay: boolean;
}

/**
 * Recalcula o streak quando o aluno conclui algo.
 *
 *  - mesmo dia          -> streak inalterado
 *  - dia seguinte       -> streak + 1
 *  - qualquer buraco    -> streak volta para 1
 */
export const advanceStreak = (
  lastStudyDate: string | null,
  currentStreak: number,
  today: string = todayISO(),
): StreakResult => {
  if (!lastStudyDate) return { streak: 1, isNewDay: true };

  const difference = dayDifference(lastStudyDate, today);
  if (difference <= 0) return { streak: Math.max(1, currentStreak), isNewDay: false };
  if (difference === 1) return { streak: Math.max(1, currentStreak) + 1, isNewDay: true };
  return { streak: 1, isNewDay: true };
};

/**
 * Streak exibido no perfil. Se o aluno nao estuda desde anteontem, o streak
 * ja esta quebrado mesmo que o banco ainda guarde o valor antigo.
 */
export const displayStreak = (
  lastStudyDate: string | null,
  storedStreak: number,
  today: string = todayISO(),
): number => {
  if (!lastStudyDate) return 0;
  const difference = dayDifference(lastStudyDate, today);
  return difference <= 1 ? storedStreak : 0;
};

/** true se o aluno ainda nao estudou hoje (usado no aviso do dashboard). */
export const studiedToday = (lastStudyDate: string | null, today: string = todayISO()): boolean =>
  lastStudyDate === today;

/* -------------------------------------------------------------------------
 * Conquistas
 * ---------------------------------------------------------------------- */

export interface AchievementState {
  completedLessonIds: string[];
  xpTotal: number;
  streak: number;
  /** true quando a licao recem-concluida foi acertada sem nenhum erro. */
  flawlessLesson?: boolean;
  /** Tags ja desbloqueadas - as conquistas secretas espelham as tags. */
  unlockedTagIds?: string[];
  /** Vitorias acumuladas no duelo 1v1. */
  pvpVitorias?: number;
  /** Empates acumulados no duelo 1v1. */
  pvpEmpates?: number;
  /**
   * Desafios diarios concluidos no total. Vem de `desafio_estado()` - tabela
   * que so o servidor escreve.
   */
  desafiosDiarios?: number;
  /**
   * Maior patamar ja alcancado na ranqueada, em QUALQUER temporada
   * (0 = Bronze ... 6 = Mestre, 7 = Elite). Ver `patamarMaximoAlcancado` em
   * `src/lib/ranked/tipos.ts`.
   */
  rankedPatamarMax?: number;
}

const moduleIsComplete = (moduleId: string, completed: Set<string>): boolean => {
  const module = moduleById(moduleId);
  if (!module || module.lessons.length === 0) return false;
  return module.lessons.every((lesson) => completed.has(lesson.id));
};

const languageIsComplete = (languageSlug: string, completed: Set<string>): boolean => {
  const sequence = languageLessonSequence(languageSlug);
  if (sequence.length === 0) return false;
  return sequence.every((lesson) => completed.has(lesson.id));
};

const meetsCriteria = (achievement: AchievementDefinition, state: AchievementState): boolean => {
  const completed = new Set(state.completedLessonIds);
  const criteria = achievement.criteria;

  switch (criteria.kind) {
    case 'first_lesson':
      return completed.size >= 1;
    case 'lessons_completed':
      return completed.size >= criteria.count;
    case 'module_completed':
      return moduleIsComplete(criteria.moduleId, completed);
    case 'language_completed':
      return languageIsComplete(criteria.languageSlug, completed);
    case 'streak':
      return state.streak >= criteria.days;
    case 'xp':
      return state.xpTotal >= criteria.amount;
    case 'flawless':
      return state.flawlessLesson === true;
    case 'pvp_wins':
      return (state.pvpVitorias ?? 0) >= criteria.count;
    case 'pvp_draws':
      return (state.pvpEmpates ?? 0) >= criteria.count;
    case 'daily_challenges':
      return (state.desafiosDiarios ?? 0) >= criteria.count;
    case 'ranked_tier':
      return (state.rankedPatamarMax ?? 0) >= criteria.patamar;
    case 'secret': {
      // A conquista secreta acompanha a tag secreta: se a tag ja foi
      // desbloqueada, a medalha vem junto.
      const tag = tagDoSegredo(criteria.segredo);
      return Boolean(tag && state.unlockedTagIds?.includes(tag.id));
    }
    default:
      return false;
  }
};

/**
 * Retorna as conquistas que o aluno acabou de desbloquear (ainda nao estao em
 * `alreadyUnlocked`). A funcao e pura: quem grava no banco e `progress.ts`.
 */
export const evaluateAchievements = (
  state: AchievementState,
  alreadyUnlocked: string[],
): AchievementDefinition[] => {
  const unlocked = new Set(alreadyUnlocked);
  return achievements.filter(
    (achievement) => !unlocked.has(achievement.id) && meetsCriteria(achievement, state),
  );
};

/**
 * Todas as conquistas com o estado de desbloqueio, para a tela de perfil.
 *
 * As que espelham uma tag secreta aparecem MASCARADAS enquanto nao forem
 * conquistadas: mostrar "Concluiu uma licao entre meia-noite e cinco da
 * manha" na lista entregaria o segredo inteiro de graca.
 */
export const achievementsWithStatus = (unlockedIds: string[]) => {
  const unlocked = new Set(unlockedIds);
  return achievements.map((achievement) => {
    const conquistada = unlocked.has(achievement.id);
    const mascarar = !conquistada && achievement.criteria.kind === 'secret';

    return {
      ...achievement,
      title: mascarar ? 'Conquista secreta' : achievement.title,
      description: mascarar
        ? 'Existe, mas você ainda não descobriu como. Continue explorando.'
        : achievement.description,
      icon: mascarar ? '❔' : achievement.icon,
      unlocked: conquistada,
      secreta: mascarar,
    };
  });
};
