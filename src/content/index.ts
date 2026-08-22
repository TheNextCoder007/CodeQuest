import type { Language, Lesson, Module } from '@/types/content';
import { fundamentos } from './python/01-fundamentos';
import { variaveis } from './python/02-variaveis';
import { condicionais } from './python/03-condicionais';
import { repeticoes } from './python/04-repeticoes';
import { funcoes } from './python/05-funcoes';
import { desafios } from './python/06-desafios';
import { projetoFinal } from './python/07-projeto-final';

/**
 * Catalogo de linguagens do CodeQuest.
 *
 * No MVP apenas Python tem conteudo populado (`available: true`). As demais
 * ficam com a estrutura pronta no catalogo e no banco, prontas para receber
 * modulos sem nenhuma mudanca de codigo.
 */
export const languages: Language[] = [
  {
    id: 'python',
    name: 'Python',
    slug: 'python',
    icon: '🐍',
    accent: 'from-mint-500 to-aqua-400',
    description: 'A linguagem mais amigável para começar. Trilha completa disponível.',
    available: true,
    modules: [fundamentos, variaveis, condicionais, repeticoes, funcoes, desafios, projetoFinal],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    slug: 'javascript',
    icon: '🟨',
    accent: 'from-amber-400 to-orange-500',
    description: 'A linguagem da web. Trilha em produção.',
    available: false,
    modules: [],
  },
  {
    id: 'java',
    name: 'Java',
    slug: 'java',
    icon: '☕',
    accent: 'from-red-400 to-rose-600',
    description: 'Forte no mercado corporativo. Trilha em produção.',
    available: false,
    modules: [],
  },
  {
    id: 'csharp',
    name: 'C#',
    slug: 'csharp',
    icon: '🎯',
    accent: 'from-violet-400 to-purple-600',
    description: 'Ecossistema .NET e desenvolvimento de jogos. Trilha em produção.',
    available: false,
    modules: [],
  },
  {
    id: 'cpp',
    name: 'C++',
    slug: 'cpp',
    icon: '⚡',
    accent: 'from-sky-400 to-electric-500',
    description: 'Performance e proximidade com o hardware. Trilha em produção.',
    available: false,
    modules: [],
  },
];

export const languageBySlug = (slug: string): Language | undefined =>
  languages.find((language) => language.slug === slug);

export const allModules = (): Module[] => languages.flatMap((language) => language.modules);

export const allLessons = (): Lesson[] => allModules().flatMap((module) => module.lessons);

export const moduleById = (id: string): Module | undefined =>
  allModules().find((module) => module.id === id);

export const lessonById = (id: string): Lesson | undefined =>
  allLessons().find((lesson) => lesson.id === id);

export const languageOfModule = (moduleId: string): Language | undefined =>
  languages.find((language) => language.modules.some((module) => module.id === moduleId));

/** XP total que uma licao concede quando todos os seus exercicios sao resolvidos. */
export const lessonXp = (lesson: Lesson): number =>
  lesson.exercises.reduce((total, exercise) => total + exercise.xpReward, 0);

/** Licoes de um modulo, em ordem. */
export const moduleLessons = (moduleId: string): Lesson[] =>
  moduleById(moduleId)?.lessons ?? [];

/**
 * Sequencia linear de todas as licoes de uma linguagem, na ordem em que o
 * aluno deve percorre-las. Usada para calcular "proxima licao".
 */
export const languageLessonSequence = (languageSlug: string): Lesson[] => {
  const language = languageBySlug(languageSlug);
  if (!language) return [];
  return [...language.modules]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((module) => [...module.lessons].sort((a, b) => a.orderIndex - b.orderIndex));
};
