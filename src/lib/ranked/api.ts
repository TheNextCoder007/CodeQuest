'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  estadoRanqueadaLocal,
  finalizarRanqueadaLocal,
  historicoRanqueadaLocal,
  iniciarRanqueadaLocal,
  resultadoRanqueadoLocal,
  temporadaAtualLocal,
} from './local';
import type {
  EstadoRanqueada,
  ResultadoRanqueado,
  Temporada,
  TemporadaPassada,
} from './tipos';
import { ESTADO_RANQUEADA_VAZIO } from './tipos';

/**
 * API do modo ranqueado.
 *
 * Com Supabase configurado, TUDO passa por funcoes do banco
 * (`supabase/migrations/0006_ranqueado.sql`): a temporada, a escolha do bot, o
 * resultado da partida e - principalmente - o elo. O cliente daqui so pergunta
 * e mostra; ele nao tem por onde enviar um numero de elo, porque nenhuma
 * funcao aceita um.
 *
 * Sem Supabase, cai no modo demonstracao (`local.ts`).
 */

const rpc = async <T,>(nome: string, argumentos: Record<string, unknown>): Promise<T> => {
  const { data, error } = await getSupabase()!.rpc(nome, argumentos);
  if (error) throw new Error(traduzir(error.message));
  return data as T;
};

const traduzir = (mensagem: string): string => {
  if (/perguntas suficientes/i.test(mensagem)) {
    return 'Esse tema ainda não tem perguntas suficientes.';
  }
  if (/nao pode ser cancelada|não pode ser cancelada/i.test(mensagem)) {
    return 'Partida ranqueada não pode ser cancelada — termine a partida.';
  }
  if (/nao participa|não participa/i.test(mensagem)) return 'Essa partida não é sua.';
  return mensagem;
};

/**
 * Erro que significa "a migração 0006 ainda não foi aplicada".
 *
 * Publicar o código antes de rodar o SQL nao pode derrubar o perfil inteiro -
 * a ranqueada simplesmente ainda nao existe para essa conta.
 */
const migracaoPendente = (mensagem: string): boolean =>
  /does not exist|schema cache|could not find the function/i.test(mensagem);

/* -------------------------------------------------------------------------
 * Temporada e situacao
 * ---------------------------------------------------------------------- */

interface LinhaEstado {
  season_numero: number;
  comeca_em: string;
  termina_em: string;
  elo: number;
  divisao: number;
  pico_elo: number;
  pico_divisao: number;
  pico_historico: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
}

const TEMPORADA_DESCONHECIDA: Temporada = {
  numero: 0,
  comecaEm: new Date().toISOString(),
  terminaEm: new Date().toISOString(),
};

/**
 * Onde a pessoa esta na temporada atual.
 *
 * Sem `userId` devolve a de quem esta logado. Devolve `null` quando a
 * ranqueada ainda nao existe no banco (migracao 0006 pendente), para a tela
 * poder simplesmente nao mostrar o cartao.
 */
export const buscarEstadoRanqueada = async (
  userId?: string,
): Promise<EstadoRanqueada | null> => {
  if (!isSupabaseConfigured) {
    if (!userId) return ESTADO_RANQUEADA_VAZIO(temporadaAtualLocal());
    return estadoRanqueadaLocal(userId);
  }

  try {
    const linhas = await rpc<LinhaEstado[]>('ranked_estado', { alvo: userId ?? null });
    const linha = linhas?.[0];
    if (!linha) return null;

    return {
      temporada: {
        numero: linha.season_numero,
        comecaEm: linha.comeca_em,
        terminaEm: linha.termina_em,
      },
      elo: linha.elo,
      divisao: linha.divisao,
      picoElo: linha.pico_elo,
      picoDivisao: linha.pico_divisao,
      picoHistorico: linha.pico_historico,
      vitorias: linha.vitorias,
      derrotas: linha.derrotas,
      empates: linha.empates,
      partidas: linha.partidas,
    };
  } catch (falha) {
    if (falha instanceof Error && migracaoPendente(falha.message)) return null;
    throw falha;
  }
};

interface LinhaHistorico {
  season_numero: number;
  comeca_em: string;
  termina_em: string;
  elo_final: number;
  pico_elo: number;
  pico_divisao: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
}

/** Temporadas ja encerradas, da mais recente para a mais antiga. */
export const buscarHistoricoRanqueada = async (
  userId?: string,
): Promise<TemporadaPassada[]> => {
  if (!isSupabaseConfigured) return userId ? historicoRanqueadaLocal(userId) : [];

  try {
    const linhas = await rpc<LinhaHistorico[]>('ranked_historico', {
      alvo: userId ?? null,
      limite: 12,
    });
    return (linhas ?? []).map((linha) => ({
      numero: linha.season_numero,
      comecaEm: linha.comeca_em,
      terminaEm: linha.termina_em,
      eloFinal: linha.elo_final,
      picoElo: linha.pico_elo,
      picoDivisao: linha.pico_divisao,
      vitorias: linha.vitorias,
      derrotas: linha.derrotas,
      partidas: linha.partidas,
    }));
  } catch (falha) {
    if (falha instanceof Error && migracaoPendente(falha.message)) return [];
    throw falha;
  }
};

export const buscarTemporada = async (): Promise<Temporada> => {
  if (!isSupabaseConfigured) return temporadaAtualLocal();
  const estado = await buscarEstadoRanqueada();
  return estado?.temporada ?? TEMPORADA_DESCONHECIDA;
};

/* -------------------------------------------------------------------------
 * Partida
 * ---------------------------------------------------------------------- */

/**
 * Comeca (ou retoma) uma partida ranqueada.
 *
 * Quem escolhe o adversario e a dificuldade e o servidor, a partir do patamar
 * atual. O tema e a unica coisa que o jogador decide.
 */
export const iniciarRanqueada = async (userId: string, tema: string): Promise<string> => {
  if (!isSupabaseConfigured) return iniciarRanqueadaLocal(userId, tema);
  return rpc<string>('ranked_iniciar', { tema_escolhido: tema });
};

interface LinhaResultado {
  elo_antes: number;
  elo_depois: number;
  delta: number;
  divisao_antes: number;
  divisao_depois: number;
  adversario: string;
}

/**
 * Quanto elo a partida rendeu.
 *
 * Devolve `null` enquanto o servidor ainda nao fechou a partida - a tela de
 * resultado continua esperando.
 */
export const buscarResultadoRanqueado = async (
  userId: string,
  matchId: string,
): Promise<ResultadoRanqueado | null> => {
  if (!isSupabaseConfigured) {
    return resultadoRanqueadoLocal(matchId) ?? finalizarRanqueadaLocal(userId, matchId);
  }

  const linhas = await rpc<LinhaResultado[]>('ranked_resultado', { m: matchId });
  const linha = linhas?.[0];
  if (!linha) return null;

  return {
    eloAntes: linha.elo_antes,
    eloDepois: linha.elo_depois,
    delta: linha.delta,
    divisaoAntes: linha.divisao_antes,
    divisaoDepois: linha.divisao_depois,
    adversario: linha.adversario,
  };
};
