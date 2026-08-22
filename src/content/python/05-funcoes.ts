import type { Module } from '@/types/content';

/** Modulo 5 - Funcoes (definicao, parametros, return e organizacao). */
export const funcoes: Module = {
  id: 'py-funcoes',
  languageId: 'python',
  title: 'Funções',
  description: 'Dar nome a um pedaço de lógica, reaproveitar código e parar de repetir você mesmo.',
  icon: '⚙️',
  orderIndex: 5,
  lessons: [
    {
      id: 'py-func-01',
      moduleId: 'py-funcoes',
      title: 'Criando uma função',
      subtitle: 'def e chamada',
      orderIndex: 1,
      content: `## Dando nome a um bloco de código

Uma **função** é um trecho de código que ganha nome e só roda quando você chama:

~~~py
def saudacao():
    print("Bem-vindo ao CodeQuest!")

saudacao()
saudacao()
~~~

~~~text
Bem-vindo ao CodeQuest!
Bem-vindo ao CodeQuest!
~~~

Duas coisas acontecem aqui:

1. \`def saudacao():\` **define** a função — nada é executado ainda, o Python só guarda a receita;
2. \`saudacao()\` **chama** a função — agora sim o bloco roda.

Definir sem chamar não produz saída nenhuma. É o erro mais comum da primeira aula sobre funções.

## Você já usa funções desde a primeira lição

\`print()\`, \`input()\`, \`int()\`, \`range()\`, \`len()\` — todas são funções prontas do Python. A diferença é que agora **você** escreve as suas.

## Por que isso importa

- **Não se repete**: a lógica existe em um lugar só; corrigiu ali, corrigiu em todo lugar.
- **Fica legível**: \`calcular_media(notas)\` conta a história melhor que dez linhas soltas.
- **Fica testável**: dá para verificar uma função isolada do resto do programa.`,
      polyglot: [
        { language: 'Python', code: 'def saudacao():\n    print("Olá")' },
        { language: 'JavaScript', code: 'function saudacao() {\n  console.log("Olá");\n}' },
        { language: 'Java', code: 'static void saudacao() {\n  System.out.println("Olá");\n}' },
      ],
      exercises: [
        {
          id: 'py-func-01-e1',
          lessonId: 'py-func-01',
          prompt:
            'Crie uma função chamada `abrir_jogo` que mostre `Partida iniciada` e chame-a duas vezes.\n\nSaída esperada:\n\n~~~text\nPartida iniciada\nPartida iniciada\n~~~',
          starterCode: '# defina a função e chame duas vezes\n',
          validationType: 'output_match',
          expectedAnswer: 'Partida iniciada\nPartida iniciada',
          hint: 'def abrir_jogo(): com o print indentado dentro, e depois duas linhas abrir_jogo()',
          explanation:
            'A definição não executa nada — quem executa são as duas chamadas. Escrever a lógica uma vez e usar quantas vezes quiser é justamente o ganho da função.',
          xpReward: 45,
          orderIndex: 1,
        },
        {
          id: 'py-func-01-e2',
          lessonId: 'py-func-01',
          prompt: 'Qual palavra-chave define uma função em Python?',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'def',
          hint: 'São três letras, abreviação de "define".',
          explanation:
            '`def` vem de *define*. Em JavaScript o equivalente é `function`; em Java e C# você declara o tipo de retorno antes do nome.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-func-02',
      moduleId: 'py-funcoes',
      title: 'Parâmetros e retorno',
      subtitle: 'Entrada e saída de uma função',
      orderIndex: 2,
      content: `## Funções que recebem dados

Um **parâmetro** é uma variável que a função recebe de quem a chamou:

~~~py
def saudacao(nome):
    print(f"Olá, {nome}!")

saudacao("Ana")
saudacao("Kauan")
~~~

~~~text
Olá, Ana!
Olá, Kauan!
~~~

A mesma função, resultados diferentes — porque o **argumento** mudou.

## Funções que devolvem dados

\`return\` devolve um valor para quem chamou, permitindo guardar o resultado:

~~~py
def dobro(numero):
    return numero * 2

resultado = dobro(5)
print(resultado)
print(dobro(10) + dobro(3))
~~~

~~~text
10
26
~~~

## print não é return

Essa distinção derruba muita gente:

~~~py
def soma_errada(a, b):
    print(a + b)      # mostra na tela, mas devolve None

def soma_certa(a, b):
    return a + b      # devolve o valor para ser usado

x = soma_errada(2, 3)   # x fica valendo None
y = soma_certa(2, 3)    # y fica valendo 5
~~~

**\`print\` fala com o usuário. \`return\` fala com o resto do programa.** Se o valor vai ser reaproveitado em outra conta, você precisa de \`return\`.

## O return encerra a função

Qualquer linha depois de um \`return\` executado é ignorada:

~~~py
def teste():
    return 1
    print("nunca aparece")
~~~`,
      exercises: [
        {
          id: 'py-func-02-e1',
          lessonId: 'py-func-02',
          prompt:
            'Escreva a função `calcular_media(a, b)` que **retorna** a média de dois números, e mostre a média de 7 e 9.\n\nSaída esperada:\n\n~~~text\n8.0\n~~~',
          starterCode: '# defina calcular_media e mostre o resultado\n',
          validationType: 'output_match',
          expectedAnswer: '8.0',
          hint: 'def calcular_media(a, b): return (a + b) / 2 — depois print(calcular_media(7, 9))',
          explanation:
            'Como a função **retorna**, o valor pode ser impresso, guardado numa variável ou usado em outra conta. Se ela apenas imprimisse, você não teria como reaproveitar o resultado.',
          xpReward: 55,
          orderIndex: 1,
        },
        {
          id: 'py-func-02-e2',
          lessonId: 'py-func-02',
          prompt:
            'Uma função que só faz `print(a + b)`, sem `return`, devolve o quê para quem a chamou?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['None', 'A soma de a e b', 'Uma string com o resultado', 'Zero'],
          expectedAnswer: 'None',
          explanation:
            'Toda função sem `return` devolve `None`, o valor que representa "nada" em Python. Por isso `x = soma_errada(2, 3)` deixa `x` valendo None, mesmo tendo aparecido 5 na tela.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-func-03',
      moduleId: 'py-funcoes',
      title: 'Organizando um programa',
      subtitle: 'Escopo e composição de funções',
      orderIndex: 3,
      content: `## Cada função tem seu mundo

Variáveis criadas dentro de uma função só existem lá dentro. Isso se chama **escopo local**:

~~~py
def calcular():
    total = 10
    return total

calcular()
print(total)
~~~

~~~text
NameError: name 'total' is not defined
~~~

Isso é uma proteção, não uma limitação: você pode usar o nome \`total\` em várias funções sem que uma atrapalhe a outra.

## Compondo funções

Programas reais são funções pequenas que chamam outras funções pequenas:

~~~py
def eh_aprovado(media):
    return media >= 6

def calcular_media(a, b):
    return (a + b) / 2

def boletim(nome, n1, n2):
    media = calcular_media(n1, n2)
    if eh_aprovado(media):
        situacao = "Aprovado"
    else:
        situacao = "Reprovado"
    print(f"{nome}: média {media} - {situacao}")

boletim("Ana", 7, 9)
boletim("Luiz", 4, 5)
~~~

~~~text
Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
~~~

Repare que \`eh_aprovado\` retorna diretamente o resultado da comparação — que já é \`True\` ou \`False\`. Não é preciso escrever \`if media >= 6: return True else: return False\`.

## Uma função, uma responsabilidade

Se você precisa usar "e" para explicar o que a função faz ("ela calcula a média **e** imprime **e** salva"), provavelmente são três funções.`,
      exercises: [
        {
          id: 'py-func-03-e1',
          lessonId: 'py-func-03',
          prompt:
            'Complete a função `eh_par(numero)` para que ela **retorne** True quando o número for par.\n\nSaída esperada:\n\n~~~text\nTrue\nFalse\n~~~',
          starterCode:
            'def eh_par(numero):\n    # complete aqui\n\nprint(eh_par(4))\nprint(eh_par(7))\n',
          validationType: 'output_match',
          expectedAnswer: 'True\nFalse',
          hint: 'return numero % 2 == 0 — a própria comparação já vale True ou False.',
          explanation:
            'A expressão `numero % 2 == 0` já é um booleano, então dá para retorná-la direto. Envolvê-la num `if` que retorna True/False seria código redundante.',
          xpReward: 55,
          orderIndex: 1,
        },
        {
          id: 'py-func-03-e2',
          lessonId: 'py-func-03',
          prompt:
            'Por que uma variável criada dentro de uma função não pode ser lida fora dela?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Porque ela existe apenas no escopo local da função',
            'Porque o Python apaga todas as variáveis a cada linha',
            'Porque faltou usar return na variável',
            'Porque variáveis dentro de funções precisam começar com _',
          ],
          expectedAnswer: 'Porque ela existe apenas no escopo local da função',
          explanation:
            'A variável nasce quando a função começa e é descartada quando ela termina. Para levar um valor para fora, use `return`.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
  ],
};
