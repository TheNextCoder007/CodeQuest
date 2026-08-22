import type { Module } from '@/types/content';

/**
 * Modulo 6 - Desafios.
 * Aqui nao ha conteudo novo: os problemas combinam variaveis, condicionais,
 * repeticoes e funcoes. E a hora de o aluno perceber que ja sabe o suficiente.
 */
export const desafios: Module = {
  id: 'py-desafios',
  languageId: 'python',
  title: 'Desafios',
  description: 'Problemas que combinam tudo que você aprendeu. Nada de conteúdo novo — só raciocínio.',
  icon: '🧩',
  orderIndex: 6,
  lessons: [
    {
      id: 'py-des-01',
      moduleId: 'py-desafios',
      title: 'FizzBuzz',
      subtitle: 'O desafio de entrevista mais famoso do mundo',
      orderIndex: 1,
      content: `## O problema

FizzBuzz é usado em entrevistas de emprego há décadas. O enunciado:

> Para os números de 1 a 15, mostre o próprio número. Mas: múltiplos de 3 viram **Fizz**, múltiplos de 5 viram **Buzz**, e múltiplos de 3 **e** 5 ao mesmo tempo viram **FizzBuzz**.

## Pensando antes de escrever

Você já tem todas as peças: \`for\`, \`if/elif/else\` e o operador \`%\`.

O detalhe que derruba a maioria das pessoas é a **ordem dos testes**. Se você testar "múltiplo de 3" primeiro, o número 15 vira "Fizz" e nunca chega a ser "FizzBuzz".

A regra que você aprendeu em Condicionais resolve: **do caso mais restritivo para o mais amplo**. E o caso mais restritivo é ser múltiplo dos dois.

~~~py
if numero % 3 == 0 and numero % 5 == 0:
    # FizzBuzz
elif numero % 3 == 0:
    # Fizz
elif numero % 5 == 0:
    # Buzz
else:
    # o próprio número
~~~

## Por que isso é um bom teste

Não é sobre dificuldade técnica — é sobre traduzir um enunciado em português para uma cadeia de decisões sem se perder. Exatamente o que você treinou nos módulos anteriores.`,
      exercises: [
        {
          id: 'py-des-01-e1',
          lessonId: 'py-des-01',
          prompt:
            'Implemente o FizzBuzz de 1 a 15.\n\nSaída esperada:\n\n~~~text\n1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n~~~',
          starterCode:
            'for numero in range(1, 16):\n    # teste primeiro o caso mais restritivo\n',
          validationType: 'output_match',
          expectedAnswer:
            '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
          hint: 'Comece com if numero % 3 == 0 and numero % 5 == 0: print("FizzBuzz") e vá afunilando com elif.',
          explanation:
            'Você resolveu o FizzBuzz — um problema que já eliminou muita gente em processo seletivo. A chave foi a ordem das condições, não a sintaxe.',
          xpReward: 80,
          orderIndex: 1,
        },
      ],
    },
    {
      id: 'py-des-02',
      moduleId: 'py-desafios',
      title: 'Validação de dados',
      subtitle: 'Um programa que não confia na entrada',
      orderIndex: 2,
      content: `## Todo dado de fora é suspeito

Programas reais nunca assumem que a pessoa vai digitar o que foi pedido. **Validar** é verificar se a entrada faz sentido antes de usá-la.

## Regras compostas

Imagine validar uma senha com três exigências: pelo menos 8 caracteres, não pode ser igual ao nome de usuário, e não pode ser \`12345678\`.

Duas ferramentas novas aqui, ambas simples:

- \`len(texto)\` devolve o número de caracteres;
- \`in\` verifica se algo está contido em outra coisa.

~~~py
senha = "abc"
print(len(senha))
print("b" in senha)
~~~

~~~text
3
True
~~~

## Estruturando a validação

O padrão mais legível é testar cada regra e sair na primeira falha:

~~~py
def validar(senha):
    if len(senha) < 8:
        return "Senha muito curta"
    if senha == "12345678":
        return "Senha óbvia demais"
    return "Senha aceita"

print(validar("abc"))
print(validar("codequest2026"))
~~~

Isso se chama **retorno antecipado** (*early return*) e evita aquelas escadas de \`if\` aninhado que ficam impossíveis de ler.`,
      exercises: [
        {
          id: 'py-des-02-e1',
          lessonId: 'py-des-02',
          prompt:
            'Complete a função `validar_senha` seguindo as regras:\n\n- menos de 8 caracteres → `Senha muito curta`\n- igual a `12345678` → `Senha óbvia demais`\n- caso contrário → `Senha aceita`\n\nSaída esperada:\n\n~~~text\nSenha muito curta\nSenha óbvia demais\nSenha aceita\n~~~',
          starterCode:
            'def validar_senha(senha):\n    # use retorno antecipado\n\nprint(validar_senha("abc"))\nprint(validar_senha("12345678"))\nprint(validar_senha("codequest2026"))\n',
          validationType: 'output_match',
          expectedAnswer: 'Senha muito curta\nSenha óbvia demais\nSenha aceita',
          hint: 'Três returns em sequência: o primeiro que for atingido encerra a função.',
          explanation:
            'Repare que a ordem das regras importa de novo: `"12345678"` tem 8 caracteres, então passa pela primeira regra e é pega pela segunda.',
          xpReward: 80,
          orderIndex: 1,
        },
      ],
    },
    {
      id: 'py-des-03',
      moduleId: 'py-desafios',
      title: 'Processando uma sequência',
      subtitle: 'Maior, menor e média em uma passada',
      orderIndex: 3,
      content: `## Listas, em três minutos

Uma **lista** guarda vários valores em uma variável só:

~~~py
notas = [7.0, 9.5, 4.0, 8.5]

print(notas[0])      # primeiro item (a contagem começa em 0)
print(len(notas))    # quantos itens
~~~

~~~text
7.0
4
~~~

## Percorrendo com for

O \`for\` percorre listas diretamente, sem precisar de \`range\`:

~~~py
for nota in notas:
    print(nota)
~~~

## O padrão "maior valor"

Como descobrir a maior nota sem usar funções prontas? Guarde um "campeão provisório" e vá comparando:

~~~py
maior = notas[0]

for nota in notas:
    if nota > maior:
        maior = nota

print(maior)
~~~

É o padrão acumulador de novo, com uma comparação no lugar da soma. Inicializar \`maior\` com o **primeiro item** (e não com zero) é importante: se todas as notas fossem negativas, começar em zero daria resposta errada.

## Combinando tudo

Na mesma passada dá para acumular a soma e achar o maior — e no fim calcular a média dividindo pela quantidade.`,
      exercises: [
        {
          id: 'py-des-03-e1',
          lessonId: 'py-des-03',
          prompt:
            'Percorra a lista de notas e mostre a maior nota e a média, nessa ordem.\n\nSaída esperada:\n\n~~~text\nMaior: 9.5\nMédia: 7.25\n~~~',
          starterCode:
            'notas = [7.0, 9.5, 4.0, 8.5]\nmaior = notas[0]\nsoma = 0\n\n# percorra a lista acumulando soma e comparando o maior\n\nprint(f"Maior: {maior}")\nprint(f"Média: {soma / len(notas)}")\n',
          validationType: 'output_match',
          expectedAnswer: 'Maior: 9.5\nMédia: 7.25',
          hint: 'Dentro do for: soma += nota e um if nota > maior: maior = nota',
          explanation:
            'Duas responsabilidades resolvidas em uma única passagem pela lista. Em programas grandes, evitar percorrer os mesmos dados várias vezes é o que mantém tudo rápido.',
          xpReward: 90,
          orderIndex: 1,
        },
      ],
    },
  ],
};
