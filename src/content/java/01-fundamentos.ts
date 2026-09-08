import type { Module } from '@/types/content';

/**
 * Modulo 1 - Fundamentos de Java.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ESTA TRILHA NAO TEM EXERCICIO DE CODIGO EXECUTADO
 *
 * Python roda no aparelho via Pyodide e JavaScript pelo motor do proprio
 * navegador. Java precisaria de uma JVM, que nao existe no navegador sem um
 * servico externo - e servico externo cobra por requisicao, o que quebra a
 * regra de custo zero do projeto.
 *
 * Entao aqui os exercicios sao de dois tipos:
 *
 *   - `multiple_choice` para o conceito ("por que isso da erro?");
 *   - `fill_blank` para a sintaxe, onde o aluno DIGITA o que falta.
 *
 * O `fill_blank` e o que mantem a trilha com as maos no teclado: ele cobra a
 * palavra exata, do jeito que o compilador cobraria.
 */
export const fundamentos: Module = {
  id: 'java-fundamentos',
  languageId: 'java',
  title: 'Fundamentos',
  description: 'A estrutura de um programa Java, a saída na tela e as primeiras mensagens de erro.',
  icon: '🐣',
  orderIndex: 1,
  lessons: [
    {
      id: 'ja-fund-01',
      moduleId: 'java-fundamentos',
      title: 'Todo programa mora numa classe',
      subtitle: 'A estrutura mínima',
      orderIndex: 1,
      content: `## O menor programa Java que existe

Em Python, \`print("Olá")\` sozinho já é um programa. Em Java, não: **todo código precisa estar dentro de uma classe**, e a execução começa por um método chamado \`main\`.

~~~java
public class Principal {
    public static void main(String[] args) {
        System.out.println("Olá, CodeQuest!");
    }
}
~~~

~~~text
Olá, CodeQuest!
~~~

Parece muita cerimônia para uma linha — e é. Mas cada palavra tem um motivo.

## Lendo a linha do main

\`public static void main(String[] args)\` é a assinatura que a JVM procura para começar.

| Palavra | O que significa |
| --- | --- |
| \`public\` | qualquer um pode chamar — a JVM precisa conseguir |
| \`static\` | pertence à classe, não a um objeto: roda sem ninguém criar nada antes |
| \`void\` | não devolve valor |
| \`main\` | o nome que a JVM procura; trocar isso e o programa não inicia |
| \`String[] args\` | os argumentos da linha de comando, mesmo que você nunca use |

> Se você renomear \`main\`, o código **compila** normalmente e só falha na hora de executar, com \`Main method not found\`. É o primeiro aviso de que compilar e rodar são dois momentos diferentes em Java.

## O nome do arquivo importa

Uma classe \`public class Principal\` precisa estar num arquivo chamado **\`Principal.java\`** — mesmo nome, mesma caixa alta. O compilador recusa qualquer outra coisa.

Python e JavaScript não ligam para o nome do arquivo. Java liga, e essa é uma das primeiras diferenças que pega quem vem de outra linguagem.

## Chaves delimitam blocos

Onde o Python usa indentação, Java usa \`{ }\`:

~~~java
public class Exemplo {
    public static void main(String[] args) {
        System.out.println("dentro do main");
    }
}
~~~

A indentação em Java é só para humanos — o compilador ignora. Ainda assim, indente: código sem indentação é ilegível para a próxima pessoa (que costuma ser você, uma semana depois).`,
      polyglot: [
        { language: 'Java', code: 'public class Principal {\n    public static void main(String[] args) {\n        System.out.println("Olá");\n    }\n}' },
        { language: 'Python', code: 'print("Olá")' },
        { language: 'JavaScript', code: 'console.log("Olá");' },
      ],
      exercises: [
        {
          id: 'ja-fund-01-e1',
          lessonId: 'ja-fund-01',
          prompt: 'Por onde a JVM começa a executar um programa Java?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Pelo método `main`',
            'Pela primeira linha do arquivo',
            'Pelo construtor da classe',
            'Pela última classe declarada',
          ],
          expectedAnswer: 'Pelo método `main`',
          explanation:
            'A JVM procura especificamente por `public static void main(String[] args)`. Sem ele o código até compila, mas não roda — o erro aparece só na execução.',
          xpReward: 25,
          orderIndex: 1,
        },
        {
          id: 'ja-fund-01-e2',
          lessonId: 'ja-fund-01',
          prompt:
            'Uma classe declarada como `public class Relatorio` precisa estar num arquivo com que nome?\n\n(Escreva o nome completo do arquivo.)',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'Relatorio.java',
          hint: 'Mesmo nome da classe, mesma caixa alta, com a extensão .java.',
          explanation:
            'O compilador exige que uma classe pública esteja num arquivo de mesmo nome — `Relatorio.java`. Python e JavaScript não têm essa regra; Java tem.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-fund-02',
      moduleId: 'java-fundamentos',
      title: 'Mostrar na tela',
      subtitle: 'println, print e printf',
      orderIndex: 2,
      content: `## System.out.println

É o \`print()\` do Java, com um nome bem mais longo:

~~~java
System.out.println("Primeira linha");
System.out.println("Segunda linha");
~~~

~~~text
Primeira linha
Segunda linha
~~~

O \`ln\` no fim é de *line*: ele pula para a linha seguinte depois de imprimir.

## println x print

~~~java
System.out.print("sem ");
System.out.print("pular");
System.out.println("!");
~~~

~~~text
sem pular!
~~~

| Comando | Pula linha ao terminar? |
| --- | --- |
| \`System.out.println(x)\` | sim |
| \`System.out.print(x)\` | não |
| \`System.out.printf(...)\` | só se você escrever \`%n\` |

## Juntando texto e valores

O \`+\` cola texto:

~~~java
String nome = "Ana";
int idade = 20;
System.out.println(nome + " tem " + idade + " anos");
~~~

~~~text
Ana tem 20 anos
~~~

> Cuidado com a ordem: \`System.out.println(1 + 2 + " itens")\` mostra \`3 itens\`, mas \`System.out.println("itens: " + 1 + 2)\` mostra \`itens: 12\`. O \`+\` é avaliado da esquerda para a direita, e assim que encontra um texto, tudo dali para frente vira texto.

## O ponto e vírgula

Toda instrução em Java termina com \`;\`. Esquecer é o erro de compilação mais comum de todos — e a mensagem costuma apontar a linha **seguinte**, porque é ali que o compilador percebe que algo ficou faltando.`,
      exercises: [
        {
          id: 'ja-fund-02-e1',
          lessonId: 'ja-fund-02',
          prompt:
            'Complete para que o programa mostre `Bem-vindo` e pule para a linha seguinte:\n\n~~~java\nSystem.out.______("Bem-vindo");\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'println',
          hint: 'O `ln` no fim do nome é de "line" — é ele que pula a linha.',
          explanation:
            '`println` imprime e pula a linha. `print` imprimiria o mesmo texto, mas deixaria o cursor na mesma linha.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-fund-02-e2',
          lessonId: 'ja-fund-02',
          prompt:
            'O que aparece na tela?\n\n~~~java\nSystem.out.println("total: " + 1 + 2);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['total: 12', 'total: 3', 'total: 1 2', 'Erro de compilação'],
          expectedAnswer: 'total: 12',
          explanation:
            'O `+` é avaliado da esquerda para a direita. `"total: " + 1` já vira o texto `total: 1`, e o `+ 2` cola o `2` no fim. Para somar antes, use parênteses: `"total: " + (1 + 2)`.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-fund-03',
      moduleId: 'java-fundamentos',
      title: 'Comentários',
      subtitle: 'Escrever para quem vem depois',
      orderIndex: 3,
      content: `## Três formas

~~~java
// comentário de uma linha

/*
   comentário de
   várias linhas
*/

/**
 * Javadoc: vira documentação gerada automaticamente.
 * É o formato usado para explicar classes e métodos públicos.
 */
~~~

O compilador ignora os três. Quem lê são as pessoas — e as ferramentas, no caso do Javadoc.

## Comentar para testar

Enquanto você desenvolve, comentar uma linha é mais seguro que apagá-la:

~~~java
public class Teste {
    public static void main(String[] args) {
        // System.out.println("valor de depuração");
        System.out.println("Relatório final");
    }
}
~~~

~~~text
Relatório final
~~~

## O que NÃO comentar

~~~java
// soma 1 ao contador
contador = contador + 1;
~~~

Esse comentário não acrescenta nada: o código já diz isso. Comentário bom explica **por quê**, não **o quê**:

~~~java
// O índice começa em 1 porque a planilha do RH conta a partir de 1.
contador = 1;
~~~

> Comentário desatualizado é pior que comentário nenhum: ele mente com autoridade. Se você mudar o código, mude o comentário junto — ou apague.`,
      exercises: [
        {
          id: 'ja-fund-03-e1',
          lessonId: 'ja-fund-03',
          prompt: 'Qual símbolo inicia um comentário de uma linha em Java?',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: '//|barra barra|duas barras',
          hint: 'São dois caracteres iguais, os mesmos do JavaScript.',
          explanation:
            'Java usa `//` para uma linha e `/* ... */` para várias. O `#` do Python não vale aqui.',
          xpReward: 25,
          orderIndex: 1,
        },
        {
          id: 'ja-fund-03-e2',
          lessonId: 'ja-fund-03',
          prompt: 'Qual destes comentários é útil?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            '// O total começa em 1 porque a planilha do RH conta a partir de 1',
            '// soma 1 ao total',
            '// declara a variável total',
            '// aqui usamos um int',
          ],
          expectedAnswer:
            '// O total começa em 1 porque a planilha do RH conta a partir de 1',
          explanation:
            'Os três últimos repetem o que o código já diz. Comentário bom explica o **porquê** — a decisão, a regra de negócio, a armadilha — que o código sozinho não consegue contar.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-fund-04',
      moduleId: 'java-fundamentos',
      title: 'Quando dá erro',
      subtitle: 'Compilação e execução são dois momentos',
      orderIndex: 4,
      content: `## Java confere antes de rodar

Python descobre a maioria dos problemas **enquanto executa**. Java tem uma etapa a mais: o **compilador** lê o programa inteiro antes, e recusa o que não fizer sentido.

Isso é uma troca: você escreve mais e espera mais para ver o resultado, mas uma classe inteira de erros nunca chega ao usuário.

## Erro de compilação

O programa nem chega a rodar:

~~~java
int idade = "vinte";
~~~

~~~text
error: incompatible types: String cannot be converted to int
~~~

Outros clássicos: ponto e vírgula faltando, chave não fechada, nome de variável escrito errado, método que não existe.

## Erro de execução (exception)

Compila, roda, e quebra no meio:

~~~java
int[] numeros = {1, 2, 3};
System.out.println(numeros[5]);
~~~

~~~text
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
~~~

O compilador não tinha como saber: o índice só existe na hora da execução.

| Momento | Exemplo | Quando você descobre |
| --- | --- | --- |
| Compilação | tipo errado, \`;\` faltando | antes de rodar |
| Execução | índice fora do array, divisão por zero | com o programa rodando |

## Como ler a mensagem

A última linha costuma ser a mais útil: ela diz **o tipo** do erro e **o que** ele esperava. Depois venha o \`at ...\`, que aponta a classe e a linha.

> \`NullPointerException\` é o erro de execução mais famoso do Java: você usou algo que ainda é \`null\`. Quando aparecer, a pergunta certa é "quem eu esqueci de criar?".`,
      exercises: [
        {
          id: 'ja-fund-04-e1',
          lessonId: 'ja-fund-04',
          prompt:
            'O código `int idade = "vinte";` falha. Em que momento?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Na compilação: o tipo não bate e o programa nem chega a rodar',
            'Na execução, ao chegar nessa linha',
            'Não falha: Java converte o texto sozinho',
            'Só falha se a variável for usada depois',
          ],
          expectedAnswer:
            'Na compilação: o tipo não bate e o programa nem chega a rodar',
          explanation:
            'Java é de tipagem estática: o compilador confere os tipos antes de gerar o programa. Um texto não entra num `int`, e isso é detectado sem executar nada.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-fund-04-e2',
          lessonId: 'ja-fund-04',
          prompt:
            'Qual exceção o Java lança ao acessar `numeros[5]` num array de 3 posições?\n\n(Escreva só o nome da exceção.)',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'ArrayIndexOutOfBoundsException',
          hint: 'O nome descreve exatamente o que aconteceu: o índice do array saiu dos limites.',
          explanation:
            'Índice fora dos limites só pode ser detectado durante a execução — o compilador não tem como saber qual valor o índice terá. Num array de 3 posições, os índices válidos são 0, 1 e 2.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-fund-05',
      moduleId: 'java-fundamentos',
      title: 'Lendo do teclado',
      subtitle: 'A classe Scanner',
      orderIndex: 5,
      content: `## Programas que perguntam

Para ler o que a pessoa digita, Java usa a classe \`Scanner\`. São três passos: importar, criar e ler.

~~~java
import java.util.Scanner;

public class Saudacao {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);

        System.out.print("Qual é o seu nome? ");
        String nome = entrada.nextLine();

        System.out.println("Olá, " + nome + "!");
    }
}
~~~

~~~text
Qual é o seu nome? Ana
Olá, Ana!
~~~

## O import

\`import java.util.Scanner;\` vai **antes** da classe e diz de onde a classe vem. Sem ele, o compilador não conhece o nome \`Scanner\`.

## Um método de leitura para cada tipo

| Método | Lê |
| --- | --- |
| \`nextLine()\` | a linha inteira, como texto |
| \`next()\` | uma palavra só |
| \`nextInt()\` | um número inteiro |
| \`nextDouble()\` | um número com casas decimais |

~~~java
Scanner entrada = new Scanner(System.in);
int idade = entrada.nextInt();
~~~

> A armadilha clássica: usar \`nextInt()\` e depois \`nextLine()\`. O \`nextInt()\` lê o número mas **deixa a quebra de linha** no buffer, e o \`nextLine()\` seguinte volta vazio na hora. A saída é chamar um \`nextLine()\` extra só para descartar a sobra.

## Comparado ao Python

Onde o Python faz \`input()\` e devolve texto sempre, Java já entrega o tipo que você pediu — mas exige que você diga qual é.`,
      polyglot: [
        { language: 'Java', code: 'Scanner entrada = new Scanner(System.in);\nString nome = entrada.nextLine();' },
        { language: 'Python', code: 'nome = input()' },
        { language: 'JavaScript', code: 'const nome = prompt();' },
      ],
      exercises: [
        {
          id: 'ja-fund-05-e1',
          lessonId: 'ja-fund-05',
          prompt:
            'Complete o import necessário para usar o Scanner:\n\n~~~java\nimport java.util.______;\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'Scanner',
          hint: 'É o próprio nome da classe, com S maiúsculo.',
          explanation:
            '`import java.util.Scanner;` diz ao compilador de qual pacote a classe vem. Sem o import, o nome `Scanner` não existe para ele.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-fund-05-e2',
          lessonId: 'ja-fund-05',
          prompt: 'Qual método do Scanner lê a linha inteira digitada, incluindo os espaços?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['nextLine()', 'next()', 'nextInt()', 'readAll()'],
          expectedAnswer: 'nextLine()',
          explanation:
            '`next()` para na primeira separação e devolve só uma palavra. `nextLine()` lê tudo até a quebra de linha — é o que você quer para um nome composto, por exemplo.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
  ],
};
