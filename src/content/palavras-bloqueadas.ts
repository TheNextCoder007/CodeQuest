/**
 * Lista de palavras bloqueadas no @username.
 *
 * Criterio deliberado: **lista curta e direta**, so palavrao obvio. Nao
 * tentamos pegar disfarce com numero ou simbolo ("s3x0" passa, e tudo bem) -
 * filtro agressivo erra mais do que acerta e acaba barrando nome inocente.
 *
 * A mesma lista existe no banco, em
 * `supabase/migrations/0004_perfis_publicos.sql`, porque a checagem de
 * verdade precisa acontecer no servidor. `npm run test:tags` compara as duas
 * e falha se saírem de sincronia.
 */

export const PALAVRAS_BLOQUEADAS: string[] = [
  'boceta',
  'boquete',
  'bosta',
  'buceta',
  'caralho',
  'cu',
  'cuzao',
  'cuzinho',
  'fdp',
  'foda',
  'fodase',
  'foder',
  'fuder',
  'gozada',
  'mamei',
  'merda',
  'penis',
  'piroca',
  'porno',
  'pornografia',
  'porra',
  'punheta',
  'puta',
  'putao',
  'putaria',
  'sexo',
  'siririca',
  'tesao',
  'vagina',
  'viado',
  'xereca',
  'xoxota',
];

/**
 * Comprimento a partir do qual a palavra tambem e barrada no meio do nome.
 *
 * Palavra curta so bloqueia quando e o nome inteiro ou um pedaco separado -
 * senao "cu" barraria "curioso", "escuro" e "documento". Mesmo entre as
 * longas o corte em 5 evita os casos classicos: "puta" (4) nao pode bloquear
 * "disputa" nem "reputacao".
 */
export const TAMANHO_PARA_BUSCA_NO_MEIO = 5;

/**
 * Quebra o username em pedacos: `davi_puta2` -> ['davi', 'puta'].
 * Underline e sequencias de numeros funcionam como separadores.
 */
const pedacos = (username: string): string[] =>
  username
    .split(/[_0-9]+/)
    .map((pedaco) => pedaco.trim())
    .filter(Boolean);

/** Remove separadores: `p_u_t_a` continua distinto, mas `puta_1` vira `puta`. */
const semSeparadores = (username: string): string => username.replace(/[_0-9]+/g, '');

/**
 * `true` quando o username bate com alguma palavra da lista.
 *
 * Regras, em ordem:
 *   1. o nome inteiro (sem `_` e sem numeros) e exatamente a palavra;
 *   2. algum pedaco separado e exatamente a palavra;
 *   3. a palavra tem 5+ letras e aparece dentro do nome.
 */
export const usernameProibido = (username: string): boolean => {
  const limpo = username.trim().toLowerCase();
  if (!limpo) return false;

  const base = semSeparadores(limpo);
  const partes = pedacos(limpo);

  return PALAVRAS_BLOQUEADAS.some((palavra) => {
    if (base === palavra) return true;
    if (partes.includes(palavra)) return true;
    if (palavra.length >= TAMANHO_PARA_BUSCA_NO_MEIO && base.includes(palavra)) return true;
    return false;
  });
};
