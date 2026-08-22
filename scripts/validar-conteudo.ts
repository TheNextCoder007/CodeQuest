/**
 * Validacao estrutural do curriculo.
 *
 * Roda com `npm run content:check` e tambem no CI. Pega os erros mais comuns
 * ao escrever uma licao nova: id repetido, alternativa correta que nao esta
 * na lista de opcoes, exercicio sem explicacao, ordem fora de sequencia.
 */

import { languages } from '../src/content/index';
import { achievements } from '../src/content/achievements';

const problemas: string[] = [];
const idsVistos = new Map<string, string>();

const registrarId = (id: string, onde: string) => {
  if (!id.trim()) {
    problemas.push(`${onde}: id vazio`);
    return;
  }
  const anterior = idsVistos.get(id);
  if (anterior) {
    problemas.push(`id duplicado "${id}" (${anterior} e ${onde})`);
  } else {
    idsVistos.set(id, onde);
  }
};

const conferirOrdem = (indices: number[], onde: string) => {
  const esperado = indices.map((_, posicao) => posicao + 1).join(',');
  const obtido = [...indices].sort((a, b) => a - b).join(',');
  if (esperado !== obtido) {
    problemas.push(`${onde}: order_index deveria ser 1..${indices.length}, veio [${obtido}]`);
  }
};

for (const language of languages) {
  registrarId(language.id, `linguagem ${language.name}`);

  if (language.available && language.modules.length === 0) {
    problemas.push(`linguagem ${language.name} marcada como disponivel mas sem modulos`);
  }

  conferirOrdem(
    language.modules.map((module) => module.orderIndex),
    `linguagem ${language.name}`,
  );

  for (const module of language.modules) {
    registrarId(module.id, `modulo ${module.title}`);

    if (module.languageId !== language.id) {
      problemas.push(`modulo ${module.id} aponta para a linguagem errada (${module.languageId})`);
    }
    if (module.lessons.length === 0) {
      problemas.push(`modulo ${module.id} nao tem licoes`);
    }

    conferirOrdem(
      module.lessons.map((lesson) => lesson.orderIndex),
      `modulo ${module.id}`,
    );

    for (const lesson of module.lessons) {
      registrarId(lesson.id, `licao ${lesson.title}`);

      if (lesson.moduleId !== module.id) {
        problemas.push(`licao ${lesson.id} aponta para o modulo errado (${lesson.moduleId})`);
      }
      if (lesson.content.trim().length < 80) {
        problemas.push(`licao ${lesson.id} tem conteudo teorico muito curto`);
      }
      if (lesson.exercises.length === 0) {
        problemas.push(`licao ${lesson.id} nao tem exercicios`);
      }

      conferirOrdem(
        lesson.exercises.map((exercise) => exercise.orderIndex),
        `licao ${lesson.id}`,
      );

      for (const exercise of lesson.exercises) {
        registrarId(exercise.id, `exercicio de ${lesson.id}`);

        if (exercise.lessonId !== lesson.id) {
          problemas.push(`exercicio ${exercise.id} aponta para a licao errada`);
        }
        if (!exercise.prompt.trim()) {
          problemas.push(`exercicio ${exercise.id} sem enunciado`);
        }
        if (!exercise.explanation.trim()) {
          problemas.push(`exercicio ${exercise.id} sem explicacao`);
        }
        if (!exercise.expectedAnswer.trim()) {
          problemas.push(`exercicio ${exercise.id} sem resposta esperada`);
        }
        if (exercise.xpReward <= 0) {
          problemas.push(`exercicio ${exercise.id} sem XP`);
        }

        if (exercise.validationType === 'multiple_choice') {
          if (!exercise.options || exercise.options.length < 2) {
            problemas.push(`exercicio ${exercise.id} precisa de pelo menos 2 alternativas`);
          } else if (!exercise.options.includes(exercise.expectedAnswer)) {
            problemas.push(
              `exercicio ${exercise.id}: a resposta correta nao esta entre as alternativas`,
            );
          } else if (new Set(exercise.options).size !== exercise.options.length) {
            problemas.push(`exercicio ${exercise.id} tem alternativas repetidas`);
          }
        }

        if (exercise.validationType !== 'output_match' && exercise.stdin) {
          problemas.push(`exercicio ${exercise.id}: stdin so faz sentido em output_match`);
        }

        if (exercise.validationType === 'output_match' && exercise.starterCode === null) {
          problemas.push(`exercicio ${exercise.id}: exercicio de codigo sem codigo inicial`);
        }
      }
    }
  }
}

// Conquistas: ids unicos e criterios apontando para conteudo que existe.
for (const achievement of achievements) {
  registrarId(achievement.id, `conquista ${achievement.title}`);

  const criteria = achievement.criteria;
  if (criteria.kind === 'module_completed') {
    const existe = languages.some((language) =>
      language.modules.some((module) => module.id === criteria.moduleId),
    );
    if (!existe) {
      problemas.push(`conquista ${achievement.id} aponta para o modulo inexistente ${criteria.moduleId}`);
    }
  }
  if (criteria.kind === 'language_completed') {
    const existe = languages.some((language) => language.slug === criteria.languageSlug);
    if (!existe) {
      problemas.push(
        `conquista ${achievement.id} aponta para a linguagem inexistente ${criteria.languageSlug}`,
      );
    }
  }
}

const totalLicoes = languages.reduce(
  (total, language) => total + language.modules.reduce((soma, module) => soma + module.lessons.length, 0),
  0,
);
const totalExercicios = languages.reduce(
  (total, language) =>
    total +
    language.modules.reduce(
      (soma, module) => soma + module.lessons.reduce((conta, lesson) => conta + lesson.exercises.length, 0),
      0,
    ),
  0,
);

if (problemas.length > 0) {
  console.error(`\n${problemas.length} problema(s) encontrado(s) no curriculo:\n`);
  problemas.forEach((problema) => console.error(`  - ${problema}`));
  process.exit(1);
}

console.log(
  `Curriculo validado: ${languages.length} linguagens, ${totalLicoes} licoes, ${totalExercicios} exercicios, ${achievements.length} conquistas.`,
);
