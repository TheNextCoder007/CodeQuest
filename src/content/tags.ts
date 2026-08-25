/**
 * Tags de perfil do CodeQuest.
 *
 * Uma tag e um titulo que o aluno exibe no perfil. Diferente das conquistas
 * (que sao um checklist), a tag e vaidade: so uma fica visivel por vez, e a
 * pessoa escolhe qual.
 *
 * O criterio fica aqui e a verificacao em `src/lib/tags.ts`. As secretas nao
 * aparecem na lista ate serem desbloqueadas - e cada uma delas tem uma
 * conquista correspondente em `src/content/achievements.ts`.
 */

/** Da mais comum para a mais rara. A ordem importa: e usada para ordenar. */
export const RARIDADES = ['comum', 'raro', 'epico', 'mitico', 'lendario', 'dev'] as const;

export type Raridade = (typeof RARIDADES)[number];

export const RARIDADE_NOME: Record<Raridade, string> = {
  comum: 'Comum',
  raro: 'Raro',
  epico: 'Épico',
  mitico: 'Mítico',
  lendario: 'Lendário',
  dev: 'Desenvolvedor',
};

export type TagCriteria =
  /** Alcancar um nivel. */
  | { kind: 'level'; level: number }
  /** Concluir a trilha inteira de uma linguagem. */
  | { kind: 'language_completed'; languageSlug: string }
  /** Secreta: liberada por uma acao especifica (ver `segredo`). */
  | { kind: 'secret'; segredo: SegredoId }
  /** Concedida a mao no banco (`profiles.is_developer = true`). */
  | { kind: 'manual' }
  /** Vitorias acumuladas no modo 1v1. */
  | { kind: 'pvp_wins'; count: number }
  /** Vitorias no MESMO tema (vira "especialista" naquela linguagem). */
  | { kind: 'pvp_tema'; count: number }
  /** Desafios diarios concluidos, no total. */
  | { kind: 'daily_challenges'; count: number };

/**
 * Identificadores das acoes secretas.
 *
 * O que desbloqueia cada uma esta documentado em `SEGREDOS` logo abaixo e
 * tambem no README - de proposito: segredo que ninguem consegue descobrir
 * vira bug, nao surpresa.
 */
export type SegredoId = 'logo-10-cliques' | 'licao-relampago' | 'madrugada' | 'serie-impecavel';

export interface SegredoDefinicao {
  id: SegredoId;
  /** Explicacao exata da acao que desbloqueia. */
  comoDesbloquear: string;
}

export const SEGREDOS: Record<SegredoId, SegredoDefinicao> = {
  'logo-10-cliques': {
    id: 'logo-10-cliques',
    comoDesbloquear:
      'Clicar 10 vezes no logo do cabeçalho, com menos de 1,5 segundo entre um clique e outro.',
  },
  'licao-relampago': {
    id: 'licao-relampago',
    comoDesbloquear:
      'Concluir uma lição em menos de 30 segundos, contados a partir do momento em que a tela de desafios abre — e sem errar nenhum exercício.',
  },
  madrugada: {
    id: 'madrugada',
    comoDesbloquear: 'Concluir uma lição entre 00h00 e 04h59 no horário do próprio aparelho.',
  },
  'serie-impecavel': {
    id: 'serie-impecavel',
    comoDesbloquear: 'Concluir 5 lições diferentes sem errar nenhum exercício em nenhuma delas.',
  },
};

export interface TagDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Raridade;
  criteria: TagCriteria;
  /** Some da lista enquanto nao for desbloqueada. */
  secret: boolean;
  orderIndex: number;
}

export const tags: TagDefinition[] = [
  /* ---------------------------------------------------------------------
   * Por nivel - uma raridade por marco, sempre subindo
   * ------------------------------------------------------------------ */
  {
    id: 'nivel-05',
    name: 'Primeiros Passos',
    description: 'Chegou ao nível 5. O começo de tudo.',
    icon: '🌱',
    rarity: 'comum',
    criteria: { kind: 'level', level: 5 },
    secret: false,
    orderIndex: 1,
  },
  {
    id: 'nivel-10',
    name: 'Codificador',
    description: 'Chegou ao nível 10. Código já não assusta mais.',
    icon: '⌨️',
    rarity: 'raro',
    criteria: { kind: 'level', level: 10 },
    secret: false,
    orderIndex: 2,
  },
  {
    id: 'nivel-20',
    name: 'Arquiteto',
    description: 'Chegou ao nível 20. Agora você desenha a solução antes de escrever.',
    icon: '📐',
    rarity: 'epico',
    criteria: { kind: 'level', level: 20 },
    secret: false,
    orderIndex: 3,
  },
  {
    id: 'nivel-30',
    name: 'Mestre do Código',
    description: 'Chegou ao nível 30. Pouca gente chega aqui.',
    icon: '🔮',
    rarity: 'mitico',
    criteria: { kind: 'level', level: 30 },
    secret: false,
    orderIndex: 4,
  },
  {
    id: 'nivel-50',
    name: 'Lenda do CodeQuest',
    description: 'Chegou ao nível 50. Isso é 5.000 XP.',
    icon: '👑',
    rarity: 'lendario',
    criteria: { kind: 'level', level: 50 },
    secret: false,
    orderIndex: 5,
  },

  /* ---------------------------------------------------------------------
   * Por trilha concluida
   * ------------------------------------------------------------------ */
  {
    id: 'pythonista',
    name: 'Pythonista',
    description: 'Concluiu a trilha de Python inteira, do primeiro print ao projeto final.',
    icon: '🐍',
    rarity: 'epico',
    criteria: { kind: 'language_completed', languageSlug: 'python' },
    secret: false,
    orderIndex: 6,
  },

  /* ---------------------------------------------------------------------
   * Duelo 1v1 - raridade crescente conforme as vitorias acumulam
   * ------------------------------------------------------------------ */
  {
    id: 'pvp-estreante',
    name: 'Estreante',
    description: 'Venceu o primeiro duelo 1v1.',
    icon: '🗡️',
    rarity: 'comum',
    criteria: { kind: 'pvp_wins', count: 1 },
    secret: false,
    orderIndex: 10,
  },
  {
    id: 'pvp-duelista',
    name: 'Duelista',
    description: '10 vitórias em duelos. Já sabe o que está fazendo.',
    icon: '⚔️',
    rarity: 'raro',
    criteria: { kind: 'pvp_wins', count: 10 },
    secret: false,
    orderIndex: 11,
  },
  {
    id: 'pvp-especialista',
    name: 'Especialista',
    description: '10 vitórias no mesmo tema. Escolheu um assunto e dominou.',
    icon: '🎓',
    rarity: 'epico',
    criteria: { kind: 'pvp_tema', count: 10 },
    secret: false,
    orderIndex: 12,
  },
  {
    id: 'pvp-gladiador',
    name: 'Gladiador',
    description: '25 vitórias em duelos.',
    icon: '🛡️',
    rarity: 'epico',
    criteria: { kind: 'pvp_wins', count: 25 },
    secret: false,
    orderIndex: 13,
  },
  {
    id: 'pvp-implacavel',
    name: 'Implacável',
    description: '50 vitórias em duelos. Pouca gente aceita o convite.',
    icon: '🔥',
    rarity: 'mitico',
    criteria: { kind: 'pvp_wins', count: 50 },
    secret: false,
    orderIndex: 14,
  },
  {
    id: 'pvp-imortal',
    name: 'Imortal',
    description: '100 vitórias em duelos.',
    icon: '💀',
    rarity: 'lendario',
    criteria: { kind: 'pvp_wins', count: 100 },
    secret: false,
    orderIndex: 15,
  },

  /* ---------------------------------------------------------------------
   * Desafios diarios - premiam constancia, nao velocidade
   *
   * A escala e mais espacada que a do duelo de proposito: um desafio por dia
   * e o teto, entao 100 desafios sao no minimo 100 dias. A tag lendaria aqui
   * custa mais tempo do que qualquer outra do jogo.
   * ------------------------------------------------------------------ */
  {
    id: 'diarista',
    name: 'Diarista',
    description: 'Concluiu o primeiro desafio diário.',
    icon: '📅',
    rarity: 'comum',
    criteria: { kind: 'daily_challenges', count: 1 },
    secret: false,
    orderIndex: 30,
  },
  {
    id: 'diarista-constante',
    name: 'Constante',
    description: '10 desafios diários concluídos. Aparecer todo dia é meio caminho.',
    icon: '🗓️',
    rarity: 'raro',
    criteria: { kind: 'daily_challenges', count: 10 },
    secret: false,
    orderIndex: 31,
  },
  {
    id: 'diarista-disciplinado',
    name: 'Disciplinado',
    description: '25 desafios diários. Mais de três semanas sem falhar um dia sequer.',
    icon: '⏳',
    rarity: 'epico',
    criteria: { kind: 'daily_challenges', count: 25 },
    secret: false,
    orderIndex: 32,
  },
  {
    id: 'diarista-inabalavel',
    name: 'Inabalável',
    description: '50 desafios diários concluídos.',
    icon: '🧱',
    rarity: 'mitico',
    criteria: { kind: 'daily_challenges', count: 50 },
    secret: false,
    orderIndex: 33,
  },
  {
    id: 'diarista-lendario',
    name: 'Diarista Lendário',
    description: '100 desafios diários. São no mínimo 100 dias de CodeQuest.',
    icon: '🌠',
    rarity: 'lendario',
    criteria: { kind: 'daily_challenges', count: 100 },
    secret: false,
    orderIndex: 34,
  },

  /* ---------------------------------------------------------------------
   * Secretas - o que desbloqueia cada uma esta em SEGREDOS acima
   * ------------------------------------------------------------------ */
  {
    id: 'secreta-curioso',
    name: 'Curioso',
    description: 'Você ficou clicando no logo até algo acontecer. Respeito.',
    icon: '🕵️',
    rarity: 'raro',
    criteria: { kind: 'secret', segredo: 'logo-10-cliques' },
    secret: true,
    orderIndex: 20,
  },
  {
    id: 'secreta-relampago',
    name: 'Relâmpago',
    description: 'Resolveu uma lição inteira em menos de 30 segundos, sem errar nada.',
    icon: '⚡',
    rarity: 'epico',
    criteria: { kind: 'secret', segredo: 'licao-relampago' },
    secret: true,
    orderIndex: 21,
  },
  {
    id: 'secreta-madrugada',
    name: 'Coruja',
    description: 'Estudou de madrugada. O código não dorme.',
    icon: '🦉',
    rarity: 'raro',
    criteria: { kind: 'secret', segredo: 'madrugada' },
    secret: true,
    orderIndex: 22,
  },
  {
    id: 'secreta-impecavel',
    name: 'Impecável',
    description: 'Cinco lições seguidas sem errar um único exercício.',
    icon: '💎',
    rarity: 'mitico',
    criteria: { kind: 'secret', segredo: 'serie-impecavel' },
    secret: true,
    orderIndex: 23,
  },

  /* ---------------------------------------------------------------------
   * Concedida a mao no banco (ver README, secao de tags)
   * ------------------------------------------------------------------ */
  {
    id: 'dev',
    name: 'Desenvolvedor',
    description: 'Quem construiu o CodeQuest.',
    icon: '🛠️',
    rarity: 'dev',
    criteria: { kind: 'manual' },
    secret: false,
    orderIndex: 99,
  },
];

export const tagById = (id: string): TagDefinition | undefined =>
  tags.find((tag) => tag.id === id);

export const tagDoSegredo = (segredo: SegredoId): TagDefinition | undefined =>
  tags.find((tag) => tag.criteria.kind === 'secret' && tag.criteria.segredo === segredo);

/** Ordena por raridade (mais rara primeiro) e depois pela ordem de catalogo. */
export const ordenarTags = (lista: TagDefinition[]): TagDefinition[] =>
  [...lista].sort((a, b) => {
    const diferenca = RARIDADES.indexOf(b.rarity) - RARIDADES.indexOf(a.rarity);
    return diferenca !== 0 ? diferenca : a.orderIndex - b.orderIndex;
  });
