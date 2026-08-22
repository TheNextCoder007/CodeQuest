import type { Module } from '@/types/content';

/**
 * Modulo 3 - Condicionais.
 * Contem o exercicio-simbolo do projeto ("maior de idade", +100 XP), que e o
 * exemplo usado no pitch do CodeQuest.
 */
export const condicionais: Module = {
  id: 'py-condicionais',
  languageId: 'python',
  title: 'Condicionais',
  description: 'Fazer o programa tomar decisões: caminhos diferentes para situações diferentes.',
  icon: '🔀',
  orderIndex: 3,
  lessons: [
    {
      id: 'py-cond-01',
      moduleId: 'py-condicionais',
      title: 'A ideia de decisão',
      subtitle: 'O comando if',
      orderIndex: 1,
      content: `## Nem todo código roda sempre

Até aqui, todas as linhas dos seus programas sempre executavam. Com a **condicional**, um trecho só roda **se** uma condição for verdadeira.

~~~py
nota = 8

if nota >= 6:
    print("Aprovado")
~~~

Leia em português: "**se** nota for maior ou igual a 6, mostre Aprovado".

## Os operadores de comparação

| Operador | Significado |
| --- | --- |
| \`==\` | é igual a |
| \`!=\` | é diferente de |
| \`>\` | maior que |
| \`<\` | menor que |
| \`>=\` | maior ou igual a |
| \`<=\` | menor ou igual a |

Atenção ao \`==\` de comparação contra o \`=\` de atribuição. \`idade = 18\` **guarda** 18 na variável; \`idade == 18\` **pergunta** se ela vale 18 e devolve \`True\` ou \`False\`.

## A indentação é obrigatória

Em Python, o que pertence ao \`if\` é definido pelos **espaços no começo da linha** (indentação, por convenção 4 espaços):

~~~py
if nota >= 6:
    print("Aprovado")      # dentro do if
    print("Parabéns!")     # dentro do if
print("Fim do boletim")    # fora do if, sempre roda
~~~

Em Java, C# e C++ esse agrupamento é feito com chaves \`{ }\` — o conceito é idêntico, muda só a forma de marcar o bloco. Em Python, esquecer a indentação gera \`IndentationError\`.`,
      polyglot: [
        {
          language: 'Python',
          code: 'if idade >= 18:\n    print("Maior de idade")',
        },
        {
          language: 'JavaScript',
          code: 'if (idade >= 18) {\n  console.log("Maior de idade");\n}',
        },
        {
          language: 'Java',
          code: 'if (idade >= 18) {\n  System.out.println("Maior de idade");\n}',
        },
      ],
      exercises: [
        {
          id: 'py-cond-01-e1',
          lessonId: 'py-cond-01',
          prompt: 'Qual operador **compara** se dois valores são iguais?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['==', '=', '!=', '=>'],
          expectedAnswer: '==',
          explanation:
            '`==` compara e devolve True/False. `=` atribui um valor a uma variável. Confundir os dois é um dos erros mais comuns de quem está começando.',
          xpReward: 25,
          orderIndex: 1,
        },
        {
          id: 'py-cond-01-e2',
          lessonId: 'py-cond-01',
          prompt:
            'Complete o `if` para que o programa mostre `Tem desconto` quando o valor da compra passar de 100.\n\nSaída esperada:\n\n~~~text\nTem desconto\n~~~',
          starterCode: 'compra = 150\n\n# escreva o if aqui\nprint("Tem desconto")\n',
          validationType: 'output_match',
          expectedAnswer: 'Tem desconto',
          hint: 'if compra > 100: e na linha seguinte o print com 4 espaços de indentação.',
          explanation:
            'A estrutura é `if condição:` seguida do bloco indentado. Como `compra` vale 150, a condição é verdadeira e o print executa.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-cond-02',
      moduleId: 'py-condicionais',
      title: 'Maior de idade',
      subtitle: 'O desafio clássico do CodeQuest',
      orderIndex: 2,
      content: `## O desafio

Este é o exercício que deu origem ao CodeQuest. Ele é simples de enunciar e junta tudo que você viu até agora: entrada, conversão, comparação e saída.

> **Crie um programa que informe se uma pessoa é maior de idade.**

## Quebrando o problema em partes

Antes de escrever qualquer linha, descreva a solução em português:

1. perguntar a idade da pessoa;
2. transformar o que foi digitado em número;
3. se a idade for 18 ou mais → "Maior de idade";
4. senão → "Menor de idade".

Essa tradução do problema para passos é **a** habilidade central da programação. A sintaxe vem depois.

## O comando else

O \`else\` cobre todos os casos em que a condição do \`if\` deu falso:

~~~py
idade = 20

if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")
~~~

Exatamente um dos dois blocos vai executar — nunca os dois, nunca nenhum.

## Por que 18 e não 19?

Porque a condição é "**18 ou mais**", então o operador é \`>=\`. Se você usasse \`>\`, quem tem exatamente 18 anos seria classificado como menor — um erro de lógica que o programa não acusa, porque para o computador ele está funcionando perfeitamente. Esse tipo de detalhe é o que separa código que roda de código que está correto.`,
      polyglot: [
        {
          language: 'Python',
          code: 'idade = int(input("Digite sua idade: "))\nif idade >= 18:\n    print("Maior de idade")\nelse:\n    print("Menor de idade")',
        },
        {
          language: 'JavaScript',
          code: 'const idade = Number(prompt("Digite sua idade: "));\nif (idade >= 18) {\n  console.log("Maior de idade");\n} else {\n  console.log("Menor de idade");\n}',
        },
        {
          language: 'Java',
          code: 'int idade = sc.nextInt();\nif (idade >= 18) {\n  System.out.println("Maior de idade");\n} else {\n  System.out.println("Menor de idade");\n}',
        },
      ],
      exercises: [
        {
          id: 'py-cond-02-e1',
          lessonId: 'py-cond-02',
          prompt:
            '**Crie um programa que informe se uma pessoa é maior de idade.**\n\nPergunte a idade com `input("Digite sua idade: ")`, converta para número e mostre `Maior de idade` ou `Menor de idade`.\n\nA idade simulada é **18**. Saída esperada:\n\n~~~text\nDigite sua idade: Maior de idade\n~~~',
          starterCode:
            'idade = int(input("Digite sua idade: "))\n\n# escreva aqui a decisão\n',
          validationType: 'output_match',
          stdin: ['18'],
          expectedAnswer: 'Digite sua idade: Maior de idade',
          hint: 'if idade >= 18: print("Maior de idade") / else: print("Menor de idade"). Lembre da indentação de 4 espaços.',
          explanation:
            'Você acabou de escrever o programa que ilustra o CodeQuest inteiro: entrada do usuário, conversão de tipo, decisão e saída. Repare que com idade exatamente 18 o `>=` é essencial — com `>` a resposta sairia errada.',
          xpReward: 100,
          orderIndex: 1,
        },
        {
          id: 'py-cond-02-e2',
          lessonId: 'py-cond-02',
          prompt:
            'Testando o mesmo programa com outra entrada. Agora a idade simulada é **15**.\n\nSaída esperada:\n\n~~~text\nDigite sua idade: Menor de idade\n~~~',
          starterCode:
            'idade = int(input("Digite sua idade: "))\n\n# o mesmo programa da questão anterior\n',
          validationType: 'output_match',
          stdin: ['15'],
          expectedAnswer: 'Digite sua idade: Menor de idade',
          hint: 'É exatamente o mesmo código do exercício anterior — o que muda é só a entrada.',
          explanation:
            'Testar o mesmo código com entradas diferentes é o que chamamos de **teste de caso**. Um programa só está pronto quando você verificou os dois caminhos da condicional.',
          xpReward: 50,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-cond-03',
      moduleId: 'py-condicionais',
      title: 'Mais de dois caminhos',
      subtitle: 'if / elif / else',
      orderIndex: 3,
      content: `## Quando duas opções não bastam

Para classificar uma nota em conceitos A, B, C e D, você precisa de mais de dois caminhos. É aí que entra o \`elif\` (contração de "else if"):

~~~py
nota = 8.5

if nota >= 9:
    print("Conceito A")
elif nota >= 7:
    print("Conceito B")
elif nota >= 5:
    print("Conceito C")
else:
    print("Conceito D")
~~~

~~~text
Conceito B
~~~

## A ordem é tudo

O Python testa as condições **de cima para baixo** e para na primeira que der verdadeira. Todas as outras são ignoradas, mesmo que também fossem verdadeiras.

Foi por isso que \`8.5\` virou B: ele não é \`>= 9\`, mas é \`>= 7\`, então parou ali — sem nem testar o \`>= 5\`.

Agora veja o mesmo código com a ordem invertida:

~~~py
nota = 8.5

if nota >= 5:
    print("Conceito C")
elif nota >= 7:
    print("Conceito B")
~~~

Aqui **todo mundo** com nota acima de 5 vira C, e o \`elif\` nunca é alcançado. O código roda sem erro e produz resultados errados — de novo, um bug de lógica, não de sintaxe.

## Regrinha prática

Quando as faixas são numéricas, escreva as condições **da mais restritiva para a mais ampla**.`,
      exercises: [
        {
          id: 'py-cond-03-e1',
          lessonId: 'py-cond-03',
          prompt:
            'Classifique a temperatura: acima de 30 → `Calor`, entre 15 e 30 → `Ameno`, abaixo de 15 → `Frio`.\n\nA temperatura é **12**. Saída esperada:\n\n~~~text\nFrio\n~~~',
          starterCode: 'temperatura = 12\n\n# use if / elif / else\n',
          validationType: 'output_match',
          expectedAnswer: 'Frio',
          hint: 'if temperatura > 30: ... elif temperatura >= 15: ... else: print("Frio")',
          explanation:
            'Com 12 graus as duas primeiras condições dão falso, então o `else` assume. O `else` é a rede de segurança: ele cobre tudo que não se encaixou antes.',
          xpReward: 45,
          orderIndex: 1,
        },
        {
          id: 'py-cond-03-e2',
          lessonId: 'py-cond-03',
          prompt:
            'Com `nota = 9.5`, o que este código mostra?\n\n~~~py\nif nota >= 5:\n    print("C")\nelif nota >= 9:\n    print("A")\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['C', 'A', 'C e A', 'Nada, dá erro'],
          expectedAnswer: 'C',
          explanation:
            'A primeira condição já é verdadeira (9.5 >= 5), então o Python executa aquele bloco e **pula todo o resto** da cadeia. O `elif` nunca é avaliado. Por isso a ordem das faixas importa tanto.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-cond-04',
      moduleId: 'py-condicionais',
      title: 'Combinando condições',
      subtitle: 'and, or e not',
      orderIndex: 4,
      content: `## Duas perguntas de uma vez

Às vezes uma decisão depende de mais de um fator. Os **operadores lógicos** combinam condições:

- \`and\` → verdadeiro só se **as duas** forem verdadeiras;
- \`or\` → verdadeiro se **pelo menos uma** for verdadeira;
- \`not\` → inverte o resultado.

~~~py
idade = 20
tem_documento = True

if idade >= 18 and tem_documento:
    print("Pode entrar")
else:
    print("Entrada negada")
~~~

## Tabela mental rápida

| Condição | Resultado |
| --- | --- |
| \`True and True\` | True |
| \`True and False\` | False |
| \`True or False\` | True |
| \`False or False\` | False |
| \`not True\` | False |

## Intervalos

Para testar se um número está **entre** dois valores, combine com \`and\`:

~~~py
if nota >= 7 and nota <= 10:
    print("Aprovado")
~~~

Python ainda aceita a forma encadeada, mais próxima da matemática — e isso é uma particularidade dele, que não existe em Java ou C++:

~~~py
if 7 <= nota <= 10:
    print("Aprovado")
~~~

## Erro clássico

Isto **não** faz o que parece:

~~~py
if cor == "azul" or "verde":
~~~

O Python lê como "(cor == "azul") ou ("verde")", e uma string não vazia sempre vale True — logo a condição é sempre verdadeira. O jeito certo é repetir a comparação inteira:

~~~py
if cor == "azul" or cor == "verde":
~~~`,
      exercises: [
        {
          id: 'py-cond-04-e1',
          lessonId: 'py-cond-04',
          prompt:
            'Uma pessoa só pode dirigir se tiver 18 anos ou mais **e** possuir habilitação.\n\nCom `idade = 22` e `tem_habilitacao = False`, escreva a condição que mostra `Não pode dirigir`.\n\nSaída esperada:\n\n~~~text\nNão pode dirigir\n~~~',
          starterCode:
            'idade = 22\ntem_habilitacao = False\n\n# use and na condição\n',
          validationType: 'output_match',
          expectedAnswer: 'Não pode dirigir',
          hint: 'if idade >= 18 and tem_habilitacao: print("Pode dirigir") / else: print("Não pode dirigir")',
          explanation:
            'Com `and`, basta uma das partes ser falsa para a condição inteira ser falsa. A idade passa, mas a habilitação não — então cai no `else`.',
          xpReward: 45,
          orderIndex: 1,
        },
        {
          id: 'py-cond-04-e2',
          lessonId: 'py-cond-04',
          prompt: 'Qual o resultado de `True and False or True`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['True', 'False', 'Erro de sintaxe', 'Depende das variáveis'],
          expectedAnswer: 'True',
          explanation:
            '`and` é avaliado antes de `or`. Então vira `(True and False) or True` → `False or True` → `True`. Na dúvida, use parênteses: eles deixam a intenção explícita para quem lê.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
  ],
};
