/** Tipos compartilhados do modo 1v1. */

export type StatusPartida = 'convite' | 'ativa' | 'encerrada' | 'recusada' | 'cancelada';

/**
 * Amistoso e o duelo entre amigos da Fase 3. Ranqueado e o da Fase 4 - mesma
 * partida, mesmas perguntas, mas valendo elo e (por enquanto) contra um bot.
 */
export type ModoPartida = 'amistoso' | 'ranqueado';

/** Resultado do ponto de vista de quem esta perguntando. */
export type DesfechoPessoal = 'vitoria' | 'derrota' | 'empate';

/** Uma pergunta como ela chega ao cliente: SEM o gabarito. */
export interface PerguntaPvp {
  num: number;
  tipo: 'multiple_choice' | 'fill_blank';
  enunciado: string;
  alternativas: string[] | null;
  total: number;
}

/** O que volta depois de responder - agora sim com o gabarito. */
export interface ResultadoResposta {
  certa: boolean;
  ganhos: number;
  tempoMs: number;
  gabarito: string;
  explicacao: string;
}

export interface EstadoPartida {
  status: StatusPartida;
  total: number;
  tema: string;
  modo: ModoPartida;
  hostId: string;
  /** Nulo quando o adversario e um bot (partida ranqueada). */
  guestId: string | null;
  winnerId: string | null;
  /**
   * Nome do bot, quando o adversario e da casa.
   *
   * Num duelo entre pessoas isto e nulo - `winner_id` ja resolve, e o nome do
   * amigo a tela ja tem.
   */
  adversario: string | null;
  /**
   * Como a partida terminou PARA MIM.
   *
   * Existe porque `winnerId` nao consegue dizer "o bot ganhou": bot nao tem
   * perfil, entao o campo ficaria nulo e a derrota pareceria empate.
   */
  meuDesfecho: DesfechoPessoal | null;
  hostRespondidas: number;
  guestRespondidas: number;
  hostPontos: number;
  guestPontos: number;
}

export interface ResultadoFinal {
  status: StatusPartida;
  winnerId: string | null;
  pontosHost: number;
  pontosGuest: number;
}

/** Convite ou partida na lista da tela de amigos. */
export interface ResumoPartida {
  id: string;
  tema: string;
  status: StatusPartida;
  hostId: string;
  guestId: string;
  winnerId: string | null;
  pontosHost: number;
  pontosGuest: number;
  criadaEm: string;
  /** Perfil da outra pessoa, preenchido pela tela. */
  adversarioId: string;
}

export interface EstatisticasPvp {
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
  pontosTotais: number;
  vitoriasPorTema: Record<string, number>;
}

export const ESTATISTICAS_VAZIAS: EstatisticasPvp = {
  vitorias: 0,
  derrotas: 0,
  empates: 0,
  partidas: 0,
  pontosTotais: 0,
  vitoriasPorTema: {},
};

/** Aproveitamento em porcentagem (0 quando nunca jogou). */
export const aproveitamento = (stats: EstatisticasPvp): number =>
  stats.partidas === 0 ? 0 : Math.round((stats.vitorias / stats.partidas) * 100);
