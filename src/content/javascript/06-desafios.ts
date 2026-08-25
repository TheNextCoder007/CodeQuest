import type { Module } from '@/types/content';

/**
 * Modulo 6 - Desafios (JavaScript).
 * Objetivo: juntar tudo em problemas classicos e apresentar os metodos de
 * array, que sao a forma como JavaScript de verdade percorre listas.
 */
export const desafios: Module = {
  id: 'js-desafios',
  languageId: 'javascript',
  title: 'Desafios',
  description:
    'Problemas clássicos que juntam tudo: FizzBuzz, validação de senha e os métodos de array que substituem metade dos seus laços.',
  icon: '🏆',
  orderIndex: 6,
  lessons: [
    {
      id: 'js-des-01',
      moduleId: 'js-desafios',
      title: 'FizzBuzz',
      subtitle: 'O exercício mais famoso das entrevistas',
      orderIndex: 1,
      content: `## O enunciado

Para os números de 1 a 15:

- múltiplo de **3 e de 5** → escreva \`FizzBuzz\`;
- múltiplo de **3** → escreva \`Fizz\`;
- múltiplo de **5** → escreva \`Buzz\`;
- nenhum dos casos → escreva o próprio número.

Parece trivial, e é justamente por isso que ele é usado em entrevistas: quem não pensa na ordem das condições erra.

## A armadilha

Esta é a tentativa mais comum — e está **errada**:

~~~js
if (i % 3 === 0) {
  console.log("Fizz");
} else if (i % 5 === 0) {
  console.log("Buzz");
} else if (i % 3 === 0 && i % 5 === 0) {
  console.log("FizzBuzz");
}
~~~

O 15 é múltiplo de 3 **e** de 5, mas a primeira condição já é verdadeira e o \`else if\` interrompe a cadeia ali. \`FizzBuzz\` nunca aparece.

## A regra geral

**Do caso mais específico para o mais geral.** "Múltiplo de 3 e de 5" é mais restrito do que "múltiplo de 3", então vem primeiro:

~~~js
if (i % 3 === 0 && i % 5 === 0) {
  // ...
} else if (i % 3 === 0) {
  // ...
}
~~~

Essa ordem já apareceu na lição de \`else if\`, com as faixas de temperatura. É o mesmo raciocínio — e ele volta em quase todo programa que classifica alguma coisa.

## Como atacar um problema desses

1. **releia** o enunciado e liste os casos possíveis;
2. **ordene** do mais específico para o mais geral;
3. **escreva** um caminho de cada vez;
4. **teste** com um valor de cada categoria — aqui: 3, 5, 15 e 7.

O passo 4 é o que separa "funcionou" de "está certo". Se você testou FizzBuzz só até 10, não testou nada.`,
      exercises: [
        {
          id: 'js-des-01-e1',
          lessonId: 'js-des-01',
          prompt:
            'Escreva o FizzBuzz de 1 a 15. A saída deve ser exatamente:\n\n~~~text\n1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n~~~',
          starterCode: '// lembre da ordem: o caso mais específico vem primeiro\n',
          validationType: 'output_match',
          expectedAnswer:
            '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
          hint: 'for de 1 a 15. Dentro dele: if (i % 3 === 0 && i % 5 === 0) primeiro, depois os casos de 3 e de 5, e um else final com o próprio número.',
          explanation:
            'A condição dupla precisa ser testada antes das simples. Repare também no `else` final: sem ele, os números comuns não apareceriam. E `console.log(i)` mostra o número — nem tudo que sai do laço precisa ser texto.',
          xpReward: 50,
          orderIndex: 1,
        },
        {
          id: 'js-des-01-e2',
          lessonId: 'js-des-01',
          prompt:
            'No FizzBuzz, por que testar `i % 3 === 0 && i % 5 === 0` **por último** não funciona?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Porque o else if para na primeira condição verdadeira, e a de múltiplo de 3 já pegou o 15',
            'Porque o operador && não funciona dentro de else if',
            'Porque 15 não é múltiplo de 3',
            'Porque o % só funciona com um número por vez',
          ],
          expectedAnswer:
            'Porque o else if para na primeira condição verdadeira, e a de múltiplo de 3 já pegou o 15',
          explanation:
            'Uma cadeia de `else if` é avaliada de cima para baixo e para no primeiro acerto. Como 15 satisfaz "múltiplo de 3", a execução nunca chega à condição dupla lá embaixo. Por isso o caso mais específico tem de vir primeiro.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-des-02',
      moduleId: 'js-desafios',
      title: 'Validador de senha',
      subtitle: 'Retorno antecipado e métodos de texto',
      orderIndex: 2,
      content: `## O padrão de validação

Validar é responder "isto está aceitável?" e, se não estiver, dizer **por quê**. A forma mais legível de escrever isso é com **retornos antecipados**: cada problema tem um \`return\` próprio, e o "tudo certo" fica no fim.

~~~js
function validarSenha(senha) {
  if (senha.length < 8) {
    return "Senha muito curta";
  }
  if (senha === "12345678") {
    return "Senha óbvia demais";
  }
  return "Senha aceita";
}

console.log(validarSenha("abc"));
console.log(validarSenha("codequest2026"));
~~~

~~~text
Senha muito curta
Senha aceita
~~~

Compare com a alternativa aninhada:

~~~js
if (senha.length >= 8) {
  if (senha !== "12345678") {
    return "Senha aceita";
  } else {
    return "Senha óbvia demais";
  }
} else {
  return "Senha muito curta";
}
~~~

Mesmo resultado, muito mais difícil de ler — e cada regra nova empurra tudo um nível para a direita. **Trate os casos ruins primeiro e saia cedo.**

## Métodos de texto

Todo texto em JavaScript vem com funções embutidas, chamadas com um ponto:

| Método | Faz | Exemplo |
| --- | --- | --- |
| \`.length\` | tamanho (sem parênteses!) | \`"abc".length\` → \`3\` |
| \`.toUpperCase()\` | tudo maiúsculo | \`"ana".toUpperCase()\` → \`"ANA"\` |
| \`.toLowerCase()\` | tudo minúsculo | \`"ANA".toLowerCase()\` → \`"ana"\` |
| \`.trim()\` | remove espaços das pontas | \`" oi ".trim()\` → \`"oi"\` |
| \`.includes(x)\` | contém? | \`"codequest".includes("quest")\` → \`true\` |
| \`.replace(a, b)\` | troca | \`"a-b".replace("-", " ")\` → \`"a b"\` |

Repare que \`.length\` é o único **sem** parênteses: é uma propriedade, não uma função.

## Encadeando

Como cada método devolve um texto novo, dá para chamar o próximo em seguida:

~~~js
const email = "  ANA@Email.COM  ";
console.log(email.trim().toLowerCase());
~~~

~~~text
ana@email.com
~~~

A leitura é da esquerda para a direita: tira os espaços, depois passa para minúsculas. E o original não muda — textos em JavaScript são **imutáveis**, todo método devolve uma cópia.`,
      exercises: [
        {
          id: 'js-des-02-e1',
          lessonId: 'js-des-02',
          prompt:
            'Escreva `validarSenha(senha)` com as regras: menos de 8 caracteres → `Senha muito curta`; exatamente `12345678` → `Senha óbvia demais`; caso contrário → `Senha aceita`. Teste com `abc`, `12345678` e `codequest2026`:\n\n~~~text\nSenha muito curta\nSenha óbvia demais\nSenha aceita\n~~~',
          starterCode: '// use return antecipado para cada caso ruim\n',
          validationType: 'output_match',
          expectedAnswer: 'Senha muito curta\nSenha óbvia demais\nSenha aceita',
          hint: 'Dentro da função: primeiro if (senha.length < 8), depois if (senha === "12345678"), e no fim return "Senha aceita". Depois, três console.log() chamando a função.',
          explanation:
            'A ordem importa: `12345678` tem 8 caracteres, então passa pela primeira regra e é pega pela segunda. Se o teste de tamanho exigisse 10, essa senha nunca chegaria à segunda regra — e a mensagem seria outra.',
          xpReward: 50,
          orderIndex: 1,
        },
        {
          id: 'js-des-02-e2',
          lessonId: 'js-des-02',
          prompt:
            'Normalize o e-mail guardado em `email`: remova os espaços das pontas e deixe tudo minúsculo, **encadeando** os métodos.\n\n~~~text\nana@email.com\n~~~',
          starterCode: 'const email = "  ANA@Email.COM  ";\n\n// mostre o e-mail normalizado\n',
          validationType: 'output_match',
          expectedAnswer: 'ana@email.com',
          hint: 'console.log(email.trim().toLowerCase());',
          explanation:
            'Cada método devolve um texto novo, então o seguinte já opera sobre o resultado do anterior. A variável `email` continua com os espaços e as maiúsculas: textos são imutáveis em JavaScript, e é por isso que você precisa **usar** o valor devolvido.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-des-03',
      moduleId: 'js-desafios',
      title: 'Métodos de array',
      subtitle: 'map, filter e reduce',
      orderIndex: 3,
      content: `## Laços que você não precisa escrever

Percorrer array com \`for\` funciona. Mas o JavaScript oferece métodos que dizem **o que** você quer, em vez de **como** percorrer — e é assim que se escreve na prática.

Os três recebem uma função (geralmente uma arrow function) que será aplicada a cada item.

## map: transformar cada item

~~~js
const precos = [10, 20, 30];
const comDesconto = precos.map((preco) => preco * 0.9);

console.log(comDesconto);
~~~

~~~text
[9, 18, 27]
~~~

\`map\` devolve um array **do mesmo tamanho**, com cada item transformado. O original fica intacto.

## filter: escolher alguns

~~~js
const notas = [7, 9.5, 4, 8.5];
const aprovadas = notas.filter((nota) => nota >= 7);

console.log(aprovadas.length);
~~~

~~~text
3
~~~

A função passada para \`filter\` responde uma pergunta de sim ou não. Quem devolve \`true\` fica; quem devolve \`false\` sai. O array resultante é **menor ou igual** ao original.

## reduce: juntar tudo em um valor

~~~js
const notas = [7, 9.5, 4, 8.5];
const soma = notas.reduce((total, nota) => total + nota, 0);

console.log(soma);
~~~

~~~text
29
~~~

\`reduce\` é o acumulador do módulo de Repetições, embutido na linguagem. Ele recebe duas coisas:

- a função \`(total, item) => ...\`, cujo retorno vira o \`total\` da próxima volta;
- o **valor inicial** (\`0\`), que é o \`total\` da primeira.

Esqueça o \`0\` e o primeiro item vira o valor inicial — o que quebra feio quando o array está vazio.

## Comparando com o for

~~~js
// com for
let soma = 0;
for (const nota of notas) {
  soma += nota;
}

// com reduce
const soma = notas.reduce((total, nota) => total + nota, 0);
~~~

Mesma coisa. A segunda é uma linha, não precisa de \`let\` e não dá espaço para você errar o índice.

## Encadeando os três

Como \`map\` e \`filter\` devolvem arrays, eles se encaixam:

~~~js
const notas = [7, 9.5, 4, 8.5];

const media = notas
  .filter((nota) => nota >= 7)
  .reduce((total, nota) => total + nota, 0) / 3;

console.log(media);
~~~

~~~text
8.333333333333334
~~~

> Quando usar \`for\` então? Quando precisar parar no meio (\`break\`) ou quando o corpo do laço fizer várias coisas. Para "transformar", "filtrar" e "somar", os métodos deixam a intenção explícita já no nome.

## Um utilitário a mais: join

\`join\` transforma um array em texto, com o separador que você escolher:

~~~js
console.log([9, 18, 27].join(", "));
~~~

~~~text
9, 18, 27
~~~`,
      polyglot: [
        { language: 'JavaScript', code: 'const pares = numeros.filter((n) => n % 2 === 0);' },
        { language: 'Python', code: 'pares = [n for n in numeros if n % 2 == 0]' },
        {
          language: 'Java',
          code: 'var pares = numeros.stream()\n  .filter(n -> n % 2 == 0)\n  .toList();',
        },
      ],
      exercises: [
        {
          id: 'js-des-03-e1',
          lessonId: 'js-des-03',
          prompt:
            'Com o array `notas`, use `filter` para contar quantas notas são maiores ou iguais a 7 e `reduce` para calcular a média de todas. A saída deve ser:\n\n~~~text\nAprovadas: 3\nMédia: 7.25\n~~~',
          starterCode:
            'const notas = [7, 9.5, 4, 8.5];\n\n// use filter e reduce, e mostre com template literal\n',
          validationType: 'output_match',
          expectedAnswer: 'Aprovadas: 3\nMédia: 7.25',
          hint: 'const aprovadas = notas.filter((nota) => nota >= 7); const soma = notas.reduce((total, nota) => total + nota, 0); depois use aprovadas.length e soma / notas.length.',
          explanation:
            'As três notas aprovadas são 7, 9.5 e 8.5 — o `>=` inclui o 7 exato. A soma total é 29 e dividida por `notas.length` (4) dá 7.25. Usar `notas.length` em vez de escrever `4` é o que faz o programa continuar certo se você acrescentar uma nota.',
          xpReward: 50,
          orderIndex: 1,
        },
        {
          id: 'js-des-03-e2',
          lessonId: 'js-des-03',
          prompt:
            'Aplique 10% de desconto em cada preço com `map` e mostre o resultado separado por vírgula e espaço, usando `join`:\n\n~~~text\n9, 18, 27\n~~~',
          starterCode: 'const precos = [10, 20, 30];\n\n// use map e depois join\n',
          validationType: 'output_match',
          expectedAnswer: '9, 18, 27',
          hint: 'const comDesconto = precos.map((preco) => preco * 0.9); e depois console.log(comDesconto.join(", "));',
          explanation:
            '`map` devolve um array novo do mesmo tamanho, com cada item transformado — `precos` continua `[10, 20, 30]`. O `join(", ")` junta tudo num único texto, que é como se costuma mostrar uma lista para quem usa o programa.',
          xpReward: 50,
          orderIndex: 2,
        },
      ],
    },
  ],
};
