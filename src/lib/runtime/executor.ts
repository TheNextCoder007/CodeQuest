'use client';

/**
 * Gerenciador de um worker que executa codigo do aluno.
 *
 * Python (Pyodide) e JavaScript rodam em workers diferentes, mas o problema e
 * o mesmo: subir o worker uma vez so, reaproveita-lo entre execucoes e,
 * quando um programa nao terminar, encerrar e recriar - por isso o aluno pode
 * testar um laco infinito sem travar o navegador, o .apk ou o .exe.
 *
 * Os dois workers falam o mesmo protocolo:
 *   entra  { type: 'run', id, code, stdin }
 *   sai    { type: 'result', id, ok, stdout, error }  e  { type: 'ready' }
 */

export interface ResultadoDaExecucao {
  ok: boolean;
  stdout: string;
  error: string | null;
  /** true quando o programa passou do tempo limite e o worker foi encerrado. */
  timedOut: boolean;
}

export interface Executor {
  /** Comeca a subir o worker antes de o aluno clicar em Executar. */
  aquecer: () => void;
  pronto: () => boolean;
  /** Avisa quando o worker terminar de carregar. Devolve o cancelador. */
  aoFicarPronto: (ouvinte: () => void) => () => void;
  executar: (codigo: string, stdin?: string[]) => Promise<ResultadoDaExecucao>;
}

interface Config {
  /** Caminho do worker dentro de `public/`. */
  arquivo: string;
  tempoLimiteMs: number;
  /** Mensagem mostrada quando o tempo limite estoura. */
  mensagemDeTempo: string;
  /** Mensagem mostrada quando o worker nem sobe (Pyodide sem internet, p.ex.). */
  mensagemDeCarga: string;
}

export const criarExecutor = ({
  arquivo,
  tempoLimiteMs,
  mensagemDeTempo,
  mensagemDeCarga,
}: Config): Executor => {
  let worker: Worker | null = null;
  let ouvintes: (() => void)[] = [];
  let carregado = false;
  let proximoId = 0;

  const criar = (): Worker => {
    const novo = new Worker(arquivo);
    carregado = false;

    novo.addEventListener('message', (evento: MessageEvent) => {
      if (evento.data?.type === 'ready') {
        carregado = true;
        ouvintes.forEach((ouvinte) => ouvinte());
        ouvintes = [];
      }
    });

    // Se o proprio arquivo do worker nao carregar, quem estiver esperando
    // ficaria preso no "preparando..." para sempre.
    novo.addEventListener('error', () => {
      worker = null;
      carregado = false;
    });

    return novo;
  };

  const garantir = (): Worker => {
    if (!worker) worker = criar();
    return worker;
  };

  return {
    aquecer: () => {
      if (typeof window === 'undefined') return;
      garantir();
    },

    pronto: () => carregado,

    aoFicarPronto: (ouvinte) => {
      if (carregado) {
        ouvinte();
        return () => {};
      }
      ouvintes.push(ouvinte);
      return () => {
        ouvintes = ouvintes.filter((item) => item !== ouvinte);
      };
    },

    executar: (codigo, stdin = []) => {
      if (typeof window === 'undefined') {
        return Promise.resolve({
          ok: false,
          stdout: '',
          error: 'Ambiente sem navegador.',
          timedOut: false,
        });
      }

      const ativo = garantir();
      const id = (proximoId += 1);

      return new Promise<ResultadoDaExecucao>((resolve) => {
        let encerrado = false;

        const terminar = (resultado: ResultadoDaExecucao) => {
          if (encerrado) return;
          encerrado = true;
          window.clearTimeout(timer);
          ativo.removeEventListener('message', aoReceber);
          ativo.removeEventListener('error', aoFalhar);
          resolve(resultado);
        };

        const aoReceber = (evento: MessageEvent) => {
          const dados = evento.data;
          if (dados?.type !== 'result' || dados.id !== id) return;
          terminar({
            ok: Boolean(dados.ok),
            stdout: String(dados.stdout ?? ''),
            error: dados.error ?? null,
            timedOut: false,
          });
        };

        const aoFalhar = () => {
          worker = null;
          carregado = false;
          terminar({ ok: false, stdout: '', error: mensagemDeCarga, timedOut: false });
        };

        const timer = window.setTimeout(() => {
          // Laco infinito ou codigo pesado demais: mata o worker e recria.
          ativo.terminate();
          worker = null;
          carregado = false;
          terminar({ ok: false, stdout: '', error: mensagemDeTempo, timedOut: true });
        }, tempoLimiteMs);

        ativo.addEventListener('message', aoReceber);
        ativo.addEventListener('error', aoFalhar);
        ativo.postMessage({ type: 'run', id, code: codigo, stdin });
      });
    },
  };
};
