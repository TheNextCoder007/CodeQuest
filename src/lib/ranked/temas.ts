/**
 * Quais assuntos caem na partida ranqueada.
 *
 * O jogador NAO escolhe. Escolher o assunto seria escolher a dificuldade -
 * todo mundo jogaria so no que ja domina, e a escada de patamares deixaria de
 * medir o que se propoe a medir. Quem decide e o patamar em que a pessoa esta:
 *
 *   Bronze 1 ate Diamante 3 -> Python, Logica e JavaScript
 *   Mitico 1 em diante      -> as seis linguagens
 *
 * A ideia e que a ranqueada acompanhe a trilha. Hoje so Python esta pronta (e
 * a de JavaScript vem em seguida), entao os patamares de baixo cobram o que o
 * aluno de fato estudou; do Mitico para cima, o jogo passa a exigir repertorio
 * alem da trilha - e isso e parte da dificuldade.
 *
 * ATENCAO: esta mesma tabela existe em SQL, em `ranked_temas()` dentro de
 * `supabase/migrations/0006_ranqueado.sql`, e la e que ela vale numa partida
 * de verdade. `npm run test:ranqueado` compara as duas.
 */

/** Patamar a partir do qual entram todas as linguagens (4 = Mitico). */
export const PATAMAR_TEMAS_COMPLETOS = 4;

/** Ate Diamante 3: so o que a trilha ensina (ou vai ensinar em seguida). */
export const TEMAS_RANQUEADA_BASE = ['python', 'geral', 'javascript'] as const;

/** Do Mitico 1 em diante: tudo. */
export const TEMAS_RANQUEADA_COMPLETOS = [
  'python',
  'geral',
  'javascript',
  'java',
  'csharp',
  'cpp',
] as const;

/** Os temas sorteados para quem esta nesse patamar (0 = Bronze ... 6 = Mestre). */
export const temasDoPatamar = (patamar: number): readonly string[] =>
  patamar >= PATAMAR_TEMAS_COMPLETOS ? TEMAS_RANQUEADA_COMPLETOS : TEMAS_RANQUEADA_BASE;

/** true quando o patamar ja joga com as seis linguagens. */
export const temTodosOsTemas = (patamar: number): boolean =>
  patamar >= PATAMAR_TEMAS_COMPLETOS;

/**
 * Identificador gravado em `matches.tema`.
 *
 * Nao e um tema do seletor casual - e o nome do POOL que valeu naquela
 * partida. Serve para saber depois em que regime ela foi jogada.
 */
export const poolDoPatamar = (patamar: number): string =>
  temTodosOsTemas(patamar) ? 'ranqueada-total' : 'ranqueada-base';
