import type { Module } from '@/types/content';

/**
 * Modulo 1 - Fundamentos.
 * Objetivo: tirar o medo da tela preta. O aluno escreve, executa e ve o
 * resultado do proprio codigo ja na primeira licao.
 */
export const fundamentos: Module = {
  id: 'py-fundamentos',
  languageId: 'python',
  title: 'Fundamentos',
  description: 'O que é programar, como o computador lê o seu código e como fazer a primeira coisa aparecer na tela.',
  icon: '🐣',
  orderIndex: 1,
  lessons: [
    {
      id: 'py-fund-01',
      moduleId: 'py-fundamentos',
      title: 'O que é programar?',
      subtitle: 'Instruções, ordem e previsibilidade',
      orderIndex: 1,
      content: `## Programar é dar instruções

Um computador não adivinha nada. Ele faz **exatamente** o que você mandou, **na ordem em que você mandou**.

Pense em uma receita de bolo: se você inverter "colocar no forno" com "misturar os ingredientes", o resultado muda. Um programa funciona igual — ele é uma lista de instruções executadas de cima para baixo, uma por vez.

## As três ideias que sustentam tudo

- **Sequência** — as instruções acontecem em ordem, uma depois da outra.
- **Decisão** — o programa escolhe caminhos diferentes dependendo de uma condição (você vai ver isso no módulo 🔀 Condicionais).
- **Repetição** — o programa repete um trecho várias vezes sem você reescrever (módulo 🔁 Repetições).

Toda linguagem de programação — Python, JavaScript, Java, C#, C++ — implementa essas três ideias. **O conceito é o mesmo, só a sintaxe muda.** É por isso que aqui a gente ensina o conceito primeiro.

## Por que Python primeiro?

Porque a sintaxe do Python é a mais próxima do português/inglês comum. Compare a instrução "mostre a palavra Olá na tela":

~~~py
print("Olá")
~~~

Sem ponto e vírgula, sem chaves, sem declarar classe nenhuma. Você gasta sua energia entendendo a **lógica**, não decorando pontuação.`,
      polyglot: [
        { language: 'Python', code: 'print("Olá")' },
        { language: 'JavaScript', code: 'console.log("Olá");' },
        { language: 'Java', code: 'System.out.println("Olá");' },
      ],
      exercises: [
        {
          id: 'py-fund-01-e1',
          lessonId: 'py-fund-01',
          prompt: 'Um programa executa suas instruções em qual ordem?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'De cima para baixo, uma instrução por vez',
            'Em ordem alfabética das palavras',
            'Todas ao mesmo tempo, instantaneamente',
            'Da última linha para a primeira',
          ],
          expectedAnswer: 'De cima para baixo, uma instrução por vez',
          explanation:
            'Isso mesmo. O interpretador do Python lê o arquivo de cima para baixo e executa cada linha na sequência. Essa previsibilidade é o que permite você raciocinar sobre o que o programa vai fazer antes de rodar.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'py-fund-01-e2',
          lessonId: 'py-fund-01',
          prompt:
            'O mesmo conceito muda de sintaxe em cada linguagem. Qual destas linhas mostra um texto na tela **em Python**?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'print("Olá")',
            'console.log("Olá");',
            'System.out.println("Olá");',
            'cout << "Olá";',
          ],
          expectedAnswer: 'print("Olá")',
          explanation:
            'As quatro linhas fazem a mesma coisa — cada uma na sua linguagem. `console.log` é JavaScript, `System.out.println` é Java e `cout <<` é C++. Em Python, é `print()`.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-fund-02',
      moduleId: 'py-fundamentos',
      title: 'Sua primeira linha de código',
      subtitle: 'A função print()',
      orderIndex: 2,
      content: `## print(): a janela do seu programa

\`print()\` é a instrução que mostra alguma coisa na tela. Tudo que estiver **dentro dos parênteses** é exibido.

~~~py
print("Bem-vindo ao CodeQuest")
~~~

Saída:

~~~text
Bem-vindo ao CodeQuest
~~~

## Aspas importam

Texto (o que chamamos de **string**) precisa estar entre aspas. Aspas simples ou duplas, tanto faz — desde que você abra e feche com a mesma.

~~~py
print("funciona")
print('também funciona')
~~~

Se você esquecer as aspas, o Python vai achar que você está falando de uma **variável** com aquele nome e vai reclamar que ela não existe.

## Vários prints, várias linhas

Cada \`print()\` termina pulando para a linha seguinte:

~~~py
print("Linha 1")
print("Linha 2")
~~~

~~~text
Linha 1
Linha 2
~~~

> Dica: no CodeQuest, o botão **Executar** roda o seu código de verdade — é o Python rodando dentro do seu navegador, via Pyodide. O que aparecer no terminal é a saída real.`,
      exercises: [
        {
          id: 'py-fund-02-e1',
          lessonId: 'py-fund-02',
          prompt:
            'Escreva um programa que mostre exatamente o texto:\n\n~~~text\nOlá, CodeQuest!\n~~~',
          starterCode: '# Escreva seu código abaixo\n',
          validationType: 'output_match',
          expectedAnswer: 'Olá, CodeQuest!',
          hint: 'Use print() com o texto entre aspas, exatamente como pedido (inclusive a vírgula e a exclamação).',
          explanation:
            'A saída precisa bater caractere por caractere. `print("Olá, CodeQuest!")` produz exatamente a linha esperada.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'py-fund-02-e2',
          lessonId: 'py-fund-02',
          prompt:
            'Agora duas linhas. Faça o programa mostrar:\n\n~~~text\nMeu nome é Dev\nEstou aprendendo Python\n~~~',
          starterCode: 'print("Meu nome é Dev")\n# falta a segunda linha\n',
          validationType: 'output_match',
          expectedAnswer: 'Meu nome é Dev\nEstou aprendendo Python',
          hint: 'Cada print() já pula de linha sozinho. Você só precisa de um segundo print().',
          explanation:
            'Dois `print()` em sequência geram duas linhas, porque cada um adiciona uma quebra de linha ao final automaticamente.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-fund-03',
      moduleId: 'py-fundamentos',
      title: 'Comentários',
      subtitle: 'Escrevendo para humanos, não só para a máquina',
      orderIndex: 3,
      content: `## Código também é leitura

Um **comentário** é um trecho que o Python ignora completamente ao executar. Ele existe para explicar o *porquê* de alguma coisa — para você daqui a duas semanas, ou para o colega de grupo.

Em Python, o comentário começa com \`#\` e vale até o fim da linha:

~~~py
# calcula o preço final já com o desconto de 10%
preco = 100
print(preco)
~~~

## O que comentar (e o que não comentar)

Comentário bom explica **por que**, não **o que**:

~~~py
# ruim: repete o óbvio
print("Olá")  # mostra Olá

# bom: explica a decisão
# a nota mínima é 6.0 por regra da instituição
nota_minima = 6.0
~~~

## Comentário no meio do código

Você também pode comentar temporariamente uma linha para testar sem ela — isso se chama "comentar código" e é uma técnica de depuração que você vai usar muito:

~~~py
print("essa roda")
# print("essa não roda")
~~~

O conceito existe em todas as linguagens; só o símbolo muda.`,
      polyglot: [
        { language: 'Python', code: '# um comentário' },
        { language: 'JavaScript', code: '// um comentário' },
        { language: 'Java', code: '// um comentário' },
        { language: 'C++', code: '// um comentário' },
      ],
      exercises: [
        {
          id: 'py-fund-03-e1',
          lessonId: 'py-fund-03',
          prompt: 'Qual símbolo inicia um comentário de uma linha em Python?',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: '#|hashtag|cerquilha|jogo da velha',
          hint: 'É o mesmo símbolo usado em hashtags nas redes sociais.',
          explanation:
            'Em Python o comentário de linha começa com `#`. Em JavaScript, Java, C# e C++ o equivalente é `//`.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'py-fund-03-e2',
          lessonId: 'py-fund-03',
          prompt:
            'O código abaixo deveria mostrar **apenas** a linha `Relatório final`. Comente a linha que não deve aparecer.',
          starterCode: 'print("teste temporário")\nprint("Relatório final")\n',
          validationType: 'output_match',
          expectedAnswer: 'Relatório final',
          hint: 'Coloque um # no começo da primeira linha.',
          explanation:
            'Ao colocar `#` no início da linha, o Python ignora aquele `print()` inteiro — sobra só a saída desejada.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-fund-04',
      moduleId: 'py-fundamentos',
      title: 'Quando dá erro',
      subtitle: 'Ler a mensagem é metade da solução',
      orderIndex: 4,
      content: `## Errar faz parte (sério)

Todo programador erra o tempo todo. A diferença entre quem trava e quem resolve é **ler a mensagem de erro** em vez de fechar os olhos para ela.

## Os dois erros mais comuns no começo

**1. SyntaxError** — você escreveu algo que o Python não consegue nem interpretar. Geralmente é um parêntese ou aspa faltando:

~~~py
print("Olá"
~~~

~~~text
SyntaxError: '(' was never closed
~~~

**2. NameError** — você usou um nome que não existe. Quase sempre é aspas esquecidas ou um erro de digitação:

~~~py
print(Olá)
~~~

~~~text
NameError: name 'Olá' is not defined
~~~

## Como ler o erro

A mensagem tem três partes úteis:

- **a linha** onde o Python travou (às vezes o problema está na linha *anterior*);
- **o tipo** do erro (SyntaxError, NameError, TypeError...);
- **a descrição** do que ele esperava encontrar.

> No CodeQuest, quando seu código dá erro, a mensagem original do Python aparece no terminal. Leia sempre a **última linha** dela primeiro: é ali que está o resumo.`,
      exercises: [
        {
          id: 'py-fund-04-e1',
          lessonId: 'py-fund-04',
          prompt:
            'O programa `print(Olá)` gera `NameError: name \'Olá\' is not defined`. Qual é a causa?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Faltaram as aspas: sem elas o Python procura uma variável chamada Olá',
            'O Python não aceita acentos em nenhum lugar do código',
            'A função print() não existe em Python',
            'Faltou ponto e vírgula no final da linha',
          ],
          expectedAnswer:
            'Faltaram as aspas: sem elas o Python procura uma variável chamada Olá',
          explanation:
            'Sem aspas, `Olá` deixa de ser texto e vira o nome de uma variável. Como nenhuma variável com esse nome foi criada, o Python levanta `NameError`. Python aceita acentos normalmente dentro de strings.',
          xpReward: 25,
          orderIndex: 1,
        },
        {
          id: 'py-fund-04-e2',
          lessonId: 'py-fund-04',
          prompt:
            'Conserte o código abaixo para que ele mostre `Tudo certo!` sem erro nenhum.',
          starterCode: 'print("Tudo certo!"\n',
          validationType: 'output_match',
          expectedAnswer: 'Tudo certo!',
          hint: 'Conte os parênteses: quantos abrem e quantos fecham?',
          explanation:
            'Faltava fechar o parêntese do `print()`. Erros de sintaxe assim são detectados antes mesmo do programa começar a rodar.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-fund-05',
      moduleId: 'py-fundamentos',
      title: 'Conversando com o usuário',
      subtitle: 'A função input()',
      orderIndex: 5,
      content: `## Programas que perguntam

Até agora seus programas só falavam. Com \`input()\` eles passam a **ouvir**:

~~~py
nome = input("Qual é o seu nome? ")
print("Olá,", nome)
~~~

O que acontece aqui, em ordem:

1. o texto \`"Qual é o seu nome? "\` aparece na tela;
2. o programa **para** e espera a pessoa digitar algo e apertar Enter;
3. o que foi digitado é guardado na caixinha \`nome\`;
4. o \`print()\` usa esse valor.

## print() com vírgula

Quando você separa valores por vírgula dentro do \`print()\`, o Python junta tudo colocando **um espaço** entre eles:

~~~py
print("Olá,", "mundo")
~~~

~~~text
Olá, mundo
~~~

## Atenção: input() sempre devolve texto

Mesmo que a pessoa digite \`18\`, o que chega no seu programa é o **texto** \`"18"\`, não o número 18. Isso vai importar muito no módulo 📦 Variáveis — e é a origem de um dos erros mais clássicos de quem está começando.

> No CodeQuest os exercícios com \`input()\` já vêm com as respostas simuladas, então o programa roda direto sem você precisar digitar nada.`,
      exercises: [
        {
          id: 'py-fund-05-e1',
          lessonId: 'py-fund-05',
          prompt:
            'Complete o programa para que ele pergunte a cidade e mostre `Boa viagem para Recife`.\n\nA resposta simulada do usuário é **Recife**.',
          starterCode: 'cidade = input("De qual cidade você é? ")\n# mostre a mensagem final aqui\n',
          validationType: 'output_match',
          stdin: ['Recife'],
          expectedAnswer: 'De qual cidade você é? Boa viagem para Recife',
          hint: 'Use print("Boa viagem para", cidade) — a vírgula coloca o espaço automaticamente.',
          explanation:
            'Repare que a pergunta do `input()` também aparece na saída: ela é impressa na mesma linha, e por isso o resultado esperado começa com o texto da pergunta.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-fund-05-e2',
          lessonId: 'py-fund-05',
          prompt: 'O que `input()` sempre devolve, independente do que a pessoa digitar?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Uma string (texto)',
            'Um número inteiro',
            'O tipo mais adequado, detectado automaticamente',
            'Um valor verdadeiro ou falso',
          ],
          expectedAnswer: 'Uma string (texto)',
          explanation:
            'Sempre texto. Para fazer contas com o que foi digitado, você precisa converter com `int()` ou `float()` — assunto do próximo módulo.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
  ],
};
