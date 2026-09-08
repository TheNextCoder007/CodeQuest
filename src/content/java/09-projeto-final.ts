import type { Module } from '@/types/content';

/**
 * Modulo 9 - Projeto final: o boletim da turma, montado por etapas.
 *
 * As duas licoes acompanham o mesmo programa crescendo: primeiro a regra de
 * negocio isolada num metodo, depois o relatorio que a usa. E a mesma
 * progressao do projeto final de Python, com o que Java tem de proprio -
 * classe, array de objetos e printf.
 */
export const projetoFinal: Module = {
  id: 'java-projeto-final',
  languageId: 'java',
  title: 'Projeto Final',
  description: 'Um boletim de turma completo, montado por etapas com tudo o que a trilha ensinou.',
  icon: '🏁',
  orderIndex: 9,
  lessons: [
    {
      id: 'ja-proj-01',
      moduleId: 'java-projeto-final',
      title: 'A regra de negócio',
      subtitle: 'Um método que decide a situação',
      orderIndex: 1,
      content: `## O projeto

Um boletim: para cada aluno, a média das duas notas e a situação — **Aprovado** (média ≥ 7), **Recuperação** (≥ 5) ou **Reprovado**.

Vamos montar em duas etapas. Primeiro a decisão, isolada num método.

## A regra sozinha

~~~java
static String situacao(double media) {
    if (media >= 7) {
        return "Aprovado";
    }
    if (media >= 5) {
        return "Recuperação";
    }
    return "Reprovado";
}
~~~

~~~java
System.out.println(situacao(8.0));
System.out.println(situacao(6.0));
System.out.println(situacao(3.0));
~~~

~~~text
Aprovado
Recuperação
Reprovado
~~~

Repare no que este método **não** faz: ele não imprime nada. Ele devolve o texto e deixa quem chamou decidir o destino — tela, arquivo, tela de outro sistema.

> Essa separação é o que permite testar a regra sem olhar para a saída, e reaproveitá-la na etapa seguinte sem alterar uma linha. Método que calcula **e** imprime serve para um lugar só.

## Por que a ordem funciona

A cadeia começa pela faixa mais alta. Com \`media = 8\`, o primeiro \`return\` já sai. Com \`media = 6\`, o primeiro teste falha e o segundo pega. O último \`return\` é o "caso restante" — e como \`return\` encerra o método, nenhum \`else\` é necessário.

Invertida, a cadeia classificaria tudo errado, exatamente como no módulo de Condicionais.

## Onde o método mora

~~~java
public class Boletim {

    static String situacao(double media) {
        // ...
    }

    public static void main(String[] args) {
        System.out.println(situacao(8.0));
    }
}
~~~

Dentro da classe, fora do \`main\`, e \`static\` — porque o \`main\` também é.`,
      exercises: [
        {
          id: 'ja-proj-01-e1',
          lessonId: 'ja-proj-01',
          prompt:
            'Complete o tipo de retorno do método que devolve a situação do aluno:\n\n~~~java\nstatic ______ situacao(double media) {\n    if (media >= 7) {\n        return "Aprovado";\n    }\n    return "Reprovado";\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'String',
          hint: 'O que ele devolve é texto — e em Java o tipo começa com maiúscula.',
          explanation:
            '`String` com S maiúsculo, porque é uma classe e não um primitivo. O tipo declarado precisa bater com o que todos os `return` entregam.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-proj-01-e2',
          lessonId: 'ja-proj-01',
          prompt:
            'Por que o método `situacao` devolve o texto em vez de imprimi-lo direto?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Devolvendo, quem chamou decide o que fazer com o resultado — e o método serve para tela, arquivo ou relatório',
            'Porque System.out.println não funciona dentro de métodos',
            'Porque métodos static não podem imprimir',
            'Porque imprimir dentro do método causa erro de compilação',
          ],
          expectedAnswer:
            'Devolvendo, quem chamou decide o que fazer com o resultado — e o método serve para tela, arquivo ou relatório',
          explanation:
            'Um método que calcula e imprime só serve para um destino. Separando a decisão da apresentação, a mesma regra é reaproveitada na etapa seguinte sem nenhuma alteração.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-proj-02',
      moduleId: 'java-projeto-final',
      title: 'O relatório da turma',
      subtitle: 'Percorrer, calcular e fechar',
      orderIndex: 2,
      content: `## Os dados

Cada aluno tem nome e duas notas. Com o que a trilha cobriu, um array de arrays resolve:

~~~java
String[] nomes = {"Ana", "Luiz", "Kauan"};
double[][] notas = {
    {7.0, 9.0},
    {4.0, 5.0},
    {6.0, 6.0},
};
~~~

\`double[][]\` é um array de arrays: \`notas[0]\` é \`{7.0, 9.0}\`, e \`notas[0][1]\` é \`9.0\`.

> Num sistema de verdade você criaria uma **classe** \`Aluno\` com nome e notas, e teria um \`Aluno[]\`. É o próximo assunto depois desta trilha — e o motivo de o Java existir do jeito que existe.

## Uma linha por aluno

~~~java
for (int i = 0; i < nomes.length; i++) {
    double media = (notas[i][0] + notas[i][1]) / 2;
    System.out.println(nomes[i] + ": média " + media + " - " + situacao(media));
}
~~~

~~~text
Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6.0 - Recuperação
~~~

Aqui o \`for\` com índice é o certo, e não o for-each: são **duas** listas percorridas em paralelo, e o \`i\` liga o nome às notas.

## O fechamento

Dois acumuladores, do módulo de Repetições:

~~~java
double somaDasMedias = 0;
int aprovados = 0;

for (int i = 0; i < nomes.length; i++) {
    double media = (notas[i][0] + notas[i][1]) / 2;
    System.out.println(nomes[i] + ": média " + media + " - " + situacao(media));

    somaDasMedias += media;
    if (situacao(media).equals("Aprovado")) {
        aprovados++;
    }
}

System.out.println("---");
System.out.printf("Média da turma: %.2f%n", somaDasMedias / nomes.length);
System.out.println("Aprovados: " + aprovados + " de " + nomes.length);
~~~

~~~text
Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6.0 - Recuperação
---
Média da turma: 6.17
Aprovados: 1 de 3
~~~

## O que este programa junta

| Da trilha | Onde aparece |
| --- | --- |
| classe e \`main\` | a estrutura toda |
| tipos e conversão | \`double\`, a média decimal |
| \`if / else if\` em ordem | dentro de \`situacao\` |
| \`for\` com índice | percorrer duas listas juntas |
| acumuladores | soma das médias e contagem |
| métodos com \`return\` | \`situacao\` isolada |
| arrays | nomes e notas |
| \`.equals()\` | comparar a situação |

Repare no \`.equals()\` na comparação da situação: com \`==\` funcionaria por acidente — os textos vêm de literais dentro do método — e quebraria assim que a situação passasse a vir de um banco de dados.

## Um passo além

Se quiser continuar por conta própria: troque os dois arrays por uma \`ArrayList\` de uma classe \`Aluno\`, e o \`aprovados++\` por um \`HashMap<String, Integer>\` contando quantos há em cada situação. Os dois módulos anteriores já deram as ferramentas.`,
      exercises: [
        {
          id: 'ja-proj-02-e1',
          lessonId: 'ja-proj-02',
          prompt:
            'Por que percorrer com `for (int i = 0; ...)` em vez de for-each neste relatório?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'São duas listas percorridas em paralelo, e o índice liga o nome às notas',
            'O for-each não funciona com double',
            'Porque o for-each não permite calcular médias',
            'Porque arrays não aceitam for-each',
          ],
          expectedAnswer:
            'São duas listas percorridas em paralelo, e o índice liga o nome às notas',
          explanation:
            'O for-each entrega o valor, mas não a posição. Com `nomes` e `notas` separados, é o `i` que garante que a nota corresponde ao nome certo.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'ja-proj-02-e2',
          lessonId: 'ja-proj-02',
          prompt:
            'Complete o formato que imprime a média da turma com duas casas decimais:\n\n~~~java\nSystem.out.printf("Média da turma: ______%n", somaDasMedias / nomes.length);\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: '%.2f',
          hint: 'Começa com % e termina com f, de "float". O número no meio é a quantidade de casas.',
          explanation:
            '`%.2f` formata um decimal com duas casas. Sem isso, uma média como `6.166666666666667` sairia inteira na tela. O `%n` no fim pula a linha.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
  ],
};
