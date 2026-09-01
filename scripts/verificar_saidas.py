"""Roda uma solucao de referencia para cada exercicio output_match e compara
com a saida esperada guardada no curriculo, usando exatamente a mesma
normalizacao do app (src/lib/exercises/validate.ts)."""

import builtins
import io
import json
import sys
from contextlib import redirect_stdout
from pathlib import Path

# As solucoes de referencia moram em `scripts/solucoes-referencia.json`, o mesmo
# arquivo que `npm run test:estrutura` usa.
#
# Ate a v1.10.3 este script guardava uma COPIA delas aqui dentro. Duas listas
# escritas a mao, mantidas em paralelo - e elas divergiram: a correcao de
# `py-fund-04-e2` foi feita no JSON e esta copia continuou com a versao antiga.
# Uma fonte so, e o problema deixa de existir.
CAMINHO = Path(__file__).parent / "solucoes-referencia.json"
SOLUCOES = {
    id_: dados["codigo"]
    for id_, dados in json.loads(CAMINHO.read_text(encoding="utf-8")).items()
    if dados["lang"] == "python"
}


def normalize(value: str) -> str:
    linhas = [linha.rstrip(" \t") for linha in value.replace("\r\n", "\n").split("\n")]
    return "\n".join(linhas).rstrip("\n").strip()


def executar(codigo: str, entradas):
    fila = list(entradas)
    original = builtins.input

    def fake_input(prompt=""):
        print(prompt, end="")
        if not fila:
            raise EOFError("entradas insuficientes")
        return fila.pop(0)

    builtins.input = fake_input
    buffer = io.StringIO()
    try:
        with redirect_stdout(buffer):
            exec(compile(codigo, "<exercicio>", "exec"), {"__name__": "__main__"})
    finally:
        builtins.input = original
    return buffer.getvalue()


def main():
    with open(sys.argv[1], encoding="utf-8") as arquivo:
        exercicios = json.load(arquivo)

    falhas = 0
    sem_solucao = []

    for exercicio in exercicios:
        codigo = SOLUCOES.get(exercicio["id"])
        if codigo is None:
            sem_solucao.append(exercicio["id"])
            continue

        try:
            saida = executar(codigo, exercicio["stdin"])
        except Exception as erro:  # noqa: BLE001
            print(f"ERRO   {exercicio['id']}: {type(erro).__name__}: {erro}")
            falhas += 1
            continue

        if normalize(saida) == normalize(exercicio["expected"]):
            print(f"ok     {exercicio['id']}")
        else:
            falhas += 1
            print(f"FALHA  {exercicio['id']}")
            print(f"       esperado: {normalize(exercicio['expected'])!r}")
            print(f"       obtido:   {normalize(saida)!r}")

    if sem_solucao:
        print("\nsem solucao de referencia:", ", ".join(sem_solucao))

    print(f"\n{len(exercicios) - falhas - len(sem_solucao)}/{len(exercicios)} conferidos com sucesso")
    sys.exit(1 if falhas or sem_solucao else 0)


if __name__ == "__main__":
    main()
