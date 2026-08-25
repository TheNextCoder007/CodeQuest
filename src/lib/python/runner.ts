'use client';

/**
 * Ponte entre a interface e o worker do Pyodide.
 *
 * A mecanica de subir, reaproveitar e encerrar o worker mora em
 * `@/lib/runtime/executor` - a mesma usada pelo JavaScript. Aqui ficam so as
 * particularidades do Python: o arquivo do worker e as mensagens de erro, que
 * falam de download do interpretador (~10 MB de WebAssembly) porque so o
 * Pyodide tem esse custo.
 */

import { criarExecutor, type ResultadoDaExecucao } from '@/lib/runtime/executor';

export type PythonResult = ResultadoDaExecucao;

const python = criarExecutor({
  arquivo: '/pyodide-worker.js',
  tempoLimiteMs: 8000,
  mensagemDeTempo:
    'Seu programa passou de 8 segundos e foi interrompido. Isso quase sempre é um laço que nunca termina — confira se a variável de controle está sendo atualizada.',
  mensagemDeCarga:
    'Não foi possível carregar o Python (Pyodide). Verifique sua conexão com a internet e tente de novo.',
});

/** Comeca a baixar o Pyodide antes de o aluno clicar em Executar. */
export const warmUpPython = (): void => python.aquecer();

export const pythonIsReady = (): boolean => python.pronto();

/** Avisa quando o Pyodide terminar de carregar. Devolve o cancelador. */
export const onPythonReady = (listener: () => void): (() => void) => python.aoFicarPronto(listener);

export const runPython = (code: string, stdin: string[] = []): Promise<PythonResult> =>
  python.executar(code, stdin);
