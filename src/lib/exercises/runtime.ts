'use client';

/**
 * Qual motor roda o exercicio de codigo de cada linguagem.
 *
 * A trilha tem exercicios `output_match` em Python e em JavaScript, e os dois
 * sao executados no proprio dispositivo (Pyodide num caso, o motor do proprio
 * navegador no outro). Este arquivo e o unico lugar que sabe dessa escolha:
 * a validacao, o editor e o terminal so perguntam por aqui.
 *
 * Para uma linguagem sem motor (Java, C#, C++ hoje), `runtimeDaLinguagem`
 * devolve `null` e a interface simplesmente nao oferece exercicio de codigo -
 * as licoes dessas trilhas usarao multipla escolha e completar.
 */

import type { ResultadoDaExecucao } from '@/lib/runtime/executor';
import {
  onPythonReady,
  pythonIsReady,
  runPython,
  warmUpPython,
} from '@/lib/python/runner';
import {
  javaScriptIsReady,
  onJavaScriptReady,
  runJavaScript,
  warmUpJavaScript,
} from '@/lib/javascript/runner';

export interface RuntimeDaLinguagem {
  nome: string;
  /** Nome mostrado na aba do editor. */
  arquivo: string;
  /** Funcao que le a entrada do usuario, citada na dica de stdin. */
  funcaoDeEntrada: string;
  /** Texto do terminal enquanto o motor ainda esta subindo. */
  preparando: string;
  /**
   * Depois de uma linha terminada assim, o Enter do editor adiciona um nivel
   * de indentacao: `:` abre bloco em Python, `{` em JavaScript.
   */
  abreBloco: RegExp;
  executar: (codigo: string, stdin?: string[]) => Promise<ResultadoDaExecucao>;
  aquecer: () => void;
  pronto: () => boolean;
  aoFicarPronto: (ouvinte: () => void) => () => void;
}

const RUNTIMES: Record<string, RuntimeDaLinguagem> = {
  python: {
    nome: 'Python',
    arquivo: 'main.py',
    funcaoDeEntrada: 'input()',
    preparando: 'Preparando o Python (isso acontece só na primeira vez)...',
    abreBloco: /:$/,
    executar: runPython,
    aquecer: warmUpPython,
    pronto: pythonIsReady,
    aoFicarPronto: onPythonReady,
  },
  javascript: {
    nome: 'JavaScript',
    arquivo: 'main.js',
    funcaoDeEntrada: 'prompt()',
    preparando: 'Preparando o executor de JavaScript...',
    abreBloco: /[{([]$/,
    executar: runJavaScript,
    aquecer: warmUpJavaScript,
    pronto: javaScriptIsReady,
    aoFicarPronto: onJavaScriptReady,
  },
};

export const runtimeDaLinguagem = (slug: string): RuntimeDaLinguagem | null =>
  RUNTIMES[slug] ?? null;

/** Linguagem usada quando a tela nao informa nenhuma (a trilha inicial). */
export const LINGUAGEM_PADRAO = 'python';
