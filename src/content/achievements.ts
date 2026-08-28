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
  | { kind: 'pvp_wins'; count: number }
  /**
   * Empates no modo 1v1.
   *
   * E de longe o resultado mais raro: as duas pessoas precisam acertar a mesma
   * quantidade de perguntas E somar o mesmo bonus de velocidade, em milesimos
   * de segundo. Por isso vale medalha ja no primeiro.
   */
  // Empates que VALEM: o 0 a 0 fica de fora (ver migracao 0013).
  | { kind: 'pvp_draws'; count: number }
  /**
   * Desafios diarios concluidos, no total.
   *
   * O contador vive no banco (`daily_challenge_completions`) e chega aqui por
   * `sincronizarDesafios` - o cliente nao tem por onde inflar esse numero.
   */
  | { kind: 'daily_challenges'; count: number }
  /**
   * Chegar a um patamar do modo ranqueado.
   *
   * `patamar` e o indice em `PATAMARES` (`src/lib/ranked/patamares.ts`):
   * 1 = Prata, 2 = Ouro, ... 7 = Elite. Bronze fica de fora porque e onde
   * todo mundo comeca - conquista por estar no comeco nao e conquista.
   *
   * E por PATAMAR, nao por sub-nivel: 22 divisoes dariam 22 medalhas quase
   * iguais e a lista de conquistas viraria uma planilha. Chegar a Ouro 1 ja
   * conta como "alcancou Ouro".
   *
   * Vale para sempre: a comparacao usa o maior elo de TODAS as temporadas
   * (`pico_historico`), entao o reset de 15 dias nao apaga a medalha.
   */
  | { kind: 'ranked_tier'; patamar: number };

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

  /* ---------------------------------------------------------------------
   * Trilha de JavaScript
   *
   * Mesma estrutura da de Python: uma medalha por modulo (menos o projeto
   * final, coberto pela medalha da trilha inteira). Os ids sao proprios
   * porque as duas trilhas podem ser percorridas em qualquer ordem - e
   * quem terminar as duas fica com os dois conjuntos.
   * ------------------------------------------------------------------ */
  {
    id: 'js-modulo-fundamentos',
    title: 'Primeiros passos no JavaScript',
    description: 'Você concluiu todo o módulo 🐣 Fundamentos da trilha de JavaScript.',
    icon: '🐣',
    criteria: { kind: 'module_completed', moduleId: 'js-fundamentos' },
  },
  {
    id: 'js-modulo-variaveis',
    title: 'let, const e você',
    description: 'Você concluiu todo o módulo 📦 Variáveis da trilha de JavaScript.',
    icon: '📦',
    criteria: { kind: 'module_completed', moduleId: 'js-variaveis' },
  },
  {
    id: 'js-modulo-condicionais',
    title: 'Time do ===',
    description: 'Você concluiu todo o módulo 🔀 Condicionais e sabe por que não usar ==.',
    icon: '🔀',
    criteria: { kind: 'module_completed', moduleId: 'js-condicionais' },
  },
  {
    id: 'js-modulo-repeticoes',
    title: 'Laços sob controle',
    description: 'Você concluiu todo o módulo 🔁 Repetições da trilha de JavaScript.',
    icon: '🔁',
    criteria: { kind: 'module_completed', moduleId: 'js-repeticoes' },
  },
  {
    id: 'js-modulo-funcoes',
    title: 'Arqueiro das arrow functions',
    description: 'Você concluiu todo o módulo 🧩 Funções e domina o =>.',
    icon: '🏹',
    criteria: { kind: 'module_completed', moduleId: 'js-funcoes' },
  },
  {
    id: 'js-modulo-desafios',
    title: 'map, filter, reduce',
    description: 'Você concluiu todo o módulo 🏆 Desafios da trilha de JavaScript.',
    icon: '🧮',
    criteria: { kind: 'module_completed', moduleId: 'js-desafios' },
  },
  {
    id: 'trilha-javascript',
    title: 'Trilha de JavaScript concluída',
    description: 'Você terminou os sete módulos da trilha de JavaScript. A web é sua.',
    icon: '🟨',
    criteria: { kind: 'language_completed', languageSlug: 'javascript' },
  },
  /* ---------------------------------------------------------------------
   * Desafios diarios - a mesma progressao 1 / 10 / 50 / 100 do duelo
   * ------------------------------------------------------------------ */
  {
    id: 'desafio-primeiro',
    title: 'Primeiro desafio do dia',
    description: 'Você concluiu o seu primeiro desafio diário.',
    icon: '📅',
    criteria: { kind: 'daily_challenges', count: 1 },
  },
  {
    id: 'desafio-10',
    title: '10 desafios diários',
    description: 'Dez desafios do dia concluídos. Virou hábito.',
    icon: '🗓️',
    criteria: { kind: 'daily_challenges', count: 10 },
  },
  {
    id: 'desafio-50',
    title: '50 desafios diários',
    description: 'Cinquenta desafios do dia. Isso é constância de verdade.',
    icon: '⏳',
    criteria: { kind: 'daily_challenges', count: 50 },
  },
  {
    id: 'desafio-100',
    title: '100 desafios diários',
    description: 'Cem desafios do dia concluídos. Poucas pessoas chegam aqui.',
    icon: '🌠',
    criteria: { kind: 'daily_challenges', count: 100 },
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

  /* ---------------------------------------------------------------------
   * Ranqueada - uma por patamar (ver `ranked_tier` acima)
   * ------------------------------------------------------------------ */
  {
    id: 'duelo-empate',
    title: 'Empate técnico',
    description:
      'Terminou um duelo empatado com placar — mesmo número de acertos e o mesmo bônus de velocidade. ' +
      'É o resultado mais raro do jogo. Empate em 0 a 0 não conta: errar tudo dos dois lados não é feito nenhum.',
    icon: '🤝',
    criteria: { kind: 'pvp_draws', count: 1 },
  },
  {
    id: 'ranqueada-prata',
    title: 'Alcançou Prata',
    description: 'Saiu do Bronze na temporada ranqueada.',
    icon: '🥈',
    criteria: { kind: 'ranked_tier', patamar: 1 },
  },
  {
    id: 'ranqueada-ouro',
    title: 'Alcançou Ouro',
    description: 'Chegou ao Ouro na ranqueada. Daqui as vitórias valem menos elo.',
    icon: '🥇',
    criteria: { kind: 'ranked_tier', patamar: 2 },
  },
  {
    id: 'ranqueada-diamante',
    title: 'Alcançou Diamante',
    description: 'Chegou ao Diamante na ranqueada.',
    icon: '💠',
    criteria: { kind: 'ranked_tier', patamar: 3 },
  },
  {
    id: 'ranqueada-mitico',
    title: 'Alcançou Mítico',
    description: 'Chegou ao Mítico. Os bots daqui pra cima erram pouco.',
    icon: '🔮',
    criteria: { kind: 'ranked_tier', patamar: 4 },
  },
  {
    id: 'ranqueada-lendario',
    title: 'Alcançou Lendário',
    description: 'Chegou ao Lendário na ranqueada.',
    icon: '👑',
    criteria: { kind: 'ranked_tier', patamar: 5 },
  },
  {
    id: 'ranqueada-mestre',
    title: 'Alcançou Mestre',
    description: 'Chegou ao Mestre, com os três sub-níveis pela frente.',
    icon: '🏅',
    criteria: { kind: 'ranked_tier', patamar: 6 },
  },
  {
    id: 'ranqueada-elite',
    title: 'Alcançou Elite',
    description: 'Chegou ao Elite — o topo absoluto da escada, de onde não se cai mais.',
    icon: '⭐',
    criteria: { kind: 'ranked_tier', patamar: 7 },
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
