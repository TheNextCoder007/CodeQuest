/**
 * Temas do duelo 1v1.
 *
 * Fica separado de `pvp-questions.ts` de proposito: o seletor de tema aparece
 * em varias telas, enquanto o banco de perguntas (que carrega os gabaritos) so
 * e importado sob demanda, no modo demonstracao. Assim o pacote principal do
 * aplicativo nao leva as respostas junto.
 */

export const TEMAS_PVP = [
  { slug: 'todas', nome: 'Todas', icon: '🎲', descricao: 'Perguntas de qualquer linguagem' },
  { slug: 'python', nome: 'Python', icon: '🐍', descricao: 'Só perguntas de Python' },
  { slug: 'javascript', nome: 'JavaScript', icon: '🟨', descricao: 'Só perguntas de JavaScript' },
  { slug: 'java', nome: 'Java', icon: '☕', descricao: 'Só perguntas de Java' },
  { slug: 'csharp', nome: 'C#', icon: '🎯', descricao: 'Só perguntas de C#' },
  { slug: 'cpp', nome: 'C++', icon: '⚡', descricao: 'Só perguntas de C++' },
  { slug: 'geral', nome: 'Lógica', icon: '🧠', descricao: 'Conceitos, sem sintaxe' },
] as const;

export type TemaPvp = (typeof TEMAS_PVP)[number]['slug'];

export const temaPorSlug = (slug: string) => TEMAS_PVP.find((tema) => tema.slug === slug);

export const nomeDoTema = (slug: string): string => temaPorSlug(slug)?.nome ?? slug;
