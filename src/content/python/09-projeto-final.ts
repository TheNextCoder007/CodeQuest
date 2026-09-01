import type { Module } from '@/types/content';

/**
 * Modulo 7 - Projeto Final.
 * Uma unica licao longa: o aluno monta um sistema completo em tres etapas,
 * cada etapa sendo um exercicio que se apoia no anterior.
 */
export const projetoFinal: Module = {
  id: 'py-projeto-final',
  languageId: 'python',
  title: 'Projeto Final',
  description: 'Um sistema completo de boletim escolar, construído em três etapas — do zero ao funcionando.',
  icon: '🏆',
  orderIndex: 9,
  lessons: [
    {
      id: 'py-proj-01',
      moduleId: 'py-projeto-final',
      title: 'Sistema de Boletim',
      subtitle: 'Juntando os sete módulos em um programa só',
      orderIndex: 1,
      content: `## O que você vai construir

Um programa que recebe as notas de vários alunos, calcula a média de cada um, decide a situação (Aprovado, Recuperação ou Reprovado) e apresenta um relatório com a média geral da turma.

Nada aqui é conteúdo novo. Tudo que você precisa já foi visto:

- 📦 **Variáveis e tipos** para guardar notas e nomes;
- 🔀 **Condicionais** para decidir a situação de cada aluno;
- 🔁 **Repetições** para percorrer a turma e acumular a média geral;
- ⚙️ **Funções** para separar cada responsabilidade.

## As regras do sistema

| Média | Situação |
| --- | --- |
| 7.0 ou mais | Aprovado |
| entre 5.0 e 6.9 | Recuperação |
| abaixo de 5.0 | Reprovado |

## Os dados

Cada aluno é uma lista com nome e duas notas, e a turma é uma lista dessas listas:

~~~py
turma = [
    ["Ana", 7.0, 9.0],
    ["Luiz", 4.0, 5.0],
    ["Kauan", 6.0, 6.0],
]
~~~

Percorrendo, cada \`aluno\` é uma lista de 3 posições — \`aluno[0]\` é o nome, \`aluno[1]\` e \`aluno[2]\` são as notas:

~~~py
for aluno in turma:
    print(aluno[0])
~~~

## Como atacar o problema

Construa **em etapas** e teste cada uma antes de seguir. É assim que se escreve software de verdade: nunca tudo de uma vez, sempre um pedaço funcionando por vez. Os três exercícios abaixo seguem exatamente essa ordem.`,
      polyglot: [
        {
          language: 'Python',
          code: 'def situacao(media):\n    if media >= 7:\n        return "Aprovado"\n    elif media >= 5:\n        return "Recuperação"\n    return "Reprovado"',
        },
        {
          language: 'JavaScript',
          code: 'function situacao(media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}',
        },
        {
          language: 'Java',
          code: 'static String situacao(double media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}',
        },
      ],
      exercises: [
        {
          id: 'py-proj-01-e1',
          lessonId: 'py-proj-01',
          prompt:
            '**Etapa 1 — a regra de negócio.**\n\nComplete a função `situacao(media)` seguindo a tabela do enunciado.\n\nSaída esperada:\n\n~~~text\nAprovado\nRecuperação\nReprovado\n~~~',
          starterCode:
            'def situacao(media):\n    # complete usando if / elif / else\n\nprint(situacao(8.0))\nprint(situacao(6.0))\nprint(situacao(3.0))\n',
          validationType: 'output_match',
          expectedAnswer: 'Aprovado\nRecuperação\nReprovado',
          hint: 'if media >= 7: return "Aprovado" / elif media >= 5: return "Recuperação" / else: return "Reprovado"',
          explanation:
            'Isolar a regra de negócio numa função é a decisão de projeto mais importante aqui: se a escola mudar a nota de corte, você altera **um** lugar.',
          xpReward: 70,
          orderIndex: 1,
        },
        {
          id: 'py-proj-01-e2',
          lessonId: 'py-proj-01',
          prompt:
            '**Etapa 2 — o relatório por aluno.**\n\nPercorra a turma e mostre uma linha por aluno no formato `Nome: média X.X - Situação`.\n\nSaída esperada:\n\n~~~text\nAna: média 8.0 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6.0 - Recuperação\n~~~',
          starterCode:
            'def situacao(media):\n    if media >= 7:\n        return "Aprovado"\n    elif media >= 5:\n        return "Recuperação"\n    return "Reprovado"\n\nturma = [\n    ["Ana", 7.0, 9.0],\n    ["Luiz", 4.0, 5.0],\n    ["Kauan", 6.0, 6.0],\n]\n\n# percorra a turma e mostre uma linha por aluno\n',
          validationType: 'output_match',
          expectedAnswer:
            'Ana: média 8.0 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6.0 - Recuperação',
          hint: 'for aluno in turma: media = (aluno[1] + aluno[2]) / 2 e depois print(f"{aluno[0]}: média {media} - {situacao(media)}")',
          explanation:
            'Repare como a f-string aceita a chamada `{situacao(media)}` diretamente. A função da etapa 1 foi reaproveitada sem nenhuma alteração.',
          xpReward: 90,
          orderIndex: 2,
        },
        {
          id: 'py-proj-01-e3',
          lessonId: 'py-proj-01',
          prompt:
            '**Etapa 3 — o fechamento da turma.**\n\nAlém das linhas por aluno, acumule as médias e mostre no final a média geral e quantos alunos foram aprovados.\n\nSaída esperada:\n\n~~~text\nAna: média 8.0 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6.0 - Recuperação\n---\nMédia da turma: 6.17\nAprovados: 1 de 3\n~~~',
          starterCode:
            'def situacao(media):\n    if media >= 7:\n        return "Aprovado"\n    elif media >= 5:\n        return "Recuperação"\n    return "Reprovado"\n\nturma = [\n    ["Ana", 7.0, 9.0],\n    ["Luiz", 4.0, 5.0],\n    ["Kauan", 6.0, 6.0],\n]\n\nsoma_medias = 0\naprovados = 0\n\n# percorra, mostre cada aluno e acumule os totais\n\nprint("---")\nprint(f"Média da turma: {round(soma_medias / len(turma), 2)}")\nprint(f"Aprovados: {aprovados} de {len(turma)}")\n',
          validationType: 'output_match',
          expectedAnswer:
            'Ana: média 8.0 - Aprovado\nLuiz: média 4.5 - Reprovado\nKauan: média 6.0 - Recuperação\n---\nMédia da turma: 6.17\nAprovados: 1 de 3',
          hint: 'Dentro do for: soma_medias += media e um if situacao(media) == "Aprovado": aprovados += 1',
          explanation:
            'Você terminou a trilha de Python do CodeQuest. Este último programa tem entrada de dados, regra de negócio isolada em função, laço, condicional, dois acumuladores e saída formatada — a estrutura de qualquer sistema real, em miniatura. `round(valor, 2)` arredonda para duas casas.',
          xpReward: 120,
          orderIndex: 3,
        },
      ],
    },
  ],
};
