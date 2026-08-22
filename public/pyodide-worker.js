/*
 * Worker que executa o codigo Python dos exercicios.
 *
 * Por que um Web Worker e nao a thread principal:
 *  1. um laco infinito (que acontece MUITO no modulo de Repeticoes) travaria
 *     a interface inteira - aqui basta encerrar o worker;
 *  2. o carregamento do Pyodide (~10 MB de WebAssembly) nao congela a UI.
 *
 * O Pyodide roda 100% no dispositivo do aluno: nenhuma linha de codigo do
 * usuario e enviada para servidor nenhum, e por isso o custo e zero.
 */

const PYODIDE_VERSION = 'v0.27.2';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodide = null;
let bootPromise = null;

/*
 * Toda a execucao acontece dentro do Python, e nao pela captura de stdout do
 * Pyodide. Isso e proposital: o stdout do Pyodide e bufferizado por linha, e
 * uma linha incompleta (o prompt de um input(), por exemplo) so seria
 * entregue na execucao seguinte, embaralhando a saida de um exercicio com a
 * do proximo. Redirecionando para um io.StringIO nos temos controle total.
 */
const RUNTIME = `
import builtins, io, json, sys, traceback

_CQ_ARQUIVO = "exercicio.py"


def __cq_executar(codigo, valores):
    fila = list(valores)

    def _input(prompt=""):
        print(prompt, end="")
        if not fila:
            raise EOFError(
                "O programa pediu mais entradas do que este exercicio fornece."
            )
        return fila.pop(0)

    buffer = io.StringIO()
    input_original = builtins.input
    stdout_original, stderr_original = sys.stdout, sys.stderr

    builtins.input = _input
    sys.stdout = buffer
    sys.stderr = buffer

    erro = None
    try:
        # Escopo novo a cada execucao: variaveis de uma tentativa nao vazam
        # para a proxima. O Python injeta __builtins__ sozinho.
        exec(compile(codigo, _CQ_ARQUIVO, "exec"), {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException as excecao:
        erro = __cq_formatar_erro(excecao)
    finally:
        builtins.input = input_original
        sys.stdout = stdout_original
        sys.stderr = stderr_original

    return json.dumps({"stdout": buffer.getvalue(), "error": erro})


def __cq_formatar_erro(excecao):
    """Mensagem curta e util: tipo do erro, descricao e a linha do aluno."""
    descricao = "".join(
        traceback.format_exception_only(type(excecao), excecao)
    ).strip()

    if isinstance(excecao, SyntaxError):
        # O format_exception_only ja traz o trecho e o "^" apontando o erro.
        return descricao

    quadros = [
        quadro
        for quadro in traceback.extract_tb(excecao.__traceback__)
        if quadro.filename == _CQ_ARQUIVO
    ]
    if not quadros:
        return descricao

    ultimo = quadros[-1]
    trecho = f"\\n    {ultimo.line}" if ultimo.line else ""
    return f"Linha {ultimo.lineno}: {descricao}{trecho}"
`;

function boot() {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    self.importScripts(`${PYODIDE_URL}pyodide.js`);
    pyodide = await self.loadPyodide({ indexURL: PYODIDE_URL });
    pyodide.runPython(RUNTIME);

    self.postMessage({ type: 'ready' });
    return pyodide;
  })();

  return bootPromise;
}

self.onmessage = async (event) => {
  const { type, id, code, stdin } = event.data || {};
  if (type !== 'run') return;

  try {
    await boot();
  } catch {
    self.postMessage({
      type: 'result',
      id,
      ok: false,
      stdout: '',
      error:
        'Não foi possível carregar o Python (Pyodide). Verifique sua conexão com a internet e tente de novo.',
    });
    return;
  }

  let executar;
  try {
    executar = pyodide.globals.get('__cq_executar');
    // A funcao devolve um JSON, que o Pyodide converte para string de JS.
    const bruto = executar(code ?? '', stdin ?? []);
    const resultado = JSON.parse(bruto);

    self.postMessage({
      type: 'result',
      id,
      ok: resultado.error === null,
      stdout: resultado.stdout,
      error: resultado.error,
    });
  } catch (falha) {
    // Só chega aqui se o proprio interpretador quebrar (falta de memoria,
    // por exemplo) - o codigo do aluno e tratado dentro do Python.
    self.postMessage({
      type: 'result',
      id,
      ok: false,
      stdout: '',
      error: String(falha?.message ?? falha),
    });
  } finally {
    executar?.destroy?.();
  }
};

// Comeca a baixar o Pyodide assim que o worker sobe, para que a primeira
// execucao do aluno seja rapida.
boot().catch(() => {
  /* o erro real e reportado na primeira execucao */
});
