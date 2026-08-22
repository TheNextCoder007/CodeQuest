'use client';

/**
 * Ponte entre a interface e o worker do Pyodide.
 *
 * O worker vive em `public/pyodide-worker.js` e e reaproveitado entre
 * execucoes. Se um programa passar do tempo limite (laco infinito), o worker
 * e encerrado e recriado - por isso o aluno pode testar sem medo de travar o
 * navegador, o .apk ou o .exe.
 */

export interface PythonResult {
  ok: boolean;
  stdout: string;
  error: string | null;
  timedOut: boolean;
}

const TIMEOUT_MS = 8000;

let worker: Worker | null = null;
let readyListeners: (() => void)[] = [];
let isReady = false;

const createWorker = (): Worker => {
  const created = new Worker('/pyodide-worker.js');
  isReady = false;

  created.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'ready') {
      isReady = true;
      readyListeners.forEach((listener) => listener());
      readyListeners = [];
    }
  });

  return created;
};

const ensureWorker = (): Worker => {
  if (!worker) worker = createWorker();
  return worker;
};

/** Comeca a baixar o Pyodide antes de o aluno clicar em Executar. */
export const warmUpPython = (): void => {
  if (typeof window === 'undefined') return;
  ensureWorker();
};

export const pythonIsReady = (): boolean => isReady;

/** Avisa quando o Pyodide terminar de carregar. Devolve o cancelador. */
export const onPythonReady = (listener: () => void): (() => void) => {
  if (isReady) {
    listener();
    return () => {};
  }
  readyListeners.push(listener);
  return () => {
    readyListeners = readyListeners.filter((item) => item !== listener);
  };
};

let nextId = 0;

export const runPython = (code: string, stdin: string[] = []): Promise<PythonResult> => {
  if (typeof window === 'undefined') {
    return Promise.resolve({ ok: false, stdout: '', error: 'Ambiente sem navegador.', timedOut: false });
  }

  const active = ensureWorker();
  const id = (nextId += 1);

  return new Promise<PythonResult>((resolve) => {
    let settled = false;

    const finish = (result: PythonResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      active.removeEventListener('message', onMessage);
      resolve(result);
    };

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type !== 'result' || data.id !== id) return;
      finish({
        ok: Boolean(data.ok),
        stdout: String(data.stdout ?? ''),
        error: data.error ?? null,
        timedOut: false,
      });
    };

    const timer = window.setTimeout(() => {
      // Laco infinito ou codigo pesado demais: mata o worker e recria.
      active.terminate();
      worker = null;
      isReady = false;
      finish({
        ok: false,
        stdout: '',
        error:
          'Seu programa passou de 8 segundos e foi interrompido. Isso quase sempre é um laço que nunca termina — confira se a variável de controle está sendo atualizada.',
        timedOut: true,
      });
    }, TIMEOUT_MS);

    active.addEventListener('message', onMessage);
    active.postMessage({ type: 'run', id, code, stdin });
  });
};
