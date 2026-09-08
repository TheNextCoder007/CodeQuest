import type { Module } from '@/types/content';

/** Modulo 5 - Arrays e ArrayList: guardar, percorrer e resumir colecoes. */
export const listas: Module = {
  id: 'java-listas',
  languageId: 'java',
  title: 'Listas',
  description: 'Array de tamanho fixo, ArrayList que cresce — e quando usar cada um.',
  icon: '📋',
  orderIndex: 5,
  lessons: [
    {
      id: 'ja-lis-01',
      moduleId: 'java-listas',
      title: 'Array',
      subtitle: 'Tamanho fixo, decidido na criação',
      orderIndex: 1,
      content: `## Declarando

~~~java
int[] notas = {7, 9, 4, 8};
System.out.println(notas[0]);
System.out.println(notas.length);
~~~

~~~text
7
4
~~~

Os colchetes vêm **no tipo**: \`int[]\` se lê "array de int". Como todo o resto em Java, um array tem um tipo só — \`int[]\` guarda inteiros e nada mais.

## Criando vazio

~~~java
String[] nomes = new String[3];
nomes[0] = "Ana";
System.out.println(nomes[1]);
~~~

~~~text
null
~~~

\`new String[3]\` reserva três posições já preenchidas com o valor padrão do tipo: \`0\` para números, \`false\` para booleanos e \`null\` para objetos.

> Aquele \`null\` é a origem mais comum de \`NullPointerException\`: você criou o array, esqueceu de preencher uma posição, e chamou um método nela.

## O tamanho não muda

~~~java
int[] notas = new int[4];
~~~

São quatro posições para sempre. Precisar de uma quinta significa criar outro array e copiar — e é exatamente esse incômodo que o \`ArrayList\` da próxima lição resolve.

| | Array | ArrayList |
| --- | --- | --- |
| Tamanho | fixo | cresce e encolhe |
| Tipos primitivos | aceita (\`int[]\`) | não (usa \`Integer\`) |
| Tamanho se lê com | \`.length\` | \`.size()\` |

## length sem parênteses

~~~java
notas.length      // array: campo, sem parênteses
texto.length()    // String: método, com parênteses
~~~

Uma inconsistência do próprio Java. Não há truque: é decorar.

> Os índices vão de \`0\` a \`length - 1\`. Pedir \`notas[4]\` num array de 4 posições lança \`ArrayIndexOutOfBoundsException\` — o erro que você viu no módulo de Fundamentos.`,
      polyglot: [
        { language: 'Java', code: 'int[] notas = {7, 9, 4};\nSystem.out.println(notas.length);' },
        { language: 'Python', code: 'notas = [7, 9, 4]\nprint(len(notas))' },
        { language: 'JavaScript', code: 'const notas = [7, 9, 4];\nconsole.log(notas.length);' },
      ],
      exercises: [
        {
          id: 'ja-lis-01-e1',
          lessonId: 'ja-lis-01',
          prompt:
            'Complete para obter a quantidade de posições de um array:\n\n~~~java\nint[] notas = {7, 9, 4, 8};\nint total = notas.______;\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'length',
          hint: 'Em array é um campo, não um método — então não leva parênteses.',
          explanation:
            'Array usa `length` sem parênteses; `String` usa `length()` com parênteses. É uma inconsistência do Java que não tem regra — só prática.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-lis-01-e2',
          lessonId: 'ja-lis-01',
          prompt:
            'O que `System.out.println(nomes[1]);` mostra?\n\n~~~java\nString[] nomes = new String[3];\nnomes[0] = "Ana";\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['null', '""', 'Ana', 'ArrayIndexOutOfBoundsException'],
          expectedAnswer: 'null',
          explanation:
            'O array foi criado com 3 posições e só a primeira foi preenchida. Posições de objeto começam em `null` — daí vem boa parte dos `NullPointerException` do mundo real.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-lis-02',
      moduleId: 'java-listas',
      title: 'ArrayList',
      subtitle: 'A lista que cresce',
      orderIndex: 2,
      content: `## Criando

~~~java
import java.util.ArrayList;

ArrayList<String> tarefas = new ArrayList<>();
tarefas.add("estudar");
tarefas.add("treinar");

System.out.println(tarefas);
System.out.println(tarefas.size());
~~~

~~~text
[estudar, treinar]
2
~~~

O \`<String>\` entre os sinais de menor e maior é o **tipo genérico**: diz o que a lista guarda. Com ele, o compilador impede que um número entre numa lista de textos.

O \`<>\` vazio do lado direito é o *diamond operator*: o Java deduz o tipo do lado esquerdo, e você não precisa repetir.

## Os métodos principais

| Método | Faz |
| --- | --- |
| \`add(x)\` | acrescenta no fim |
| \`get(i)\` | devolve o item da posição \`i\` |
| \`set(i, x)\` | troca o item da posição \`i\` |
| \`remove(i)\` | remove pela **posição** |
| \`size()\` | quantidade de itens |
| \`contains(x)\` | \`true\` se contém |
| \`isEmpty()\` | \`true\` se está vazia |

~~~java
tarefas.set(0, "dormir");
tarefas.remove(1);
System.out.println(tarefas);
~~~

~~~text
[dormir]
~~~

## Colchete não funciona aqui

~~~java
tarefas[0]
~~~

~~~text
error: array required, but ArrayList found
~~~

Colchetes são só para array. Em \`ArrayList\` é \`get(0)\`.

## Primitivo não entra

~~~java
ArrayList<int> numeros = new ArrayList<>();
~~~

Não compila. Genéricos só aceitam objetos, então use \`Integer\`, \`Double\`, \`Boolean\` — as versões "objeto" dos primitivos:

~~~java
ArrayList<Integer> numeros = new ArrayList<>();
numeros.add(10);
~~~

> Repare que \`numeros.add(10)\` funciona mesmo com \`10\` sendo um \`int\`: o Java converte sozinho para \`Integer\`. Isso se chama *autoboxing*.

## A ambiguidade do remove

Numa \`ArrayList<Integer>\`, \`remove(1)\` remove **a posição 1**, não o número 1. Para remover pelo valor, \`remove(Integer.valueOf(1))\`.`,
      exercises: [
        {
          id: 'ja-lis-02-e1',
          lessonId: 'ja-lis-02',
          prompt:
            'Complete para acrescentar um item ao fim da lista:\n\n~~~java\nArrayList<String> tarefas = new ArrayList<>();\ntarefas.______("estudar");\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'add',
          hint: 'É o método de acrescentar — o mesmo nome usado em quase toda coleção do Java.',
          explanation:
            '`add()` acrescenta no fim e faz a lista crescer. É justamente isso que um array não consegue: o tamanho dele é fixo desde a criação.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-lis-02-e2',
          lessonId: 'ja-lis-02',
          prompt: 'Por que `ArrayList<int>` não compila?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Genéricos só aceitam objetos; para inteiros use ArrayList<Integer>',
            'ArrayList só guarda texto',
            'Falta importar java.util.int',
            'O tipo genérico precisa vir depois do nome da variável',
          ],
          expectedAnswer:
            'Genéricos só aceitam objetos; para inteiros use ArrayList<Integer>',
          explanation:
            '`int` é primitivo e não pode ser tipo genérico. `Integer` é a versão objeto dele. Na prática o Java converte sozinho entre os dois (*autoboxing*), então `numeros.add(10)` funciona normalmente.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-lis-03',
      moduleId: 'java-listas',
      title: 'Percorrer',
      subtitle: 'O for-each',
      orderIndex: 3,
      content: `## Com índice

~~~java
String[] linguagens = {"Java", "Python", "C++"};

for (int i = 0; i < linguagens.length; i++) {
    System.out.println(linguagens[i]);
}
~~~

~~~text
Java
Python
C++
~~~

Funciona, mas você tem de acertar o \`0\`, o \`<\` e o \`length\`. Errar qualquer um vira \`ArrayIndexOutOfBoundsException\`.

## O for-each

~~~java
for (String linguagem : linguagens) {
    System.out.println(linguagem);
}
~~~

Lê-se "para cada \`String linguagem\` **em** \`linguagens\`". Os dois-pontos fazem o papel do \`in\` do Python.

Sem índice, sem \`length\`, sem como errar o limite. Quando você não precisa da posição, é a forma preferida — e é o que se espera de você numa revisão de código.

| Precisa de... | Use |
| --- | --- |
| só o valor | \`for (Tipo x : colecao)\` |
| a posição também | \`for (int i = 0; ...)\` |
| remover durante o percurso | \`Iterator\` |

## Funciona igual no ArrayList

~~~java
ArrayList<String> tarefas = new ArrayList<>();
tarefas.add("estudar");
tarefas.add("treinar");

for (String tarefa : tarefas) {
    System.out.println(tarefa);
}
~~~

~~~text
estudar
treinar
~~~

## Não dá para alterar por ali

~~~java
for (String tarefa : tarefas) {
    tarefa = tarefa.toUpperCase();
}
~~~

A lista não muda. A variável do for-each é uma **cópia da referência**: reatribuí-la não mexe na coleção. Para alterar, use índice e \`set()\`.

> E remover itens durante um for-each lança \`ConcurrentModificationException\`. A coleção percebe que mudou de tamanho no meio do percurso e interrompe — de propósito, porque o resultado seria imprevisível.`,
      polyglot: [
        { language: 'Java', code: 'for (String cor : cores) {\n    System.out.println(cor);\n}' },
        { language: 'Python', code: 'for cor in cores:\n    print(cor)' },
        { language: 'JavaScript', code: 'for (const cor of cores) {\n  console.log(cor);\n}' },
      ],
      exercises: [
        {
          id: 'ja-lis-03-e1',
          lessonId: 'ja-lis-03',
          prompt:
            'Complete o for-each que percorre a lista:\n\n~~~java\nfor (String fruta ______ frutas) {\n    System.out.println(fruta);\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: ':|dois pontos',
          hint: 'Um único caractere de pontuação — o que faz o papel do `in` do Python.',
          explanation:
            'O for-each usa dois-pontos: `for (Tipo variavel : colecao)`. Escrever `in` ali é um reflexo de quem vem do Python, e não compila.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-lis-03-e2',
          lessonId: 'ja-lis-03',
          prompt:
            'O que acontece ao remover itens de uma lista **durante** um for-each sobre ela?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O programa lança ConcurrentModificationException',
            'A lista é percorrida normalmente e os itens somem',
            'Erro de compilação',
            'O for-each recomeça do zero',
          ],
          expectedAnswer: 'O programa lança ConcurrentModificationException',
          explanation:
            'A coleção detecta que mudou de tamanho no meio do percurso e interrompe de propósito — continuar daria um resultado imprevisível. Para remover enquanto percorre, use um `Iterator` e o `remove()` dele.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-lis-04',
      moduleId: 'java-listas',
      title: 'Resumir e ordenar',
      subtitle: 'Somar, achar o maior, ordenar',
      orderIndex: 4,
      content: `## Somar e tirar a média

Java não tem um \`sum()\` pronto para array como o Python. O caminho é o acumulador do módulo anterior:

~~~java
int[] valores = {10, 5, 20, 5};
int soma = 0;

for (int valor : valores) {
    soma += valor;
}

System.out.println(soma);
System.out.println((double) soma / valores.length);
~~~

~~~text
40
10.0
~~~

Repare no \`(double)\` antes da divisão: sem ele, \`soma / valores.length\` seria divisão entre inteiros e a média sairia truncada.

## Maior e menor

\`Math.max\` e \`Math.min\` comparam **dois** valores, então continuam servindo dentro do laço:

~~~java
int maior = valores[0];
for (int valor : valores) {
    maior = Math.max(maior, valor);
}
System.out.println(maior);
~~~

~~~text
20
~~~

## Ordenar

~~~java
import java.util.Arrays;

int[] pontos = {7, 3, 12};
Arrays.sort(pontos);
System.out.println(Arrays.toString(pontos));
~~~

~~~text
[3, 7, 12]
~~~

Duas coisas importantes aqui:

- \`Arrays.sort\` ordena **o próprio array**, no lugar. Não existe cópia: a ordem original se perde.
- \`System.out.println(pontos)\` sozinho não mostra o conteúdo — imprime algo como \`[I@1b6d3586\`, que é o tipo e o endereço. Para ver os valores, \`Arrays.toString(pontos)\`.

| Coleção | Ordenar | Imprimir |
| --- | --- | --- |
| array | \`Arrays.sort(a)\` | \`Arrays.toString(a)\` |
| ArrayList | \`Collections.sort(lista)\` | \`System.out.println(lista)\` |

\`ArrayList\` já imprime bonito sozinho, porque tem um \`toString()\` próprio. Array não tem — ele herda o padrão de \`Object\`.

> Precisa manter a ordem original? Copie antes: \`int[] copia = Arrays.copyOf(pontos, pontos.length);\` e ordene a cópia.`,
      exercises: [
        {
          id: 'ja-lis-04-e1',
          lessonId: 'ja-lis-04',
          prompt:
            'Por que `System.out.println(pontos);` não mostra os números de um `int[]`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Array não tem toString() próprio, então imprime tipo e endereço de memória',
            'Arrays só podem ser impressos dentro de um laço',
            'Falta importar java.util.Arrays',
            'Porque o array ainda não foi ordenado',
          ],
          expectedAnswer:
            'Array não tem toString() próprio, então imprime tipo e endereço de memória',
          explanation:
            'A saída fica parecida com `[I@1b6d3586`. `Arrays.toString(pontos)` resolve. Um `ArrayList`, ao contrário, tem `toString()` próprio e imprime o conteúdo direto.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-lis-04-e2',
          lessonId: 'ja-lis-04',
          prompt:
            'Complete para ordenar o array em ordem crescente:\n\n~~~java\nimport java.util.Arrays;\n\nint[] pontos = {7, 3, 12};\n______(pontos);\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'Arrays.sort',
          hint: 'Método da classe utilitária `Arrays`, importada acima.',
          explanation:
            '`Arrays.sort` ordena o próprio array, no lugar — a ordem original se perde. Para uma `ArrayList` o equivalente é `Collections.sort(lista)`.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
  ],
};
