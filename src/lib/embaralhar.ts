/**
 * Embaralhamento com semente.
 *
 * Usado em dois lugares que parecem iguais mas nao sao:
 *
 *   - **Duelo e ranqueada**: quem embaralha as alternativas e o SERVIDOR
 *     (`pvp_pergunta`, em `supabase/migrations/0007_embaralhar.sql`). O que
 *     esta aqui serve so ao modo demonstracao, que roda sem banco.
 *   - **Trilha**: as licoes sao 100% offline - o gabarito ja viaja no pacote
 *     do aplicativo, entao nao existe segredo a proteger. Aqui embaralhar e
 *     questao de ensino: com a resposta certa sempre na primeira posicao, da
 *     para "acertar" tudo sem ler o enunciado.
 *
 * O gerador com semente existe por causa do React: a ordem e derivada de um
 * numero guardado em estado, entao recalcular o `useMemo` nunca reordena as
 * alternativas embaixo do dedo de quem esta respondendo.
 */

/**
 * Gerador pseudoaleatorio deterministico (mulberry32).
 *
 * A mesma semente devolve sempre a mesma sequencia. Nao serve para nada
 * criptografico - e so para embaralhar de forma reproduzivel.
 */
export const geradorComSemente = (semente: number): (() => number) => {
  let estado = Math.floor(semente) || 1;
  return () => {
    estado |= 0;
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Copia a lista embaralhada (Fisher-Yates).
 *
 * Nao mexe na lista original - o conteudo das licoes e do banco de perguntas e
 * compartilhado entre telas, e embaralhar no lugar bagunçaria todas elas.
 */
export const embaralhar = <T>(
  lista: readonly T[],
  aleatorio: () => number = Math.random,
): T[] => {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

/** Embaralha de forma reproduzivel a partir de uma semente. */
export const embaralharComSemente = <T>(lista: readonly T[], semente: number): T[] =>
  embaralhar(lista, geradorComSemente(semente));
