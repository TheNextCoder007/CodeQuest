import type { Module } from '@/types/content';

/** Modulo 2 - Variaveis, tipos primitivos, String e conversao. */
export const variaveis: Module = {
  id: 'java-variaveis',
  languageId: 'java',
  title: 'Variáveis',
  description: 'Tipos declarados na frente do nome — o que Java ganha e o que cobra por isso.',
  icon: '📦',
  orderIndex: 2,
  lessons: [
    {
      id: 'ja-var-01',
      moduleId: 'java-variaveis',
      title: 'O tipo vem antes do nome',
      subtitle: 'Os tipos primitivos',
      orderIndex: 1,
      content: `## Declarar é dizer o tipo

Em Python, \`idade = 20\` basta. Em Java, você diz de que tipo a variável é — e ela não muda mais:

~~~java
int idade = 20;
double altura = 1.75;
boolean ativo = true;
char inicial = 'A';
~~~

Isso se chama **tipagem estática**. O compilador passa a conhecer cada variável e recusa o que não fizer sentido antes de o programa rodar.

## Os primitivos que você vai usar

| Tipo | Guarda | Exemplo |
| --- | --- | --- |
| \`int\` | inteiro | \`42\` |
| \`double\` | número com casas decimais | \`3.14\` |
| \`boolean\` | \`true\` ou \`false\` | \`true\` |
| \`char\` | **um** caractere | \`'A'\` |
| \`long\` | inteiro muito grande | \`9000000000L\` |

Existem outros (\`byte\`, \`short\`, \`float\`), mas no dia a dia \`int\`, \`double\` e \`boolean\` resolvem quase tudo.

## Aspas simples e aspas duplas são coisas diferentes

Esta é a pegadinha que mais aparece para quem vem do Python:

~~~java
char letra = 'A';      // um caractere, aspas SIMPLES
String palavra = "A";  // um texto, aspas DUPLAS
~~~

Trocar uma pela outra é erro de compilação. Em Python as duas formas são equivalentes; em Java, não.

## O tipo não muda depois

~~~java
int idade = 20;
idade = "vinte";
~~~

~~~text
error: incompatible types: String cannot be converted to int
~~~

> Essa rigidez parece um estorvo no começo e vira uma rede de proteção depois: erros de tipo aparecem na compilação, e não com o programa nas mãos de alguém.`,
      polyglot: [
        { language: 'Java', code: 'int idade = 20;\ndouble altura = 1.75;' },
        { language: 'Python', code: 'idade = 20\naltura = 1.75' },
        { language: 'JavaScript', code: 'let idade = 20;\nlet altura = 1.75;' },
      ],
      exercises: [
        {
          id: 'ja-var-01-e1',
          lessonId: 'ja-var-01',
          prompt:
            'Complete a declaração de uma variável que guarda `1.75`:\n\n~~~java\n______ altura = 1.75;\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'double',
          hint: 'É o tipo padrão para números com casas decimais em Java.',
          explanation:
            '`double` é o tipo usual para decimais. `int` só guarda inteiros e recusaria o `1.75` na compilação.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-var-01-e2',
          lessonId: 'ja-var-01',
          prompt: 'Qual declaração está **errada** em Java?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            "char inicial = \"A\";",
            "char inicial = 'A';",
            'String nome = "Ana";',
            'boolean ativo = true;',
          ],
          expectedAnswer: "char inicial = \"A\";",
          explanation:
            'Aspas duplas produzem uma `String`, e uma `String` não cabe num `char`. Um caractere usa aspas simples: `char inicial = \'A\';`. Em Python as duas formas seriam equivalentes — em Java, não.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-var-02',
      moduleId: 'java-variaveis',
      title: 'Textos',
      subtitle: 'String e seus métodos',
      orderIndex: 2,
      content: `## String não é primitivo

\`String\` começa com maiúscula porque é uma **classe**, não um tipo primitivo. Isso muda três coisas importantes.

~~~java
String nome = "Ana";
System.out.println(nome.length());
System.out.println(nome.toUpperCase());
~~~

~~~text
3
ANA
~~~

Repare no ponto: \`nome.length()\` pede algo **ao texto**. Primitivos não têm métodos; objetos têm.

## Métodos que você usa toda hora

| Método | Devolve |
| --- | --- |
| \`length()\` | quantidade de caracteres |
| \`toUpperCase()\` / \`toLowerCase()\` | o texto em outra caixa |
| \`trim()\` | sem espaços nas pontas |
| \`substring(i, f)\` | um pedaço |
| \`contains("x")\` | \`true\` se contém |
| \`equals(outro)\` | \`true\` se o **conteúdo** é igual |

## Nenhum deles muda o texto original

~~~java
String nome = "ana";
nome.toUpperCase();
System.out.println(nome);
~~~

~~~text
ana
~~~

Strings em Java são **imutáveis**: os métodos devolvem um texto novo em vez de alterar o que existe. Para ficar com o resultado, guarde:

~~~java
nome = nome.toUpperCase();
~~~

> Esse é um erro silencioso clássico: o programa compila, roda, não reclama de nada — e simplesmente não faz o que você queria.

## Concatenar

~~~java
String nome = "Ana";
int idade = 20;
System.out.println("Nome: " + nome + ", idade: " + idade);
~~~

~~~text
Nome: Ana, idade: 20
~~~

O \`+\` converte números para texto automaticamente quando um dos lados já é texto.`,
      exercises: [
        {
          id: 'ja-var-02-e1',
          lessonId: 'ja-var-02',
          prompt:
            'O que este trecho mostra?\n\n~~~java\nString nome = "ana";\nnome.toUpperCase();\nSystem.out.println(nome);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          /*
           * As alternativas precisam descrever a saida, e nao ser so `ana`,
           * `ANA` e `Ana`: a correcao normaliza antes de comparar (minusculas,
           * sem aspas), entao as tres variacoes de caixa seriam a MESMA
           * resposta - e quem marcasse `ANA` seria dado como certo.
           */
          options: [
            'ana — o texto original, inalterado',
            'ANA — o texto inteiro em maiúsculas',
            'Ana — só a primeira letra em maiúscula',
            'Erro de compilação',
          ],
          expectedAnswer: 'ana — o texto original, inalterado',
          explanation:
            'Strings são imutáveis: `toUpperCase()` devolve um texto novo e deixa o original intacto. Como o retorno foi descartado, `nome` continua `ana`. O certo seria `nome = nome.toUpperCase();`.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-var-02-e2',
          lessonId: 'ja-var-02',
          prompt:
            'Complete para obter a quantidade de caracteres do texto:\n\n~~~java\nString nome = "CodeQuest";\nint tamanho = nome.______;\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'length()',
          hint: 'É um método, então não esqueça os parênteses.',
          explanation:
            'Em `String` é o método `length()`, com parênteses. Em array é o campo `length`, sem parênteses — uma inconsistência do Java que confunde todo mundo no começo.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-var-03',
      moduleId: 'java-variaveis',
      title: 'Convertendo tipos',
      subtitle: 'Casting e parse',
      orderIndex: 3,
      content: `## Texto para número

O que vem do teclado ou de um arquivo é texto. Para calcular, converta:

~~~java
String digitado = "42";
int numero = Integer.parseInt(digitado);
System.out.println(numero + 10);
~~~

~~~text
52
~~~

| Conversão | Como |
| --- | --- |
| texto → inteiro | \`Integer.parseInt(texto)\` |
| texto → decimal | \`Double.parseDouble(texto)\` |
| número → texto | \`String.valueOf(n)\` ou \`"" + n\` |

> \`Integer.parseInt("abc")\` compila normalmente e lança \`NumberFormatException\` na execução. Conversão de texto é sempre um ponto onde o programa pode quebrar com dado de fora.

## Entre números: o casting

~~~java
double preco = 19.99;
int inteiro = (int) preco;
System.out.println(inteiro);
~~~

~~~text
19
~~~

\`(int)\` **corta** a parte decimal — não arredonda. Para arredondar, \`Math.round(preco)\`.

## A divisão que engana

~~~java
System.out.println(7 / 2);
System.out.println(7.0 / 2);
~~~

~~~text
3
3.5
~~~

Dois inteiros produzem um inteiro, e o resto é descartado. Basta um dos lados ser \`double\` para o resultado ter casas decimais.

É a origem de uma quantidade enorme de médias erradas: \`(nota1 + nota2) / 2\` com notas inteiras devolve um inteiro.`,
      exercises: [
        {
          id: 'ja-var-03-e1',
          lessonId: 'ja-var-03',
          prompt: 'O que `System.out.println(7 / 2);` mostra em Java?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['3', '3.5', '3.0', '4'],
          expectedAnswer: '3',
          explanation:
            'Divisão entre dois inteiros devolve inteiro, descartando o resto. Para obter `3.5`, basta um dos lados ser decimal: `7.0 / 2`.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-var-03-e2',
          lessonId: 'ja-var-03',
          prompt:
            'Complete para transformar o texto digitado em número inteiro:\n\n~~~java\nString digitado = "42";\nint numero = ______(digitado);\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'Integer.parseInt',
          hint: 'É um método da classe Integer, com "parse" no nome.',
          explanation:
            '`Integer.parseInt` converte texto em `int`. Se o texto não for um número válido, o programa lança `NumberFormatException` durante a execução.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-var-04',
      moduleId: 'java-variaveis',
      title: 'Operadores',
      subtitle: 'Contas, resto e atalhos',
      orderIndex: 4,
      content: `## Os aritméticos

~~~java
int a = 10;
int b = 3;

System.out.println(a + b);
System.out.println(a - b);
System.out.println(a * b);
System.out.println(a / b);
System.out.println(a % b);
~~~

~~~text
13
7
30
3
1
~~~

O \`%\` é o **resto** da divisão. Ele parece um detalhe e resolve uma quantidade surpreendente de problemas:

| Pergunta | Teste |
| --- | --- |
| é par? | \`n % 2 == 0\` |
| é múltiplo de 3? | \`n % 3 == 0\` |
| último dígito | \`n % 10\` |

## Atalhos de atribuição

~~~java
int total = 10;
total += 5;   // total = total + 5
total -= 2;
total *= 3;
~~~

E os incrementos, muito comuns em laços:

~~~java
int i = 0;
i++;   // soma 1
i--;   // subtrai 1
~~~

## final: a variável que não muda

~~~java
final double PI = 3.14159;
PI = 3;
~~~

~~~text
error: cannot assign a value to final variable PI
~~~

\`final\` é o \`const\` do JavaScript. Use em valores que não deveriam mudar — o compilador passa a defender essa decisão por você.

> Convenção da comunidade: constantes em MAIÚSCULAS com \`_\` (\`TAXA_JUROS\`), variáveis e métodos em \`camelCase\` (\`valorTotal\`), classes em \`PascalCase\` (\`ContaBancaria\`). Ninguém é obrigado, mas todo código Java que você vai ler segue isso.`,
      exercises: [
        {
          id: 'ja-var-04-e1',
          lessonId: 'ja-var-04',
          prompt:
            'Complete a condição que testa se `numero` é par:\n\n~~~java\nif (numero ______ 2 == 0) {\n    System.out.println("par");\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: '%',
          hint: 'O operador que devolve o resto da divisão.',
          explanation:
            'Um número é par quando o resto da divisão por 2 é zero. O `%` é o operador de resto — o mesmo símbolo do Python e do JavaScript.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-var-04-e2',
          lessonId: 'ja-var-04',
          prompt: 'O que `final` faz numa declaração de variável?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Impede que o valor seja alterado depois de atribuído',
            'Faz a variável ser apagada ao fim do método',
            'Torna a variável visível para todas as classes',
            'Converte a variável para texto automaticamente',
          ],
          expectedAnswer: 'Impede que o valor seja alterado depois de atribuído',
          explanation:
            '`final` é o equivalente ao `const` do JavaScript: tentar reatribuir vira erro de compilação. É a forma de deixar registrado no código que aquele valor não deveria mudar.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
  ],
};
