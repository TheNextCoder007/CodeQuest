import type { Module } from '@/types/content';

/** Modulo 3 - Condicionais: if, else, operadores logicos e switch. */
export const condicionais: Module = {
  id: 'java-condicionais',
  languageId: 'java',
  title: 'Condicionais',
  description: 'Fazer o programa decidir — e a armadilha do == com textos.',
  icon: '🔀',
  orderIndex: 3,
  lessons: [
    {
      id: 'ja-cond-01',
      moduleId: 'java-condicionais',
      title: 'Decidir com if',
      subtitle: 'A condição entre parênteses',
      orderIndex: 1,
      content: `## A forma

~~~java
int compra = 150;

if (compra > 100) {
    System.out.println("Tem desconto");
}
~~~

~~~text
Tem desconto
~~~

Três diferenças em relação ao Python:

- a condição fica entre **parênteses**;
- o bloco fica entre **chaves**, não depois de \`:\`;
- não existe \`elif\` — é \`else if\`, duas palavras.

## Os operadores de comparação

| Operador | Pergunta |
| --- | --- |
| \`==\` | é igual? |
| \`!=\` | é diferente? |
| \`>\` \`<\` | maior / menor |
| \`>=\` \`<=\` | maior ou igual / menor ou igual |

O resultado é sempre um \`boolean\`.

## A condição precisa ser boolean

~~~java
int idade = 20;
if (idade) { }
~~~

~~~text
error: incompatible types: int cannot be converted to boolean
~~~

Em Python e JavaScript, um número vale como condição (\`0\` é falso, o resto é verdadeiro). Java **não aceita**: a condição tem de ser um \`boolean\` de verdade. Escreva \`if (idade > 0)\`.

> Isso elimina de vez o bug de escrever \`if (x = 5)\` — atribuição em vez de comparação — que em C e JavaScript passa despercebido. Em Java, \`x = 5\` devolve um \`int\`, e o compilador recusa.

## As chaves são opcionais (e é melhor não abrir mão)

~~~java
if (compra > 100)
    System.out.println("Tem desconto");
~~~

Funciona, mas só a **primeira** linha entra no \`if\`. Acrescentar uma segunda depois, achando que ela também está dentro, é um erro que já derrubou sistema em produção. Use sempre chaves.`,
      polyglot: [
        { language: 'Java', code: 'if (compra > 100) {\n    System.out.println("Tem desconto");\n}' },
        { language: 'Python', code: 'if compra > 100:\n    print("Tem desconto")' },
        { language: 'JavaScript', code: 'if (compra > 100) {\n  console.log("Tem desconto");\n}' },
      ],
      exercises: [
        {
          id: 'ja-cond-01-e1',
          lessonId: 'ja-cond-01',
          prompt: 'Por que `if (idade)` não compila em Java, sendo `idade` um `int`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'A condição de um if precisa ser um boolean, e um int não vira boolean sozinho',
            'Faltam as chaves do bloco',
            'A variável precisa ser final',
            'Compila normalmente: qualquer número diferente de zero é verdadeiro',
          ],
          expectedAnswer:
            'A condição de um if precisa ser um boolean, e um int não vira boolean sozinho',
          explanation:
            'Java não converte número em booleano. Escreva a comparação por extenso: `if (idade > 0)`. Em troca dessa rigidez, o erro clássico `if (x = 5)` deixa de existir.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-cond-01-e2',
          lessonId: 'ja-cond-01',
          prompt:
            'Complete a palavra que, em Java, faz o papel do `elif` do Python:\n\n~~~java\nif (nota >= 7) {\n    System.out.println("Aprovado");\n} ______ (nota >= 5) {\n    System.out.println("Recuperação");\n}\n~~~\n\n(Escreva as duas palavras.)',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'else if',
          hint: 'São duas palavras separadas por espaço — Java não tem uma palavra única para isso.',
          explanation:
            'Java usa `else if`, duas palavras. O `elif` é exclusivo do Python; escrever `elif` em Java é erro de compilação.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-cond-02',
      moduleId: 'java-condicionais',
      title: 'Comparar textos',
      subtitle: 'Por que == falha com String',
      orderIndex: 2,
      content: `## O erro mais famoso da linguagem

~~~java
String a = new String("Ana");
String b = new String("Ana");

System.out.println(a == b);
System.out.println(a.equals(b));
~~~

~~~text
false
true
~~~

Os dois textos têm o mesmo conteúdo, e mesmo assim \`==\` deu \`false\`.

## Por que

\`String\` é um objeto. Uma variável de objeto não guarda o texto: guarda **onde ele está na memória**.

- \`==\` compara os endereços: "são o mesmo objeto?"
- \`.equals()\` compara o conteúdo: "têm o mesmo texto?"

Para textos, você quase sempre quer \`.equals()\`.

| Comparação | Use |
| --- | --- |
| \`int\`, \`double\`, \`char\`, \`boolean\` | \`==\` |
| \`String\` e outros objetos | \`.equals()\` |

## Por que às vezes o == parece funcionar

~~~java
String a = "Ana";
String b = "Ana";
System.out.println(a == b);
~~~

~~~text
true
~~~

Textos escritos literalmente no código são reaproveitados pela JVM: as duas variáveis apontam para o mesmo objeto. Mas assim que o texto vier de um \`Scanner\`, de um arquivo ou de uma concatenação, isso deixa de valer.

> É o pior tipo de bug: funciona nos seus testes, com textos escritos à mão, e falha com dado de verdade. Use \`.equals()\` sempre — não só quando parecer necessário.

## Ignorando maiúsculas

~~~java
String resposta = "SIM";
System.out.println(resposta.equalsIgnoreCase("sim"));
~~~

~~~text
true
~~~`,
      exercises: [
        {
          id: 'ja-cond-02-e1',
          lessonId: 'ja-cond-02',
          prompt:
            'Complete para comparar corretamente o **conteúdo** de dois textos:\n\n~~~java\nif (resposta.______("sim")) {\n    System.out.println("Confirmado");\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'equals',
          hint: 'É o método que compara conteúdo, e não endereço de memória.',
          explanation:
            '`.equals()` compara o texto em si. O `==` compararia se são o mesmo objeto na memória — o que costuma dar `false` justamente quando o texto vem de fora do código.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-cond-02-e2',
          lessonId: 'ja-cond-02',
          prompt:
            'Um programa compara com `==` o nome digitado pelo usuário e funciona nos seus testes, mas falha com usuários reais. Por quê?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Textos escritos no código são reaproveitados pela JVM; texto vindo do teclado é outro objeto, e o == compara objetos',
            'O Scanner sempre devolve o texto em maiúsculas',
            'O == não funciona dentro de um if',
            'Falta converter o texto com Integer.parseInt',
          ],
          expectedAnswer:
            'Textos escritos no código são reaproveitados pela JVM; texto vindo do teclado é outro objeto, e o == compara objetos',
          explanation:
            'Literais iguais no código apontam para o mesmo objeto, então o `==` dá `true` por acidente. Texto lido em tempo de execução é um objeto novo, e a comparação passa a dar `false` mesmo com o conteúdo certo.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-cond-03',
      moduleId: 'java-condicionais',
      title: 'Vários caminhos',
      subtitle: 'else if em cadeia',
      orderIndex: 3,
      content: `## A cadeia

~~~java
int temperatura = 12;

if (temperatura > 30) {
    System.out.println("Calor");
} else if (temperatura >= 15) {
    System.out.println("Ameno");
} else {
    System.out.println("Frio");
}
~~~

~~~text
Frio
~~~

O Java testa de cima para baixo e **para no primeiro que der verdadeiro**. Os demais nem são avaliados.

## A ordem é a regra

~~~java
if (nota >= 5) {
    System.out.println("Recuperação");
} else if (nota >= 7) {
    System.out.println("Aprovado");
}
~~~

Com \`nota = 9\`, isso mostra **Recuperação**. O primeiro teste já foi verdadeiro, e o segundo nunca chega a rodar.

Numa cadeia de faixas, comece sempre pela **mais restritiva**.

> Este erro não gera nenhum aviso: compila, roda e simplesmente classifica errado. É o tipo de defeito que só um teste com valores de cada faixa encontra.

## O else é opcional

Sem \`else\`, se nada bater, nada acontece. Com \`else\`, você garante que sempre há uma saída — e por isso ele é útil como rede de segurança em classificações.`,
      exercises: [
        {
          id: 'ja-cond-03-e1',
          lessonId: 'ja-cond-03',
          prompt:
            'Com `nota = 9`, o que este trecho mostra?\n\n~~~java\nif (nota >= 5) {\n    System.out.println("Recuperação");\n} else if (nota >= 7) {\n    System.out.println("Aprovado");\n}\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['Recuperação', 'Aprovado', 'Recuperação e Aprovado', 'Nada'],
          expectedAnswer: 'Recuperação',
          explanation:
            'A cadeia para no primeiro teste verdadeiro. Como `9 >= 5` já é verdade, o `else if` nem é avaliado. Numa faixa, a condição mais restritiva vem primeiro.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-cond-03-e2',
          lessonId: 'ja-cond-03',
          prompt:
            'Numa cadeia de `else if` que classifica faixas de valor, por onde a cadeia deve começar?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Pela condição mais restritiva',
            'Pela condição mais abrangente',
            'Pela ordem alfabética das mensagens',
            'Tanto faz: o Java avalia todas e escolhe a melhor',
          ],
          expectedAnswer: 'Pela condição mais restritiva',
          explanation:
            'Como a execução para no primeiro teste verdadeiro, uma condição abrangente colocada antes engole todos os casos seguintes. Java não avalia as demais nem escolhe a "melhor".',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-cond-04',
      moduleId: 'java-condicionais',
      title: 'Combinando condições',
      subtitle: '&&, || e switch',
      orderIndex: 4,
      content: `## E, OU, NÃO

~~~java
int idade = 22;
boolean temHabilitacao = false;

if (idade >= 18 && temHabilitacao) {
    System.out.println("Pode dirigir");
} else {
    System.out.println("Não pode dirigir");
}
~~~

~~~text
Não pode dirigir
~~~

| Operador | Verdadeiro quando | Em Python |
| --- | --- | --- |
| \`&&\` | os **dois** lados são verdadeiros | \`and\` |
| \`\\|\\|\` | **pelo menos um** é verdadeiro | \`or\` |
| \`!\` | inverte | \`not\` |

## Curto-circuito

\`&&\` e \`||\` param assim que a resposta já está decidida:

~~~java
if (nome != null && nome.length() > 0) { }
~~~

Se \`nome\` for \`null\`, o lado direito **não é avaliado** — e é isso que evita o \`NullPointerException\`. Inverter a ordem dos dois testes quebraria o programa.

> Guarde este padrão: verificar \`!= null\` **antes** de usar o objeto, no mesmo \`&&\`. É a defesa mais comum contra a exceção mais comum do Java.

## switch: muitos valores exatos

Quando você compara a **mesma variável** com vários valores fixos, o \`switch\` fica mais legível:

~~~java
int dia = 3;

switch (dia) {
    case 1:
        System.out.println("Domingo");
        break;
    case 3:
        System.out.println("Terça");
        break;
    default:
        System.out.println("Outro dia");
}
~~~

~~~text
Terça
~~~

O \`break\` é obrigatório: sem ele a execução **continua no próximo case**, mesmo com o valor diferente. Esquecer o \`break\` é um clássico.

\`switch\` serve para igualdade exata. Para faixas (\`nota >= 7\`), continue com \`if / else if\`.`,
      exercises: [
        {
          id: 'ja-cond-04-e1',
          lessonId: 'ja-cond-04',
          prompt:
            'Complete o operador que exige as **duas** condições verdadeiras:\n\n~~~java\nif (idade >= 18 ______ temHabilitacao) {\n    System.out.println("Pode dirigir");\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: '&&',
          hint: 'São dois caracteres iguais — o "and" do Java.',
          explanation:
            '`&&` é o E lógico. Ele também tem curto-circuito: se o lado esquerdo já for falso, o direito nem é avaliado.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-cond-04-e2',
          lessonId: 'ja-cond-04',
          prompt: 'O que acontece num `switch` quando você esquece o `break` de um `case`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'A execução continua no case seguinte, mesmo com o valor diferente',
            'O switch inteiro é ignorado',
            'Erro de compilação',
            'Só o default é executado',
          ],
          expectedAnswer:
            'A execução continua no case seguinte, mesmo com o valor diferente',
          explanation:
            'É o chamado *fall-through*: sem `break`, o programa segue executando os próximos `case`. Compila sem nenhum aviso, então o defeito só aparece na saída errada.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
  ],
};
