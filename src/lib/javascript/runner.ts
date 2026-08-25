'use client';

/**
 * Ponte entre a interface e o worker que roda JavaScript.
 *
 * Espelha `@/lib/python/runner`, com duas diferencas que vem do fato de o
 * motor de JavaScript ja estar dentro do navegador:
 *
 *  - nao ha nada para baixar, entao o worker fica pronto praticamente na
 *    hora (o Pyodide leva alguns segundos na primeira vez);
 *  - o tempo limite e menor. No Python os 8 segundos precisam cobrir o
 *    carregamento do interpretador; aqui 4 segundos ja e uma eternidade para
 *    um exercicio de trilha, e cortar antes devolve o "seu laço não termina"
 *    mais rapido para quem esta aprendendo `while`.
 */

import { criarExecutor, type ResultadoDaExecucao } from '@/lib/runtime/executor';

export type JavaScriptResult = ResultadoDaExecucao;

const javascript = criarExecutor({
  arquivo: '/js-worker.js',
  tempoLimiteMs: 4000,
  mensagemDeTempo:
    'Seu programa passou de 4 segundos e foi interrompido. Isso quase sempre é um laço que nunca termina — confira se a variável de controle está sendo atualizada.',
  mensagemDeCarga: 'Não foi possível iniciar o executor de JavaScript. Recarregue a página.',
});

export const warmUpJavaScript = (): void => javascript.aquecer();

export const javaScriptIsReady = (): boolean => javascript.pronto();

export const onJavaScriptReady = (listener: () => void): (() => void) =>
  javascript.aoFicarPronto(listener);

export const runJavaScript = (code: string, stdin: string[] = []): Promise<JavaScriptResult> =>
  javascript.executar(code, stdin);
