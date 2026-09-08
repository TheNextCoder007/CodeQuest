import type { Module } from '@/types/content';

/** Modulo 4 - Repeticoes: for, while, acumuladores e controle de fluxo. */
export const repeticoes: Module = {
  id: 'java-repeticoes',
  languageId: 'java',
  title: 'Repetições',
  description: 'O for de três partes, o while e os acumuladores que resolvem quase tudo.',
  icon: '🔁',
  orderIndex: 4,
  lessons: [
    {
      id: 'ja-rep-01',
      moduleId: 'java-repeticoes',
      title: 'O for de três partes',
      subtitle: 'Início, condição e passo',
      orderIndex: 1,
      content: `## A forma clássica

~~~java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
~~~

~~~text
1
2
3
4
5
~~~

O \`for\` do Java é bem diferente do Python: dentro dos parênteses vão **três coisas**, separadas por ponto e vírgula.

| Parte | Neste exemplo | Quando roda |
| --- | --- | --- |
| início | \`int i = 1\` | uma vez, antes de tudo |
| condição | \`i <= 5\` | antes de cada volta; se for falsa, o laço acaba |
| passo | \`i++\` | ao fim de cada volta |

Enquanto o Python diz "para cada número deste conjunto", o Java diz "comece assim, continue enquanto isso, e a cada volta faça aquilo". É mais trabalho e mais controle.

## Contando de trás para frente

~~~java
for (int i = 5; i >= 1; i--) {
    System.out.println(i);
}
~~~

~~~text
5
4
3
2
1
~~~

## De dois em dois

~~~java
for (int i = 0; i <= 10; i += 2) {
    System.out.print(i + " ");
}
~~~

~~~text
0 2 4 6 8 10
~~~

## O escopo do i

A variável declarada no \`for\` **só existe dentro dele**:

~~~java
for (int i = 0; i < 3; i++) { }
System.out.println(i);
~~~

~~~text
error: cannot find symbol
~~~

> Isso é proposital: evita que um contador vaze e seja reaproveitado sem querer mais adiante. Se você precisa do valor depois do laço, declare a variável antes dele.`,
      polyglot: [
        { language: 'Java', code: 'for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}' },
        { language: 'Python', code: 'for i in range(1, 6):\n    print(i)' },
        { language: 'JavaScript', code: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}' },
      ],
      exercises: [
        {
          id: 'ja-rep-01-e1',
          lessonId: 'ja-rep-01',
          prompt:
            'Complete a condição para que o laço mostre os números de 1 a 5:\n\n~~~java\nfor (int i = 1; ______; i++) {\n    System.out.println(i);\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'i <= 5',
          hint: 'Precisa incluir o 5, então não é apenas "menor que".',
          explanation:
            'Com `i < 5` o laço pararia no 4. Como a contagem começa em 1 e deve incluir o 5, a condição é `i <= 5`.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-rep-01-e2',
          lessonId: 'ja-rep-01',
          prompt:
            'Quantas vezes o corpo deste laço executa?\n\n~~~java\nfor (int i = 0; i < 4; i++) {\n    System.out.println("oi");\n}\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['4', '3', '5', '0'],
          expectedAnswer: '4',
          explanation:
            'O `i` assume 0, 1, 2 e 3 — quatro voltas. Em `i = 4` a condição `i < 4` fica falsa e o laço termina. Começar em 0 com `<` limite é o formato mais comum em Java, justamente porque índices de array começam em 0.',
          xpReward: 30,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-rep-02',
      moduleId: 'java-repeticoes',
      title: 'while e do-while',
      subtitle: 'Quando você não sabe quantas voltas',
      orderIndex: 2,
      content: `## while: enquanto der

~~~java
int contador = 3;

while (contador >= 1) {
    System.out.println(contador);
    contador--;
}

System.out.println("Fim");
~~~

~~~text
3
2
1
Fim
~~~

Use \`for\` quando souber quantas voltas serão; \`while\` quando a parada depender de algo que acontece durante a execução — uma resposta do usuário, o fim de um arquivo, um valor encontrado.

## O laço infinito

~~~java
int contador = 3;
while (contador >= 1) {
    System.out.println(contador);
}
~~~

Sem o \`contador--\`, a condição nunca fica falsa e o programa trava. **Todo \`while\` precisa de algo no corpo que caminhe em direção à parada** — e vale conferir isso antes de rodar.

## do-while: pelo menos uma vez

~~~java
int numero;
do {
    System.out.print("Digite um número positivo: ");
    numero = entrada.nextInt();
} while (numero <= 0);
~~~

A condição é testada **no fim**, então o corpo roda ao menos uma vez. É o formato natural para pedir algo até vir uma resposta válida.

| Laço | Testa a condição | Corpo roda no mínimo |
| --- | --- | --- |
| \`while\` | antes | 0 vez |
| \`do-while\` | depois | 1 vez |

> O \`do-while\` termina com ponto e vírgula depois do \`while (...)\`. É a única estrutura do Java que exige isso, e esquecer dá erro de compilação.`,
      exercises: [
        {
          id: 'ja-rep-02-e1',
          lessonId: 'ja-rep-02',
          prompt: 'Qual a diferença prática entre `while` e `do-while`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'O do-while testa a condição no fim, então o corpo executa pelo menos uma vez',
            'O do-while é mais rápido',
            'O while não aceita condições compostas',
            'Não há diferença: são sinônimos',
          ],
          expectedAnswer:
            'O do-while testa a condição no fim, então o corpo executa pelo menos uma vez',
          explanation:
            'Com `while`, se a condição já começar falsa o corpo nunca roda. Com `do-while` ele roda uma vez antes do primeiro teste — por isso é o formato usado para pedir uma entrada até ela ser válida.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-rep-02-e2',
          lessonId: 'ja-rep-02',
          prompt:
            'O que falta neste laço para ele não ser infinito?\n\n~~~java\nint contador = 3;\nwhile (contador >= 1) {\n    System.out.println(contador);\n}\n~~~',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Uma linha que diminua o contador, como `contador--;`',
            'Trocar o while por for',
            'Declarar o contador como final',
            'Um ponto e vírgula depois do while',
          ],
          expectedAnswer: 'Uma linha que diminua o contador, como `contador--;`',
          explanation:
            'A condição `contador >= 1` nunca fica falsa porque nada altera o `contador`. Todo `while` precisa de algo no corpo que caminhe em direção à parada.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-rep-03',
      moduleId: 'java-repeticoes',
      title: 'Acumuladores',
      subtitle: 'Somar e contar dentro do laço',
      orderIndex: 3,
      content: `## Somar

O padrão é sempre o mesmo: uma variável **antes** do laço, alterada **dentro** dele, lida **depois**.

~~~java
int soma = 0;

for (int i = 1; i <= 100; i++) {
    soma += i;
}

System.out.println(soma);
~~~

~~~text
5050
~~~

Se \`soma\` fosse declarada dentro do \`for\`, ela nasceria zerada a cada volta — e o resultado seria o último número, não o total.

## Contar quando uma condição bate

~~~java
int quantidade = 0;

for (int i = 1; i <= 20; i++) {
    if (i % 3 == 0) {
        quantidade++;
    }
}

System.out.println(quantidade);
~~~

~~~text
6
~~~

Um \`for\` percorrendo tudo e um \`if\` decidindo o que conta: é a combinação mais frequente em programação.

## Guardar o maior

~~~java
int[] notas = {7, 9, 4, 8};
int maior = notas[0];

for (int i = 1; i < notas.length; i++) {
    if (notas[i] > maior) {
        maior = notas[i];
    }
}

System.out.println(maior);
~~~

~~~text
9
~~~

Repare que \`maior\` começa com o **primeiro elemento**, e não com zero. Começar em zero funcionaria aqui, mas quebraria com uma lista só de negativos — o maior de \`{-5, -2}\` sairia como \`0\`, que não está na lista.

> Três acumuladores resolvem a maior parte dos exercícios: **soma** (começa em 0), **contador** (começa em 0) e **melhor até agora** (começa com o primeiro elemento).`,
      exercises: [
        {
          id: 'ja-rep-03-e1',
          lessonId: 'ja-rep-03',
          prompt:
            'Por que a variável `soma` precisa ser declarada **antes** do `for`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Declarada dentro do laço, ela seria recriada zerada a cada volta',
            'Java não permite declarar variáveis dentro de um for',
            'Para poder ser final',
            'Para o laço executar mais rápido',
          ],
          expectedAnswer:
            'Declarada dentro do laço, ela seria recriada zerada a cada volta',
          explanation:
            'Uma variável declarada no corpo do laço nasce e morre a cada volta. O acumulador precisa sobreviver entre as voltas, então mora fora — e por isso também continua acessível depois que o laço acaba.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-rep-03-e2',
          lessonId: 'ja-rep-03',
          prompt:
            'Ao procurar o maior valor de uma lista, com que valor a variável `maior` deve começar?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Com o primeiro elemento da lista',
            'Com zero',
            'Com o tamanho da lista',
            'Com o último elemento da lista',
          ],
          expectedAnswer: 'Com o primeiro elemento da lista',
          explanation:
            'Começar em zero parece funcionar até aparecer uma lista só com números negativos: o maior de `{-5, -2}` sairia como `0`, que sequer está na lista. Começar pelo primeiro elemento garante uma resposta que existe nos dados.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-rep-04',
      moduleId: 'java-repeticoes',
      title: 'Interromper e pular',
      subtitle: 'break e continue',
      orderIndex: 4,
      content: `## continue: pula esta volta

~~~java
for (int i = 1; i <= 10; i++) {
    if (i == 7) {
        continue;
    }
    System.out.print(i + " ");
}
~~~

~~~text
1 2 3 4 5 6 8 9 10
~~~

O \`continue\` abandona o **resto do corpo** e vai para a próxima volta. O laço continua normalmente.

## break: encerra o laço

~~~java
int[] numeros = {4, 8, 15, 16, 23};

for (int i = 0; i < numeros.length; i++) {
    if (numeros[i] > 10) {
        System.out.println("Primeiro maior que 10: " + numeros[i]);
        break;
    }
}
~~~

~~~text
Primeiro maior que 10: 15
~~~

Sem o \`break\`, o laço continuaria varrendo a lista inteira à toa. Quando você já achou o que procurava, pare.

| Comando | Efeito |
| --- | --- |
| \`continue\` | pula para a próxima volta |
| \`break\` | sai do laço |

## Cuidado com o continue no while

~~~java
int i = 0;
while (i < 5) {
    if (i == 2) {
        continue;
    }
    System.out.println(i);
    i++;
}
~~~

Este laço trava. Ao chegar em \`i == 2\`, o \`continue\` pula o \`i++\` — e \`i\` fica em 2 para sempre. No \`for\`, o passo roda de qualquer jeito; no \`while\`, o incremento faz parte do corpo e pode ser pulado.

> Regra prática: \`continue\` combina bem com \`for\`. Num \`while\`, confira se o avanço acontece antes dele.`,
      exercises: [
        {
          id: 'ja-rep-04-e1',
          lessonId: 'ja-rep-04',
          prompt:
            'Complete o comando que pula apenas a volta atual, sem encerrar o laço:\n\n~~~java\nfor (int i = 1; i <= 10; i++) {\n    if (i == 7) {\n        ______;\n    }\n    System.out.print(i + " ");\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'continue',
          hint: 'O outro comando, `break`, encerraria o laço inteiro.',
          explanation:
            '`continue` abandona o resto do corpo e segue para a próxima volta. `break` sairia do laço e os números depois do 7 não apareceriam.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-rep-04-e2',
          lessonId: 'ja-rep-04',
          prompt:
            'Por que usar `continue` dentro de um `while` é mais arriscado do que dentro de um `for`?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'No while o incremento faz parte do corpo e pode ser pulado, travando o laço',
            'O while não aceita continue',
            'O continue só funciona com arrays',
            'No while o continue encerra o laço, como um break',
          ],
          expectedAnswer:
            'No while o incremento faz parte do corpo e pode ser pulado, travando o laço',
          explanation:
            'No `for`, o passo (`i++`) roda a cada volta independentemente do `continue`. No `while`, o incremento é só mais uma linha do corpo — se o `continue` vier antes dele, a variável para de avançar e o laço nunca termina.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
  ],
};
