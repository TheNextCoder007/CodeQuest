import type { Module } from '@/types/content';

/**
 * Modulo 8 - Desafios: problemas classicos que juntam o que veio antes.
 *
 * Aqui a teoria e curta de proposito - o valor esta em reconhecer o padrao e
 * as armadilhas de cada problema, que sao as mesmas que aparecem em entrevista
 * tecnica e em prova.
 */
export const desafios: Module = {
  id: 'java-desafios',
  languageId: 'java',
  title: 'Desafios',
  description: 'Problemas clássicos que juntam laços, condições, métodos e coleções.',
  icon: '🧩',
  orderIndex: 8,
  lessons: [
    {
      id: 'ja-des-01',
      moduleId: 'java-desafios',
      title: 'FizzBuzz',
      subtitle: 'A ordem das condições é tudo',
      orderIndex: 1,
      content: `## O problema

De 1 a 15, mostre o número — mas múltiplos de 3 viram \`Fizz\`, múltiplos de 5 viram \`Buzz\`, e múltiplos de ambos viram \`FizzBuzz\`.

~~~java
for (int i = 1; i <= 15; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
        System.out.println("FizzBuzz");
    } else if (i % 3 == 0) {
        System.out.println("Fizz");
    } else if (i % 5 == 0) {
        System.out.println("Buzz");
    } else {
        System.out.println(i);
    }
}
~~~

~~~text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
~~~

## Por que ele é usado em entrevista

Não é a dificuldade — é a **ordem**. Quem testa \`i % 3\` primeiro nunca chega no \`FizzBuzz\`: o 15 é múltiplo de 3, o primeiro teste dá verdadeiro, e a cadeia para ali.

O caso mais específico (múltiplo de 3 **e** de 5) tem de vir primeiro. É a mesma regra da cadeia de \`else if\` do módulo de Condicionais, num problema onde o erro fica visível.

## Uma variação sem duplicar a condição

~~~java
for (int i = 1; i <= 15; i++) {
    String saida = "";
    if (i % 3 == 0) saida += "Fizz";
    if (i % 5 == 0) saida += "Buzz";
    System.out.println(saida.isEmpty() ? i : saida);
}
~~~

Aqui não há cadeia: cada teste acrescenta um pedaço, e o 15 recebe os dois. O \`? :\` é o **operador ternário** — um \`if/else\` que cabe numa expressão e devolve um valor.

> Ternário é ótimo para escolher entre dois valores e péssimo quando aninhado. Se você precisar de um ternário dentro de outro, volte para o \`if\`.`,
      exercises: [
        {
          id: 'ja-des-01-e1',
          lessonId: 'ja-des-01',
          prompt:
            'Por que testar `i % 3 == 0` **antes** de `i % 3 == 0 && i % 5 == 0` quebra o FizzBuzz?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O 15 entraria no primeiro teste e imprimiria Fizz; o FizzBuzz nunca apareceria',
            'O operador % não funciona com o número 15',
            'A cadeia else if avalia todas as condições e imprime as duas',
            'Não quebra: a ordem dos else if não importa',
          ],
          expectedAnswer:
            'O 15 entraria no primeiro teste e imprimiria Fizz; o FizzBuzz nunca apareceria',
          explanation:
            'A cadeia para no primeiro teste verdadeiro. Como 15 é múltiplo de 3, ele sairia como `Fizz`. O caso mais específico — múltiplo de 3 **e** de 5 — precisa vir primeiro.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'ja-des-01-e2',
          lessonId: 'ja-des-01',
          prompt:
            'Complete o operador que testa se `i` é múltiplo de 5:\n\n~~~java\nif (i ______ 5 == 0) {\n    System.out.println("Buzz");\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: '%',
          hint: 'O operador de resto — múltiplo é quando o resto dá zero.',
          explanation:
            'Resto zero significa divisão exata, ou seja, múltiplo. O `%` é a ferramenta de "é divisível por" em qualquer linguagem da família C.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-des-02',
      moduleId: 'java-desafios',
      title: 'Validar com retorno antecipado',
      subtitle: 'Um return por problema',
      orderIndex: 2,
      content: `## O problema

Validar uma senha e dizer **por quê** ela não serve:

- menos de 8 caracteres → \`Senha muito curta\`
- igual a \`12345678\` → \`Senha óbvia demais\`
- caso contrário → \`Senha aceita\`

## Com retorno antecipado

~~~java
static String validarSenha(String senha) {
    if (senha.length() < 8) {
        return "Senha muito curta";
    }
    if (senha.equals("12345678")) {
        return "Senha óbvia demais";
    }
    return "Senha aceita";
}
~~~

~~~java
System.out.println(validarSenha("abc"));
System.out.println(validarSenha("12345678"));
System.out.println(validarSenha("codequest2026"));
~~~

~~~text
Senha muito curta
Senha óbvia demais
Senha aceita
~~~

Cada problema tem o seu \`return\`, e o caso bom fica no fim. Como o \`return\` encerra o método na hora, não é preciso \`else\`.

## Comparado ao aninhamento

~~~java
static String validarSenha(String senha) {
    if (senha.length() >= 8) {
        if (!senha.equals("12345678")) {
            return "Senha aceita";
        } else {
            return "Senha óbvia demais";
        }
    } else {
        return "Senha muito curta";
    }
}
~~~

Faz o mesmo e é bem mais difícil de ler. Com três regras a mais, isso vira uma escada. O retorno antecipado mantém tudo no mesmo nível de indentação.

> Repare no \`.equals()\`: comparar a senha com \`==\` funcionaria nos seus testes com texto escrito no código e falharia com a senha vinda de um formulário. É exatamente a armadilha do módulo de Condicionais.

## A ordem também importa aqui

\`"1234"\` é curta **e** óbvia. Como a checagem de tamanho vem primeiro, a resposta é \`Senha muito curta\`. Se a regra de negócio exigir outra prioridade, é só reordenar os \`if\` — e é bom que essa decisão fique visível no código.`,
      exercises: [
        {
          id: 'ja-des-02-e1',
          lessonId: 'ja-des-02',
          prompt:
            'Por que o retorno antecipado dispensa o `else`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O return encerra o método na hora, então o que vem depois só roda se a condição foi falsa',
            'Porque o Java proíbe else dentro de métodos que devolvem String',
            'Porque o compilador insere o else automaticamente',
            'Não dispensa: o else é obrigatório',
          ],
          expectedAnswer:
            'O return encerra o método na hora, então o que vem depois só roda se a condição foi falsa',
          explanation:
            'Saindo do método dentro do `if`, o código seguinte já é, na prática, o "senão". Isso mantém tudo no mesmo nível de indentação em vez de virar uma escada de blocos aninhados.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'ja-des-02-e2',
          lessonId: 'ja-des-02',
          prompt:
            'Complete a comparação correta do conteúdo da senha:\n\n~~~java\nif (senha.______("12345678")) {\n    return "Senha óbvia demais";\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'equals',
          hint: 'Comparar texto com `==` é a armadilha clássica do Java.',
          explanation:
            '`.equals()` compara o conteúdo. Com `==`, o teste passaria nos seus experimentos (texto escrito no código) e falharia com a senha vinda de um formulário.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-des-03',
      moduleId: 'java-desafios',
      title: 'Percorrer e resumir',
      subtitle: 'Maior, menor e média numa passagem',
      orderIndex: 3,
      content: `## O problema

De uma lista de notas, obter a maior e a média.

~~~java
double[] notas = {7.0, 9.5, 4.0, 8.5};

double maior = notas[0];
double soma = 0;

for (double nota : notas) {
    soma += nota;
    if (nota > maior) {
        maior = nota;
    }
}

System.out.println("Maior: " + maior);
System.out.println("Média: " + soma / notas.length);
~~~

~~~text
Maior: 9.5
Média: 7.25
~~~

Uma passagem só, dois acumuladores: \`soma\` começando em 0 e \`maior\` começando **no primeiro elemento**. Percorrer a lista duas vezes daria o mesmo resultado e faria o dobro do trabalho.

## As três armadilhas deste exercício

**1. \`maior\` começando em zero.** Funciona com notas, que são positivas. Com temperaturas negativas, o maior de \`{-5, -2}\` sairia \`0\` — um valor que nem está na lista.

**2. Divisão inteira.** Se as notas fossem \`int\`, \`soma / notas.length\` truncaria a média. Aqui \`notas\` é \`double[]\`, então a divisão já sai decimal. Com inteiros, seria preciso \`(double) soma / notas.length\`.

**3. Lista vazia.** \`notas[0]\` lança \`ArrayIndexOutOfBoundsException\` e a divisão por \`length\` zero daria problema. Código de produção começa perguntando:

~~~java
if (notas.length == 0) {
    System.out.println("Sem notas para resumir");
    return;
}
~~~

> Vale a pena ficar com o hábito: toda vez que você escrever \`[0]\` ou dividir por um tamanho, pergunte-se o que acontece se a coleção estiver vazia. É o caso que os testes esquecem e o usuário encontra.

## Formatando a saída

\`7.25\` já sai legível, mas \`7.333333333333333\` não. Para duas casas:

~~~java
System.out.printf("Média: %.2f%n", soma / notas.length);
~~~

O \`%.2f\` formata com duas casas decimais e o \`%n\` pula a linha.`,
      exercises: [
        {
          id: 'ja-des-03-e1',
          lessonId: 'ja-des-03',
          prompt:
            'Um método calcula a média de um `int[]` com `soma / notas.length`, e a média sai sempre sem casas decimais. Por quê?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Divisão entre dois inteiros devolve inteiro; falta converter, como em `(double) soma / notas.length`',
            'O método length devolve texto',
            'Porque a variável soma precisa ser final',
            'Porque arrays não podem ser divididos',
          ],
          expectedAnswer:
            'Divisão entre dois inteiros devolve inteiro; falta converter, como em `(double) soma / notas.length`',
          explanation:
            '`soma` e `length` são `int`, então o resultado é truncado antes mesmo de ser atribuído. Basta um dos lados virar `double` para a divisão sair decimal.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'ja-des-03-e2',
          lessonId: 'ja-des-03',
          prompt:
            'Ao resumir uma lista, qual caso costuma ser esquecido e quebra o programa em produção?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'A lista vazia: `notas[0]` lança exceção e a divisão pelo tamanho zero não faz sentido',
            'A lista com um único elemento',
            'A lista já ordenada',
            'A lista com elementos repetidos',
          ],
          expectedAnswer:
            'A lista vazia: `notas[0]` lança exceção e a divisão pelo tamanho zero não faz sentido',
          explanation:
            'Sempre que você escrever `[0]` ou dividir por um tamanho, pergunte o que acontece com a coleção vazia. É o caso que passa pelos testes escritos à mão e aparece com dado real.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
  ],
};
