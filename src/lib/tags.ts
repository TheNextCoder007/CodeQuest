/**
 * Regras das tags de perfil.
 *
 * Funcoes puras: recebem o estado do aluno e dizem quais tags ele ja merece.
 * Quem grava no banco e o `PlayerProvider`.
 *
 * As tags secretas NAO sao avaliadas aqui - elas nascem de uma acao pontual
 * (clicar no logo, terminar rapido, estudar de madrugada) e sao registradas
 * na hora, com `registrarSegredo`. Ver `SEGREDOS` em `src/content/tags.ts`.
 */

import { languageLessonSequence } from '@/content/index';
import {
  RARIDADES,
  type Raridade,
  type SegredoId,
  type TagDefinition,
  tagDoSegredo,
  tags,
} from '@/content/tags';

export interface TagState {
  level: number;
  completedLessonIds: string[];
  isDeveloper: boolean;
  /** Vitorias no duelo 1v1 (0 quando as estatisticas ainda nao carregaram). */
  pvpVitorias?: number;
  /** Vitorias por tema - alimenta a tag de "especialista". */
  pvpVitoriasPorTema?: Record<string, number>;
}

const trilhaCompleta = (languageSlug: string, completed: Set<string>): boolean => {
  const sequencia = languageLessonSequence(languageSlug);
  if (sequencia.length === 0) return false;
  return sequencia.every((licao) => completed.has(licao.id));
};

const atendeCriterio = (tag: TagDefinition, state: TagState): boolean => {
  switch (tag.criteria.kind) {
    case 'level':
      return state.level >= tag.criteria.level;
    case 'language_completed':
      return trilhaCompleta(tag.criteria.languageSlug, new Set(state.completedLessonIds));
    case 'manual':
      return state.isDeveloper;
    case 'pvp_wins':
      return (state.pvpVitorias ?? 0) >= tag.criteria.count;
    case 'pvp_tema': {
      // Basta UM tema atingir a marca: a tag e de especialista, nao de
      // colecionador.
      const porTema = Object.values(state.pvpVitoriasPorTema ?? {});
      const alvo = tag.criteria.count;
      return porTema.some((quantidade) => quantidade >= alvo);
    }
    case 'secret':
      // Nunca por avaliacao: so por `registrarSegredo`.
      return false;
    default:
      return false;
  }
};

/** Tags que o aluno ja merece e que ainda nao estao desbloqueadas. */
export const evaluateTags = (state: TagState, jaDesbloqueadas: string[]): TagDefinition[] => {
  const desbloqueadas = new Set(jaDesbloqueadas);
  return tags.filter((tag) => !desbloqueadas.has(tag.id) && atendeCriterio(tag, state));
};

/** A tag correspondente a um segredo, se ela ainda nao foi desbloqueada. */
export const tagPendenteDoSegredo = (
  segredo: SegredoId,
  jaDesbloqueadas: string[],
): TagDefinition | null => {
  const tag = tagDoSegredo(segredo);
  if (!tag || jaDesbloqueadas.includes(tag.id)) return null;
  return tag;
};

/**
 * Catalogo para a tela de perfil: todas as tags com o estado de desbloqueio.
 * As secretas ainda nao descobertas aparecem como "???".
 */
export interface TagComEstado extends TagDefinition {
  unlocked: boolean;
  /** true quando e secreta e ainda nao foi descoberta (mostrar mascarada). */
  escondida: boolean;
}

export const tagsComEstado = (desbloqueadasIds: string[], isDeveloper = false): TagComEstado[] => {
  const desbloqueadas = new Set(desbloqueadasIds);
  return tags
    .filter((tag) => tag.criteria.kind !== 'manual' || isDeveloper || desbloqueadas.has(tag.id))
    .map((tag) => ({
      ...tag,
      unlocked: desbloqueadas.has(tag.id),
      escondida: tag.secret && !desbloqueadas.has(tag.id),
    }))
    .sort((a, b) => {
      // Desbloqueadas primeiro, depois raridade decrescente, depois catalogo.
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      const raridade = RARIDADES.indexOf(b.rarity) - RARIDADES.indexOf(a.rarity);
      return raridade !== 0 ? raridade : a.orderIndex - b.orderIndex;
    });
};

/* -------------------------------------------------------------------------
 * Aparencia de cada raridade
 *
 * Segue a paleta do app: verde-agua (mint/aqua) e azul (electric) para as
 * comuns, violeta e rosa para as altas, dourado para a lendaria. A de
 * desenvolvedor tem tratamento proprio - gradiente cheio, para nao ser
 * confundida com nenhuma raridade conquistavel.
 * ---------------------------------------------------------------------- */

export interface EstiloRaridade {
  /** Classe do "chip" da tag. */
  chip: string;
  /** Cor do texto do nome da raridade. */
  texto: string;
  /** Borda usada em molduras (avatar, cards). */
  borda: string;
  rotulo: string;
}

export const ESTILO_RARIDADE: Record<Raridade, EstiloRaridade> = {
  comum: {
    chip: 'border-white/20 bg-white/[0.06] text-slate-200',
    texto: 'text-slate-400',
    borda: 'border-white/20',
    rotulo: 'Comum',
  },
  raro: {
    chip: 'border-electric-400/50 bg-electric-400/10 text-aqua-200',
    texto: 'text-aqua-300',
    borda: 'border-electric-400/50',
    rotulo: 'Raro',
  },
  epico: {
    chip: 'border-violet-400/50 bg-violet-500/15 text-violet-200',
    texto: 'text-violet-300',
    borda: 'border-violet-400/50',
    rotulo: 'Épico',
  },
  mitico: {
    chip: 'border-rose-400/50 bg-rose-500/15 text-rose-200',
    texto: 'text-rose-300',
    borda: 'border-rose-400/50',
    rotulo: 'Mítico',
  },
  lendario: {
    chip: 'border-amber-300/60 bg-gradient-to-r from-amber-400/25 via-amber-300/10 to-transparent text-amber-100 shadow-[0_0_18px_-6px_rgba(251,191,36,0.8)]',
    texto: 'text-amber-300',
    borda: 'border-amber-300/60',
    rotulo: 'Lendário',
  },
  dev: {
    chip: 'border-transparent bg-gradient-to-r from-mint-500 via-aqua-400 to-electric-500 text-night-950 font-extrabold shadow-glow',
    texto: 'text-mint-300',
    borda: 'border-mint-400/70',
    rotulo: 'Desenvolvedor',
  },
};

/** Moldura do avatar para quem esta no pódio do ranking global. */
export const MOLDURA_PODIO: Record<number, { anel: string; rotulo: string; emoji: string }> = {
  1: {
    anel: 'ring-2 ring-amber-300 shadow-[0_0_22px_-4px_rgba(251,191,36,0.9)]',
    rotulo: '1º lugar global',
    emoji: '🥇',
  },
  2: {
    anel: 'ring-2 ring-slate-300 shadow-[0_0_18px_-6px_rgba(203,213,225,0.9)]',
    rotulo: '2º lugar global',
    emoji: '🥈',
  },
  3: {
    anel: 'ring-2 ring-amber-600 shadow-[0_0_18px_-6px_rgba(217,119,6,0.9)]',
    rotulo: '3º lugar global',
    emoji: '🥉',
  },
};
