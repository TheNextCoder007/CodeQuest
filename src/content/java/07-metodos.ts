import type { Module } from '@/types/content';

/** Modulo 7 - Metodos: criar, devolver, sobrecarregar e organizar. */
export const metodos: Module = {
  id: 'java-metodos',
  languageId: 'java',
  title: 'Métodos',
  description: 'Dar nome a um pedaço de código — e o tipo de retorno que o Java exige na frente.',
  icon: '⚙️',
  orderIndex: 7,
  lessons: [
    {
      id: 'ja-met-01',
      moduleId: 'java-metodos',
      title: 'Criar um método',
      subtitle: 'A assinatura',
      orderIndex: 1,
      content: `## Por que separar

Um bloco que você repete em três lugares é um bloco que você vai corrigir em três lugares. Um **método** dá nome a esse pedaço e passa a existir num lugar só.

~~~java
public class Jogo {

    static void abrirJogo() {
        System.out.println("Partida iniciada");
    }

    public static void main(String[] args) {
        abrirJogo();
        abrirJogo();
    }
}
~~~

~~~text
Partida iniciada
Partida iniciada
~~~

Em Java, o que outras linguagens chamam de "função" chama-se **método**, porque sempre pertence a uma classe.

## Lendo a assinatura

\`static void abrirJogo()\`

| Parte | Significa |
| --- | --- |
| \`static\` | pertence à classe; dá para chamar sem criar objeto |
| \`void\` | não devolve nada |
| \`abrirJogo\` | o nome, em \`camelCase\` |
| \`()\` | não recebe parâmetros |

## Por que static aqui

O \`main\` é \`static\`. Um método \`static\` só chama outros \`static\` diretamente — chamar um não-static de dentro do \`main\` dá:

~~~text
error: non-static method abrirJogo() cannot be referenced from a static context
~~~

É uma das mensagens que mais aparecem para quem está começando. Enquanto todo o seu programa vive numa classe só, deixe os métodos \`static\`.

> Métodos sem \`static\` fazem sentido quando existem objetos — cada objeto tem os seus dados, e o método trabalha sobre eles. É o assunto de orientação a objetos, que vem depois desta trilha.

## Onde declarar

Dentro da classe, **fora** do \`main\`. A ordem não importa: o Java enxerga todos os métodos da classe, mesmo os declarados abaixo.`,
      polyglot: [
        { language: 'Java', code: 'static void abrirJogo() {\n    System.out.println("Partida iniciada");\n}' },
        { language: 'Python', code: 'def abrir_jogo():\n    print("Partida iniciada")' },
        { language: 'JavaScript', code: 'function abrirJogo() {\n  console.log("Partida iniciada");\n}' },
      ],
      exercises: [
        {
          id: 'ja-met-01-e1',
          lessonId: 'ja-met-01',
          prompt:
            'Complete o tipo de retorno de um método que apenas imprime e não devolve nada:\n\n~~~java\nstatic ______ abrirJogo() {\n    System.out.println("Partida iniciada");\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'void',
          hint: 'Quatro letras, e significa exatamente "vazio".',
          explanation:
            '`void` declara que o método não devolve valor. Java exige o tipo de retorno na assinatura — não existe método sem essa declaração.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-met-01-e2',
          lessonId: 'ja-met-01',
          prompt:
            'Por que aparece `non-static method cannot be referenced from a static context` ao chamar um método a partir do `main`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O main é static e só chama outros métodos static diretamente',
            'O método foi declarado depois do main',
            'Falta um import',
            'Métodos não podem ser chamados dentro do main',
          ],
          expectedAnswer:
            'O main é static e só chama outros métodos static diretamente',
          explanation:
            'Um método não-static pertence a um objeto, e no `main` ainda não há objeto nenhum. Enquanto o programa vive numa classe só, declare os métodos como `static`.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-met-02',
      moduleId: 'java-metodos',
      title: 'Parâmetros e retorno',
      subtitle: 'Entrada e saída do método',
      orderIndex: 2,
      content: `## Recebendo valores

Cada parâmetro tem tipo e nome:

~~~java
static void saudar(String nome, int vezes) {
    for (int i = 0; i < vezes; i++) {
        System.out.println("Olá, " + nome);
    }
}
~~~

Chamando:

~~~java
saudar("Ana", 2);
~~~

~~~text
Olá, Ana
Olá, Ana
~~~

A ordem dos argumentos é a da declaração. Java não tem argumento nomeado como o Python — \`saudar(vezes: 2, nome: "Ana")\` não existe.

## Devolvendo

Trocar \`void\` por um tipo obriga o método a devolver aquele tipo:

~~~java
static double calcularMedia(double a, double b) {
    return (a + b) / 2;
}

public static void main(String[] args) {
    System.out.println(calcularMedia(7, 9));
}
~~~

~~~text
8.0
~~~

O \`return\` faz duas coisas ao mesmo tempo: entrega o valor e **encerra o método** ali. Código depois dele não roda.

## O compilador cobra o retorno

~~~java
static int dobro(int n) {
    System.out.println(n * 2);
}
~~~

~~~text
error: missing return statement
~~~

Prometeu \`int\`, tem de devolver \`int\` em **todos** os caminhos possíveis. Um \`return\` só dentro de um \`if\` não basta: se a condição for falsa, o método terminaria sem devolver nada, e o compilador recusa.

> Isso é uma vantagem concreta sobre Python e JavaScript, onde um caminho sem \`return\` devolve \`None\`/\`undefined\` em silêncio e o problema só aparece bem depois.

## Imprimir não é devolver

~~~java
static void mediaErrada(double a, double b) {
    System.out.println((a + b) / 2);
}
~~~

Este método mostra a média e não devolve nada — o valor não pode ser reaproveitado. **Quem calcula devolve; quem chamou decide o que fazer com o resultado.** É o que mantém o método reutilizável.`,
      exercises: [
        {
          id: 'ja-met-02-e1',
          lessonId: 'ja-met-02',
          prompt:
            'Complete o tipo de retorno para um método que devolve a média de dois `double`:\n\n~~~java\nstatic ______ calcularMedia(double a, double b) {\n    return (a + b) / 2;\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'double',
          hint: 'A divisão de dois decimais devolve um decimal.',
          explanation:
            'O tipo declarado precisa bater com o que o `return` entrega. Declarar `int` aqui daria erro de compilação, porque `(a + b) / 2` é `double`.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-met-02-e2',
          lessonId: 'ja-met-02',
          prompt:
            'Por que o Java recusa um método `int` cujo `return` está apenas dentro de um `if`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Se a condição for falsa o método terminaria sem devolver nada, e o compilador exige retorno em todos os caminhos',
            'Porque return não pode aparecer dentro de if',
            'Porque o if precisa ter else obrigatoriamente',
            'Porque métodos int não podem ter condicionais',
          ],
          expectedAnswer:
            'Se a condição for falsa o método terminaria sem devolver nada, e o compilador exige retorno em todos os caminhos',
          explanation:
            'A mensagem é `missing return statement`. Em Python o mesmo código devolveria `None` em silêncio; o Java prefere reclamar antes de o programa existir.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-met-03',
      moduleId: 'java-metodos',
      title: 'Sobrecarga',
      subtitle: 'Mesmo nome, assinaturas diferentes',
      orderIndex: 3,
      content: `## Um nome, várias formas

Java permite vários métodos com o **mesmo nome**, desde que os parâmetros sejam diferentes:

~~~java
static int somar(int a, int b) {
    return a + b;
}

static double somar(double a, double b) {
    return a + b;
}

static int somar(int a, int b, int c) {
    return a + b + c;
}
~~~

~~~java
System.out.println(somar(2, 3));
System.out.println(somar(2.5, 3.5));
System.out.println(somar(1, 2, 3));
~~~

~~~text
5
6.0
6
~~~

Isso é **sobrecarga** (*overloading*). O compilador escolhe a versão pelo tipo e pela quantidade dos argumentos — e essa escolha acontece na compilação, não durante a execução.

Você já usava isso sem saber: \`System.out.println\` é sobrecarregado para \`int\`, \`double\`, \`String\`, \`boolean\` e outros. É por isso que ele imprime qualquer coisa.

## O que diferencia é a assinatura

Só contam **tipo e quantidade** dos parâmetros. Estes dois não coexistem:

~~~java
static int calcular(int a) { return a; }
static double calcular(int a) { return a; }
~~~

~~~text
error: method calcular(int) is already defined
~~~

O tipo de retorno **não** faz parte da assinatura. Faz sentido: em \`calcular(5);\`, sem usar o resultado, o compilador não teria como escolher.

| Muda o quê | Serve para sobrecarregar? |
| --- | --- |
| tipo dos parâmetros | sim |
| quantidade de parâmetros | sim |
| nome dos parâmetros | não |
| tipo de retorno | não |

> Sobrecarga é conveniência, não obrigação. Se as versões fazem coisas **diferentes**, dê nomes diferentes: \`buscarPorId\` e \`buscarPorNome\` são mais claros que dois \`buscar\`.`,
      exercises: [
        {
          id: 'ja-met-03-e1',
          lessonId: 'ja-met-03',
          prompt: 'O que precisa mudar para dois métodos terem o mesmo nome na mesma classe?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O tipo ou a quantidade dos parâmetros',
            'Apenas o tipo de retorno',
            'O nome dos parâmetros',
            'Nada: nomes repetidos são sempre permitidos',
          ],
          expectedAnswer: 'O tipo ou a quantidade dos parâmetros',
          explanation:
            'É a assinatura que diferencia. O tipo de retorno não entra: em `calcular(5);`, sem usar o resultado, não haveria como o compilador escolher a versão.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-met-03-e2',
          lessonId: 'ja-met-03',
          prompt:
            'Qual método sobrecarregado é escolhido em `somar(2.5, 3.5)`, havendo `somar(int, int)` e `somar(double, double)`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'somar(double, double), decidido na compilação pelos tipos dos argumentos',
            'somar(int, int), com arredondamento automático',
            'O primeiro declarado na classe',
            'Nenhum: a chamada é ambígua e não compila',
          ],
          expectedAnswer:
            'somar(double, double), decidido na compilação pelos tipos dos argumentos',
          explanation:
            '`2.5` e `3.5` são `double`, então a versão `double` é a única compatível. A escolha acontece na compilação — por isso a saída é `6.0` e não `6`.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-met-04',
      moduleId: 'java-metodos',
      title: 'Escopo',
      subtitle: 'Onde cada variável existe',
      orderIndex: 4,
      content: `## Variável local morre no método

~~~java
static void contar() {
    int total = 0;
    total++;
    System.out.println(total);
}
~~~

Chamando \`contar()\` três vezes, a saída é \`1\`, \`1\`, \`1\`. A cada chamada, \`total\` nasce de novo.

Para que o valor sobreviva entre as chamadas, ele precisa morar **na classe**:

~~~java
public class Contador {

    static int total = 0;

    static void contar() {
        total++;
        System.out.println(total);
    }

    public static void main(String[] args) {
        contar();
        contar();
        contar();
    }
}
~~~

~~~text
1
2
3
~~~

## Os três escopos

| Onde é declarada | Existe |
| --- | --- |
| dentro de um bloco (\`if\`, \`for\`) | só naquele bloco |
| dentro de um método | só naquela chamada |
| na classe (\`static int total\`) | enquanto o programa roda |

## O bloco também conta

~~~java
if (true) {
    int x = 10;
}
System.out.println(x);
~~~

~~~text
error: cannot find symbol
~~~

Precisa do valor depois? Declare antes do bloco.

## Parâmetro é uma cópia

~~~java
static void dobrar(int n) {
    n = n * 2;
}

public static void main(String[] args) {
    int valor = 5;
    dobrar(valor);
    System.out.println(valor);
}
~~~

~~~text
5
~~~

O método recebeu uma **cópia** do número. Alterá-la não toca no original. Para ficar com o resultado, devolva: \`valor = dobrar(valor);\`.

> Com objetos a história muda: a cópia é da **referência**, então os dois nomes apontam para o mesmo objeto. Alterar o conteúdo de uma \`ArrayList\` recebida por parâmetro **afeta** a lista de quem chamou — mas reatribuir a variável dentro do método, não.

## Menos estado, menos bug

Variável de classe é conveniente e perigosa: qualquer método pode alterá-la, e descobrir quem mudou o quê fica difícil. Prefira passar por parâmetro e devolver por \`return\`. Só promova a variável de classe quando o valor realmente precisar sobreviver entre chamadas.`,
      exercises: [
        {
          id: 'ja-met-04-e1',
          lessonId: 'ja-met-04',
          prompt:
            'O que este programa mostra?\n\n~~~java\nstatic void dobrar(int n) {\n    n = n * 2;\n}\n\npublic static void main(String[] args) {\n    int valor = 5;\n    dobrar(valor);\n    System.out.println(valor);\n}\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['5', '10', '0', 'Erro de compilação'],
          expectedAnswer: '5',
          explanation:
            'O parâmetro recebe uma cópia do valor. Alterar `n` dentro do método não toca em `valor`. Para aproveitar o resultado, o método precisaria devolvê-lo com `return`.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-met-04-e2',
          lessonId: 'ja-met-04',
          prompt:
            'Onde declarar uma variável que precisa manter o valor **entre** várias chamadas de um método?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Na classe, fora dos métodos',
            'Dentro do próprio método',
            'Dentro do bloco do for',
            'Como parâmetro do método',
          ],
          expectedAnswer: 'Na classe, fora dos métodos',
          explanation:
            'Variável local nasce e morre a cada chamada. Na classe, ela vive enquanto o programa roda. Vale usar com parcimônia: estado compartilhado é conveniente e é onde os bugs difíceis se escondem.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
  ],
};
