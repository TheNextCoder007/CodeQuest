/*
 * Worker que executa o codigo JavaScript dos exercicios.
 *
 * Fala o MESMO protocolo do `pyodide-worker.js` ({type:'run'} entra,
 * {type:'result'} sai), o que permite os dois serem controlados pelo mesmo
 * gerenciador em `src/lib/runtime/executor.ts`.
 *
 * Por que um Web Worker, se JavaScript ja roda no navegador:
 *
 *  1. laco infinito. `while (true) {}` na thread principal congela a pagina
 *     inteira e nem o botao de parar responde - nao existe timeout que
 *     funcione, porque o proprio timer nao chega a rodar. Num worker basta
 *     `terminate()` do lado de fora;
 *  2. isolamento. O worker nao alcanca o DOM, nem o `localStorage` (onde o
 *     Supabase guarda a sessao), entao um `document.cookie` da vida nao
 *     existe ali dentro.
 *
 * O codigo do aluno roda 100% no dispositivo dele: nada e enviado para
 * servidor nenhum, e por isso o custo e zero.
 */

importScripts('./js-runtime.js');

/*
 * Trava o que o worker consegue alcancar ANTES de qualquer codigo de aluno
 * rodar. Como o `importScripts` acima ja aconteceu, nada disso e mais
 * necessario para nos.
 *
 * Isto e uma tranca contra acidente e curiosidade, nao um sandbox de
 * seguranca: o codigo executado e o que a propria pessoa digitou, no
 * navegador dela. O risco real de um exercicio e o laco infinito, e disso
 * cuida o `terminate()` do lado de fora.
 */
['fetch', 'XMLHttpRequest', 'WebSocket', 'importScripts', 'indexedDB', 'caches', 'Worker'].forEach(
  function (nome) {
    try {
      self[nome] = undefined;
    } catch (erro) {
      /* alguns motores marcam esses globais como somente leitura */
    }
  },
);

self.onmessage = function (evento) {
  var dados = evento.data || {};
  if (dados.type !== 'run') return;

  var resultado;
  try {
    resultado = self.CQJSRuntime.executar(dados.code || '', dados.stdin || []);
  } catch (falha) {
    // So chega aqui se o proprio runtime quebrar (falta de memoria, por
    // exemplo) - o codigo do aluno ja e tratado dentro do `executar`.
    resultado = { stdout: '', error: String((falha && falha.message) || falha) };
  }

  self.postMessage({
    type: 'result',
    id: dados.id,
    ok: resultado.error === null,
    stdout: resultado.stdout,
    error: resultado.error,
  });
};

// Nao ha nada pesado para baixar (ao contrario do Pyodide), mas o gerenciador
// espera este aviso para liberar o botao Executar.
self.postMessage({ type: 'ready' });
