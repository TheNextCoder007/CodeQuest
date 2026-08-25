import type { Module } from '@/types/content';

/**
 * Modulo 1 - Fundamentos (JavaScript).
 * Objetivo: mostrar que o JavaScript ja esta instalado em tudo que o aluno
 * usa, e fazer a primeira coisa aparecer na tela ainda na segunda licao.
 */
export const fundamentos: Module = {
  id: 'js-fundamentos',
  languageId: 'javascript',
  title: 'Fundamentos',
  description:
    'Onde o JavaScript roda, como fazer a primeira coisa aparecer na tela e como ler um erro sem entrar em pânico.',
  icon: '🐣',
  orderIndex: 1,
  lessons: [
    {
      id: 'js-fund-01',
      moduleId: 'js-fundamentos',
      title: 'Onde o JavaScript roda',
      subtitle: 'A linguagem que já está em todo lugar',
      orderIndex: 1,
      content: `## A linguagem que veio junto

Para rodar Python, Java ou C++ você precisa instalar alguma coisa. Para rodar JavaScript, **não**. Todo navegador — Chrome, Firefox, Safari, Edge — já vem com um motor de JavaScript embutido.

É por isso que o JavaScript está em praticamente tudo:

- **páginas web** — o botão que abre um menu, o formulário que avisa "senha muito curta" antes de enviar;
- **servidores** — com o Node.js, a mesma linguagem passou a rodar fora do navegador;
- **aplicativos de celular e de computador** — o próprio CodeQuest que você está usando agora é escrito em JavaScript.

## Um programa é uma lista de instruções

Um computador não adivinha nada. Ele faz **exatamente** o que você mandou, **na ordem em que você mandou** — de cima para baixo, uma linha por vez.

Sobre essa base existem três ideias, e elas aparecem em qualquer linguagem:

- **Sequência** — as instruções acontecem em ordem.
- **Decisão** — o programa escolhe caminhos diferentes dependendo de uma condição (módulo 🔀 Condicionais).
- **Repetição** — o programa repete um trecho sem você reescrever (módulo 🔁 Repetições).

**O conceito é o mesmo em toda linguagem; só a sintaxe muda.** Veja "mostre Olá na tela" em três delas:`,
      polyglot: [
        { language: 'JavaScript', code: 'console.log("Olá");' },
        { language: 'Python', code: 'print("Olá")' },
        { language: 'Java', code: 'System.out.println("Olá");' },
      ],
      exercises: [
        {
          id: 'js-fund-01-e1',
          lessonId: 'js-fund-01',
          prompt: 'O que é preciso instalar para rodar JavaScript em uma página da web?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Nada: todo navegador já traz um motor de JavaScript',
            'O Node.js, obrigatoriamente',
            'Um compilador oficial da linguagem',
            'Uma extensão paga do navegador',
          ],
          expectedAnswer: 'Nada: todo navegador já traz um motor de JavaScript',
          explanation:
            'Essa é a grande vantagem prática do JavaScript: o interpretador já está no navegador de quem visita a página. O Node.js só entra quando você quer rodar JavaScript **fora** do navegador, como em um servidor.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'js-fund-01-e2',
          lessonId: 'js-fund-01',
          prompt:
            'O mesmo conceito muda de sintaxe em cada linguagem. Qual destas linhas mostra um texto na tela **em JavaScript**?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'console.log("Olá");',
            'print("Olá")',
            'System.out.println("Olá");',
            'cout << "Olá";',
          ],
          expectedAnswer: 'console.log("Olá");',
          explanation:
            'As quatro linhas fazem a mesma coisa, cada uma na sua linguagem. `print` é Python, `System.out.println` é Java e `cout <<` é C++. Em JavaScript, é `console.log()`.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-fund-02',
      moduleId: 'js-fundamentos',
      title: 'Sua primeira linha de código',
      subtitle: 'console.log() e os três tipos de aspas',
      orderIndex: 2,
      content: `## console.log(): a janela do seu programa

\`console.log()\` mostra alguma coisa no console. Tudo que estiver **dentro dos parênteses** é exibido.

~~~js
console.log("Bem-vindo ao CodeQuest");
~~~

Saída:

~~~text
Bem-vindo ao CodeQuest
~~~

O nome é literal: *console* é aquele painel que você abre no navegador com F12, onde as pessoas que programam acompanham o que o código está fazendo. Aqui no CodeQuest ele aparece como o terminal preto embaixo do editor.

## Três tipos de aspas

Texto (o que chamamos de **string**) precisa estar entre aspas. Em JavaScript existem três formas, e as duas primeiras são equivalentes:

~~~js
console.log("aspas duplas");
console.log('aspas simples');
console.log(\`crase\`);
~~~

Abra e feche com o mesmo símbolo. A crase tem um superpoder que você vai ver no módulo de Variáveis — por enquanto, use aspas duplas ou simples.

## Vários valores de uma vez

Se você passar mais de um valor separado por vírgula, todos aparecem na mesma linha, separados por um espaço:

~~~js
console.log("Nota:", 10);
~~~

~~~text
Nota: 10
~~~

E cada \`console.log()\` termina pulando para a linha seguinte:

~~~js
console.log("Linha 1");
console.log("Linha 2");
~~~

~~~text
Linha 1
Linha 2
~~~

> No CodeQuest o botão **Executar** roda o seu código de verdade — é o motor de JavaScript do seu próprio navegador. O que aparecer no terminal é a saída real.`,
      exercises: [
        {
          id: 'js-fund-02-e1',
          lessonId: 'js-fund-02',
          prompt:
            'Escreva um programa que mostre exatamente o texto:\n\n~~~text\nOlá, CodeQuest!\n~~~',
          starterCode: '// Escreva seu código abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Olá, CodeQuest!',
          hint: 'Use console.log() com o texto entre aspas, exatamente como pedido (inclusive a vírgula e a exclamação).',
          explanation:
            'A saída precisa bater caractere por caractere. `console.log("Olá, CodeQuest!");` produz exatamente a linha esperada.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'js-fund-02-e2',
          lessonId: 'js-fund-02',
          prompt:
            'Agora duas linhas. Faça o programa mostrar:\n\n~~~text\nMeu nome é Dev\nEstou aprendendo JavaScript\n~~~',
          starterCode: 'console.log("Meu nome é Dev");\n// falta a segunda linha\n',
          validationType: 'output_match',
          expectedAnswer: 'Meu nome é Dev\nEstou aprendendo JavaScript',
          hint: 'Cada console.log() já pula de linha sozinho. Você só precisa de um segundo console.log().',
          explanation:
            'Dois `console.log()` em sequência geram duas linhas, porque cada um adiciona uma quebra de linha ao final automaticamente.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-fund-03',
      moduleId: 'js-fundamentos',
      title: 'Comentários e ponto e vírgula',
      subtitle: 'Notas para humanos — e uma pegadinha clássica',
      orderIndex: 3,
      content: `## Comentários: o computador ignora, você agradece

Comentário é texto que o JavaScript **não executa**. Serve para explicar uma decisão, marcar um pendência ou desligar temporariamente uma linha.

~~~js
// uma linha inteira ignorada

console.log("isto roda"); // ignorado a partir daqui

/*
  Várias linhas de uma vez.
  Útil para explicações mais longas.
*/
~~~

Desligar uma linha para testar é uma das táticas mais usadas por quem programa:

~~~js
console.log("versão nova");
// console.log("versão antiga");
~~~

## O ponto e vírgula

Em JavaScript, o \`;\` marca o fim de uma instrução. Só que a linguagem tem um mecanismo chamado **inserção automática de ponto e vírgula**: quando você esquece, na maioria das vezes ele é colocado sozinho e o código funciona mesmo assim.

~~~js
console.log("funciona")
console.log("isto também")
~~~

Parece ótimo — e é justamente aí que mora a pegadinha. Em alguns casos o ponto e vírgula é inserido em um lugar que você não queria, e o programa passa a fazer outra coisa **sem dar erro**, que é o tipo de problema mais difícil de encontrar.

> A recomendação deste curso: **sempre escreva o ponto e vírgula**. É um caractere, e você elimina uma categoria inteira de bug silencioso.

## Nomes que o JavaScript diferencia

\`Nome\`, \`nome\` e \`NOME\` são três coisas diferentes. A linguagem diferencia maiúsculas de minúsculas — inclusive em \`console.log\`, que não funciona escrito \`Console.Log\`.`,
      exercises: [
        {
          id: 'js-fund-03-e1',
          lessonId: 'js-fund-03',
          prompt: 'Qual destas linhas é um comentário de **uma linha** em JavaScript?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            '// isto é um comentário',
            '# isto é um comentário',
            '<!-- isto é um comentário -->',
            '** isto é um comentário',
          ],
          expectedAnswer: '// isto é um comentário',
          explanation:
            'Em JavaScript o comentário de uma linha é `//`. O `#` é de Python e o `<!-- -->` é do HTML. Para várias linhas, o JavaScript usa `/* ... */`.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'js-fund-03-e2',
          lessonId: 'js-fund-03',
          prompt:
            'O código abaixo mostra duas linhas, mas a primeira era só um teste. **Comente** a linha do teste e acrescente a linha que falta, para a saída ficar exatamente:\n\n~~~text\nRelatório final\n~~~',
          starterCode: 'console.log("teste temporário");\n',
          validationType: 'output_match',
          expectedAnswer: 'Relatório final',
          hint: 'Coloque // no começo da linha do teste e escreva um novo console.log() com o texto pedido.',
          explanation:
            'Com `//` na frente, a linha vira comentário e deixa de ser executada — sem precisar apagá-la. É assim que se testa uma alteração sem perder a versão anterior.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-fund-04',
      moduleId: 'js-fundamentos',
      title: 'Quando o código quebra',
      subtitle: 'Ler o erro é metade da solução',
      orderIndex: 4,
      content: `## Errar é o estado normal

Ninguém escreve código sem errar. A diferença entre quem está começando e quem já tem prática não é errar menos — é **ler o erro** em vez de fechar os olhos.

Uma mensagem de erro em JavaScript tem três partes úteis: o **tipo**, a **descrição** e a **linha**.

~~~text
Linha 2: ReferenceError: nomes is not defined
~~~

## Os três erros que você mais vai ver

**ReferenceError** — você usou um nome que não existe. Quase sempre é erro de digitação:

~~~js
let nome = "Ana";
console.log(nomes); // ReferenceError: nomes is not defined
~~~

**TypeError** — o valor existe, mas não faz o que você pediu:

~~~js
let idade = 20;
idade.toUpperCase(); // TypeError: idade.toUpperCase is not a function
~~~

Faz sentido: \`toUpperCase\` transforma texto em maiúsculas, e \`20\` não é texto.

**SyntaxError** — a frase está mal escrita e o JavaScript nem consegue começar:

~~~js
console.log("faltou fechar";
~~~

Repare na diferença: no SyntaxError **nada** roda, nem as linhas anteriores. Nos outros dois, o programa roda até o ponto do erro e para ali.

## A rotina que resolve

1. Leia a **linha** indicada.
2. Leia o **tipo** — ele já diz a categoria do problema.
3. Compare o nome que você escreveu com o nome que você declarou, letra por letra.

> Um erro não é uma reprovação. É o JavaScript dizendo, com precisão, onde ele se perdeu.`,
      exercises: [
        {
          id: 'js-fund-04-e1',
          lessonId: 'js-fund-04',
          prompt:
            'Qual erro este código produz?\n\n~~~js\nlet nome = "Ana";\nconsole.log(nomes);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'ReferenceError: nomes is not defined',
            'TypeError: nomes is not a function',
            'SyntaxError: unexpected token',
            'Nenhum: o programa mostra "Ana"',
          ],
          expectedAnswer: 'ReferenceError: nomes is not defined',
          explanation:
            'A variável declarada é `nome`, no singular. Ao pedir `nomes`, o JavaScript procura um nome que nunca foi criado e levanta um **ReferenceError**. Erro de digitação é a causa número um desse erro.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'js-fund-04-e2',
          lessonId: 'js-fund-04',
          prompt:
            'O código abaixo quebra com `ReferenceError`. Corrija para que a saída seja:\n\n~~~text\nTudo certo!\n~~~',
          starterCode: 'let mensagem = "Tudo certo!";\nconsole.log(menssagem);\n',
          validationType: 'output_match',
          expectedAnswer: 'Tudo certo!',
          hint: 'Compare letra por letra o nome usado no console.log() com o nome declarado no let.',
          explanation:
            'A variável foi declarada como `mensagem` e usada como `menssagem`, com dois "s". Para o JavaScript são dois nomes completamente diferentes — e só o primeiro existe.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-fund-05',
      moduleId: 'js-fundamentos',
      title: 'Conversando com quem usa',
      subtitle: 'A função prompt()',
      orderIndex: 5,
      content: `## Programas que perguntam

Até agora seus programas só falavam. Com \`prompt()\` eles passam a **ouvir**:

~~~js
const nome = prompt("Qual é o seu nome? ");
console.log("Prazer, " + nome);
~~~

O que acontece, em ordem:

1. o texto entre parênteses aparece como pergunta;
2. o programa **para** e espera a resposta;
3. o que foi digitado é guardado na variável \`nome\`;
4. a execução continua.

## No navegador de verdade

\`prompt()\` abre uma caixinha no topo da página. Aqui no CodeQuest as respostas são **simuladas**: cada exercício traz uma lista de entradas prontas, mostrada logo abaixo do editor, e cada \`prompt()\` consome a próxima da fila. Assim seu programa é sempre testado com os mesmos valores.

## O detalhe que derruba todo mundo

\`prompt()\` devolve **sempre texto**, mesmo quando a pessoa digita um número:

~~~js
const idade = prompt("Sua idade: ");
console.log(idade + 1);
~~~

Se a pessoa digitar \`20\`, isso mostra \`201\` — e não \`21\`. O JavaScript entendeu \`"20" + 1\` como "junte o texto 20 com o texto 1".

Guarde essa cena: a lição **Conversão de tipos**, no próximo módulo, existe por causa dela.`,
      exercises: [
        {
          id: 'js-fund-05-e1',
          lessonId: 'js-fund-05',
          prompt:
            'Pergunte a cidade da pessoa e mostre uma mensagem de despedida. Com a entrada simulada `Recife`, a saída deve ser exatamente:\n\n~~~text\nDe qual cidade você é? Boa viagem para Recife\n~~~',
          starterCode: 'const cidade = prompt("De qual cidade você é? ");\n',
          validationType: 'output_match',
          expectedAnswer: 'De qual cidade você é? Boa viagem para Recife',
          stdin: ['Recife'],
          hint: 'A pergunta do prompt() já aparece no terminal. Falta só um console.log() juntando "Boa viagem para " com a variável cidade.',
          explanation:
            'O texto do `prompt()` é escrito sem pular linha, então a resposta do `console.log()` continua na mesma linha. Juntar textos com `+` é chamado de **concatenação**.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'js-fund-05-e2',
          lessonId: 'js-fund-05',
          prompt: 'Que tipo de valor `prompt()` devolve quando a pessoa digita `42`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Texto (string), sempre — mesmo parecendo número',
            'Número (number), porque 42 é um número',
            'Depende: número se for dígito, texto se tiver letra',
            'Booleano (true ou false)',
          ],
          expectedAnswer: 'Texto (string), sempre — mesmo parecendo número',
          explanation:
            '`prompt()` devolve string em qualquer situação. É por isso que `prompt() + 1` gruda os valores em vez de somar. Para fazer conta, é preciso converter antes — assunto da próxima lição.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
  ],
};
