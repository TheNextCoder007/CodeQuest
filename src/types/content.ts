/**
 * Tipos do conteudo pedagogico do CodeQuest.
 *
 * O curriculo vive em `src/content` como TypeScript (fonte da verdade) e o
 * arquivo `supabase/seed.sql` e gerado a partir dele por `npm run seed:gen`.
 * Assim o mesmo conteudo existe no banco (conforme o modelo de dados do
 * projeto) e tambem embarcado no app - o que garante que o .apk e o .exe
 * mostrem as licoes mesmo sem conexao.
 */

export type ValidationType = 'output_match' | 'multiple_choice' | 'fill_blank';

export interface Exercise {
  id: string;
  lessonId: string;
  /** Enunciado do desafio (markdown-lite). */
  prompt: string;
  /** Codigo inicial que aparece no editor. */
  starterCode: string | null;
  validationType: ValidationType;
  /**
   * output_match    -> saida esperada no terminal (comparada linha a linha)
   * multiple_choice -> texto exato da alternativa correta
   * fill_blank      -> resposta esperada; varias respostas aceitas com "|"
   */
  expectedAnswer: string;
  /** Alternativas (apenas multiple_choice). */
  options?: string[];
  /** Valores entregues a cada chamada de input() (apenas output_match). */
  stdin?: string[];
  /** Dica opcional liberada pelo botao "Preciso de uma dica". */
  hint?: string;
  /** Explicacao mostrada depois da resposta (certa ou errada). */
  explanation: string;
  xpReward: number;
  orderIndex: number;
}

/** Mesmo conceito escrito em linguagens diferentes ("conceito primeiro, sintaxe depois"). */
export interface PolyglotSample {
  language: string;
  code: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  /** Teoria da licao em markdown-lite (ver `MarkdownLite`). */
  content: string;
  orderIndex: number;
  polyglot?: PolyglotSample[];
  exercises: Exercise[];
}

export interface Module {
  id: string;
  languageId: string;
  title: string;
  description: string;
  icon: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Language {
  id: string;
  name: string;
  slug: string;
  icon: string;
  /** Classe Tailwind de gradiente usada nos cards da linguagem. */
  accent: string;
  description: string;
  /** false = estrutura pronta no banco, conteudo ainda nao populado. */
  available: boolean;
  modules: Module[];
}
