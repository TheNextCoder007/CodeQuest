'use client';

import {
  criarDueloLocal,
  desfechoLocal,
  encerrarAbandonadaLocal,
  finalizarLocal,
  ranqueadaAbertaLocal,
  temaLocal,
} from '@/lib/pvp/local';
import type { DesfechoPessoal } from '@/lib/pvp/tipos';
import { botDoElo } from './bots';
import { divisaoDoElo, novoElo, patamarDaDivisao, type ResultadoRanqueada } from './patamares';
import { poolDoPatamar, temasDoPatamar } from './temas';
import type {
  TopoRanqueado,
  EscopoRanking,
  EstadoRanqueada,
  LinhaRankingRanqueada,
  ResultadoRanqueado,
  Temporada,
  TemporadaPassada,
} from './tipos';

/**
 * Modo ranqueado no modo demonstracao (sem Supabase).
 *
 * Mesma logica do servidor, rodando no aparelho: temporada de 15 dias que vira
 * sozinha, elo por temporada, historico das temporadas passadas e bot escolhido
 * pelo patamar.
 *
 * Nada aqui vale para uma partida de verdade. Com Supabase configurado quem
 * calcula elo e `ranked_aplicar_resultado`, dentro do banco - o aparelho nao
 * tem como escrever nesse numero. Esta copia existe para o projeto poder ser
 * apresentado offline, que e um requisito do trabalho.
 */

export const DIAS_DA_TEMPORADA = 15;

const CHAVE_TEMPORADAS = 'cq:demo:ranked-temporadas';
const CHAVE_STATS = 'cq:demo:ranked-stats';

interface LinhaStats {
  elo: number;
  picoElo: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
}

const VAZIA: LinhaStats = {
  elo: 0,
  picoElo: 0,
  vitorias: 0,
  derrotas: 0,
  empates: 0,
  partidas: 0,
};

const lerJson = <T,>(chave: string, padrao: T): T => {
  if (typeof window === 'undefined') return padrao;
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
};

const gravarJson = (chave: string, valor: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(chave, JSON.stringify(valor));
};

/* -------------------------------------------------------------------------
 * Temporada
 * ---------------------------------------------------------------------- */

const meiaNoiteDeHoje = (): Date => {
  const agora = new Date();
  agora.setHours(0, 0, 0, 0);
  return agora;
};

const somarDias = (data: string | Date, dias: number): string => {
  const base = new Date(data);
  base.setDate(base.getDate() + dias);
  return base.toISOString();
};

/**
 * A temporada de agora, criando o que faltar.
 *
 * Igual ao servidor: a virada e preguicosa (acontece na primeira vez que
 * alguem abre a tela depois do prazo) e as temporadas se encaixam sem buraco,
 * entao ficar duas semanas sem abrir o app nao bagunca a contagem.
 */
export const temporadaAtualLocal = (): Temporada => {
  const todas = lerJson<Temporada[]>(CHAVE_TEMPORADAS, []);

  if (todas.length === 0) {
    const inicio = meiaNoiteDeHoje().toISOString();
    const primeira: Temporada = {
      numero: 1,
      comecaEm: inicio,
      terminaEm: somarDias(inicio, DIAS_DA_TEMPORADA),
    };
    gravarJson(CHAVE_TEMPORADAS, [primeira]);
    return primeira;
  }

  let atual = todas[todas.length - 1];
  let giros = 0;
  while (Date.now() >= new Date(atual.terminaEm).getTime() && giros < 500) {
    atual = {
      numero: atual.numero + 1,
      comecaEm: atual.terminaEm,
      terminaEm: somarDias(atual.terminaEm, DIAS_DA_TEMPORADA),
    };
    todas.push(atual);
    giros += 1;
  }
  if (giros > 0) gravarJson(CHAVE_TEMPORADAS, todas);

  return atual;
};

const temporadasLocais = (): Temporada[] => lerJson<Temporada[]>(CHAVE_TEMPORADAS, []);

/* -------------------------------------------------------------------------
 * Elo
 * ---------------------------------------------------------------------- */

type MapaStats = Record<string, LinhaStats>;

const chaveDe = (temporada: number, userId: string) => `${temporada}:${userId}`;

const lerStats = (): MapaStats => lerJson<MapaStats>(CHAVE_STATS, {});

const linhaDe = (temporada: number, userId: string): LinhaStats =>
  lerStats()[chaveDe(temporada, userId)] ?? { ...VAZIA };

export const estadoRanqueadaLocal = (userId: string): EstadoRanqueada => {
  const temporada = temporadaAtualLocal();
  const linha = linhaDe(temporada.numero, userId);
  const todas = lerStats();

  // Maior pico de TODAS as temporadas: a temporada zera, a conquista nao.
  const picoHistorico = Object.entries(todas)
    .filter(([chave]) => chave.endsWith(`:${userId}`))
    .reduce((maior, [, valor]) => Math.max(maior, valor.picoElo), 0);

  return {
    temporada,
    elo: linha.elo,
    divisao: divisaoDoElo(linha.elo),
    picoElo: linha.picoElo,
    picoDivisao: divisaoDoElo(linha.picoElo),
    picoHistorico,
    vitorias: linha.vitorias,
    derrotas: linha.derrotas,
    empates: linha.empates,
    partidas: linha.partidas,
  };
};

export const historicoRanqueadaLocal = (userId: string): TemporadaPassada[] => {
  const atual = temporadaAtualLocal();
  const stats = lerStats();

  return temporadasLocais()
    .filter((temporada) => temporada.numero < atual.numero)
    .map((temporada) => ({ temporada, linha: stats[chaveDe(temporada.numero, userId)] }))
    .filter((item): item is { temporada: Temporada; linha: LinhaStats } => Boolean(item.linha))
    .sort((a, b) => b.temporada.numero - a.temporada.numero)
    .map(({ temporada, linha }) => ({
      numero: temporada.numero,
      comecaEm: temporada.comecaEm,
      terminaEm: temporada.terminaEm,
      eloFinal: linha.elo,
      picoElo: linha.picoElo,
      picoDivisao: divisaoDoElo(linha.picoElo),
      vitorias: linha.vitorias,
      derrotas: linha.derrotas,
      partidas: linha.partidas,
    }));
};

const aplicarElo = (
  userId: string,
  resultado: ResultadoRanqueada,
): { antes: number; depois: number } => {
  const temporada = temporadaAtualLocal();
  const todas = lerStats();
  const chave = chaveDe(temporada.numero, userId);
  const linha = todas[chave] ?? { ...VAZIA };

  const antes = linha.elo;
  const depois = novoElo(antes, resultado);

  todas[chave] = {
    elo: depois,
    picoElo: Math.max(linha.picoElo, depois),
    vitorias: linha.vitorias + (resultado === 'vitoria' ? 1 : 0),
    derrotas: linha.derrotas + (resultado === 'derrota' ? 1 : 0),
    empates: linha.empates + (resultado === 'empate' ? 1 : 0),
    partidas: linha.partidas + 1,
  };
  gravarJson(CHAVE_STATS, todas);

  return { antes, depois };
};

/* -------------------------------------------------------------------------
 * Partida
 * ---------------------------------------------------------------------- */

const CHAVE_RESULTADOS = 'cq:demo:ranked-resultados';

type MapaResultados = Record<string, ResultadoRanqueado>;

/** Depois disto, uma partida largada no meio pode ser encerrada. Igual ao SQL. */
const ABANDONO_MS = 5 * 60 * 1000;

/**
 * Comeca (ou retoma) uma partida ranqueada contra o bot do patamar atual.
 *
 * Mesma regra do servidor: uma partida por vez. Enquanto os 5 minutos nao
 * passam, pedir partida nova devolve a que ja estava aberta; passados eles, a
 * velha e encerrada com o placar parcial antes de comecar outra.
 *
 * O assunto tambem sai do patamar, como no servidor - nao ha o que escolher.
 */
export const iniciarRanqueadaLocal = async (userId: string): Promise<string> => {
  const aberta = ranqueadaAbertaLocal(userId);
  if (aberta) {
    if (aberta.comecouHaMs < ABANDONO_MS) return aberta.id;
    encerrarAbandonadaLocal(aberta.id);
    finalizarRanqueadaLocal(userId, aberta.id);
  }

  const { elo } = estadoRanqueadaLocal(userId);
  const patamar = patamarDaDivisao(divisaoDoElo(elo));
  const bot = botDoElo(elo);

  return criarDueloLocal(
    userId,
    `bot-${bot.patamar}`,
    bot.nome,
    poolDoPatamar(patamar),
    bot,
    'ranqueado',
    temasDoPatamar(patamar),
  );
};

/**
 * Leaderboard no modo demonstracao.
 *
 * Sem servidor so existe uma conta neste aparelho, entao a lista tem no maximo
 * uma linha - e ela some enquanto a pessoa nao jogar nenhuma partida, igual ao
 * servidor. Serve para a tela poder ser demonstrada offline sem parecer
 * quebrada.
 */
export const rankingRanqueadaLocal = (
  userId: string,
  nome: string,
  username: string | null,
  avatarUrl: string | null,
): LinhaRankingRanqueada[] => {
  const estado = estadoRanqueadaLocal(userId);
  if (estado.partidas === 0) return [];

  return [
    {
      posicao: 1,
      id: userId,
      name: nome,
      username,
      avatarUrl,
      elo: estado.elo,
      divisao: estado.divisao,
      vitorias: estado.vitorias,
      derrotas: estado.derrotas,
      partidas: estado.partidas,
      equippedTagId: null,
      isDeveloper: false,
    },
  ];
};

/**
 * Fecha a partida e aplica o elo.
 *
 * Devolve `null` enquanto a partida nao terminou - a tela continua esperando,
 * igual ao modo com servidor.
 */
export const finalizarRanqueadaLocal = (
  userId: string,
  matchId: string,
): ResultadoRanqueado | null => {
  const guardados = lerJson<MapaResultados>(CHAVE_RESULTADOS, {});
  if (guardados[matchId]) return guardados[matchId];

  const fim = finalizarLocal(matchId);
  if (fim.status !== 'encerrada') return null;

  const desfecho: DesfechoPessoal = desfechoLocal(matchId) ?? 'empate';
  const { antes, depois } = aplicarElo(userId, desfecho);

  const resultado: ResultadoRanqueado = {
    eloAntes: antes,
    eloDepois: depois,
    delta: depois - antes,
    divisaoAntes: divisaoDoElo(antes),
    divisaoDepois: divisaoDoElo(depois),
    adversario: botDoElo(antes).nome,
  };

  guardados[matchId] = resultado;
  gravarJson(CHAVE_RESULTADOS, guardados);
  return resultado;
};

/** O que ja foi calculado para essa partida (a tela de resultado recarrega). */
export const resultadoRanqueadoLocal = (matchId: string): ResultadoRanqueado | null =>
  lerJson<MapaResultados>(CHAVE_RESULTADOS, {})[matchId] ?? null;

/** Tema da partida, para a tela de resultado. */
export const temaRanqueadoLocal = (matchId: string): string => temaLocal(matchId);

/**
 * Recorde historico no modo demonstracao.
 *
 * Mesma conta do servidor: percorre as temporadas guardadas, acha o maior
 * patamar e conta em quantas delas o pico chegou nesse patamar.
 */
export const topoRanqueadoLocal = (userId?: string): TopoRanqueado => {
  const vazio: TopoRanqueado = {
    patamar: 0,
    divisao: 0,
    picoElo: 0,
    vezes: 0,
    temporadas: 0,
  };
  if (!userId) return vazio;

  const stats = lerJson<Record<string, LinhaStats>>(CHAVE_STATS, {});
  const picos = Object.entries(stats)
    .filter(([chave, linha]) => chave.endsWith(`:${userId}`) && linha.partidas > 0)
    .map(([, linha]) => linha.picoElo);

  if (picos.length === 0) return vazio;

  const picoElo = Math.max(...picos);
  const patamar = patamarDaDivisao(divisaoDoElo(picoElo));

  return {
    patamar,
    divisao: divisaoDoElo(picoElo),
    picoElo,
    vezes: picos.filter((p) => patamarDaDivisao(divisaoDoElo(p)) === patamar).length,
    temporadas: picos.length,
  };
};
