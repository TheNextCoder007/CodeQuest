import type { Exercise } from '@/types/content';

/** Estado do desafio de hoje para a tela. */
export interface EstadoDesafio {
  /** Data do desafio no fuso de Sao Paulo, `YYYY-MM-DD`. */
  dia: string;
  /** O exercicio em si, ja resolvido a partir do curriculo embarcado. */
  exercicio: Exercise | null;
  /** Id vindo do servidor - util quando o exercicio nao existe no app ainda. */
  exercicioId: string;
  xp: number;
  jaCompletou: boolean;
  /** Quantos desafios diarios esta conta ja concluiu, no total. */
  total: number;
  /** Quando o desafio de hoje deixa de valer. */
  expiraEm: Date;
  /**
   * true quando o servidor tem um desafio que este aplicativo nao conhece
   * (o banco foi populado com conteudo mais novo que o app instalado).
   */
  desconhecido: boolean;
}

export interface ResultadoDesafio {
  xpGanho: number;
  /** true quando o desafio de hoje ja tinha sido concluido antes. */
  jaTinha: boolean;
  total: number;
  novoXp: number;
  novoNivel: number;
}

/** Uma linha da comparacao com amigos. */
export interface AmigoNoDesafio {
  userId: string;
  nome: string;
  username: string | null;
  avatarUrl: string | null;
  /** Ja concluiu o desafio de HOJE. */
  concluido: boolean;
  /** Total historico de desafios concluidos. */
  total: number;
}

export const ESTADO_DESAFIO_VAZIO: EstadoDesafio = {
  dia: '',
  exercicio: null,
  exercicioId: '',
  xp: 0,
  jaCompletou: false,
  total: 0,
  expiraEm: new Date(0),
  desconhecido: false,
};
