import type { Module } from '@/types/content';

/**
 * Modulo 4 - Repeticoes (JavaScript).
 * Objetivo: sair do modulo sabendo escolher entre `for`, `while` e `for...of`
 * - e sabendo diagnosticar um laco que nunca termina.
 */
export const repeticoes: Module = {
  id: 'js-repeticoes',
  languageId: 'javascript',
  title: 'Repetições',
  description:
    'Fazer o computador repetir sem você reescrever: for, while, acumuladores e a travessia de listas com for...of.',
  icon: '🔁',
  orderIndex: 4,
  lessons: [
    {
      id: 'js-rep-01',
      moduleId: 'js-repeticoes',
      title: 'O laço for',
      subtitle: 'Quando você sabe quantas vezes',
      orderIndex: 1,
      content: `## Repetir sem copiar e colar

Para mostrar os números de 1 a 5, você poderia escrever cinco \`console.log()\`. Para 1 a 1000, não poderia. É para isso que existe o \`for\`:

~~~js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
~~~

~~~text
1
2
3
4
5
~~~

## As três partes dentro dos parênteses

~~~js
for (início; condição; passo) {
~~~

Elas são separadas por **ponto e vírgula** e cada uma tem um papel:

1. **início** — \`let i = 1\` roda **uma única vez**, antes de tudo;
2. **condição** — \`i <= 5\` é testada **antes de cada volta**. Enquanto for verdadeira, o bloco roda;
3. **passo** — \`i++\` roda **no fim de cada volta**.

Acompanhe a mecânica: começa com \`i\` valendo 1 → testa \`1 <= 5\` → mostra 1 → \`i\` vira 2 → testa de novo... até \`i\` virar 6, quando \`6 <= 5\` é falso e o laço termina.

## i++ e as outras formas de somar

\`i++\` é uma abreviação de \`i = i + 1\`. Existem três formas de escrever a mesma coisa, e você vai ver todas:

~~~js
i = i + 1;
i += 1;
i++;
~~~

Para somar de 2 em 2, use \`i += 2\`. Para contar de trás para frente, \`i--\`.

## Contando de trás para frente

~~~js
for (let i = 3; i >= 1; i--) {
  console.log(i);
}
~~~

~~~text
3
2
1
~~~

## Por que let e não var

Escreva sempre \`let i\` no início do \`for\`. Com \`let\`, a variável **só existe dentro do laço** e cada volta tem a sua própria cópia — o que evita uma classe inteira de bugs que o \`var\` causa. A lição de **escopo**, no módulo de Funções, mostra o problema em detalhe.`,
      polyglot: [
        {
          language: 'JavaScript',
          code: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
        },
        { language: 'Python', code: 'for i in range(1, 6):\n    print(i)' },
        {
          language: 'Java',
          code: 'for (int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}',
        },
      ],
      exercises: [
        {
          id: 'js-rep-01-e1',
          lessonId: 'js-rep-01',
          prompt:
            'Mostre os números de 1 a 5, um por linha:\n\n~~~text\n1\n2\n3\n4\n5\n~~~',
          starterCode: '// escreva o for abaixo\n',
          validationType: 'output_match',
          expectedAnswer: '1\n2\n3\n4\n5',
          hint: 'for (let i = 1; i <= 5; i++) { console.log(i); }',
          explanation:
            'A condição é `i <= 5` (menor **ou igual**). Com `i < 5` o laço pararia no 4 — esse deslize de um número a mais ou a menos é tão comum que tem nome: *erro de um*.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-rep-01-e2',
          lessonId: 'js-rep-01',
          prompt:
            'No `for` abaixo, quantas vezes a parte `let i = 0` é executada?\n\n~~~js\nfor (let i = 0; i < 10; i++) {\n  console.log(i);\n}\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['1 vez', '10 vezes', '11 vezes', 'Nenhuma vez'],
          expectedAnswer: '1 vez',
          explanation:
            'A inicialização roda **uma única vez**, antes da primeira volta. Quem roda a cada volta é a condição (11 vezes, contando a que falha) e o passo (10 vezes).',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-rep-02',
      moduleId: 'js-repeticoes',
      title: 'O laço while',
      subtitle: 'Quando você não sabe quantas vezes',
      orderIndex: 2,
      content: `## Repetir enquanto algo for verdade

O \`while\` repete **enquanto** a condição for verdadeira. Use quando o número de voltas não é conhecido de antemão:

~~~js
let contador = 3;

while (contador >= 1) {
  console.log(contador);
  contador--;
}

console.log("Fim");
~~~

~~~text
3
2
1
Fim
~~~

## As três peças que não podem faltar

Todo \`while\` correto tem:

1. uma variável **iniciada antes** do laço;
2. uma **condição** que depende dela;
3. uma **atualização** dessa variável dentro do bloco.

Esquecer a terceira é o erro clássico:

~~~js
let contador = 3;

while (contador >= 1) {
  console.log(contador);
  // faltou contador--
}
~~~

\`contador\` fica valendo 3 para sempre, a condição nunca fica falsa e o programa não para. Isso se chama **laço infinito**.

> No CodeQuest você pode testar sem medo: o código roda em um espaço separado do resto do aplicativo e é interrompido automaticamente depois de 4 segundos. Fora daqui, um laço infinito trava a página inteira.

## Como escolher entre for e while

| Situação | Use |
| --- | --- |
| "repita 10 vezes" | \`for\` |
| "para cada item da lista" | \`for...of\` |
| "até a pessoa digitar sair" | \`while\` |
| "enquanto houver saldo" | \`while\` |

A regra curta: **número de voltas conhecido → \`for\`; condição aberta → \`while\`**.

## do...while: pelo menos uma vez

Existe uma variação que testa a condição **no fim**, garantindo ao menos uma execução:

~~~js
let tentativas = 0;

do {
  console.log("rodou pelo menos uma vez");
  tentativas++;
} while (tentativas < 1);
~~~

É bem menos comum, mas útil em menus — onde você precisa mostrar as opções antes de perguntar se a pessoa quer sair.`,
      exercises: [
        {
          id: 'js-rep-02-e1',
          lessonId: 'js-rep-02',
          prompt:
            'Usando `while`, faça uma contagem regressiva de 3 até 1 e depois mostre `Fim`:\n\n~~~text\n3\n2\n1\nFim\n~~~',
          starterCode: 'let contador = 3;\n\n// escreva o while abaixo\n',
          validationType: 'output_match',
          expectedAnswer: '3\n2\n1\nFim',
          hint: 'Dentro do while: mostre o contador e depois diminua com contador--. O console.log("Fim") fica FORA das chaves.',
          explanation:
            'O `contador--` é o que faz o laço terminar. E repare onde fica o `console.log("Fim")`: fora das chaves, para rodar uma vez só, depois que o laço acabar. Dentro, ele apareceria três vezes.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-rep-02-e2',
          lessonId: 'js-rep-02',
          prompt: 'O que faz um `while` virar um laço infinito?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'A variável da condição nunca é atualizada dentro do laço',
            'Usar while em vez de for',
            'Colocar mais de uma instrução dentro das chaves',
            'Iniciar a variável com zero',
          ],
          expectedAnswer: 'A variável da condição nunca é atualizada dentro do laço',
          explanation:
            'Se nada dentro do bloco muda o valor testado na condição, ela continua verdadeira para sempre. Ao escrever um `while`, procure imediatamente a linha que aproxima a condição do fim — se ela não existe, o laço não termina.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-rep-03',
      moduleId: 'js-repeticoes',
      title: 'Acumuladores e contadores',
      subtitle: 'O padrão que aparece em todo lugar',
      orderIndex: 3,
      content: `## Guardar um resultado que cresce

Somar todos os números de 1 a 100 na mão é inviável. Com um **acumulador**, são quatro linhas:

~~~js
let soma = 0;

for (let i = 1; i <= 100; i++) {
  soma += i;
}

console.log(soma);
~~~

~~~text
5050
~~~

A ideia: uma variável começa em 0 **fora** do laço, e a cada volta recebe mais um pedaço. No fim, ela tem o total.

## O erro de declarar dentro

~~~js
for (let i = 1; i <= 100; i++) {
  let soma = 0;   // ERRADO
  soma += i;
}
~~~

Aqui \`soma\` é recriada do zero a cada volta e some no fim dela — o total nunca se forma. **Acumulador se declara fora do laço.** Sempre.

## Contador: quantas vezes aconteceu

Mesma ideia, mas somando 1 quando uma condição bate:

~~~js
let quantidade = 0;

for (let i = 1; i <= 20; i++) {
  if (i % 5 === 0) {
    quantidade++;
  }
}

console.log(quantidade);
~~~

~~~text
4
~~~

## O operador %

O \`%\` (módulo) devolve o **resto** da divisão, e é a ferramenta padrão para "é múltiplo de?":

~~~js
console.log(10 % 3);
console.log(10 % 5);
~~~

~~~text
1
0
~~~

Resto zero significa divisão exata. Daí saem os dois testes que você mais vai usar:

- \`numero % 2 === 0\` → é par;
- \`numero % 3 === 0\` → é múltiplo de 3.

## Os quatro passos, sempre iguais

1. crie a variável **antes** do laço;
2. inicie em \`0\` (soma/contagem) ou no primeiro elemento (maior/menor);
3. atualize **dentro** do laço;
4. use **depois** que ele terminar.`,
      exercises: [
        {
          id: 'js-rep-03-e1',
          lessonId: 'js-rep-03',
          prompt:
            'Some todos os números de 1 a 100 e mostre o total:\n\n~~~text\n5050\n~~~',
          starterCode: 'let soma = 0;\n\n// escreva o for abaixo e mostre a soma no final\n',
          validationType: 'output_match',
          expectedAnswer: '5050',
          hint: 'Dentro do laço: soma += i. Depois do laço (fora das chaves): console.log(soma).',
          explanation:
            'O acumulador `soma` vive fora do laço, recebe um pedaço por volta e só é mostrado no fim. Se o `console.log()` estivesse dentro das chaves, você veria 100 linhas em vez de uma.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'js-rep-03-e2',
          lessonId: 'js-rep-03',
          prompt:
            'Conte quantos números de 1 a 20 são múltiplos de 3 e mostre a quantidade:\n\n~~~text\n6\n~~~',
          starterCode: 'let quantidade = 0;\n\n// escreva o for e o if abaixo\n',
          validationType: 'output_match',
          expectedAnswer: '6',
          hint: 'Dentro do for, um if com numero % 3 === 0. Dentro do if, quantidade++.',
          explanation:
            'São 3, 6, 9, 12, 15 e 18 — seis números. O contador só sobe quando o resto da divisão por 3 é zero. Repare no `===`: comparar o resto com `0`, e não atribuir.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-rep-04',
      moduleId: 'js-repeticoes',
      title: 'Controlando o laço e percorrendo listas',
      subtitle: 'break, continue e for...of',
      orderIndex: 4,
      content: `## Sair antes da hora: break

\`break\` interrompe o laço na hora, sem terminar as voltas restantes:

~~~js
for (let i = 1; i <= 10; i++) {
  if (i === 4) {
    break;
  }
  console.log(i);
}
~~~

~~~text
1
2
3
~~~

É o que você usa ao **procurar** algo: assim que encontra, não há motivo para continuar.

## Pular uma volta: continue

\`continue\` abandona só a volta atual e segue para a próxima:

~~~js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }
  console.log(i);
}
~~~

~~~text
1
2
4
5
~~~

O 3 foi pulado, mas o laço continuou até o fim. **\`break\` sai do laço; \`continue\` sai da volta.**

## Listas: o array

Um **array** guarda vários valores em ordem, dentro de colchetes:

~~~js
const linguagens = ["Python", "JavaScript", "Java"];

console.log(linguagens[0]);
console.log(linguagens.length);
~~~

~~~text
Python
3
~~~

Duas coisas para gravar: a contagem **começa em 0** (por isso \`linguagens[0]\` é o primeiro) e \`.length\` diz quantos itens existem. Como o último índice é \`length - 1\`, o índice \`3\` desse array não existe — pedir por ele devolve \`undefined\`.

## for...of: percorrer sem pensar em índice

~~~js
const linguagens = ["Python", "JavaScript", "Java"];

for (const linguagem of linguagens) {
  console.log(linguagem);
}
~~~

~~~text
Python
JavaScript
Java
~~~

Não há \`i\`, não há \`length\`, não há como errar o limite. Quando você só precisa dos **valores**, \`for...of\` é a forma mais legível.

## Um aviso: for...in é outra coisa

~~~js
for (const i in linguagens) {
  console.log(i);
}
~~~

~~~text
0
1
2
~~~

\`for...in\` percorre os **índices** (e, em objetos, as chaves), não os valores. A troca de um pelo outro é um erro comum de quem está começando.

> Regra prática: **\`of\` para valores, \`in\` para chaves.** Em arrays, quase sempre você quer \`of\`.`,
      polyglot: [
        {
          language: 'JavaScript',
          code: 'for (const item of lista) {\n  console.log(item);\n}',
        },
        { language: 'Python', code: 'for item in lista:\n    print(item)' },
        {
          language: 'Java',
          code: 'for (String item : lista) {\n  System.out.println(item);\n}',
        },
      ],
      exercises: [
        {
          id: 'js-rep-04-e1',
          lessonId: 'js-rep-04',
          prompt:
            'Mostre os números de 1 a 10, **pulando o 7**:\n\n~~~text\n1\n2\n3\n4\n5\n6\n8\n9\n10\n~~~',
          starterCode: '// use continue para pular o 7\n',
          validationType: 'output_match',
          expectedAnswer: '1\n2\n3\n4\n5\n6\n8\n9\n10',
          hint: 'Dentro do for: if (i === 7) { continue; } antes do console.log(i).',
          explanation:
            'O `continue` precisa vir **antes** do `console.log()` — se viesse depois, o 7 já teria sido mostrado. Com `break` no lugar dele, a saída pararia no 6.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'js-rep-04-e2',
          lessonId: 'js-rep-04',
          prompt:
            'Percorra o array `linguagens` com `for...of` e mostre cada nome em uma linha:\n\n~~~text\nPython\nJavaScript\nJava\n~~~',
          starterCode: 'const linguagens = ["Python", "JavaScript", "Java"];\n\n// escreva o for...of abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Python\nJavaScript\nJava',
          hint: 'for (const linguagem of linguagens) { console.log(linguagem); }',
          explanation:
            'Com `for...of` você recebe direto o **valor** de cada posição, sem lidar com índices. Se tivesse usado `for...in`, a saída seria `0 1 2` — os índices, não os nomes.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
  ],
};
