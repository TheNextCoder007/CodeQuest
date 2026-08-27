/**
 * Versao do CodeQuest mostrada no canto da tela.
 *
 * FONTE UNICA: este arquivo. O `HISTORICO.md` (e o PDF gerado dele) precisa
 * bater com o valor daqui - `npm run content:check` recusa se os dois
 * divergirem, para nao existir a situacao de o site anunciar uma versao e o
 * documento contar a historia de outra.
 *
 * Ao lancar uma versao nova: troque aqui, escreva a entrada no HISTORICO.md e
 * rode `npm run doc:pdf`.
 */
export const VERSAO = 'v1.10.1';
