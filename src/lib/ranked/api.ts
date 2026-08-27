'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  topoRanqueadoLocal,
  estadoRanqueadaLocal,
  finalizarRanqueadaLocal,
  historicoRanqueadaLocal,
  iniciarRanqueadaLocal,
  rankingHistoricoLocal,
  rankingRanqueadaLocal,
  resultadoRanqueadoLocal,
  temporadaAtualLocal,
} from './local';
import type {
  TopoRanqueado,
  EscopoRanking,
  EstadoRanqueada,
  LinhaRankingRanqueada,
  RecorteRanking,
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
 * Nao ha nada a escolher: o adversario, a dificuldade E os assuntos saem todos
 * do patamar atual, decididos pelo servidor. Repare que a RPC nao leva nenhum
 * argumento - nem chamando na mao daria para pedir "so Python".
 */
export const iniciarRanqueada = async (userId: string): Promise<string> => {
  if (!isSupabaseConfigured) return iniciarRanqueadaLocal(userId);
  return rpc<string>('ranked_iniciar', {});
};

interface LinhaRanking {
  posicao: number;
  user_id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  elo: number;
  divisao: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
  temporadas?: number;
  equipped_tag_id: string | null;
  is_developer: boolean;
}

/**
 * Leaderboard da ranqueada.
 *
 * `recorte` escolhe a pergunta: `temporada` mostra o elo de agora (zera a cada
 * 15 dias); `historico` mostra o maior pico ja alcancado em qualquer
 * temporada - o hall da fama, que nao zera.
 *
 * As duas listas saem de funcoes diferentes no banco (`ranked_ranking` e
 * `ranked_ranking_topo`), e nao de uma ordenacao feita aqui: ordenar no
 * cliente exigiria trazer a base inteira para o aparelho.
 */
export const buscarRankingRanqueada = async (
  escopo: EscopoRanking,
  demo?: { id: string; nome: string; username: string | null; avatarUrl: string | null },
  limite = 50,
  recorte: RecorteRanking = 'temporada',
): Promise<LinhaRankingRanqueada[]> => {
  if (!isSupabaseConfigured) {
    if (!demo) return [];
    return recorte === 'historico'
      ? rankingHistoricoLocal(demo.id, demo.nome, demo.username, demo.avatarUrl)
      : rankingRanqueadaLocal(demo.id, demo.nome, demo.username, demo.avatarUrl);
  }

  try {
    const linhas = await rpc<LinhaRanking[]>(
      recorte === 'historico' ? 'ranked_ranking_topo' : 'ranked_ranking',
      { escopo, limite },
    );
    return (linhas ?? []).map((linha) => ({
      posicao: linha.posicao,
      id: linha.user_id,
      name: linha.name,
      username: linha.username,
      avatarUrl: linha.avatar_url,
      elo: linha.elo,
      divisao: linha.divisao,
      vitorias: linha.vitorias,
      derrotas: linha.derrotas,
      partidas: linha.partidas,
      temporadas: linha.temporadas,
      equippedTagId: linha.equipped_tag_id,
      isDeveloper: linha.is_developer,
    }));
  } catch (falha) {
    if (falha instanceof Error && migracaoPendente(falha.message)) return [];
    throw falha;
  }
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

/* -------------------------------------------------------------------------
 * Recorde historico (o "quantas vezes cheguei ao meu topo")
 * ---------------------------------------------------------------------- */

interface LinhaTopo {
  patamar: number;
  divisao: number;
  pico_elo: number;
  vezes: number;
  temporadas: number;
}

/**
 * Maior patamar ja alcancado e em quantas temporadas isso aconteceu.
 *
 * Devolve `null` quando a migracao 0009 ainda nao foi aplicada, para a tela
 * simplesmente nao mostrar a linha em vez de quebrar.
 */
export const buscarTopoRanqueado = async (userId?: string): Promise<TopoRanqueado | null> => {
  if (!isSupabaseConfigured) return topoRanqueadoLocal(userId);

  try {
    const linhas = await rpc<LinhaTopo[]>('ranked_topo', { alvo: userId ?? null });
    const linha = linhas?.[0];
    if (!linha) return null;
    return {
      patamar: linha.patamar,
      divisao: linha.divisao,
      picoElo: linha.pico_elo,
      vezes: linha.vezes,
      temporadas: linha.temporadas,
    };
  } catch (falha) {
    const mensagem = falha instanceof Error ? falha.message : String(falha);
    if (migracaoPendente(mensagem)) return null;
    throw falha;
  }
};
