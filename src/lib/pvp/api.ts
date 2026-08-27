'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  abandonarLocal,
  criarDueloLocal,
  estadoLocal,
  estatisticasLocais,
  finalizarLocal,
  partidasLocais,
  perguntaLocal,
  responderLocal,
} from './local';
import {
  ESTATISTICAS_VAZIAS,
  type DesfechoPessoal,
  type EstadoPartida,
  type EstatisticasPvp,
  type ModoPartida,
  type PerguntaPvp,
  type ResultadoFinal,
  type ResultadoResposta,
  type ResumoPartida,
  type StatusPartida,
} from './tipos';

/**
 * API do duelo 1v1.
 *
 * Com Supabase configurado, TUDO passa por funcoes do banco
 * (`supabase/migrations/0005_pvp.sql`): o sorteio das perguntas, a correcao, o
 * cronometro e o placar. O cliente aqui so faz perguntas e mostra respostas -
 * ele nao sabe o gabarito antes da hora e nao tem como enviar pontuacao.
 *
 * Sem Supabase, cai no modo demonstracao (`local.ts`), com adversario
 * simulado no proprio dispositivo.
 */

const rpc = async <T>(nome: string, argumentos: Record<string, unknown>): Promise<T> => {
  const { data, error } = await getSupabase()!.rpc(nome, argumentos);
  if (error) throw new Error(traduzir(error.message));
  return data as T;
};

/** Mensagens do banco em portugues corrido. */
const traduzir = (mensagem: string): string => {
  if (/amigos confirmados/i.test(mensagem)) {
    return 'Você só pode duelar com amigos confirmados.';
  }
  if (/andamento/i.test(mensagem)) {
    return 'Já existe um convite ou partida em andamento com essa pessoa.';
  }
  if (/nao participa|não participa/i.test(mensagem)) return 'Essa partida não é sua.';
  if (/ja foi respondida|já foi respondida/i.test(mensagem)) {
    return 'Essa pergunta já foi respondida.';
  }
  if (/perguntas suficientes/i.test(mensagem)) {
    return 'Esse tema ainda não tem perguntas suficientes.';
  }
  return mensagem;
};

/* -------------------------------------------------------------------------
 * Convite
 * ---------------------------------------------------------------------- */

export interface ConviteLocalInfo {
  adversarioId: string;
  adversarioNome: string;
}

/**
 * Convida alguem para um duelo.
 *
 * No modo demonstracao nao existe outra pessoa do outro lado, entao a partida
 * ja comeca contra um adversario simulado - e a tela avisa isso.
 */
export const convidar = async (
  username: string,
  tema: string,
  meuId: string,
  local?: ConviteLocalInfo,
): Promise<string> => {
  if (!isSupabaseConfigured) {
    return criarDueloLocal(
      meuId,
      local?.adversarioId ?? `bot-${username}`,
      local?.adversarioNome ?? username,
      tema,
    );
  }
  return rpc<string>('pvp_convidar', { alvo_username: username, tema_escolhido: tema });
};

export const responderConvite = async (
  matchId: string,
  aceitar: boolean,
): Promise<StatusPartida> => {
  if (!isSupabaseConfigured) return aceitar ? 'ativa' : 'recusada';
  return rpc<StatusPartida>('pvp_responder_convite', { m: matchId, aceitar });
};

export const cancelarPartida = async (matchId: string): Promise<StatusPartida> => {
  if (!isSupabaseConfigured) return 'cancelada';
  return rpc<StatusPartida>('pvp_cancelar', { m: matchId });
};

/* -------------------------------------------------------------------------
 * Partida
 * ---------------------------------------------------------------------- */

interface LinhaPergunta {
  num: number;
  tipo: PerguntaPvp['tipo'];
  enunciado: string;
  alternativas: string[] | null;
  total: number;
  /** Opcional: so existe depois da migracao 0011. */
  comecou_em?: string | null;
  /** Opcional: so existe depois da migracao 0012. */
  agora?: string | null;
}

export const buscarPergunta = async (matchId: string, n: number): Promise<PerguntaPvp> => {
  if (!isSupabaseConfigured) return perguntaLocal(matchId, n);

  const linhas = await rpc<LinhaPergunta[]>('pvp_pergunta', { m: matchId, n });
  const linha = linhas?.[0];
  if (!linha) throw new Error('Não consegui carregar a pergunta.');
  return {
    num: linha.num,
    tipo: linha.tipo,
    enunciado: linha.enunciado,
    alternativas: linha.alternativas,
    total: linha.total,
    comecouEm: linha.comecou_em ?? null,
    agora: linha.agora ?? null,
  };
};

interface LinhaResposta {
  correta: boolean;
  pontos: number;
  ms: number;
  gabarito: string;
  explicacao: string;
}

export const responderPergunta = async (
  matchId: string,
  n: number,
  resposta: string,
): Promise<ResultadoResposta> => {
  if (!isSupabaseConfigured) return responderLocal(matchId, n, resposta);

  const linhas = await rpc<LinhaResposta[]>('pvp_responder', {
    m: matchId,
    n,
    resposta_dada: resposta,
  });
  const linha = linhas?.[0];
  if (!linha) throw new Error('Não consegui registrar a resposta.');
  return {
    certa: linha.correta,
    ganhos: linha.pontos,
    tempoMs: linha.ms,
    gabarito: linha.gabarito,
    explicacao: linha.explicacao,
  };
};

interface LinhaEstado {
  status: StatusPartida;
  total: number;
  tema: string;
  modo: ModoPartida;
  host_id: string;
  guest_id: string | null;
  winner_id: string | null;
  adversario: string | null;
  meu_desfecho: DesfechoPessoal | null;
  host_respondidas: number;
  guest_respondidas: number;
  host_pontos: number;
  guest_pontos: number;
  abandonada_por?: string | null;
}

export const buscarEstado = async (matchId: string): Promise<EstadoPartida> => {
  if (!isSupabaseConfigured) return estadoLocal(matchId);

  const linhas = await rpc<LinhaEstado[]>('pvp_estado', { m: matchId });
  const linha = linhas?.[0];
  if (!linha) throw new Error('Partida não encontrada.');
  return {
    status: linha.status,
    total: linha.total,
    tema: linha.tema,
    // `modo` e `adversario` so existem depois da migracao 0006. Publicar o
    // codigo antes de rodar o SQL nao pode quebrar o duelo entre amigos.
    modo: linha.modo ?? 'amistoso',
    hostId: linha.host_id,
    guestId: linha.guest_id,
    winnerId: linha.winner_id,
    adversario: linha.adversario ?? null,
    meuDesfecho: linha.meu_desfecho ?? null,
    hostRespondidas: linha.host_respondidas,
    guestRespondidas: linha.guest_respondidas,
    hostPontos: linha.host_pontos,
    guestPontos: linha.guest_pontos,
    abandonadaPor: linha.abandonada_por ?? null,
  };
};

interface LinhaFinal {
  status: StatusPartida;
  winner_id: string | null;
  pontos_host: number;
  pontos_guest: number;
}

/**
 * Declara o proprio abandono: encerra a partida como derrota de quem chama.
 *
 * Repare que nao ha parametro dizendo quem perdeu - quem perde e sempre quem
 * chamou. Por isso e seguro o cliente poder chamar isto: a unica coisa que se
 * consegue com essa funcao e se prejudicar.
 *
 * O elo sai pelo caminho de sempre, entao a derrota por abandono custa
 * exatamente o mesmo que a derrota jogada (ver `pvp_abandonar` na migracao
 * 0010).
 */
export const abandonarPartida = async (matchId: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    abandonarLocal(matchId);
    return;
  }
  await rpc<unknown>('pvp_abandonar', { m: matchId });
};

export const finalizarPartida = async (matchId: string): Promise<ResultadoFinal> => {
  if (!isSupabaseConfigured) return finalizarLocal(matchId);

  const linhas = await rpc<LinhaFinal[]>('pvp_finalizar', { m: matchId });
  const linha = linhas?.[0];
  if (!linha) throw new Error('Não consegui encerrar a partida.');
  return {
    status: linha.status,
    winnerId: linha.winner_id,
    pontosHost: linha.pontos_host,
    pontosGuest: linha.pontos_guest,
  };
};

/* -------------------------------------------------------------------------
 * Listas e estatisticas
 * ---------------------------------------------------------------------- */

interface LinhaPartida {
  id: string;
  tema: string;
  status: StatusPartida;
  host_id: string;
  guest_id: string;
  winner_id: string | null;
  pontos_host: number;
  pontos_guest: number;
  created_at: string;
}

const paraResumo = (linha: LinhaPartida, meuId: string): ResumoPartida => ({
  id: linha.id,
  tema: linha.tema,
  status: linha.status,
  hostId: linha.host_id,
  guestId: linha.guest_id,
  winnerId: linha.winner_id,
  pontosHost: linha.pontos_host,
  pontosGuest: linha.pontos_guest,
  criadaEm: linha.created_at,
  adversarioId: linha.host_id === meuId ? linha.guest_id : linha.host_id,
});

/** Convites que EU recebi e ainda nao respondi. */
export const convitesRecebidos = async (meuId: string): Promise<ResumoPartida[]> => {
  if (!isSupabaseConfigured || !meuId) return [];

  const { data, error } = await getSupabase()!
    .from('matches')
    .select('id, tema, status, host_id, guest_id, winner_id, pontos_host, pontos_guest, created_at')
    .eq('guest_id', meuId)
    .eq('status', 'convite')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as LinhaPartida[]).map((linha) => paraResumo(linha, meuId));
};

/** Partidas em andamento ou convites que EU enviei. */
export const partidasAbertas = async (meuId: string): Promise<ResumoPartida[]> => {
  if (!isSupabaseConfigured || !meuId) return [];

  const { data, error } = await getSupabase()!
    .from('matches')
    .select('id, tema, status, host_id, guest_id, winner_id, pontos_host, pontos_guest, created_at')
    .or(`host_id.eq.${meuId},guest_id.eq.${meuId}`)
    .in('status', ['convite', 'ativa'])
    // Ranqueada contra bot nao tem `guest_id`, e ela nao pertence a esta lista
    // (que e "duelos com amigos"). Filtrar por `guest_id` em vez de por `modo`
    // e de proposito: `modo` so existe depois da migracao 0006, e esta tela
    // precisa continuar funcionando para quem ainda nao rodou o SQL novo.
    .not('guest_id', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as LinhaPartida[]).map((linha) => paraResumo(linha, meuId));
};

export const partidasRecentes = async (meuId: string, limite = 10): Promise<ResumoPartida[]> => {
  if (!isSupabaseConfigured) return partidasLocais(meuId, limite);
  if (!meuId) return [];

  const { data, error } = await getSupabase()!
    .from('matches')
    .select('id, tema, status, host_id, guest_id, winner_id, pontos_host, pontos_guest, created_at')
    .or(`host_id.eq.${meuId},guest_id.eq.${meuId}`)
    .eq('status', 'encerrada')
    .not('guest_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return ((data ?? []) as LinhaPartida[]).map((linha) => paraResumo(linha, meuId));
};

interface LinhaStats {
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
  pontos_totais: number;
  vitorias_por_tema: Record<string, number> | null;
}

export const buscarEstatisticas = async (userId: string): Promise<EstatisticasPvp> => {
  if (!userId) return { ...ESTATISTICAS_VAZIAS, vitoriasPorTema: {} };
  if (!isSupabaseConfigured) return estatisticasLocais(userId);

  const { data, error } = await getSupabase()!
    .from('pvp_stats')
    .select('vitorias, derrotas, empates, partidas, pontos_totais, vitorias_por_tema')
    .eq('user_id', userId)
    .maybeSingle();

  // Tabela ainda nao criada (migration 0005 pendente) nao pode derrubar o
  // perfil inteiro - o duelo simplesmente ainda nao existe para essa conta.
  if (error) {
    if (/does not exist|schema cache/i.test(error.message)) {
      return { ...ESTATISTICAS_VAZIAS, vitoriasPorTema: {} };
    }
    throw new Error(error.message);
  }
  if (!data) return { ...ESTATISTICAS_VAZIAS, vitoriasPorTema: {} };

  const linha = data as LinhaStats;
  return {
    vitorias: linha.vitorias,
    derrotas: linha.derrotas,
    empates: linha.empates,
    partidas: linha.partidas,
    pontosTotais: linha.pontos_totais,
    vitoriasPorTema: linha.vitorias_por_tema ?? {},
  };
};
