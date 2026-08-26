import type { Module } from '@/types/content';

/**
 * Modulo 3 - Condicionais (JavaScript).
 * Objetivo: fazer o programa escolher caminhos. Termina na licao de `===`,
 * que e o assunto onde o JavaScript mais se diferencia das outras linguagens.
 */
export const condicionais: Module = {
  id: 'js-condicionais',
  languageId: 'javascript',
  title: 'Condicionais',
  description:
    'Fazer o programa decidir: if, else, else if, switch e a diferença entre == e === que separa quem entende JavaScript de quem decora.',
  icon: '🔀',
  orderIndex: 3,
  lessons: [
    {
      id: 'js-cond-01',
      moduleId: 'js-condicionais',
      title: 'A primeira decisão',
      subtitle: 'if, parênteses e chaves',
      orderIndex: 1,
      content: `## Executar só às vezes

Até agora todas as linhas rodavam sempre. Com \`if\`, um trecho só roda **se** uma condição for verdadeira:

~~~js
const nota = 8;

if (nota >= 7) {
  console.log("Aprovado");
}
~~~

~~~text
Aprovado
~~~

Se \`nota\` fosse \`5\`, o programa simplesmente não mostraria nada e seguiria em frente.

## A anatomia da linha

~~~js
if (condição) {
  // o que acontece quando for verdadeira
}
~~~

Três exigências:

1. a condição vai entre **parênteses**;
2. o bloco vai entre **chaves**;
3. tudo que estiver dentro das chaves pertence ao \`if\`.

Em JavaScript **as chaves é que delimitam o bloco** — a indentação é só para humanos lerem. (Em Python é o contrário: lá a indentação é obrigatória e não existem chaves.) Ainda assim, indente: código sem indentação é legal para o computador e ilegível para você.

## Os operadores de comparação

| Operador | Significa | Exemplo verdadeiro |
| --- | --- | --- |
| \`>\` | maior que | \`10 > 5\` |
| \`<\` | menor que | \`3 < 7\` |
| \`>=\` | maior ou igual | \`7 >= 7\` |
| \`<=\` | menor ou igual | \`4 <= 9\` |
| \`===\` | igual a | \`5 === 5\` |
| \`!==\` | diferente de | \`5 !== 3\` |

## Um erro que quase todo mundo comete

~~~js
if (nota = 7) {   // ERRADO
if (nota === 7) { // certo
~~~

Um \`=\` **atribui**; três \`===\` **comparam**. Trocar um pelo outro não dá erro de sintaxe — o programa roda e faz a coisa errada em silêncio. Se um \`if\` seu está sempre entrando, confira isso primeiro.

## Uma condição é verdadeira ou falsa

Toda condição resulta em \`true\` ou \`false\`. Dá para ver isso:

~~~js
console.log(10 > 5);
console.log(10 === 5);
~~~

~~~text
true
false
~~~`,
      polyglot: [
        {
          language: 'JavaScript',
          code: 'if (nota >= 7) {\n  console.log("Aprovado");\n}',
        },
        { language: 'Python', code: 'if nota >= 7:\n    print("Aprovado")' },
        {
          language: 'Java',
          code: 'if (nota >= 7) {\n  System.out.println("Aprovado");\n}',
        },
      ],
      exercises: [
        {
          id: 'js-cond-01-e1',
          lessonId: 'js-cond-01',
          prompt: 'Em JavaScript, o que delimita o bloco de código de um `if`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'As chaves { }',
            'A indentação com espaços',
            'Os dois-pontos no fim da linha',
            'A palavra end',
          ],
          expectedAnswer: 'As chaves { }',
          explanation:
            'Em JavaScript quem define o bloco são as chaves `{ }`. A indentação não muda nada para o interpretador — mas continua sendo essencial para quem lê. Python usa indentação e Ruby usa `end`; é o mesmo conceito com sintaxes diferentes.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'js-cond-01-e2',
          lessonId: 'js-cond-01',
          prompt:
            'A variável `compra` já vale 150. Mostre `Tem desconto` **apenas se** a compra for maior que 100.\n\n~~~text\nTem desconto\n~~~',
          starterCode: 'const compra = 150;\n\n// escreva o if abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Tem desconto',
          hint: 'if (compra > 100) { ... } — a condição entre parênteses e o console.log() dentro das chaves.',
          explanation:
            'Como `150 > 100` é verdadeiro, o bloco roda. Troque o valor de `compra` para 50 e execute de novo: o programa não mostra nada, porque não existe um caminho alternativo — isso é assunto da próxima lição.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-cond-02',
      moduleId: 'js-condicionais',
      title: 'O caminho alternativo',
      subtitle: 'if / else',
      orderIndex: 2,
      content: `## Quando existem dois caminhos

O \`else\` cobre todos os casos em que a condição do \`if\` foi falsa:

~~~js
const idade = 20;

if (idade >= 18) {
  console.log("Maior de idade");
} else {
  console.log("Menor de idade");
}
~~~

~~~text
Maior de idade
~~~

Três garantias que o \`else\` te dá:

- **sempre** um dos dois blocos roda;
- **nunca** os dois rodam;
- o \`else\` não tem condição própria — ele é o "em todos os outros casos".

## O else anda colado

O \`else\` vem logo depois da chave que fecha o \`if\`, na mesma linha:

~~~js
if (condição) {
  // ...
} else {
  // ...
}
~~~

## Cuidado com o ponto e vírgula sobrando

~~~js
if (idade >= 18); {   // ERRADO
  console.log("Maior de idade");
}
~~~

Esse \`;\` depois do parêntese encerra o \`if\` ali mesmo. O bloco seguinte passa a rodar **sempre**, independentemente da condição — e o JavaScript não reclama. É outro erro silencioso para a sua coleção.

## Testando com dados reais

Junte com o que você aprendeu no módulo anterior:

~~~js
const idade = Number(prompt("Digite sua idade: "));

if (idade >= 18) {
  console.log("Maior de idade");
} else {
  console.log("Menor de idade");
}
~~~

Repare no \`Number()\`: sem ele a comparação seria entre **texto** e número, e o resultado ficaria imprevisível.`,
      exercises: [
        {
          id: 'js-cond-02-e1',
          lessonId: 'js-cond-02',
          prompt:
            'Pergunte a idade e classifique a pessoa. Com a entrada simulada `20`, a saída deve ser exatamente:\n\n~~~text\nDigite sua idade: Maior de idade\n~~~',
          starterCode: 'const idade = Number(prompt("Digite sua idade: "));\n\n// escreva o if / else abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Digite sua idade: Maior de idade',
          stdin: ['20'],
          hint: 'if (idade >= 18) { console.log("Maior de idade"); } else { console.log("Menor de idade"); }',
          explanation:
            'Como a pergunta do `prompt()` não pula linha, a resposta aparece logo em seguida, na mesma linha. Com `20`, a condição `idade >= 18` é verdadeira e só o primeiro bloco roda.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-cond-02-e2',
          lessonId: 'js-cond-02',
          prompt:
            'O **mesmo programa** da questão anterior, agora com a entrada simulada `15`. A saída deve ser:\n\n~~~text\nDigite sua idade: Menor de idade\n~~~',
          starterCode: 'const idade = Number(prompt("Digite sua idade: "));\n\n// escreva o if / else abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Digite sua idade: Menor de idade',
          stdin: ['15'],
          hint: 'É exatamente o mesmo código do exercício anterior — quem muda é só a entrada.',
          explanation:
            'O código é idêntico; só a entrada mudou. É assim que se testa um `if / else` de verdade: um valor para cada caminho. Um programa que você só testou com um caso é um programa meio testado.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-cond-03',
      moduleId: 'js-condicionais',
      title: 'Vários caminhos',
      subtitle: 'else if e switch',
      orderIndex: 3,
      content: `## Mais de duas possibilidades

Quando existem várias faixas, encadeie com \`else if\`:

~~~js
const temperatura = 25;

if (temperatura > 30) {
  console.log("Calor");
} else if (temperatura >= 15) {
  console.log("Ameno");
} else {
  console.log("Frio");
}
~~~

~~~text
Ameno
~~~

## A ordem é tudo

O JavaScript testa **de cima para baixo** e para no primeiro verdadeiro. Os demais nem são avaliados.

Por isso este código está errado:

~~~js
if (nota >= 5) {
  console.log("Recuperação");
} else if (nota >= 7) {   // nunca alcançado
  console.log("Aprovado");
}
~~~

Com \`nota = 9\`, a primeira condição já é verdadeira e o programa imprime "Recuperação". A regra prática: **do mais específico para o mais geral**, ou seja, das faixas mais altas para as mais baixas.

## switch: quando é igualdade exata

Quando você compara **a mesma variável** com **vários valores exatos**, o \`switch\` fica mais legível:

~~~js
const dia = 3;

switch (dia) {
  case 1:
    console.log("Domingo");
    break;
  case 2:
    console.log("Segunda");
    break;
  case 3:
    console.log("Terça");
    break;
  default:
    console.log("Dia inválido");
}
~~~

~~~text
Terça
~~~

O \`break\` **não é opcional**: sem ele a execução continua caindo nos casos seguintes (o chamado *fall-through*), e o programa mostra vários dias de uma vez. O \`default\` faz o papel do \`else\`.

> Use \`switch\` para igualdade exata contra uma lista de valores. Para faixas (\`>\`, \`<=\`), use \`else if\` — \`switch\` não sabe fazer isso.`,
      exercises: [
        {
          id: 'js-cond-03-e1',
          lessonId: 'js-cond-03',
          prompt:
            'A variável `temperatura` vale 12. Classifique em três faixas: acima de 30 é `Calor`, de 15 a 30 é `Ameno`, abaixo de 15 é `Frio`. A saída deve ser:\n\n~~~text\nFrio\n~~~',
          starterCode: 'const temperatura = 12;\n\n// escreva o if / else if / else abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Frio',
          hint: 'Comece pela faixa mais alta: if (temperatura > 30) ... else if (temperatura >= 15) ... else ...',
          explanation:
            'Com 12, as duas primeiras condições falham e o `else` assume. Começar pela faixa mais alta é o que garante que cada valor caia em um único caminho — testando de baixo para cima, a faixa larga engoliria as estreitas.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-cond-03-e2',
          lessonId: 'js-cond-03',
          prompt:
            'O que acontece em um `switch` se você esquecer o `break` no fim de um `case` que foi escolhido?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'A execução continua nos cases seguintes',
            'O programa para com um erro de sintaxe',
            'Nada: o break é opcional',
            'O switch volta para o primeiro case',
          ],
          expectedAnswer: 'A execução continua nos cases seguintes',
          explanation:
            'Isso se chama *fall-through*: sem o `break`, o JavaScript segue executando os `case` de baixo, mesmo sem eles baterem com o valor. É a origem de bugs em que "aparecem coisas demais" na tela.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-cond-04',
      moduleId: 'js-condicionais',
      title: 'Combinando condições',
      subtitle: '&&, ||, ! e o famoso === ',
      orderIndex: 4,
      content: `## Duas condições ao mesmo tempo

- \`&&\` (**E**) — verdadeiro quando **as duas** condições são verdadeiras.
- \`||\` (**OU**) — verdadeiro quando **pelo menos uma** é verdadeira.
- \`!\` (**NÃO**) — inverte o valor: \`!true\` vira \`false\`.

~~~js
const idade = 22;
const temHabilitacao = true;

if (idade >= 18 && temHabilitacao) {
  console.log("Pode dirigir");
} else {
  console.log("Não pode dirigir");
}
~~~

~~~text
Pode dirigir
~~~

Basta uma das duas falhar para o \`&&\` inteiro virar falso.

## == e ===: a diferença que define o JavaScript

Esta é a lição mais importante do módulo.

~~~js
console.log("5" == 5);
console.log("5" === 5);
~~~

~~~text
true
false
~~~

- \`==\` compara **depois de converter** os tipos. Ele vê o texto \`"5"\`, converte para número e conclui que são iguais.
- \`===\` compara **valor e tipo**. Texto nunca é igual a número, então dá \`false\`.

O \`==\` parece amigável, mas produz resultados que ninguém consegue prever de cabeça:

~~~js
console.log(0 == "");      // true
console.log(null == undefined); // true
console.log("0" == false); // true
~~~

> **Regra deste curso, sem exceção: use sempre \`===\` e \`!==\`.** Se você precisa comparar tipos diferentes, converta explicitamente com \`Number()\` — assim a intenção fica escrita no código, em vez de escondida numa regra de conversão automática.

## Truthy e falsy

Um \`if\` aceita qualquer valor, não só \`true\` e \`false\`. Quando o valor não é booleano, o JavaScript pergunta se ele é **falsy**. São exatamente oito:

\`false\`, \`0\`, \`-0\`, \`0n\`, \`""\` (texto vazio), \`null\`, \`undefined\` e \`NaN\`.

**Todo o resto é truthy** — incluindo \`"0"\`, \`"false"\`, \`[]\` e \`{}\`, que enganam bastante.

Na prática isso é muito útil:

~~~js
const nome = "";

if (nome) {
  console.log(\`Olá, \${nome}\`);
} else {
  console.log("Nome não informado");
}
~~~

~~~text
Nome não informado
~~~

Texto vazio é falsy, então o \`else\` assume — sem precisar escrever \`nome !== ""\`.`,
      exercises: [
        {
          id: 'js-cond-04-e1',
          lessonId: 'js-cond-04',
          prompt:
            'Só pode dirigir quem tem 18 anos **ou mais** **e** possui habilitação. Com `idade` valendo 22 e `temHabilitacao` valendo `false`, a saída deve ser:\n\n~~~text\nNão pode dirigir\n~~~',
          starterCode:
            'const idade = 22;\nconst temHabilitacao = false;\n\n// escreva o if / else abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Não pode dirigir',
          hint: 'A condição junta as duas exigências: idade >= 18 && temHabilitacao',
          explanation:
            'A idade passa, mas a habilitação não — e no `&&` basta um lado falhar para tudo virar falso. Repare que `temHabilitacao` já é booleano, então não precisa de `=== true`: escrever `if (temHabilitacao)` é mais direto e mais legível.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-cond-04-e2',
          lessonId: 'js-cond-04',
          prompt: 'O que este código mostra?\n\n~~~js\nconsole.log("5" === 5);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['false', 'true', 'undefined', 'Um erro de tipo'],
          expectedAnswer: 'false',
          explanation:
            'O `===` compara **valor e tipo**. `"5"` é string e `5` é number, então o resultado é `false`. Com `==` daria `true`, porque ele converte antes de comparar — e é justamente essa conversão invisível que torna o `==` perigoso.',
          xpReward: 25,
          orderIndex: 2,
        },
        {
          id: 'js-cond-04-e3',
          lessonId: 'js-cond-04',
          prompt: 'Qual destes valores é **truthy** (ou seja, faz o `if` entrar)?',
          starterCode: null,
          validationType: 'multiple_choice',
          // As alternativas sao descritas por extenso de proposito: a correcao
          // tira as aspas das pontas antes de comparar, entao `"0"` e `0`
          // seriam a MESMA resposta - e as duas dariam certo.
          options: ['O texto "0"', 'O número 0', 'O texto vazio', 'NaN'],
          expectedAnswer: 'O texto "0"',
          explanation:
            'O texto `"0"` não está vazio, então é truthy — mesmo parecendo o número zero. Já `0`, `""` e `NaN` estão na lista dos oito valores falsy. É por isso que checar entrada de usuário com `if (valor)` engana: o texto `"0"` passa.',
          xpReward: 25,
          orderIndex: 3,
        },
      ],
    },
  ],
};
