import type { Module } from '@/types/content';

/** Modulo 5 - Listas (criar, alterar, percorrer e resumir colecoes). */
export const listas: Module = {
  id: 'py-listas',
  languageId: 'python',
  title: 'Listas',
  description: 'Guardar muitos valores num nome só — e trabalhar com todos eles de uma vez.',
  icon: '📋',
  orderIndex: 5,
  lessons: [
    {
      id: 'py-lis-01',
      moduleId: 'py-listas',
      title: 'Vários valores, um nome',
      subtitle: 'Criar, acessar e contar',
      orderIndex: 1,
      content: `## O problema de uma variável por valor

Guardar três notas ainda dá para fazer com três variáveis:

~~~py
nota1 = 7.0
nota2 = 9.5
nota3 = 4.0
~~~

E trinta notas? E se você não souber quantas serão? A **lista** resolve isso: um nome só, guardando muitos valores em ordem.

~~~py
notas = [7.0, 9.5, 4.0]
print(notas)
~~~

~~~text
[7.0, 9.5, 4.0]
~~~

Colchetes \`[ ]\` criam a lista; as vírgulas separam os itens.

## Cada item tem uma posição

A posição chama-se **índice**, e a contagem começa em **zero** — não em um:

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print(linguagens[0])
print(linguagens[2])
~~~

~~~text
Python
Java
~~~

| Item | \`"Python"\` | \`"JavaScript"\` | \`"Java"\` |
| --- | --- | --- | --- |
| Índice | 0 | 1 | 2 |

Começar em zero parece estranho por uns dias e depois vira natural. Java, JavaScript, C# e C++ fazem igual.

## Índice negativo: contando do fim

Este aqui o Python tem e a maioria das linguagens não:

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print(linguagens[-1])
~~~

~~~text
Java
~~~

\`-1\` é o último, \`-2\` o penúltimo. É bem mais legível que \`linguagens[len(linguagens) - 1]\`.

## Quantos itens tem?

\`len()\` responde — a mesma função que conta letras de um texto:

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print(len(linguagens))
~~~

~~~text
3
~~~

> Cuidado com o índice que não existe: numa lista de 3 itens, o último índice válido é 2. Pedir \`linguagens[3]\` levanta \`IndexError: list index out of range\`.`,
      polyglot: [
        { language: 'Python', code: 'notas = [7, 9, 4]\nprint(notas[0])\nprint(len(notas))' },
        {
          language: 'JavaScript',
          code: 'const notas = [7, 9, 4];\nconsole.log(notas[0]);\nconsole.log(notas.length);',
        },
        {
          language: 'Java',
          code: 'int[] notas = {7, 9, 4};\nSystem.out.println(notas[0]);\nSystem.out.println(notas.length);',
        },
      ],
      exercises: [
        {
          id: 'py-lis-01-e1',
          lessonId: 'py-lis-01',
          prompt:
            'Crie uma lista chamada `cores` com `azul`, `verde` e `roxo`, nessa ordem, e mostre o **primeiro** e o **último** item, um por linha.\n\nSaída esperada:\n\n~~~text\nazul\nroxo\n~~~',
          starterCode: '# crie a lista cores e mostre o primeiro e o último item\n',
          validationType: 'output_match',
          expectedAnswer: 'azul\nroxo',
          hint: 'cores[0] é o primeiro. Para o último, cores[-1] evita ter de contar.',
          explanation:
            'O índice `0` é o primeiro item e `-1` é o último — sem precisar saber o tamanho da lista.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'py-lis-01-e2',
          lessonId: 'py-lis-01',
          prompt:
            'A lista `compras` já existe. Mostre quantos itens ela tem.\n\nSaída esperada:\n\n~~~text\n4\n~~~',
          starterCode: 'compras = ["arroz", "feijão", "café", "sal"]\n\n# mostre a quantidade de itens\n',
          validationType: 'output_match',
          expectedAnswer: '4',
          hint: 'len(compras) devolve a quantidade — deixe o Python contar por você.',
          explanation:
            '`len()` conta os itens da lista. Escrever `print(4)` daria a mesma saída hoje e a saída errada assim que a lista mudasse.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-lis-02',
      moduleId: 'py-listas',
      title: 'Listas mudam',
      subtitle: 'append, remove e alterar por índice',
      orderIndex: 2,
      content: `## Diferente de um número

Quando você faz \`idade = 25\` e depois \`idade = 26\`, o valor antigo simplesmente some. Uma lista é diferente: ela pode **crescer, encolher e mudar por dentro**, continuando a ser a mesma lista.

## Acrescentar no fim: append()

~~~py
tarefas = ["estudar"]
tarefas.append("treinar")
print(tarefas)
~~~

~~~text
['estudar', 'treinar']
~~~

Repare na forma: \`tarefas.append(...)\`. O ponto quer dizer "peça isto **à lista**". É um **método** — uma função que pertence a um valor.

> \`append()\` não devolve a lista nova, ele altera a que já existe. Por isso \`lista = lista.append(x)\` é um erro clássico: você acaba com \`None\` no lugar da lista.

## Trocar um item

Basta atribuir na posição:

~~~py
tarefas = ["estudar", "treinar"]
tarefas[0] = "dormir"
print(tarefas)
~~~

~~~text
['dormir', 'treinar']
~~~

## Remover

Duas formas, com propósitos diferentes:

~~~py
tarefas = ["dormir", "treinar", "ler"]
tarefas.remove("treinar")
print(tarefas)

ultimo = tarefas.pop()
print(ultimo)
print(tarefas)
~~~

~~~text
['dormir', 'ler']
ler
['dormir']
~~~

| Método | O que faz |
| --- | --- |
| \`append(x)\` | põe \`x\` no fim |
| \`remove(x)\` | tira a **primeira** ocorrência do valor \`x\` |
| \`pop()\` | tira o último item **e devolve ele** |
| \`insert(i, x)\` | põe \`x\` na posição \`i\` |

Use \`remove()\` quando souber o **valor**; \`pop()\` quando quiser o item de volta.`,
      exercises: [
        {
          id: 'py-lis-02-e1',
          lessonId: 'py-lis-02',
          prompt:
            'A lista `time` já tem três nomes. Acrescente `Kauan` ao final e mostre a lista.\n\nSaída esperada:\n\n~~~text\n[\'Ana\', \'Luiz\', \'Davi\', \'Kauan\']\n~~~',
          starterCode: 'time = ["Ana", "Luiz", "Davi"]\n\n# acrescente Kauan e mostre a lista\n',
          validationType: 'output_match',
          expectedAnswer: "['Ana', 'Luiz', 'Davi', 'Kauan']",
          hint: 'time.append("Kauan") altera a lista; depois basta um print(time).',
          explanation:
            '`append()` acrescenta no fim e não devolve nada — ele mexe na lista que já existe. Por isso o `print()` vem depois, em outra linha.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'py-lis-02-e2',
          lessonId: 'py-lis-02',
          prompt:
            'Na lista `fila`, troque o primeiro item por `Bruna`, remova `Carlos` e mostre a lista final.\n\nSaída esperada:\n\n~~~text\n[\'Bruna\', \'Dora\']\n~~~',
          starterCode: 'fila = ["Alan", "Carlos", "Dora"]\n\n# troque o primeiro por Bruna, remova Carlos e mostre\n',
          validationType: 'output_match',
          expectedAnswer: "['Bruna', 'Dora']",
          hint: 'fila[0] = "Bruna" troca por posição; fila.remove("Carlos") tira pelo valor.',
          explanation:
            'Atribuir em `fila[0]` troca o item daquela posição. `remove()` procura pelo **valor** e tira a primeira ocorrência dele.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-lis-03',
      moduleId: 'py-listas',
      title: 'Percorrer a lista',
      subtitle: 'for direto nos itens, in e fatias',
      orderIndex: 3,
      content: `## O for que você já conhece, melhor

No módulo anterior o \`for\` andava sobre números do \`range()\`. Ele também anda **direto sobre os itens** de uma lista:

~~~py
linguagens = ["Python", "JavaScript", "Java"]

for linguagem in linguagens:
    print(linguagem)
~~~

~~~text
Python
JavaScript
Java
~~~

Sem índice, sem \`len()\`, sem risco de errar o limite. Este é o jeito Python de percorrer uma lista — e é o que se espera de você numa revisão de código.

> Precisa da posição junto com o valor? \`for i, item in enumerate(lista):\` entrega os dois.

## Está na lista? O operador in

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print("Java" in linguagens)
print("Rust" in linguagens)
~~~

~~~text
True
False
~~~

\`in\` devolve \`True\` ou \`False\` — combina naturalmente com o \`if\` do módulo de condicionais.

## Fatias: pedaços da lista

\`lista[inicio:fim]\` devolve uma **lista nova** com o pedaço pedido. Como no \`range()\`, o fim é exclusivo:

~~~py
numeros = [10, 20, 30, 40, 50]
print(numeros[1:3])
print(numeros[:2])
print(numeros[3:])
~~~

~~~text
[20, 30]
[10, 20]
[40, 50]
~~~

Omitir o início quer dizer "desde o começo"; omitir o fim, "até o final".`,
      polyglot: [
        { language: 'Python', code: 'for cor in cores:\n    print(cor)' },
        { language: 'JavaScript', code: 'for (const cor of cores) {\n  console.log(cor);\n}' },
        {
          language: 'Java',
          code: 'for (String cor : cores) {\n  System.out.println(cor);\n}',
        },
      ],
      exercises: [
        {
          id: 'py-lis-03-e1',
          lessonId: 'py-lis-03',
          prompt:
            'Percorra a lista `frutas` e mostre cada fruta em uma linha.\n\nSaída esperada:\n\n~~~text\nuva\npera\nmanga\n~~~',
          starterCode: 'frutas = ["uva", "pera", "manga"]\n\n# percorra a lista e mostre uma por linha\n',
          validationType: 'output_match',
          expectedAnswer: 'uva\npera\nmanga',
          hint: 'for fruta in frutas: — o for anda direto nos itens, sem índice.',
          explanation:
            'Percorrer direto nos itens é mais legível que usar índice, e não há como errar o limite da lista.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'py-lis-03-e2',
          lessonId: 'py-lis-03',
          prompt:
            'Percorra a lista `numeros` e mostre **apenas** os números maiores que 20, um por linha.\n\nSaída esperada:\n\n~~~text\n30\n45\n~~~',
          starterCode: 'numeros = [10, 30, 8, 45, 20]\n\n# mostre só os maiores que 20\n',
          validationType: 'output_match',
          expectedAnswer: '30\n45',
          hint: 'Um for percorrendo a lista, e dentro dele um if decidindo se mostra.',
          explanation:
            'O `if` dentro do `for` é a combinação mais comum em programação: percorrer tudo e agir só no que interessa. Repare que 20 não entra — a condição é **maior que** 20, não maior ou igual.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-lis-04',
      moduleId: 'py-listas',
      title: 'Resumir uma lista',
      subtitle: 'sum, max, min e ordenação',
      orderIndex: 4,
      content: `## O Python já sabe fazer as contas comuns

No módulo de repetições você somou números com um acumulador. Para uma lista, o Python já traz isso pronto:

~~~py
notas = [7.0, 9.5, 4.0, 8.5]

print(sum(notas))
print(max(notas))
print(min(notas))
print(len(notas))
~~~

~~~text
29.0
9.5
4.0
4
~~~

A média sai da combinação de duas delas:

~~~py
notas = [7.0, 9.5, 4.0, 8.5]
print(sum(notas) / len(notas))
~~~

~~~text
7.25
~~~

> Escrever o acumulador à mão continua valendo como aprendizado — mas em código de verdade, use \`sum()\`: é mais curto, mais rápido e não tem como errar.

## Ordenar

Há duas formas, e a diferença entre elas importa:

~~~py
notas = [7.0, 9.5, 4.0]

print(sorted(notas))
print(notas)

notas.sort()
print(notas)
~~~

~~~text
[4.0, 7.0, 9.5]
[7.0, 9.5, 4.0]
[4.0, 7.0, 9.5]
~~~

| Forma | O que faz com a lista original |
| --- | --- |
| \`sorted(lista)\` | não mexe — devolve uma **lista nova** ordenada |
| \`lista.sort()\` | ordena **a própria lista** e devolve \`None\` |

Para ordem decrescente, \`sorted(lista, reverse=True)\`.

## Juntar numa frase

\`join()\` cola os itens de uma lista de textos usando um separador:

~~~py
cores = ["azul", "verde", "roxo"]
print(", ".join(cores))
~~~

~~~text
azul, verde, roxo
~~~

Repare na ordem: quem faz o \`join\` é o **separador**, e a lista vai dentro dos parênteses.`,
      exercises: [
        {
          id: 'py-lis-04-e1',
          lessonId: 'py-lis-04',
          prompt:
            'Mostre a soma e a média da lista `valores`, nessa ordem.\n\nSaída esperada:\n\n~~~text\n40\n10.0\n~~~',
          starterCode: 'valores = [10, 5, 20, 5]\n\n# mostre a soma e depois a média\n',
          validationType: 'output_match',
          expectedAnswer: '40\n10.0',
          hint: 'sum(valores) soma; a média é sum(valores) / len(valores).',
          explanation:
            'A média sai da soma dividida pela quantidade. A divisão com `/` sempre devolve um número com casa decimal — por isso `10.0` e não `10`.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-lis-04-e2',
          lessonId: 'py-lis-04',
          prompt:
            'Mostre a lista `pontos` ordenada do menor para o maior, **sem alterar** a lista original — e depois a original, para provar que ela continua como estava.\n\nSaída esperada:\n\n~~~text\n[3, 7, 12]\n[7, 3, 12]\n~~~',
          starterCode: 'pontos = [7, 3, 12]\n\n# mostre a versão ordenada e depois a lista original\n',
          validationType: 'output_match',
          expectedAnswer: '[3, 7, 12]\n[7, 3, 12]',
          hint: 'sorted(pontos) devolve uma lista nova; pontos.sort() mudaria a original.',
          explanation:
            '`sorted()` devolve uma cópia ordenada e deixa a original intacta — que é exatamente o que o exercício pede. `pontos.sort()` teria alterado a lista e a segunda linha sairia ordenada também.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
  ],
};
