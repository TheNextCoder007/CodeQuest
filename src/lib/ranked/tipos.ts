/** Tipos compartilhados do modo ranqueado. */

import { divisaoDoElo, patamarDaDivisao, subnivelDaDivisao } from './patamares';

/** A temporada corrente. Dura 15 dias e vira sozinha (ver `0006_ranqueado.sql`). */
export interface Temporada {
  numero: number;
  comecaEm: string;
  terminaEm: string;
}

/** Onde o jogador esta na temporada atual. */
export interface EstadoRanqueada {
  temporada: Temporada;
  elo: number;
  /** 0 a 20 (Bronze 1 ... Mestre 3). */
  divisao: number;
  /** Maior elo alcancado NESTA temporada. */
  picoElo: number;
  picoDivisao: number;
  /**
   * Maior elo de todas as temporadas.
   *
   * E ele que libera as conquistas de patamar: a temporada zera, a medalha
   * nao.
   */
  picoHistorico: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
}

/** Uma temporada ja encerrada, para a lista de "temporadas passadas". */
export interface TemporadaPassada {
  numero: number;
  comecaEm: string;
  terminaEm: string;
  eloFinal: number;
  picoElo: number;
  picoDivisao: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
}

/** Uma linha do leaderboard da ranqueada. */
export interface LinhaRankingRanqueada {
  posicao: number;
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  elo: number;
  divisao: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
  equippedTagId: string | null;
  isDeveloper: boolean;
}

/** As duas listas do leaderboard, iguais as do ranking de XP. */
export type EscopoRanking = 'global' | 'amigos';

/** O que mudou no elo por causa de uma partida ranqueada. */
export interface ResultadoRanqueado {
  eloAntes: number;
  eloDepois: number;
  delta: number;
  divisaoAntes: number;
  divisaoDepois: number;
  /** Nome do adversario (o bot do patamar). */
  adversario: string;
}

export const ESTADO_RANQUEADA_VAZIO = (temporada: Temporada): EstadoRanqueada => ({
  temporada,
  elo: 0,
  divisao: 0,
  picoElo: 0,
  picoDivisao: 0,
  picoHistorico: 0,
  vitorias: 0,
  derrotas: 0,
  empates: 0,
  partidas: 0,
});

/** Patamar (0 a 6) mais alto ja alcancado em qualquer temporada. */
export const patamarMaximoAlcancado = (estado: EstadoRanqueada | null): number =>
  estado ? patamarDaDivisao(divisaoDoElo(estado.picoHistorico)) : 0;

/** Ex.: "Ouro 2" -> { patamar: 2, subnivel: 2 }. */
export const partesDaDivisao = (divisao: number) => ({
  patamar: patamarDaDivisao(divisao),
  subnivel: subnivelDaDivisao(divisao),
});

/** Dias inteiros que faltam para a temporada acabar (0 = acaba hoje). */
export const diasRestantes = (temporada: Temporada, agora = new Date()): number => {
  const fim = new Date(temporada.terminaEm).getTime();
  return Math.max(0, Math.ceil((fim - agora.getTime()) / 86_400_000));
};

/** "termina em 6 dias" / "termina hoje". */
export const descricaoDoPrazo = (temporada: Temporada, agora = new Date()): string => {
  const dias = diasRestantes(temporada, agora);
  if (dias <= 0) return 'termina hoje';
  if (dias === 1) return 'termina amanhã';
  return `termina em ${dias} dias`;
};
