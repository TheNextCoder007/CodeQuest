/**
 * Regras do duelo 1v1 - versao TypeScript.
 *
 * ATENCAO: estas mesmas regras existem em SQL, dentro de
 * `supabase/migrations/0005_pvp.sql`. O servidor e quem manda: numa partida
 * de verdade, quem corrige a resposta e quem soma os pontos e o banco, e o
 * cliente nunca recebe o gabarito.
 *
 * Esta copia em TypeScript existe por dois motivos legitimos:
 *
 *   1. o modo demonstracao (sem Supabase) precisa rodar o duelo inteiro no
 *      dispositivo, senao o projeto nao pode ser apresentado offline;
 *   2. o adversario controlado pelo computador (bots) vai reusar exatamente
 *      esta pontuacao.
 *
 * `npm run test:pvp` compara as duas implementacoes rodando a versao SQL num
 * PostgreSQL real e conferindo se dao o mesmo numero. Se alguem mexer numa e
 * esquecer da outra, o teste quebra.
 */

/** Quantas perguntas tem uma partida. */
export const PERGUNTAS_POR_PARTIDA = 5;

/** Tempo maximo para responder cada pergunta. Estourar = 0 ponto. */
export const TEMPO_LIMITE_MS = 20_000;

/** Pontos de um acerto, antes do bonus de velocidade. */
export const PONTOS_ACERTO = 100;

/** Bonus maximo por responder rapido (cai ao longo do tempo limite). */
export const BONUS_MAXIMO = 100;

/**
 * Pontuacao de uma resposta.
 *
 *   errou ou estourou o tempo -> 0
 *   acertou                   -> 100 + bonus, onde o bonus cai 1 ponto a cada
 *                                200 ms (100 na hora, 0 aos 20 s)
 *
 * O `ms` que entra aqui e SEMPRE medido pelo servidor (diferenca entre o
 * instante em que a pergunta foi entregue e o instante da resposta). Tempo
 * informado pelo cliente seria trivial de falsificar.
 */
export const pontuar = (correta: boolean, ms: number): number => {
  if (!correta) return 0;
  const gasto = Math.max(0, Math.min(ms, TEMPO_LIMITE_MS));
  if (gasto >= TEMPO_LIMITE_MS) return 0;
  const bonus = Math.max(0, BONUS_MAXIMO - Math.floor(gasto / 200));
  return PONTOS_ACERTO + bonus;
};

/**
 * Normaliza a resposta antes de comparar.
 *
 * Vale para os dois formatos: em `fill_blank` a pessoa digita, e cobrar
 * maiuscula ou espaco sobrando seria maldade. O que NAO fazemos e aceitar
 * resposta parecida - a comparacao continua exata depois da normalizacao.
 */
export const normalizarResposta = (valor: string): string =>
  valor
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    // ponto e virgula no fim nao muda a resposta de um trecho curto
    .replace(/;+$/, '');

export const respostaCorreta = (gabarito: string, resposta: string): boolean =>
  normalizarResposta(gabarito) === normalizarResposta(resposta);

export type Desfecho = 'anfitriao' | 'convidado' | 'empate';

/** Quem venceu, a partir dos pontos somados. */
export const desfecho = (pontosAnfitriao: number, pontosConvidado: number): Desfecho => {
  if (pontosAnfitriao > pontosConvidado) return 'anfitriao';
  if (pontosConvidado > pontosAnfitriao) return 'convidado';
  return 'empate';
};

/**
 * Sorteia as perguntas de uma partida.
 *
 * Recebe a lista ja filtrada pelo tema. Embaralha e corta - com um gerador
 * que aceita semente, para o teste poder repetir o mesmo sorteio.
 */
export const sortearPerguntas = <T>(
  disponiveis: T[],
  quantidade = PERGUNTAS_POR_PARTIDA,
  aleatorio: () => number = Math.random,
): T[] => {
  const copia = [...disponiveis];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, Math.min(quantidade, copia.length));
};
