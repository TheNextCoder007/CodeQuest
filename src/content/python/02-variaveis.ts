import type { Module } from '@/types/content';

/**
 * Modulo 2 - Variaveis.
 * Objetivo: entender que variavel e uma caixa com nome, que todo valor tem um
 * tipo, e que converter tipo e uma decisao consciente do programador.
 */
export const variaveis: Module = {
  id: 'py-variaveis',
  languageId: 'python',
  title: 'Variáveis',
  description: 'Guardar informação na memória, dar nome a ela e entender que todo valor tem um tipo.',
  icon: '📦',
  orderIndex: 2,
  lessons: [
    {
      id: 'py-var-01',
      moduleId: 'py-variaveis',
      title: 'O que é uma variável',
      subtitle: 'Uma caixa com etiqueta',
      orderIndex: 1,
      content: `## Guardando um valor

Uma **variável** é um espaço na memória que guarda um valor e recebe um nome. Você cria uma variável simplesmente atribuindo um valor a um nome:

~~~py
idade = 18
~~~

Leia isso como "**idade recebe 18**", nunca como "idade é igual a 18". O sinal \`=\` aqui é **atribuição**: ele coloca o valor da direita na caixa da esquerda.

## O valor pode mudar

É por isso que se chama *variável*:

~~~py
pontos = 0
print(pontos)
pontos = 50
print(pontos)
~~~

~~~text
0
50
~~~

A segunda atribuição substitui a primeira. A caixa é a mesma; o conteúdo mudou.

## Nomes de variáveis

Regras do Python:

- podem ter letras, números e \`_\`, mas **não podem começar com número**;
- não podem ter espaço nem traço (\`-\`);
- diferenciam maiúsculas de minúsculas: \`idade\` e \`Idade\` são variáveis diferentes.

E uma regra de bom senso que vale mais que todas: **o nome deve dizer o que a variável guarda**. \`x\` não diz nada; \`nota_final\` diz tudo.

~~~py
# ruim
a = 7.5

# bom
nota_final = 7.5
~~~`,
      polyglot: [
        { language: 'Python', code: 'idade = 18' },
        { language: 'JavaScript', code: 'let idade = 18;' },
        { language: 'Java', code: 'int idade = 18;' },
        { language: 'C#', code: 'int idade = 18;' },
      ],
      exercises: [
        {
          id: 'py-var-01-e1',
          lessonId: 'py-var-01',
          prompt:
            'Crie uma variável chamada `nome` com o valor `Ana` e mostre-a na tela.\n\nSaída esperada:\n\n~~~text\nAna\n~~~',
          starterCode: '# crie a variável e mostre o valor\n',
          validationType: 'output_match',
          expectedAnswer: 'Ana',
          hint: 'Primeiro nome = "Ana", depois print(nome) — sem aspas no print, senão você mostra a palavra "nome".',
          explanation:
            '`nome = "Ana"` guarda o texto na variável e `print(nome)` mostra o **conteúdo** dela. Se você escrevesse `print("nome")`, apareceria a palavra nome.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'py-var-01-e2',
          lessonId: 'py-var-01',
          prompt: 'Qual destes nomes de variável é **inválido** em Python?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['2nota', 'nota_2', 'segunda_nota', '_nota'],
          expectedAnswer: '2nota',
          explanation:
            'Nomes de variável não podem começar com número. `nota_2`, `segunda_nota` e `_nota` são todos válidos.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-var-02',
      moduleId: 'py-variaveis',
      title: 'Tipos de dados',
      subtitle: 'int, float, str e bool',
      orderIndex: 2,
      content: `## Todo valor tem um tipo

O tipo define **o que dá para fazer** com aquele valor. Os quatro tipos básicos do Python:

| Tipo | O que guarda | Exemplo |
| --- | --- | --- |
| \`int\` | número inteiro | \`18\`, \`-3\`, \`0\` |
| \`float\` | número com casas decimais | \`7.5\`, \`3.14\` |
| \`str\` | texto (string) | \`"Ana"\`, \`'oi'\` |
| \`bool\` | verdadeiro ou falso | \`True\`, \`False\` |

Repare: em Python, decimal usa **ponto**, não vírgula. E \`True\`/\`False\` começam com maiúscula.

## Descobrindo o tipo

A função \`type()\` responde qual é o tipo de um valor:

~~~py
print(type(18))
print(type(7.5))
print(type("Ana"))
print(type(True))
~~~

~~~text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
~~~

## O mesmo símbolo, comportamentos diferentes

O tipo muda o significado da operação. Compare:

~~~py
print(2 + 3)
print("2" + "3")
~~~

~~~text
5
23
~~~

Com números, \`+\` **soma**. Com strings, \`+\` **junta** (concatena). Não é o Python sendo confuso — é o mesmo operador se comportando de acordo com o tipo dos valores.

E se você misturar os dois, dá erro:

~~~py
print("2" + 3)
~~~

~~~text
TypeError: can only concatenate str (not "int") to str
~~~`,
      exercises: [
        {
          id: 'py-var-02-e1',
          lessonId: 'py-var-02',
          prompt: 'Qual é o tipo do valor `7.5` em Python?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['float', 'int', 'str', 'bool'],
          expectedAnswer: 'float',
          explanation:
            'Números com casas decimais são `float`. Se fosse `7`, sem o ponto, seria `int`.',
          xpReward: 20,
          orderIndex: 1,
        },
        {
          id: 'py-var-02-e2',
          lessonId: 'py-var-02',
          prompt:
            'Sem rodar mentalmente nada difícil: escreva um programa que mostre o resultado de `"10" + "5"` e depois de `10 + 5`, nessa ordem.\n\nSaída esperada:\n\n~~~text\n105\n15\n~~~',
          starterCode: '# dois prints: um com strings, outro com números\n',
          validationType: 'output_match',
          expectedAnswer: '105\n15',
          hint: 'print("10" + "5") junta os textos; print(10 + 5) soma os números.',
          explanation:
            'Esse é o exercício que fixa a ideia central do módulo: o **tipo** decide o comportamento do operador. Concatenação com strings, soma com números.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-var-03',
      moduleId: 'py-variaveis',
      title: 'Convertendo tipos',
      subtitle: 'int(), float() e str()',
      orderIndex: 3,
      content: `## O problema clássico

Lembra que \`input()\` sempre devolve texto? Então este programa **não funciona**:

~~~py
idade = input("Idade: ")
print(idade + 1)
~~~

~~~text
TypeError: can only concatenate str (not "int") to str
~~~

O Python está certo: você pediu para juntar o texto \`"18"\` com o número \`1\`, e isso não faz sentido.

## Convertendo

As funções de conversão transformam um valor em outro tipo:

- \`int(valor)\` → número inteiro
- \`float(valor)\` → número decimal
- \`str(valor)\` → texto

~~~py
idade = int(input("Idade: "))
print(idade + 1)
~~~

Agora \`idade\` guarda o número 18 e a conta funciona.

## Lendo de dentro para fora

\`int(input("Idade: "))\` parece confuso, mas leia **de dentro para fora**:

1. \`input("Idade: ")\` → pergunta e devolve o texto \`"18"\`;
2. \`int("18")\` → converte esse texto no número \`18\`;
3. \`idade = ...\` → guarda o resultado.

## Cuidado

Se o texto não representar um número, a conversão falha:

~~~py
int("abc")
~~~

~~~text
ValueError: invalid literal for int() with base 10: 'abc'
~~~`,
      exercises: [
        {
          id: 'py-var-03-e1',
          lessonId: 'py-var-03',
          prompt:
            'Complete o código para que o programa some 10 ao número digitado.\n\nO usuário digita **32**. Saída esperada:\n\n~~~text\nDigite um número: 42\n~~~',
          starterCode: 'numero = input("Digite um número: ")\nprint(numero + 10)\n',
          validationType: 'output_match',
          stdin: ['32'],
          expectedAnswer: 'Digite um número: 42',
          hint: 'Envolva o input() com int(...) para transformar o texto em número.',
          explanation:
            '`int(input(...))` é o padrão que você vai repetir centenas de vezes: ler texto e converter na hora para número.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-var-03-e2',
          lessonId: 'py-var-03',
          prompt:
            'Qual função converte um texto como `"3.5"` em um número com casas decimais?',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'float|float()|float(x)',
          hint: 'É o nome do próprio tipo decimal.',
          explanation:
            '`float("3.5")` devolve o número 3.5. Se você usasse `int("3.5")` daria erro, porque o texto não representa um inteiro.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-var-04',
      moduleId: 'py-variaveis',
      title: 'Contas e f-strings',
      subtitle: 'Operadores e texto formatado',
      orderIndex: 4,
      content: `## Operadores aritméticos

~~~py
a = 7
b = 2

print(a + b)   # soma
print(a - b)   # subtração
print(a * b)   # multiplicação
print(a / b)   # divisão (sempre float)
print(a // b)  # divisão inteira
print(a % b)   # resto da divisão
print(a ** b)  # potência
~~~

~~~text
9
5
14
3.5
3
1
49
~~~

Dois merecem atenção especial, porque você vai usá-los muito:

- \`//\` devolve só a parte inteira da divisão — é assim que o CodeQuest calcula o seu **nível** a partir do XP;
- \`%\` devolve o resto — é assim que se descobre se um número é par (\`n % 2 == 0\`).

## f-strings: juntando texto e valores

Concatenar com \`+\` é chato porque exige converter tudo para texto. A **f-string** resolve isso: coloque \`f\` antes das aspas e use \`{}\` para inserir valores.

~~~py
nome = "Ana"
nota = 9.5

print("Aluno: " + nome + " nota: " + str(nota))
print(f"Aluno: {nome} nota: {nota}")
~~~

As duas linhas produzem o mesmo resultado, mas a segunda é muito mais legível:

~~~text
Aluno: Ana nota: 9.5
Aluno: Ana nota: 9.5
~~~

Dentro das chaves você pode até fazer contas:

~~~py
print(f"O dobro de {nota} é {nota * 2}")
~~~`,
      polyglot: [
        { language: 'Python', code: 'print(f"Olá, {nome}")' },
        { language: 'JavaScript', code: 'console.log(`Olá, ${nome}`);' },
        { language: 'Java', code: 'System.out.printf("Olá, %s%n", nome);' },
      ],
      exercises: [
        {
          id: 'py-var-04-e1',
          lessonId: 'py-var-04',
          prompt:
            'Use uma f-string para mostrar a média das duas notas.\n\nSaída esperada:\n\n~~~text\nA média de Ana é 8.0\n~~~',
          starterCode: 'nome = "Ana"\nnota1 = 7.0\nnota2 = 9.0\n# mostre a média usando f-string\n',
          validationType: 'output_match',
          expectedAnswer: 'A média de Ana é 8.0',
          hint: 'print(f"A média de {nome} é {(nota1 + nota2) / 2}") — repare nos parênteses da conta.',
          explanation:
            'A divisão em Python sempre devolve `float`, por isso a média aparece como `8.0` e não `8`. Dá para fazer a conta direto dentro das chaves da f-string.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-var-04-e2',
          lessonId: 'py-var-04',
          prompt: 'Qual operador devolve o **resto** de uma divisão?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['%', '//', '/', '**'],
          expectedAnswer: '%',
          explanation:
            '`%` é o resto (módulo): `7 % 2` vale 1. Já `//` é a divisão inteira: `7 // 2` vale 3.',
          xpReward: 20,
          orderIndex: 2,
        },
      ],
    },
  ],
};
