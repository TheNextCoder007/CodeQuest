import type { Module } from '@/types/content';

/** Modulo 4 - Repeticoes (for, while, acumuladores e controle de fluxo). */
export const repeticoes: Module = {
  id: 'py-repeticoes',
  languageId: 'python',
  title: 'Repetições',
  description: 'Fazer o computador repetir trabalho por você — sem copiar e colar código.',
  icon: '🔁',
  orderIndex: 4,
  lessons: [
    {
      id: 'py-rep-01',
      moduleId: 'py-repeticoes',
      title: 'Repetir com for',
      subtitle: 'for e range()',
      orderIndex: 1,
      content: `## O problema do copia-e-cola

Para mostrar os números de 1 a 5, você poderia escrever cinco \`print()\`. E para ir até 1000? A repetição existe justamente para isso:

~~~py
for numero in range(1, 6):
    print(numero)
~~~

~~~text
1
2
3
4
5
~~~

## Entendendo o range()

\`range(inicio, fim)\` gera os números **do início até o fim menos 1**. O fim é exclusivo — isso é intencional e você se acostuma rápido.

| Chamada | Números gerados |
| --- | --- |
| \`range(5)\` | 0, 1, 2, 3, 4 |
| \`range(1, 6)\` | 1, 2, 3, 4, 5 |
| \`range(0, 10, 2)\` | 0, 2, 4, 6, 8 |

O terceiro argumento é o **passo**.

## Anatomia do for

~~~py
for numero in range(1, 6):
    print(numero)
~~~

- \`numero\` é a **variável de controle** — a cada volta ela recebe o próximo valor;
- o bloco indentado é o **corpo** do laço, e roda uma vez por valor;
- quando os valores acabam, o laço termina sozinho.

Você não precisa incrementar nada manualmente: o \`for\` do Python cuida disso, diferente do \`for (int i = 0; i < 5; i++)\` de Java, C# e C++.`,
      polyglot: [
        { language: 'Python', code: 'for i in range(5):\n    print(i)' },
        { language: 'JavaScript', code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}' },
        { language: 'Java', code: 'for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}' },
      ],
      exercises: [
        {
          id: 'py-rep-01-e1',
          lessonId: 'py-rep-01',
          prompt:
            'Mostre os números de 1 a 5, um por linha.\n\nSaída esperada:\n\n~~~text\n1\n2\n3\n4\n5\n~~~',
          starterCode: '# use for com range\n',
          validationType: 'output_match',
          expectedAnswer: '1\n2\n3\n4\n5',
          hint: 'for numero in range(1, 6): — lembre que o fim do range é exclusivo.',
          explanation:
            'Para chegar até 5, o `range` precisa ir até 6. Esse "fim exclusivo" é a pegadinha mais comum do `range()`.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-rep-01-e2',
          lessonId: 'py-rep-01',
          prompt: 'Quantos números `range(3)` gera, e quais são?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['3 números: 0, 1, 2', '3 números: 1, 2, 3', '4 números: 0, 1, 2, 3', '1 número: 3'],
          expectedAnswer: '3 números: 0, 1, 2',
          explanation:
            'Com um único argumento, o `range` começa em 0 e para antes do valor informado. Por isso `range(3)` dá exatamente 3 voltas.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-rep-02',
      moduleId: 'py-repeticoes',
      title: 'Repetir com while',
      subtitle: 'Quando você não sabe quantas voltas serão',
      orderIndex: 2,
      content: `## for x while

- \`for\` → você **sabe** quantas repetições (percorrer 1 a 10, percorrer uma lista);
- \`while\` → repete **enquanto** uma condição for verdadeira, sem número definido.

~~~py
senha = ""

while senha != "1234":
    senha = input("Senha: ")

print("Acesso liberado")
~~~

O laço roda quantas vezes for preciso até a pessoa acertar.

## As três partes de um while seguro

~~~py
contador = 1              # 1. inicializar

while contador <= 3:      # 2. condição de parada
    print(contador)
    contador = contador + 1   # 3. atualizar (senão trava!)
~~~

~~~text
1
2
3
~~~

## Loop infinito

Se você esquecer o passo 3, a condição nunca fica falsa e o programa **trava**:

~~~py
contador = 1
while contador <= 3:
    print(contador)   # contador nunca muda -> laço infinito
~~~

> O CodeQuest interrompe automaticamente qualquer código que passe de alguns segundos, então você pode testar sem medo de travar o navegador.

## Atalho útil

\`contador = contador + 1\` pode ser escrito como \`contador += 1\`. O mesmo vale para \`-=\`, \`*=\` e \`/=\`.`,
      exercises: [
        {
          id: 'py-rep-02-e1',
          lessonId: 'py-rep-02',
          prompt:
            'Use um `while` para fazer uma contagem regressiva de 3 até 1 e depois mostrar `Fim`.\n\nSaída esperada:\n\n~~~text\n3\n2\n1\nFim\n~~~',
          starterCode: 'contador = 3\n\n# escreva o while aqui\n\nprint("Fim")\n',
          validationType: 'output_match',
          expectedAnswer: '3\n2\n1\nFim',
          hint: 'while contador >= 1: print(contador) e depois contador -= 1',
          explanation:
            'Como a contagem é decrescente, a atualização precisa **diminuir** o contador. Se você usasse `+=`, a condição nunca ficaria falsa e o laço seria infinito.',
          xpReward: 45,
          orderIndex: 1,
        },
        {
          id: 'py-rep-02-e2',
          lessonId: 'py-rep-02',
          prompt:
            'O que acontece se você esquecer de atualizar a variável de controle dentro de um `while`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O laço roda para sempre (loop infinito)',
            'O laço roda exatamente uma vez',
            'O Python atualiza a variável automaticamente',
            'O programa acusa erro de sintaxe',
          ],
          expectedAnswer: 'O laço roda para sempre (loop infinito)',
          explanation:
            'Diferente do `for`, o `while` não avança nada sozinho. Manter a condição sempre verdadeira é um erro de lógica: o Python não reclama, o programa simplesmente nunca termina.',
          xpReward: 25,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-rep-03',
      moduleId: 'py-repeticoes',
      title: 'Acumuladores e contadores',
      subtitle: 'Somando dentro do laço',
      orderIndex: 3,
      content: `## O padrão acumulador

Este é provavelmente o padrão mais reutilizado da programação: uma variável **fora** do laço que vai crescendo **dentro** dele.

~~~py
soma = 0

for numero in range(1, 6):
    soma += numero

print(soma)
~~~

~~~text
15
~~~

Acompanhe volta a volta:

| Volta | numero | soma antes | soma depois |
| --- | --- | --- | --- |
| 1 | 1 | 0 | 1 |
| 2 | 2 | 1 | 3 |
| 3 | 3 | 3 | 6 |
| 4 | 4 | 6 | 10 |
| 5 | 5 | 10 | 15 |

## Por que fora do laço?

Se \`soma = 0\` estivesse dentro do \`for\`, ela seria zerada a cada volta e o resultado final seria só o último número. Inicializar fora e acumular dentro é a essência do padrão.

## Contador

A mesma ideia serve para **contar** ocorrências — some 1 sempre que a condição acontecer:

~~~py
pares = 0

for numero in range(1, 11):
    if numero % 2 == 0:
        pares += 1

print(f"Encontrei {pares} números pares")
~~~

Repare que aqui tem um \`if\` **dentro** de um \`for\`: os conceitos se combinam livremente. É assim que programas de verdade são construídos.`,
      exercises: [
        {
          id: 'py-rep-03-e1',
          lessonId: 'py-rep-03',
          prompt:
            'Calcule a soma de todos os números de 1 a 100.\n\nSaída esperada:\n\n~~~text\n5050\n~~~',
          starterCode: 'soma = 0\n\n# percorra de 1 a 100 acumulando em soma\n\nprint(soma)\n',
          validationType: 'output_match',
          expectedAnswer: '5050',
          hint: 'for numero in range(1, 101): soma += numero',
          explanation:
            'Esse é o famoso problema de Gauss. O computador resolve por força bruta em microssegundos — e o padrão acumulador é a ferramenta.',
          xpReward: 50,
          orderIndex: 1,
        },
        {
          id: 'py-rep-03-e2',
          lessonId: 'py-rep-03',
          prompt:
            'Conte quantos números de 1 a 20 são múltiplos de 3.\n\nSaída esperada:\n\n~~~text\n6\n~~~',
          starterCode: 'quantidade = 0\n\n# use for + if com o operador %\n\nprint(quantidade)\n',
          validationType: 'output_match',
          expectedAnswer: '6',
          hint: 'Dentro do for, teste if numero % 3 == 0: e some 1 no contador.',
          explanation:
            'São 3, 6, 9, 12, 15 e 18 — seis números. O teste `% 3 == 0` significa "o resto da divisão por 3 é zero", ou seja, divisão exata.',
          xpReward: 50,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-rep-04',
      moduleId: 'py-repeticoes',
      title: 'Controlando o laço',
      subtitle: 'break e continue',
      orderIndex: 4,
      content: `## Saindo mais cedo: break

\`break\` interrompe o laço na hora, mesmo que ainda houvesse voltas a fazer:

~~~py
for numero in range(1, 11):
    if numero == 4:
        break
    print(numero)
~~~

~~~text
1
2
3
~~~

Uso típico: você está procurando algo e já encontrou — não faz sentido continuar varrendo.

## Pulando uma volta: continue

\`continue\` pula **só a volta atual** e vai para a próxima:

~~~py
for numero in range(1, 6):
    if numero == 3:
        continue
    print(numero)
~~~

~~~text
1
2
4
5
~~~

## Usando com moderação

Os dois comandos existem em praticamente todas as linguagens, mas atrapalham a leitura quando usados demais. Regra prática: se dá para expressar a mesma coisa com uma condição clara no \`while\` ou num \`if\`, prefira a condição.

~~~py
# com break
while True:
    resposta = input("Continuar? ")
    if resposta == "não":
        break

# mais legível
resposta = ""
while resposta != "não":
    resposta = input("Continuar? ")
~~~`,
      exercises: [
        {
          id: 'py-rep-04-e1',
          lessonId: 'py-rep-04',
          prompt:
            'Mostre os números de 1 a 10, **pulando** o número 7.\n\nSaída esperada:\n\n~~~text\n1\n2\n3\n4\n5\n6\n8\n9\n10\n~~~',
          starterCode: 'for numero in range(1, 11):\n    # pule o 7 e mostre o resto\n    print(numero)\n',
          validationType: 'output_match',
          expectedAnswer: '1\n2\n3\n4\n5\n6\n8\n9\n10',
          hint: 'if numero == 7: continue — colocado antes do print.',
          explanation:
            'O `continue` precisa vir **antes** do `print()`: ele aborta o restante do corpo do laço naquela volta e segue para o próximo número.',
          xpReward: 50,
          orderIndex: 1,
        },
        {
          id: 'py-rep-04-e2',
          lessonId: 'py-rep-04',
          prompt: 'Qual a diferença entre `break` e `continue`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'break encerra o laço inteiro; continue pula só a volta atual',
            'break pula a volta atual; continue encerra o laço inteiro',
            'Os dois encerram o laço, mas break é mais rápido',
            'continue só funciona em while e break só em for',
          ],
          expectedAnswer: 'break encerra o laço inteiro; continue pula só a volta atual',
          explanation:
            'Os dois funcionam tanto em `for` quanto em `while`. `break` sai do laço de vez; `continue` só abandona a iteração corrente.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
  ],
};
