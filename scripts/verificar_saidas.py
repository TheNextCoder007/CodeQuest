"""Roda uma solucao de referencia para cada exercicio output_match e compara
com a saida esperada guardada no curriculo, usando exatamente a mesma
normalizacao do app (src/lib/exercises/validate.ts)."""

import builtins
import io
import json
import sys
from contextlib import redirect_stdout

SOLUCOES = {
    "py-fund-02-e1": 'print("Olá, CodeQuest!")',
    "py-fund-02-e2": 'print("Meu nome é Dev")\nprint("Estou aprendendo Python")',
    "py-fund-03-e2": '# print("teste temporário")\nprint("Relatório final")',
    "py-fund-04-e2": 'print("Tudo certo!")',
    "py-fund-05-e1": 'cidade = input("De qual cidade você é? ")\nprint("Boa viagem para", cidade)',
    "py-var-01-e1": 'nome = "Ana"\nprint(nome)',
    "py-var-02-e2": 'print("10" + "5")\nprint(10 + 5)',
    "py-var-03-e1": 'numero = int(input("Digite um número: "))\nprint(numero + 10)',
    "py-var-04-e1": 'nome = "Ana"\nnota1 = 7.0\nnota2 = 9.0\nprint(f"A média de {nome} é {(nota1 + nota2) / 2}")',
    "py-cond-01-e2": 'compra = 150\n\nif compra > 100:\n    print("Tem desconto")',
    "py-cond-02-e1": 'idade = int(input("Digite sua idade: "))\n\nif idade >= 18:\n    print("Maior de idade")\nelse:\n    print("Menor de idade")',
    "py-cond-02-e2": 'idade = int(input("Digite sua idade: "))\n\nif idade >= 18:\n    print("Maior de idade")\nelse:\n    print("Menor de idade")',
    "py-cond-03-e1": 'temperatura = 12\n\nif temperatura > 30:\n    print("Calor")\nelif temperatura >= 15:\n    print("Ameno")\nelse:\n    print("Frio")',
    "py-cond-04-e1": 'idade = 22\ntem_habilitacao = False\n\nif idade >= 18 and tem_habilitacao:\n    print("Pode dirigir")\nelse:\n    print("Não pode dirigir")',
    "py-rep-01-e1": "for numero in range(1, 6):\n    print(numero)",
    "py-rep-02-e1": 'contador = 3\n\nwhile contador >= 1:\n    print(contador)\n    contador -= 1\n\nprint("Fim")',
    "py-rep-03-e1": "soma = 0\n\nfor numero in range(1, 101):\n    soma += numero\n\nprint(soma)",
    "py-rep-03-e2": "quantidade = 0\n\nfor numero in range(1, 21):\n    if numero % 3 == 0:\n        quantidade += 1\n\nprint(quantidade)",
    "py-rep-04-e1": "for numero in range(1, 11):\n    if numero == 7:\n        continue\n    print(numero)",
    "py-func-01-e1": 'def abrir_jogo():\n    print("Partida iniciada")\n\nabrir_jogo()\nabrir_jogo()',
    "py-func-02-e1": "def calcular_media(a, b):\n    return (a + b) / 2\n\nprint(calcular_media(7, 9))",
    "py-func-03-e1": "def eh_par(numero):\n    return numero % 2 == 0\n\nprint(eh_par(4))\nprint(eh_par(7))",
    "py-des-01-e1": 'for numero in range(1, 16):\n    if numero % 3 == 0 and numero % 5 == 0:\n        print("FizzBuzz")\n    elif numero % 3 == 0:\n        print("Fizz")\n    elif numero % 5 == 0:\n        print("Buzz")\n    else:\n        print(numero)',
    "py-des-02-e1": 'def validar_senha(senha):\n    if len(senha) < 8:\n        return "Senha muito curta"\n    if senha == "12345678":\n        return "Senha óbvia demais"\n    return "Senha aceita"\n\nprint(validar_senha("abc"))\nprint(validar_senha("12345678"))\nprint(validar_senha("codequest2026"))',
    "py-des-03-e1": 'notas = [7.0, 9.5, 4.0, 8.5]\nmaior = notas[0]\nsoma = 0\n\nfor nota in notas:\n    soma += nota\n    if nota > maior:\n        maior = nota\n\nprint(f"Maior: {maior}")\nprint(f"Média: {soma / len(notas)}")',
    "py-proj-01-e1": 'def situacao(media):\n    if media >= 7:\n        return "Aprovado"\n    elif media >= 5:\n        return "Recuperação"\n    return "Reprovado"\n\nprint(situacao(8.0))\nprint(situacao(6.0))\nprint(situacao(3.0))',
    "py-proj-01-e2": 'def situacao(media):\n    if media >= 7:\n        return "Aprovado"\n    elif media >= 5:\n        return "Recuperação"\n    return "Reprovado"\n\nturma = [\n    ["Ana", 7.0, 9.0],\n    ["Luiz", 4.0, 5.0],\n    ["Kauan", 6.0, 6.0],\n]\n\nfor aluno in turma:\n    media = (aluno[1] + aluno[2]) / 2\n    print(f"{aluno[0]}: média {media} - {situacao(media)}")',
    "py-proj-01-e3": 'def situacao(media):\n    if media >= 7:\n        return "Aprovado"\n    elif media >= 5:\n        return "Recuperação"\n    return "Reprovado"\n\nturma = [\n    ["Ana", 7.0, 9.0],\n    ["Luiz", 4.0, 5.0],\n    ["Kauan", 6.0, 6.0],\n]\n\nsoma_medias = 0\naprovados = 0\n\nfor aluno in turma:\n    media = (aluno[1] + aluno[2]) / 2\n    print(f"{aluno[0]}: média {media} - {situacao(media)}")\n    soma_medias += media\n    if situacao(media) == "Aprovado":\n        aprovados += 1\n\nprint("---")\nprint(f"Média da turma: {round(soma_medias / len(turma), 2)}")\nprint(f"Aprovados: {aprovados} de {len(turma)}")',
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
