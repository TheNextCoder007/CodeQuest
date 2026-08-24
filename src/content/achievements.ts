/**
 * Conquistas do CodeQuest.
 *
 * `criteria` e uma descricao legivel do criterio, guardada tambem no banco.
 * A verificacao em si acontece em `src/lib/gamification.ts` (funcao
 * `evaluateAchievements`), que recebe o estado do aluno e devolve os ids
 * recem-desbloqueados.
 */

import type { SegredoId } from './tags';

export type AchievementCriteria =
  | { kind: 'first_lesson' }
  | { kind: 'lessons_completed'; count: number }
  | { kind: 'module_completed'; moduleId: string }
  | { kind: 'language_completed'; languageSlug: string }
  | { kind: 'streak'; days: number }
  | { kind: 'xp'; amount: number }
  | { kind: 'flawless' }
  /**
   * Espelha uma tag secreta: a conquista e concedida junto com a tag.
   * O que desbloqueia cada segredo esta em `src/content/tags.ts` (SEGREDOS).
   */
  | { kind: 'secret'; segredo: SegredoId }
  /** Vitorias no modo 1v1. */
  | { kind: 'pvp_wins'; count: number };

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
}

export const achievements: AchievementDefinition[] = [
  {
    id: 'primeiro-desafio',
    title: 'Primeiro desafio concluído',
    description: 'Você resolveu sua primeira lição no CodeQuest.',
    icon: '🎯',
    criteria: { kind: 'first_lesson' },
  },
  {
    id: 'aquecendo',
    title: 'Aquecendo os motores',
    description: 'Cinco lições concluídas. A rotina começou.',
    icon: '🚀',
    criteria: { kind: 'lessons_completed', count: 5 },
  },
  {
    id: 'meia-trilha',
    title: 'Meia trilha',
    description: 'Doze lições concluídas — você passou da metade da trilha de Python.',
    icon: '🧭',
    criteria: { kind: 'lessons_completed', count: 12 },
  },
  {
    id: 'modulo-fundamentos',
    title: 'Fundamentos dominados',
    description: 'Você concluiu todo o módulo 🐣 Fundamentos.',
    icon: '🐣',
    criteria: { kind: 'module_completed', moduleId: 'py-fundamentos' },
  },
  {
    id: 'modulo-variaveis',
    title: 'Mestre das variáveis',
    description: 'Você concluiu todo o módulo 📦 Variáveis.',
    icon: '📦',
    criteria: { kind: 'module_completed', moduleId: 'py-variaveis' },
  },
  {
    id: 'modulo-condicionais',
    title: 'Módulo Condicionais completo',
    description: 'Você concluiu todo o módulo 🔀 Condicionais.',
    icon: '🔀',
    criteria: { kind: 'module_completed', moduleId: 'py-condicionais' },
  },
  {
    id: 'modulo-repeticoes',
    title: 'Domador de laços',
    description: 'Você concluiu todo o módulo 🔁 Repetições.',
    icon: '🔁',
    criteria: { kind: 'module_completed', moduleId: 'py-repeticoes' },
  },
  {
    id: 'modulo-funcoes',
    title: 'Arquiteto de funções',
    description: 'Você concluiu todo o módulo ⚙️ Funções.',
    icon: '⚙️',
    criteria: { kind: 'module_completed', moduleId: 'py-funcoes' },
  },
  {
    id: 'modulo-desafios',
    title: 'Resolvedor de problemas',
    description: 'Você concluiu todo o módulo 🧩 Desafios, incluindo o FizzBuzz.',
    icon: '🧩',
    criteria: { kind: 'module_completed', moduleId: 'py-desafios' },
  },
  {
    id: 'trilha-python',
    title: 'Trilha de Python concluída',
    description: 'Você terminou os sete módulos da trilha de Python. Respeito.',
    icon: '🏆',
    criteria: { kind: 'language_completed', languageSlug: 'python' },
  },
  {
    id: 'streak-3',
    title: '3 dias de streak',
    description: 'Três dias seguidos estudando.',
    icon: '🔥',
    criteria: { kind: 'streak', days: 3 },
  },
  {
    id: 'streak-7',
    title: '7 dias de streak',
    description: 'Uma semana inteira sem falhar um dia.',
    icon: '🔥',
    criteria: { kind: 'streak', days: 7 },
  },
  {
    id: 'streak-30',
    title: '30 dias de streak',
    description: 'Um mês de constância. Isso é hábito, não sorte.',
    icon: '💎',
    criteria: { kind: 'streak', days: 30 },
  },
  {
    id: 'xp-500',
    title: '500 XP',
    description: 'Meio milhar de pontos de experiência acumulados.',
    icon: '⭐',
    criteria: { kind: 'xp', amount: 500 },
  },
  {
    id: 'xp-1000',
    title: '1000 XP',
    description: 'Mil pontos de experiência. Você é veterano por aqui.',
    icon: '🌟',
    criteria: { kind: 'xp', amount: 1000 },
  },
  {
    id: 'sem-erros',
    title: 'Impecável',
    description: 'Você concluiu uma lição acertando todos os exercícios de primeira.',
    icon: '🥇',
    criteria: { kind: 'flawless' },
  },

  /* ---------------------------------------------------------------------
   * Espelhos das tags secretas (ver src/content/tags.ts)
   * ------------------------------------------------------------------ */
  /* ---------------------------------------------------------------------
   * Duelo 1v1
   * ------------------------------------------------------------------ */
  {
    id: 'pvp-primeira-vitoria',
    title: 'Primeira vitória',
    description: 'Venceu seu primeiro duelo 1v1.',
    icon: '🗡️',
    criteria: { kind: 'pvp_wins', count: 1 },
  },
  {
    id: 'pvp-10-vitorias',
    title: '10 duelos vencidos',
    description: 'Dez vitórias no 1v1 — isso já é constância.',
    icon: '⚔️',
    criteria: { kind: 'pvp_wins', count: 10 },
  },
  {
    id: 'pvp-50-vitorias',
    title: '50 duelos vencidos',
    description: 'Cinquenta vitórias. Virou referência entre os amigos.',
    icon: '🔥',
    criteria: { kind: 'pvp_wins', count: 50 },
  },
  {
    id: 'pvp-100-vitorias',
    title: '100 duelos vencidos',
    description: 'Cem vitórias no 1v1.',
    icon: '💀',
    criteria: { kind: 'pvp_wins', count: 100 },
  },

  {
    id: 'segredo-curioso',
    title: 'Achou o botão secreto',
    description: 'Dez cliques no logo depois, algo apareceu.',
    icon: '🕵️',
    criteria: { kind: 'secret', segredo: 'logo-10-cliques' },
  },
  {
    id: 'segredo-relampago',
    title: 'Rápido no gatilho',
    description: 'Uma lição inteira em menos de 30 segundos, sem errar nada.',
    icon: '⚡',
    criteria: { kind: 'secret', segredo: 'licao-relampago' },
  },
  {
    id: 'segredo-madrugada',
    title: 'Turno da madrugada',
    description: 'Concluiu uma lição entre meia-noite e cinco da manhã.',
    icon: '🦉',
    criteria: { kind: 'secret', segredo: 'madrugada' },
  },
  {
    id: 'segredo-impecavel',
    title: 'Série impecável',
    description: 'Cinco lições sem errar um único exercício.',
    icon: '💎',
    criteria: { kind: 'secret', segredo: 'serie-impecavel' },
  },
];

export const achievementById = (id: string): AchievementDefinition | undefined =>
  achievements.find((achievement) => achievement.id === id);
