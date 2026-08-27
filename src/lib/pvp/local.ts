'use client';

import { embaralhar } from '@/lib/embaralhar';
import {
  PERGUNTAS_POR_PARTIDA,
  desfecho,
  pontuar,
  respostaCorreta,
  sortearPerguntas,
} from './regras';
import {
  ESTATISTICAS_VAZIAS,
  type DesfechoPessoal,
  type EstadoPartida,
  type ModoPartida,
  type EstatisticasPvp,
  type PerguntaPvp,
  type ResultadoFinal,
  type ResultadoResposta,
  type ResumoPartida,
  type StatusPartida,
} from './tipos';

/**
 * Duelo no modo demonstracao (sem Supabase).
 *
 * Sem servidor nao ha adversario de verdade, entao quem joga do outro lado e
 * um adversario simulado. Ele NAO e um enfeite: usa a mesma pontuacao do
 * servidor (`regras.ts`) e tem perfil configuravel de acerto e velocidade -
 * exatamente o que o modo ranqueado vai precisar dos bots.
 *
 * Nada aqui vale para uma partida de verdade: com Supabase configurado, quem
 * corrige e pontua e o banco.
 */

/* -------------------------------------------------------------------------
 * Adversario simulado
 * ---------------------------------------------------------------------- */

export interface PerfilDeBot {
  /** Nome mostrado na tela. */
  nome: string;
  /** Chance de acertar cada pergunta, de 0 a 1. */
  acerto: number;
  /** Faixa de tempo de resposta, em milissegundos. */
  msMin: number;
  msMax: number;
}

/** Adversario equilibrado: acerta a maioria, sem ser instantaneo. */
export const BOT_PADRAO: PerfilDeBot = {
  nome: 'Adversário',
  acerto: 0.7,
  msMin: 2500,
  msMax: 9000,
};

export interface JogadaDoBot {
  acertou: boolean;
  ms: number;
  pontos: number;
}

/** Uma resposta do adversario simulado, ja pontuada pelas regras oficiais. */
export const jogadaDoBot = (
  bot: PerfilDeBot,
  aleatorio: () => number = Math.random,
): JogadaDoBot => {
  const acertou = aleatorio() < bot.acerto;
  const ms = Math.round(bot.msMin + aleatorio() * Math.max(0, bot.msMax - bot.msMin));
  return { acertou, ms, pontos: pontuar(acertou, ms) };
};

/* -------------------------------------------------------------------------
 * Guarda local
 * ---------------------------------------------------------------------- */

const CHAVE = 'cq:demo:duelos';
const CHAVE_STATS = 'cq:demo:pvp-stats';

interface RespostaLocal {
  resposta: string | null;
  correta: boolean | null;
  pontos: number;
  ms: number | null;
  startedAt: number | null;
  answeredAt: number | null;
  /**
   * Ordem em que as alternativas foram mostradas NESTA exibicao.
   *
   * Espelha `match_answers.alternativas` do servidor: sorteada na primeira
   * entrega e guardada, para recarregar a pagina nao reordenar as opcoes com
   * o cronometro correndo.
   */
  alternativas?: string[] | null;
}

interface DueloLocal {
  id: string;
  tema: string;
  modo: ModoPartida;
  status: StatusPartida;
  meuId: string;
  adversarioId: string;
  adversarioNome: string;
  bot: PerfilDeBot;
  perguntaIds: string[];
  minhas: RespostaLocal[];
  dele: RespostaLocal[];
  criadaEm: string;
  winnerId: string | null;
  /** Resultado do dono do aparelho. Preenchido por `finalizarLocal`. */
  desfecho: DesfechoPessoal | null;
  /** Encerrada por abandono (trocou de aba vezes demais). */
  abandonada?: boolean;
}

const ler = (): Record<string, DueloLocal> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(CHAVE) || '{}') as Record<string, DueloLocal>;
  } catch {
    return {};
  }
};

const gravar = (todos: Record<string, DueloLocal>) => {
  window.localStorage.setItem(CHAVE, JSON.stringify(todos));
};

const pegar = (id: string): DueloLocal => {
  const duelo = ler()[id];
  if (!duelo) throw new Error('Partida não encontrada neste dispositivo.');
  return duelo;
};

const salvar = (duelo: DueloLocal) => {
  const todos = ler();
  todos[duelo.id] = duelo;
  gravar(todos);
};

const respostaVazia = (): RespostaLocal => ({
  resposta: null,
  correta: null,
  pontos: 0,
  ms: null,
  startedAt: null,
  answeredAt: null,
  alternativas: null,
});

/* -------------------------------------------------------------------------
 * Partida
 * ---------------------------------------------------------------------- */

export async function criarDueloLocal(
  meuId: string,
  adversarioId: string,
  adversarioNome: string,
  tema: string,
  bot: PerfilDeBot = BOT_PADRAO,
  modo: ModoPartida = 'amistoso',
  /**
   * Sorteia so entre estes assuntos, ignorando `tema`.
   *
   * A ranqueada usa isto: la o `tema` nao e um assunto do seletor, e o nome do
   * POOL que valeu naquela partida (ver `src/lib/ranked/temas.ts`).
   */
  temasPermitidos?: readonly string[],
): Promise<string> {
  // Import sob demanda: o banco de perguntas carrega os gabaritos junto, e
  // so o modo demonstracao precisa deles no dispositivo.
  const { perguntasDoTema, pvpQuestions } = await import('@/content/pvp-questions');
  const disponiveis = temasPermitidos
    ? pvpQuestions.filter((questao) => temasPermitidos.includes(questao.languageSlug))
    : perguntasDoTema(tema);
  if (disponiveis.length < PERGUNTAS_POR_PARTIDA) {
    throw new Error(`Não há perguntas suficientes para o tema ${tema}.`);
  }

  const sorteadas = sortearPerguntas(disponiveis, PERGUNTAS_POR_PARTIDA);
  const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  salvar({
    id,
    tema,
    modo,
    status: 'ativa',
    meuId,
    adversarioId,
    adversarioNome: adversarioNome || bot.nome,
    bot: { ...bot, nome: adversarioNome || bot.nome },
    perguntaIds: sorteadas.map((questao) => questao.id),
    minhas: sorteadas.map(respostaVazia),
    dele: sorteadas.map(respostaVazia),
    criadaEm: new Date().toISOString(),
    winnerId: null,
    desfecho: null,
  });

  return id;
}

export async function perguntaLocal(id: string, n: number): Promise<PerguntaPvp> {
  const duelo = pegar(id);
  if (n < 1 || n > duelo.perguntaIds.length) throw new Error('Pergunta fora do intervalo.');
  if (n > 1 && duelo.minhas[n - 2].answeredAt === null) {
    throw new Error('Responda a pergunta anterior primeiro.');
  }

  const { pvpQuestionById } = await import('@/content/pvp-questions');
  const questao = pvpQuestionById(duelo.perguntaIds[n - 1]);
  if (!questao) throw new Error('Pergunta não encontrada.');

  const minha = duelo.minhas[n - 1];
  let mudou = false;

  if (minha.startedAt === null) {
    minha.startedAt = Date.now();
    mudou = true;
  }

  // Mesma regra do servidor (`pvp_pergunta` em 0007): a ordem e sorteada UMA
  // vez por exibicao e guardada. Sem isso, a resposta certa cairia sempre na
  // primeira posicao - o banco de perguntas foi escrito com o gabarito na
  // frente.
  if (!minha.alternativas && questao.options) {
    minha.alternativas = embaralhar(questao.options);
    mudou = true;
  }

  if (mudou) salvar(duelo);

  return {
    num: n,
    tipo: questao.kind,
    enunciado: questao.prompt,
    alternativas: minha.alternativas ?? null,
    total: duelo.perguntaIds.length,
  };
}

export async function responderLocal(
  id: string,
  n: number,
  resposta: string,
): Promise<ResultadoResposta> {
  const duelo = pegar(id);
  const minha = duelo.minhas[n - 1];
  if (!minha) throw new Error('Pergunta fora do intervalo.');
  if (minha.startedAt === null) throw new Error('Peça a pergunta antes de responder.');
  if (minha.answeredAt !== null) throw new Error('Essa pergunta já foi respondida.');

  const { pvpQuestionById } = await import('@/content/pvp-questions');
  const questao = pvpQuestionById(duelo.perguntaIds[n - 1])!;

  const agora = Date.now();
  const ms = Math.max(0, agora - minha.startedAt);
  const certa = respostaCorreta(questao.answer, resposta);

  minha.resposta = resposta;
  minha.correta = certa;
  minha.ms = ms;
  minha.pontos = pontuar(certa, ms);
  minha.answeredAt = agora;

  // O adversario simulado joga a mesma pergunta neste momento.
  const dele = duelo.dele[n - 1];
  if (dele.answeredAt === null) {
    const jogada = jogadaDoBot(duelo.bot);
    dele.correta = jogada.acertou;
    dele.ms = jogada.ms;
    dele.pontos = jogada.pontos;
    dele.answeredAt = agora;
    dele.resposta = jogada.acertou ? questao.answer : '(errou)';
  }

  salvar(duelo);

  return {
    certa,
    ganhos: minha.pontos,
    tempoMs: ms,
    gabarito: questao.answer,
    explicacao: questao.explanation,
  };
}

const somar = (respostas: RespostaLocal[]) =>
  respostas.reduce((total, item) => total + item.pontos, 0);

const respondidas = (respostas: RespostaLocal[]) =>
  respostas.filter((item) => item.answeredAt !== null).length;

export function estadoLocal(id: string): EstadoPartida {
  const duelo = pegar(id);
  const encerrada = duelo.status === 'encerrada';
  return {
    status: duelo.status,
    total: duelo.perguntaIds.length,
    tema: duelo.tema,
    modo: duelo.modo ?? 'amistoso',
    hostId: duelo.meuId,
    guestId: duelo.adversarioId,
    winnerId: duelo.winnerId,
    adversario: duelo.adversarioNome,
    meuDesfecho: duelo.desfecho ?? null,
    hostRespondidas: respondidas(duelo.minhas),
    guestRespondidas: respondidas(duelo.dele),
    hostPontos: somar(duelo.minhas),
    guestPontos: encerrada ? somar(duelo.dele) : 0,
  };
}

export function finalizarLocal(id: string): ResultadoFinal {
  const duelo = pegar(id);
  const meus = somar(duelo.minhas);
  const dele = somar(duelo.dele);

  if (duelo.status === 'encerrada') {
    return { status: 'encerrada', winnerId: duelo.winnerId, pontosHost: meus, pontosGuest: dele };
  }

  if (respondidas(duelo.minhas) < duelo.perguntaIds.length) {
    return { status: duelo.status, winnerId: null, pontosHost: 0, pontosGuest: 0 };
  }

  const quem = desfecho(meus, dele);
  duelo.status = 'encerrada';
  duelo.winnerId = quem === 'empate' ? null : quem === 'anfitriao' ? duelo.meuId : duelo.adversarioId;
  duelo.desfecho = quem === 'empate' ? 'empate' : quem === 'anfitriao' ? 'vitoria' : 'derrota';
  salvar(duelo);

  // Ranqueada nao entra no cartel de duelos com amigos - mesma regra do
  // servidor (ver `pvp_finalizar` em `supabase/migrations/0006_ranqueado.sql`).
  // Quem aplica o elo da ranqueada e `finalizarRanqueadaLocal`.
  if ((duelo.modo ?? 'amistoso') === 'amistoso') {
    registrarStatsLocais(duelo.meuId, quem === 'anfitriao', quem === 'empate', meus, duelo.tema);
  }

  return { status: 'encerrada', winnerId: duelo.winnerId, pontosHost: meus, pontosGuest: dele };
}

/* -------------------------------------------------------------------------
 * Estatisticas locais
 * ---------------------------------------------------------------------- */

type MapaStats = Record<string, EstatisticasPvp>;

const lerStats = (): MapaStats => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(CHAVE_STATS) || '{}') as MapaStats;
  } catch {
    return {};
  }
};

export const estatisticasLocais = (userId: string): EstatisticasPvp =>
  lerStats()[userId] ?? { ...ESTATISTICAS_VAZIAS, vitoriasPorTema: {} };

function registrarStatsLocais(
  userId: string,
  venceu: boolean,
  empatou: boolean,
  pontos: number,
  tema: string,
) {
  const todos = lerStats();
  const atual = estatisticasLocais(userId);

  todos[userId] = {
    vitorias: atual.vitorias + (venceu ? 1 : 0),
    derrotas: atual.derrotas + (!venceu && !empatou ? 1 : 0),
    empates: atual.empates + (empatou ? 1 : 0),
    partidas: atual.partidas + 1,
    pontosTotais: atual.pontosTotais + pontos,
    vitoriasPorTema: venceu
      ? { ...atual.vitoriasPorTema, [tema]: (atual.vitoriasPorTema[tema] ?? 0) + 1 }
      : atual.vitoriasPorTema,
  };

  window.localStorage.setItem(CHAVE_STATS, JSON.stringify(todos));
}

/**
 * A partida ranqueada em andamento deste aparelho, se houver.
 *
 * Devolve o id e ha quanto tempo ela comecou, para a ranqueada poder aplicar
 * a mesma regra do servidor: uma partida por vez, e quem larga no meio leva a
 * derrota depois de 5 minutos.
 */
export const ranqueadaAbertaLocal = (
  userId: string,
): { id: string; comecouHaMs: number } | null => {
  const aberta = Object.values(ler())
    .filter(
      (duelo) =>
        duelo.meuId === userId && duelo.modo === 'ranqueado' && duelo.status === 'ativa',
    )
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
    .at(0);

  if (!aberta) return null;
  return { id: aberta.id, comecouHaMs: Date.now() - new Date(aberta.criadaEm).getTime() };
};

/** Marca como encerrada uma partida largada no meio (o placar parcial vale). */
export const encerrarAbandonadaLocal = (id: string) => {
  const duelo = pegar(id);
  if (duelo.status !== 'ativa') return;

  // O adversario simulado termina as perguntas dele - largar na frente nao
  // pode virar vitoria de graca (mesma regra de `ranked_bot_completar`).
  duelo.dele.forEach((resposta) => {
    if (resposta.answeredAt !== null) return;
    const jogada = jogadaDoBot(duelo.bot);
    resposta.correta = jogada.acertou;
    resposta.ms = jogada.ms;
    resposta.pontos = jogada.pontos;
    resposta.answeredAt = Date.now();
    resposta.resposta = jogada.acertou ? '(acertou)' : '(errou)';
  });

  // As minhas que ficaram em branco valem zero.
  duelo.minhas.forEach((resposta) => {
    if (resposta.answeredAt !== null) return;
    resposta.answeredAt = Date.now();
    resposta.pontos = 0;
    resposta.correta = false;
  });

  salvar(duelo);
};

/**
 * Abandono declarado: quem sai perde, mesmo estando na frente.
 *
 * No modo demonstracao nao ha servidor, entao a regra roda aqui - e ela e a
 * mesma de `pvp_abandonar()` na migracao 0010: as perguntas que faltavam do
 * adversario sao completadas, as minhas em branco valem zero, e o desfecho e
 * derrota independentemente do placar.
 */
export const abandonarLocal = (id: string): DesfechoPessoal => {
  const duelo = pegar(id);
  if (duelo.status === 'encerrada') return duelo.desfecho ?? 'derrota';

  encerrarAbandonadaLocal(id);

  const fechado = pegar(id);
  fechado.status = 'encerrada';
  fechado.desfecho = 'derrota';
  fechado.abandonada = true;
  salvar(fechado);
  return 'derrota';
};

/**
 * Como a partida terminou para o dono do aparelho.
 *
 * `finalizarLocal` grava isto; a ranqueada le para saber que elo aplicar.
 */
export const desfechoLocal = (id: string): DesfechoPessoal | null => pegar(id).desfecho ?? null;

/** Tema da partida local (a ranqueada usa para a tela de resultado). */
export const temaLocal = (id: string): string => pegar(id).tema;

/** Partidas recentes deste dispositivo, da mais nova para a mais antiga. */
export const partidasLocais = (userId: string, limite = 10): ResumoPartida[] =>
  Object.values(ler())
    .filter((duelo) => duelo.meuId === userId && (duelo.modo ?? 'amistoso') === 'amistoso')
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
    .slice(0, limite)
    .map((duelo) => ({
      id: duelo.id,
      tema: duelo.tema,
      status: duelo.status,
      hostId: duelo.meuId,
      guestId: duelo.adversarioId,
      winnerId: duelo.winnerId,
      pontosHost: somar(duelo.minhas),
      pontosGuest: somar(duelo.dele),
      criadaEm: duelo.criadaEm,
      adversarioId: duelo.adversarioId,
    }));
