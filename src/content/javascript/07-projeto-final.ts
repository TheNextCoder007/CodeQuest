import type { Module } from '@/types/content';

/**
 * Modulo 7 - Projeto final (JavaScript).
 *
 * Comeca apresentando objetos - que e como dados reais sao organizados em
 * JavaScript e o unico conceito novo daqui - e termina montando um boletim
 * completo, que usa TODOS os modulos anteriores de uma vez.
 */
export const projetoFinal: Module = {
  id: 'js-projeto-final',
  languageId: 'javascript',
  title: 'Projeto Final',
  description:
    'Objetos para organizar dados e um boletim completo que junta variáveis, condicionais, repetições e funções.',
  icon: '🚀',
  orderIndex: 7,
  lessons: [
    {
      id: 'js-proj-01',
      moduleId: 'js-projeto-final',
      title: 'Objetos',
      subtitle: 'Agrupando dados que andam juntos',
      orderIndex: 1,
      content: `## O problema das variáveis soltas

Para representar uma aluna, você poderia escrever:

~~~js
const nome = "Ana";
const nota1 = 7;
const nota2 = 9;
~~~

Funciona para **uma**. Para trinta, vira caos: nada indica que essas três variáveis pertencem à mesma pessoa.

## O objeto

Um **objeto** agrupa valores relacionados, cada um com o seu nome:

~~~js
const aluna = {
  nome: "Ana",
  nota1: 7,
  nota2: 9,
};

console.log(aluna.nome);
console.log(aluna.nota1);
~~~

~~~text
Ana
7
~~~

A estrutura é \`chave: valor\`, separados por vírgula, tudo entre chaves. Cada chave é chamada de **propriedade**.

## Acessando e mudando

~~~js
const aluna = { nome: "Ana", nota1: 7 };

console.log(aluna.nome);
console.log(aluna["nome"]);

aluna.nota1 = 10;
aluna.turma = "3B";
~~~

Duas formas de acessar: o **ponto** (mais comum) e os **colchetes** (necessários quando o nome da propriedade está numa variável).

Repare que \`aluna\` foi declarada com \`const\` e mesmo assim as propriedades mudaram. \`const\` impede trocar **o objeto inteiro** por outro, não impede mexer no conteúdo dele.

## Propriedade que não existe

~~~js
const aluna = { nome: "Ana" };
console.log(aluna.idade);
~~~

~~~text
undefined
~~~

Não é erro: JavaScript devolve \`undefined\` e segue. Isso torna erros de digitação em nomes de propriedade especialmente traiçoeiros — \`aluna.Nome\` (com maiúscula) também dá \`undefined\`, calado.

## Array de objetos: o formato dos dados reais

É assim que praticamente todo dado chega do mundo real — de um banco de dados, de um formulário, de uma API:

~~~js
const turma = [
  { nome: "Ana", nota: 9 },
  { nome: "Luiz", nota: 4 },
];

for (const aluno of turma) {
  console.log(\`\${aluno.nome}: \${aluno.nota}\`);
}
~~~

~~~text
Ana: 9
Luiz: 4
~~~

Junte com os métodos do módulo anterior e você já consegue responder perguntas de verdade:

~~~js
const aprovados = turma.filter((aluno) => aluno.nota >= 7);
console.log(aprovados.length);
~~~

~~~text
1
~~~`,
      polyglot: [
        { language: 'JavaScript', code: 'const aluna = { nome: "Ana", nota: 9 };\nconsole.log(aluna.nome);' },
        { language: 'Python', code: 'aluna = {"nome": "Ana", "nota": 9}\nprint(aluna["nome"])' },
        {
          language: 'Java',
          code: 'record Aluna(String nome, int nota) {}\n\nvar aluna = new Aluna("Ana", 9);\nSystem.out.println(aluna.nome());',
        },
      ],
      exercises: [
        {
          id: 'js-proj-01-e1',
          lessonId: 'js-proj-01',
          prompt:
            'Crie um objeto `aluno` com as propriedades `nome` valendo `Ana` e `nota` valendo `9`, e mostre as duas:\n\n~~~text\nAna\n9\n~~~',
          starterCode: '// crie o objeto e mostre nome e nota\n',
          validationType: 'output_match',
          expectedAnswer: 'Ana\n9',
          hint: 'const aluno = { nome: "Ana", nota: 9 }; e depois console.log(aluno.nome); console.log(aluno.nota);',
          explanation:
            'Dentro do objeto a chave é escrita **sem aspas** (`nome:`), e o acesso usa ponto (`aluno.nome`). Um objeto guarda dados que descrevem a mesma coisa — o que evita ficar carregando três variáveis soltas por aí.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'js-proj-01-e2',
          lessonId: 'js-proj-01',
          prompt:
            'O que este código mostra?\n\n~~~js\nconst aluno = { nome: "Ana" };\nconsole.log(aluno.idade);\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'undefined',
            'null',
            'ReferenceError: idade is not defined',
            'Uma string vazia',
          ],
          expectedAnswer: 'undefined',
          explanation:
            'Pedir uma propriedade que não existe devolve `undefined`, sem erro nenhum. É por isso que um `nome` escrito com maiúscula errada não estoura — ele apenas devolve `undefined` e o problema aparece bem mais tarde.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'js-proj-02',
      moduleId: 'js-projeto-final',
      title: 'Boletim da turma',
      subtitle: 'Tudo o que você aprendeu, num programa só',
      orderIndex: 2,
      content: `## O projeto

Você vai montar um boletim que:

1. calcula a **média** de cada aluno;
2. classifica a situação (**Aprovado**, **Recuperação** ou **Reprovado**);
3. mostra uma linha por aluno;
4. fecha com a **média da turma** e a **quantidade de aprovados**.

Ele usa, ao mesmo tempo, tudo o que veio antes:

| Módulo | Onde aparece |
| --- | --- |
| Variáveis | acumuladores e template literals |
| Condicionais | a classificação por faixa |
| Repetições | percorrer a turma |
| Funções | a regra da situação, isolada |
| Objetos | os dados de cada aluno |

## As regras

- média **≥ 7** → \`Aprovado\`
- média **≥ 5** e < 7 → \`Recuperação\`
- abaixo de 5 → \`Reprovado\`

## Construa em três etapas

Este é o hábito mais valioso que você leva desta trilha: **não escreva o programa inteiro de uma vez.** Faça uma parte, execute, confirme que está certa, e só então acrescente a próxima.

Os três exercícios a seguir são exatamente essas etapas — a função da situação, depois o laço, depois o resumo.

## Arredondando a média da turma

A média das médias raramente é um número redondo. Para mostrar com duas casas:

~~~js
console.log(Math.round(6.166666 * 100) / 100);
~~~

~~~text
6.17
~~~

A ideia: multiplica por 100, arredonda para o inteiro mais próximo e divide de novo. É o truque padrão de "duas casas decimais" em JavaScript.

> Quando terminar, você terá escrito um programa completo — com entrada de dados, regra de negócio, repetição e relatório. É exatamente a estrutura de um sistema de verdade, só que menor.`,
      exercises: [
        {
          id: 'js-proj-02-e1',
          lessonId: 'js-proj-02',
          prompt:
            '**Etapa 1.** Escreva a função `situacao(media)` que devolve `Aprovado` (≥ 7), `Recuperação` (≥ 5) ou `Reprovado`. Teste com 8, 6 e 3:\n\n~~~text\nAprovado\nRecuperação\nReprovado\n~~~',
          starterCode: '// a função devolve o texto; quem mostra é o console.log de fora\n',
          validationType: 'output_match',
          expectedAnswer: 'Aprovado\nRecuperação\nReprovado',
          hint: 'function situacao(media) { if (media >= 7) return "Aprovado"; if (media >= 5) return "Recuperação"; return "Reprovado"; }',
          explanation:
            'A ordem das faixas é o que faz funcionar: 8 é maior que 7 **e** que 5, e o primeiro `return` encerra a função ali. Devolver texto em vez de mostrar é o que permite reaproveitar a função no próximo exercício.',
          xpReward: 50,
          orderIndex: 1,
        },
        {
          id: 'js-proj-02-e2',
          lessonId: 'js-proj-02',
          prompt:
            '**Etapa 2.** Percorra a `turma`, calcule a média de cada aluno e mostre uma linha por pessoa no formato `nome: média X - Situação`:\n\n~~~text\nAna: média 8 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6 - Recuperação\n~~~',
          starterCode:
            'function situacao(media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}\n\nconst turma = [\n  { nome: "Ana", nota1: 7, nota2: 9 },\n  { nome: "Luiz", nota1: 4, nota2: 5 },\n  { nome: "Kauan", nota1: 6, nota2: 6 },\n];\n\n// percorra a turma com for...of\n',
          validationType: 'output_match',
          expectedAnswer:
            'Ana: média 8 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6 - Recuperação',
          hint: 'for (const aluno of turma) { const media = (aluno.nota1 + aluno.nota2) / 2; console.log(`${aluno.nome}: média ${media} - ${situacao(media)}`); }',
          explanation:
            'A média é calculada dentro do laço, para cada aluno, e passada para a função — que não sabe nem precisa saber de onde o número veio. Repare que 4.5 aparece assim mesmo: em JavaScript o resultado de uma divisão não ganha casas decimais extras.',
          xpReward: 60,
          orderIndex: 2,
        },
        {
          id: 'js-proj-02-e3',
          lessonId: 'js-proj-02',
          prompt:
            '**Etapa 3.** Acrescente o resumo ao final: a média da turma (com duas casas) e quantos foram aprovados.\n\n~~~text\nAna: média 8 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6 - Recuperação\n---\nMédia da turma: 6.17\nAprovados: 1 de 3\n~~~',
          starterCode:
            'function situacao(media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}\n\nconst turma = [\n  { nome: "Ana", nota1: 7, nota2: 9 },\n  { nome: "Luiz", nota1: 4, nota2: 5 },\n  { nome: "Kauan", nota1: 6, nota2: 6 },\n];\n\nlet somaDasMedias = 0;\nlet aprovados = 0;\n\n// percorra a turma, acumule e mostre o resumo no final\n',
          validationType: 'output_match',
          expectedAnswer:
            'Ana: média 8 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6 - Recuperação\n---\nMédia da turma: 6.17\nAprovados: 1 de 3',
          hint: 'Dentro do laço, além do console.log: somaDasMedias += media; e um if (situacao(media) === "Aprovado") { aprovados++; }. Depois do laço, mostre "---", a média arredondada e a contagem.',
          explanation:
            'Os dois acumuladores são declarados **antes** do laço e usados **depois** dele — o padrão do módulo de Repetições. A média da turma é 18.5 / 3 = 6.1666..., que `Math.round(x * 100) / 100` transforma em 6.17. Parabéns: você acaba de escrever um programa completo em JavaScript.',
          xpReward: 80,
          orderIndex: 3,
        },
      ],
    },
  ],
};
