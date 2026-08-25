import type { Module } from '@/types/content';

/**
 * Modulo 2 - Variaveis e tipos (JavaScript).
 * Objetivo: guardar valores com `let`/`const`, entender que `prompt` sempre
 * devolve texto e sair do modulo sabendo converter antes de fazer conta.
 */
export const variaveis: Module = {
  id: 'js-variaveis',
  languageId: 'javascript',
  title: 'Variáveis',
  description:
    'Guardar valores com let e const, os tipos do JavaScript e a conversão que evita o bug mais comum de quem começa.',
  icon: '📦',
  orderIndex: 2,
  lessons: [
    {
      id: 'js-var-01',
      moduleId: 'js-variaveis',
      title: 'let, const e o var que você vai encontrar por aí',
      subtitle: 'Três formas de declarar — e por que só duas importam',
      orderIndex: 1,
      content: `## Uma variável é uma caixa com etiqueta

Você guarda um valor, dá um nome a ele e passa a usar o nome:

~~~js
let pontos = 10;
console.log(pontos);
~~~

~~~text
10
~~~

O \`=\` aqui **não** é "igual" da matemática. Ele significa "guarde o valor da direita na variável da esquerda".

## let: muda quando precisar

~~~js
let pontos = 10;
pontos = 25;
console.log(pontos);
~~~

~~~text
25
~~~

Repare que \`let\` aparece **só na primeira vez**. Depois disso a variável já existe e você só atribui um valor novo.

## const: não muda mais

\`const\` é para valores que não devem ser trocados depois de definidos:

~~~js
const PI = 3.14;
PI = 3.15; // TypeError: Assignment to constant variable.
~~~

Isso não é uma limitação chata — é uma proteção. Se o valor não deveria mudar, o JavaScript avisa quando alguém tenta.

> **Regra prática deste curso:** comece sempre com \`const\`. Só troque para \`let\` quando você perceber que precisa mesmo reatribuir. Assim o próprio código documenta o que muda e o que não muda.

## E o var?

\`var\` é a forma antiga, de antes de 2015. Você vai encontrá-la em código mais velho e em vídeos antigos, e ela tem comportamentos que confundem (a lição de **escopo**, no módulo de Funções, mostra um deles). Reconheça quando vir — mas escreva \`let\` e \`const\`.

## Nomes que ajudam

| Bom | Ruim | Por quê |
| --- | --- | --- |
| \`quantidadeDeAlunos\` | \`q\` | o nome explica sozinho |
| \`precoFinal\` | \`x2\` | você entende daqui a um mês |
| \`estaLogado\` | \`flag\` | diz o que representa |

Em JavaScript o costume é o **camelCase**: primeira palavra minúscula, as seguintes com inicial maiúscula, sem espaços nem acentos.`,
      polyglot: [
        { language: 'JavaScript', code: 'let pontos = 10;\nconst nome = "Ana";' },
        { language: 'Python', code: 'pontos = 10\nnome = "Ana"' },
        { language: 'Java', code: 'int pontos = 10;\nfinal String nome = "Ana";' },
      ],
      exercises: [
        {
          id: 'js-var-01-e1',
          lessonId: 'js-var-01',
          prompt:
            'Crie uma variável chamada `nome` guardando o texto `Ana` e mostre o conteúdo dela. A saída deve ser:\n\n~~~text\nAna\n~~~',
          starterCode: '// declare a variável e mostre o valor\n',
          validationType: 'output_match',
          expectedAnswer: 'Ana',
          hint: 'Duas linhas: uma com const nome = "Ana"; e outra com console.log(nome);',
          explanation:
            'Dentro do `console.log()` vai o **nome da variável, sem aspas**. Com aspas (`console.log("nome")`) você mostraria a palavra "nome", e não o valor guardado nela.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'js-var-01-e2',
          lessonId: 'js-var-01',
          prompt:
            'O que acontece ao executar isto?\n\n~~~js\nconst limite = 100;\nlimite = 200;\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'TypeError: Assignment to constant variable.',
            'O valor muda para 200 normalmente',
            'ReferenceError: limite is not defined',
            'O programa mostra um aviso, mas continua com 100',
          ],
          expectedAnswer: 'TypeError: Assignment to constant variable.',
          explanation:
            'Uma variável declarada com `const` não aceita nova atribuição. O JavaScript interrompe o programa com um **TypeError** — que é justamente o ponto: se o valor não deveria mudar, o erro aparece na hora, e não como um comportamento estranho lá na frente.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-var-02',
      moduleId: 'js-variaveis',
      title: 'Tipos de valor',
      subtitle: 'string, number, boolean e o typeof',
      orderIndex: 2,
      content: `## Nem todo valor é da mesma natureza

Os três tipos que você vai usar o tempo todo:

| Tipo | O que guarda | Exemplo |
| --- | --- | --- |
| \`string\` | texto | \`"Ana"\`, \`'oi'\` |
| \`number\` | número | \`7\`, \`3.5\`, \`-2\` |
| \`boolean\` | verdadeiro ou falso | \`true\`, \`false\` |

E dois que representam "vazio", com uma diferença importante:

- \`undefined\` — a variável existe, mas **nunca recebeu valor**;
- \`null\` — alguém **colocou** o vazio ali, de propósito.

## Um detalhe: número é número

Ao contrário de outras linguagens, o JavaScript não separa inteiro de decimal. \`7\` e \`3.5\` são os dois \`number\`. Isso simplifica — e explica por que \`10 / 2\` mostra \`5\`, e não \`5.0\`.

## typeof: perguntando o tipo

~~~js
console.log(typeof "Ana");
console.log(typeof 7);
console.log(typeof true);
~~~

~~~text
string
number
boolean
~~~

## O + faz duas coisas diferentes

Esta é **a** confusão do JavaScript, e vale parar aqui:

~~~js
console.log(10 + 5);
console.log("10" + 5);
~~~

~~~text
15
105
~~~

Na primeira linha os dois lados são números, então o \`+\` **soma**. Na segunda, um dos lados é texto — e aí o \`+\` **junta** (concatena), transformando o \`5\` em \`"5"\`.

Não é um bug: é uma regra da linguagem. O problema é que ela é silenciosa, e um \`105\` inesperado costuma custar horas a quem não conhece a regra.

> Quando aparecer um resultado grudado em vez de somado, a primeira pergunta é sempre: **algum desses valores é texto?**`,
      exercises: [
        {
          id: 'js-var-02-e1',
          lessonId: 'js-var-02',
          prompt: 'O que `console.log(typeof "10");` mostra?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['string', 'number', 'text', 'undefined'],
          expectedAnswer: 'string',
          explanation:
            'O que está entre aspas é texto, mesmo parecendo número. `typeof "10"` é `string`; sem as aspas, `typeof 10` seria `number`.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'js-var-02-e2',
          lessonId: 'js-var-02',
          prompt:
            'Mostre, nesta ordem, o resultado de juntar o texto `"10"` com o número `5` e o resultado de somar os números `10` e `5`. A saída deve ser:\n\n~~~text\n105\n15\n~~~',
          starterCode: '// primeiro a concatenação, depois a soma\n',
          validationType: 'output_match',
          expectedAnswer: '105\n15',
          hint: 'Na primeira linha, um dos valores precisa estar entre aspas: console.log("10" + 5);',
          explanation:
            'Com `"10" + 5` o JavaScript trata tudo como texto e devolve `"105"`. Com `10 + 5` os dois lados são números e o resultado é `15`. O mesmo símbolo, duas operações — decididas pelo tipo dos valores.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-var-03',
      moduleId: 'js-variaveis',
      title: 'Conversão de tipos',
      subtitle: 'Number(), String() e o NaN',
      orderIndex: 3,
      content: `## O problema, de novo

\`prompt()\` devolve texto. Sempre. Então isto está errado:

~~~js
const idade = prompt("Sua idade: ");
console.log(idade + 1);
~~~

Com a resposta \`20\`, a saída é \`201\`. O JavaScript juntou os textos.

## Number(): texto vira número

~~~js
const idade = Number(prompt("Sua idade: "));
console.log(idade + 1);
~~~

Agora, com \`20\`, a saída é \`21\`. A conversão acontece **antes** de a conta ser feita.

## As conversões que você vai usar

| Função | Faz | Exemplo |
| --- | --- | --- |
| \`Number(x)\` | texto → número | \`Number("7")\` → \`7\` |
| \`String(x)\` | número → texto | \`String(7)\` → \`"7"\` |
| \`parseInt(x)\` | texto → inteiro | \`parseInt("3.9")\` → \`3\` |
| \`Boolean(x)\` | qualquer → true/false | \`Boolean("")\` → \`false\` |

## Quando a conversão não dá certo: NaN

Se o texto não representa um número, \`Number()\` devolve \`NaN\` — *Not a Number*:

~~~js
console.log(Number("abc"));
~~~

~~~text
NaN
~~~

\`NaN\` é contagioso: qualquer conta com ele também dá \`NaN\`. Se um resultado seu virou \`NaN\`, procure a **primeira** conversão que falhou — o resto é consequência.

## Onde converter

Converta **na entrada**, na mesma linha do \`prompt()\`. Assim a variável já nasce com o tipo certo e você não precisa lembrar disso em nenhum outro lugar do programa:

~~~js
const nota = Number(prompt("Nota: "));
const peso = Number(prompt("Peso: "));
console.log(nota * peso);
~~~`,
      polyglot: [
        { language: 'JavaScript', code: 'const idade = Number(prompt("Idade: "));' },
        { language: 'Python', code: 'idade = int(input("Idade: "))' },
        { language: 'Java', code: 'int idade = Integer.parseInt(entrada.nextLine());' },
      ],
      exercises: [
        {
          id: 'js-var-03-e1',
          lessonId: 'js-var-03',
          prompt:
            'Peça um número e mostre esse número somado a 10. Com a entrada simulada `5`, a saída deve ser exatamente:\n\n~~~text\nDigite um número: 15\n~~~',
          starterCode: 'const numero = prompt("Digite um número: ");\n',
          validationType: 'output_match',
          expectedAnswer: 'Digite um número: 15',
          stdin: ['5'],
          hint: 'Envolva o prompt() com Number(...) antes de guardar. Sem isso a saída seria 510.',
          explanation:
            'Sem `Number()`, `"5" + 10` produz `"510"`. Convertendo na entrada, a variável já nasce como número e a soma funciona como você espera.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-var-03-e2',
          lessonId: 'js-var-03',
          prompt: 'O que `Number("abc")` devolve?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['NaN', '0', 'null', 'Um erro que para o programa'],
          expectedAnswer: 'NaN',
          explanation:
            '`NaN` significa *Not a Number*. Repare que o programa **não para** — ele continua com um valor inválido, e qualquer conta feita a partir dali também vira `NaN`. Por isso vale checar a conversão logo na entrada.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-var-04',
      moduleId: 'js-variaveis',
      title: 'Template literals',
      subtitle: 'A crase que acabou com a concatenação',
      orderIndex: 4,
      content: `## Juntando texto e variável

Do jeito antigo, com \`+\`:

~~~js
const nome = "Ana";
const idade = 17;
console.log("Olá, " + nome + "! Você tem " + idade + " anos.");
~~~

Funciona, mas conte os espaços, as aspas e os \`+\`. É fácil errar — e difícil de ler.

## Do jeito moderno: crase e \${}

~~~js
const nome = "Ana";
const idade = 17;
console.log(\`Olá, \${nome}! Você tem \${idade} anos.\`);
~~~

~~~text
Olá, Ana! Você tem 17 anos.
~~~

O texto fica entre **crases** (\` \` \`), e tudo que estiver dentro de \`\${...}\` é calculado e encaixado no lugar. Isso se chama **template literal**.

## Dá para colocar contas dentro

Não precisa ser só uma variável — qualquer expressão funciona:

~~~js
const nota1 = 7;
const nota2 = 9;
console.log(\`Média: \${(nota1 + nota2) / 2}\`);
~~~

~~~text
Média: 8
~~~

## E várias linhas de uma vez

Com crase, o texto pode ocupar várias linhas sem nenhum truque:

~~~js
console.log(\`Relatório
--------
Aluna: Ana\`);
~~~

~~~text
Relatório
--------
Aluna: Ana
~~~

> A partir daqui, este curso usa template literal sempre que houver variável no meio do texto. É mais curto, mais legível e evita o erro clássico de esquecer um espaço antes do \`+\`.`,
      exercises: [
        {
          id: 'js-var-04-e1',
          lessonId: 'js-var-04',
          prompt:
            'Usando **template literal**, mostre a média de duas notas. Com `nome` valendo `Ana`, `nota1` valendo `7` e `nota2` valendo `9`, a saída deve ser:\n\n~~~text\nA média de Ana é 8\n~~~',
          starterCode: 'const nome = "Ana";\nconst nota1 = 7;\nconst nota2 = 9;\n',
          validationType: 'output_match',
          expectedAnswer: 'A média de Ana é 8',
          hint: 'console.log(`A média de ${nome} é ${(nota1 + nota2) / 2}`); — atenção aos parênteses da conta.',
          explanation:
            'Os parênteses em `(nota1 + nota2) / 2` são obrigatórios: sem eles o JavaScript faria primeiro `nota2 / 2` e o resultado sairia errado. Repare também que `16 / 2` mostra `8`, e não `8.0` — em JavaScript não existe distinção entre inteiro e decimal.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-var-04-e2',
          lessonId: 'js-var-04',
          prompt:
            'Qual destas linhas mostra `Oi, Ana` usando template literal, com a variável `nome` valendo `"Ana"`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'console.log(`Oi, ${nome}`);',
            "console.log('Oi, ${nome}');",
            'console.log(`Oi, {nome}`);',
            'console.log(`Oi, $nome`);',
          ],
          expectedAnswer: 'console.log(`Oi, ${nome}`);',
          explanation:
            'São duas exigências ao mesmo tempo: o texto entre **crases** e a variável dentro de `${...}`. Com aspas simples nada é substituído — sai literalmente `Oi, ${nome}`. E sem o cifrão, `{nome}` também é apenas texto.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
  ],
};
