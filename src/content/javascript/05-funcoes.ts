import type { Module } from '@/types/content';

/**
 * Modulo 5 - Funcoes (JavaScript).
 * Objetivo: parar de repetir codigo. Inclui arrow function, que e sintaxe do
 * dia a dia em JavaScript e pre-requisito para os metodos de array do modulo
 * seguinte.
 */
export const funcoes: Module = {
  id: 'js-funcoes',
  languageId: 'javascript',
  title: 'Funções',
  description:
    'Dar nome a um pedaço de código e reutilizá-lo: parâmetros, return, arrow functions e escopo.',
  icon: '🧩',
  orderIndex: 5,
  lessons: [
    {
      id: 'js-func-01',
      moduleId: 'js-funcoes',
      title: 'Criando uma função',
      subtitle: 'Dar nome a um pedaço de código',
      orderIndex: 1,
      content: `## O problema

Se o mesmo trecho aparece em três lugares do seu programa e você precisa corrigi-lo, são três correções — e basta esquecer uma para o programa ficar inconsistente.

Uma **função** resolve isso: você escreve o trecho **uma vez**, dá um nome a ele e passa a usar o nome.

## Declarar e chamar

~~~js
function saudar() {
  console.log("Bem-vindo ao CodeQuest");
}

saudar();
saudar();
~~~

~~~text
Bem-vindo ao CodeQuest
Bem-vindo ao CodeQuest
~~~

São duas etapas bem diferentes:

- **declarar** (\`function saudar() { ... }\`) apenas ensina o que fazer. Nada acontece;
- **chamar** (\`saudar();\`) é o que executa.

Declarar sem chamar é o esquecimento mais comum de quem está começando: o programa roda, não dá erro nenhum e não mostra nada.

## Os parênteses fazem parte do nome

~~~js
saudar;    // apenas menciona a função, não executa
saudar();  // executa
~~~

Sem os parênteses você está falando **sobre** a função, não pedindo que ela rode.

## Como escolher o nome

Funções fazem coisas, então o nome começa com um **verbo**, em camelCase:

- \`calcularMedia\`, \`validarSenha\`, \`mostrarRelatorio\` — bons;
- \`media\`, \`senha\`, \`x\` — ruins: parecem variáveis.

## Uma função por responsabilidade

Se você precisa usar "e" para explicar o que a função faz ("calcula a média **e** mostra na tela **e** salva"), provavelmente são três funções. Funções pequenas são mais fáceis de testar, de reaproveitar e de corrigir.`,
      polyglot: [
        {
          language: 'JavaScript',
          code: 'function saudar() {\n  console.log("Olá");\n}\n\nsaudar();',
        },
        { language: 'Python', code: 'def saudar():\n    print("Olá")\n\nsaudar()' },
        {
          language: 'Java',
          code: 'static void saudar() {\n  System.out.println("Olá");\n}\n\nsaudar();',
        },
      ],
      exercises: [
        {
          id: 'js-func-01-e1',
          lessonId: 'js-func-01',
          prompt:
            'Crie uma função chamada `abrirJogo` que mostre `Partida iniciada` e chame-a **duas vezes**:\n\n~~~text\nPartida iniciada\nPartida iniciada\n~~~',
          starterCode: '// declare a função e chame duas vezes\n',
          validationType: 'output_match',
          expectedAnswer: 'Partida iniciada\nPartida iniciada',
          hint: 'function abrirJogo() { console.log("Partida iniciada"); } e depois duas linhas com abrirJogo();',
          explanation:
            'O texto foi escrito uma vez só e apareceu duas — esse é o ganho. As chamadas ficam **fora** das chaves da função: dentro, elas fariam a função chamar a si mesma sem parar.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-func-01-e2',
          lessonId: 'js-func-01',
          prompt:
            'O que este programa mostra?\n\n~~~js\nfunction avisar() {\n  console.log("Atenção");\n}\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Nada: a função foi declarada, mas nunca chamada',
            'Atenção, uma vez',
            'Um erro dizendo que falta chamar a função',
            'Atenção, infinitamente',
          ],
          expectedAnswer: 'Nada: a função foi declarada, mas nunca chamada',
          explanation:
            'Declarar só ensina o que fazer; executar é a chamada `avisar();`. E note que o JavaScript **não** avisa que você esqueceu — o programa termina normalmente, sem saída. Quando "não aparece nada", verifique se a chamada existe.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-func-02',
      moduleId: 'js-funcoes',
      title: 'Parâmetros e return',
      subtitle: 'Funções que recebem e devolvem',
      orderIndex: 2,
      content: `## Funções que recebem dados

Um **parâmetro** é uma variável que a função recebe de fora:

~~~js
function saudar(nome) {
  console.log(\`Olá, \${nome}!\`);
}

saudar("Ana");
saudar("Luiz");
~~~

~~~text
Olá, Ana!
Olá, Luiz!
~~~

A mesma função, resultados diferentes. Pode ter quantos parâmetros você precisar, separados por vírgula.

## Funções que devolvem: return

\`console.log()\` **mostra**. \`return\` **devolve** — e essa diferença é maior do que parece:

~~~js
function calcularMedia(a, b) {
  return (a + b) / 2;
}

const resultado = calcularMedia(7, 9);
console.log(resultado);
console.log(calcularMedia(10, 6) > 7);
~~~

~~~text
8
true
~~~

Como a função **devolve** um valor, ele pode ser guardado, comparado, somado, passado adiante. Se ela apenas mostrasse na tela, o valor se perderia ali.

> Regra prática: uma função que **calcula** deve usar \`return\`. Deixe a exibição para quem chamou. Assim a mesma função serve para mostrar na tela hoje e para salvar num arquivo amanhã.

## return encerra a função na hora

~~~js
function testar() {
  return "primeiro";
  console.log("nunca chego aqui");
}
~~~

Nenhuma linha depois do \`return\` executa. Isso é útil para sair mais cedo:

~~~js
function dividir(a, b) {
  if (b === 0) {
    return "Não dá para dividir por zero";
  }
  return a / b;
}
~~~

## Função sem return devolve undefined

~~~js
function semRetorno() {
  console.log("oi");
}

const valor = semRetorno();
console.log(valor);
~~~

~~~text
oi
undefined
~~~

Se um resultado seu apareceu como \`undefined\`, a primeira suspeita é uma função que esqueceu o \`return\`.

## Valores padrão

Um parâmetro pode ter valor padrão, usado quando o argumento não é passado:

~~~js
function saudar(nome = "visitante") {
  console.log(\`Olá, \${nome}!\`);
}

saudar();
~~~

~~~text
Olá, visitante!
~~~`,
      exercises: [
        {
          id: 'js-func-02-e1',
          lessonId: 'js-func-02',
          prompt:
            'Crie uma função `calcularMedia` que receba dois números e **devolva** a média. Mostre o resultado de `calcularMedia(7, 9)`:\n\n~~~text\n8\n~~~',
          starterCode: '// a função deve usar return, não console.log\n',
          validationType: 'output_match',
          expectedAnswer: '8',
          hint: 'function calcularMedia(a, b) { return (a + b) / 2; } e depois console.log(calcularMedia(7, 9));',
          explanation:
            'Os parênteses em `(a + b) / 2` são obrigatórios: sem eles o JavaScript dividiria só o `b`. E como `16 / 2` dá exatamente 8, a saída é `8` — em JavaScript não existe `8.0`, porque inteiro e decimal são o mesmo tipo.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'js-func-02-e2',
          lessonId: 'js-func-02',
          prompt:
            'O que este programa mostra?\n\n~~~js\nfunction dobrar(n) {\n  console.log(n * 2);\n}\n\nconst resultado = dobrar(5);\nconsole.log(resultado);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['10 e depois undefined', '10 e depois 10', 'undefined e depois 10', 'Apenas 10'],
          expectedAnswer: '10 e depois undefined',
          explanation:
            'A função **mostra** 10, mas não **devolve** nada — e toda função sem `return` devolve `undefined`. Por isso `resultado` fica `undefined`. Trocando o `console.log(n * 2)` por `return n * 2`, as duas linhas mostrariam 10.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-func-03',
      moduleId: 'js-funcoes',
      title: 'Arrow functions',
      subtitle: 'A sintaxe curta que você vai ver em todo código moderno',
      orderIndex: 3,
      content: `## A mesma função, escrita de outro jeito

Desde 2015 o JavaScript tem uma segunda forma de escrever funções, chamada **arrow function** (função seta). As duas abaixo fazem exatamente a mesma coisa:

~~~js
function dobrar(n) {
  return n * 2;
}

const dobrarSeta = (n) => {
  return n * 2;
};
~~~

Repare na estrutura: a arrow function é um **valor**, guardado numa variável com \`const\`. Some a palavra \`function\` e aparece o \`=>\` entre os parâmetros e o corpo.

## O retorno implícito

Quando o corpo é uma **única expressão**, você pode remover as chaves e o \`return\`:

~~~js
const dobrar = (n) => n * 2;

console.log(dobrar(5));
~~~

~~~text
10
~~~

Foi de quatro linhas para uma, sem perder clareza. Esse é o formato que você mais vai encontrar.

> Cuidado: as chaves e o \`return\` andam **juntos**. \`(n) => { n * 2 }\` calcula e joga fora o resultado, devolvendo \`undefined\`. Ou tira os dois, ou mantém os dois.

## Variações da sintaxe

~~~js
const semParametro = () => "oi";
const umParametro = (n) => n * 2;
const semParenteses = n => n * 2;
const doisParametros = (a, b) => a + b;

const comCorpo = (a, b) => {
  const soma = a + b;
  return soma / 2;
};
~~~

Com **um** parâmetro os parênteses são opcionais; com zero ou dois ou mais, obrigatórios. Este curso mantém os parênteses sempre, porque a linha fica igual em todos os casos.

## Quando usar cada uma

Na prática, ambas resolvem. A escolha do dia a dia:

- **arrow function** para funções curtas, principalmente quando ela é passada como argumento para outra (é o que você vai fazer no módulo de Desafios, com \`map\` e \`filter\`);
- **\`function\`** para funções maiores e nomeadas, onde a palavra na frente ajuda a localizar a declaração no arquivo.

Há também uma diferença técnica no comportamento do \`this\` dentro de cada uma. Isso só aparece em programação orientada a objetos, que está além desta trilha — por ora, guarde que **elas não são 100% intercambiáveis**.`,
      polyglot: [
        { language: 'JavaScript', code: 'const dobrar = (n) => n * 2;' },
        { language: 'Python', code: 'dobrar = lambda n: n * 2' },
        { language: 'Java', code: 'Function<Integer, Integer> dobrar = n -> n * 2;' },
      ],
      exercises: [
        {
          id: 'js-func-03-e1',
          lessonId: 'js-func-03',
          prompt:
            'Escreva uma **arrow function** chamada `ehPar` que devolva `true` se o número for par. Mostre o resultado para 4 e para 7:\n\n~~~text\ntrue\nfalse\n~~~',
          starterCode: '// use const ehPar = (numero) => ...\n',
          validationType: 'output_match',
          expectedAnswer: 'true\nfalse',
          hint: 'const ehPar = (numero) => numero % 2 === 0; e depois console.log(ehPar(4)); console.log(ehPar(7));',
          explanation:
            'A comparação `numero % 2 === 0` já **é** um booleano, então ela pode ser devolvida direto — não precisa de `if (...) return true; else return false;`. Devolver a comparação em vez de ramificar é um hábito que deixa o código bem mais limpo.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'js-func-03-e2',
          lessonId: 'js-func-03',
          prompt: 'Qual destas arrow functions devolve a soma de `a` e `b`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'const somar = (a, b) => a + b;',
            'const somar = (a, b) => { a + b };',
            'const somar = (a, b) -> a + b;',
            'const somar = => (a, b) a + b;',
          ],
          expectedAnswer: 'const somar = (a, b) => a + b;',
          explanation:
            'Sem chaves, o valor da expressão é devolvido automaticamente. A segunda opção é a pegadinha: com chaves e **sem** `return`, a soma é calculada e descartada, e a função devolve `undefined`. A seta do JavaScript é `=>`; `->` é de outras linguagens.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-func-04',
      moduleId: 'js-funcoes',
      title: 'Escopo',
      subtitle: 'Onde cada variável existe',
      orderIndex: 4,
      content: `## Variável tem endereço

**Escopo** é a região do programa onde uma variável existe. Fora dela, é como se nunca tivesse sido criada:

~~~js
function calcular() {
  const interno = 10;
  console.log(interno);
}

calcular();
console.log(interno); // ReferenceError: interno is not defined
~~~

Isso é uma qualidade, não um obstáculo: como as variáveis de uma função morrem com ela, você pode usar \`i\` em vinte funções diferentes sem que uma atrapalhe a outra.

## let e const respeitam qualquer bloco

Em JavaScript, \`let\` e \`const\` valem **dentro do bloco em que foram declarados** — e bloco é qualquer par de chaves, não só o de uma função:

~~~js
if (true) {
  let dentro = "existo só aqui";
  console.log(dentro);
}

console.log(dentro); // ReferenceError
~~~

## O var e o problema que ele causa

\`var\` ignora blocos. Ele vale na função inteira, mesmo declarado dentro de um \`if\` ou de um \`for\`:

~~~js
for (var i = 0; i < 3; i++) {
  // ...
}
console.log(i);
~~~

~~~text
3
~~~

Com \`var\`, o \`i\` **vazou** do laço e continua valendo 3 depois dele. Com \`let\`, essa última linha daria \`ReferenceError\` — que é o comportamento desejável: o contador do laço não tem por que existir fora dele.

Este é o motivo concreto da recomendação do módulo 2: **use \`let\` e \`const\`, nunca \`var\`.**

## Lendo de fora para dentro

Uma função **enxerga** as variáveis declaradas fora dela:

~~~js
const taxa = 0.1;

function calcularTotal(valor) {
  return valor + valor * taxa;
}

console.log(calcularTotal(100));
~~~

~~~text
110
~~~

> Já que estamos em decimais, guarde uma armadilha que existe em **qualquer** linguagem, não só no JavaScript: \`console.log(0.1 + 0.2)\` mostra \`0.30000000000000004\`. Números com casas decimais são guardados em binário, e nem todos cabem exatamente. Quando o resultado é dinheiro, arredonde na hora de mostrar — \`Math.round(valor * 100) / 100\` deixa duas casas.

## O que passar por parâmetro

Depender de variáveis de fora funciona, mas amarra a função ao resto do arquivo. Uma função que recebe tudo de que precisa por **parâmetro** pode ser levada para qualquer lugar — e testada isoladamente.`,
      exercises: [
        {
          id: 'js-func-04-e1',
          lessonId: 'js-func-04',
          prompt:
            'O que acontece ao executar isto?\n\n~~~js\nif (true) {\n  let mensagem = "oi";\n}\n\nconsole.log(mensagem);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'ReferenceError: mensagem is not defined',
            'Mostra "oi" normalmente',
            'Mostra undefined',
            'SyntaxError na linha do if',
          ],
          expectedAnswer: 'ReferenceError: mensagem is not defined',
          explanation:
            '`let` existe apenas dentro do bloco em que foi declarado — e o `if` tem o seu próprio bloco. Se ali estivesse `var mensagem`, o programa mostraria `oi`, porque `var` ignora blocos. É essa inconsistência que faz o `var` ser evitado hoje.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'js-func-04-e2',
          lessonId: 'js-func-04',
          prompt:
            'A variável `contador` precisa sobreviver entre as chamadas da função. Complete o programa para a saída ser:\n\n~~~text\n1\n2\n3\n~~~',
          starterCode:
            'let contador = 0;\n\nfunction registrar() {\n  // aumente o contador e mostre o valor\n}\n\nregistrar();\nregistrar();\nregistrar();\n',
          validationType: 'output_match',
          expectedAnswer: '1\n2\n3',
          hint: 'Dentro da função: contador++; e depois console.log(contador);',
          explanation:
            'Como `contador` foi declarado **fora**, ele sobrevive a cada chamada e vai acumulando. Se a declaração estivesse dentro da função, ela seria recriada com zero toda vez e a saída seria `1 1 1`.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
  ],
};
