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
  | { kind: 'manual' };

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
