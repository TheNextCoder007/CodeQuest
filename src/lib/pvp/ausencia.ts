/**
 * O que acontece quando o jogador troca de aba no meio da partida.
 *
 * ---------------------------------------------------------------------------
 * O QUE NAO DA PARA FAZER
 *
 * Impedir a troca de aba. Nenhum site consegue: nao existe API de navegador
 * que prenda o foco, e nem deveria existir. Tela cheia com bloqueio de saida
 * tambem nao resolve - basta o atalho do sistema.
 *
 * O QUE DA PARA FAZER
 *
 * Cobrar o preco. Sao tres regras, em ordem de severidade:
 *
 *   1. **O relogio nao para.** Isso ja era verdade e continua sendo: o tempo
 *      restante e calculado por `Date.now() - inicioDaPergunta`, e nao por
 *      contagem de ticks. Se o navegador congela o `setInterval` da aba
 *      escondida - e ele congela -, o calculo na volta ja da o valor certo.
 *      Consultar dica em outra aba custa tempo de verdade.
 *
 *   2. **Sumir por muito tempo perde a pergunta.** Passou de
 *      {@link LIMITE_AUSENCIA_MS} fora numa mesma pergunta, aquela pergunta
 *      vale 0. A partida NAO fica esperando a volta: o adversario segue
 *      jogando normalmente, e a resposta em branco e enviada quando a pessoa
 *      retorna (ou o tempo estoura sozinho, o que vier antes).
 *
 *   3. **Insistir e abandono.** Na {@link AUSENCIAS_PARA_ABANDONO}-esima vez, a
 *      partida encerra como derrota de quem saiu, com a perda de elo normal -
 *      o mesmo tratamento de quem fecha o aplicativo no meio.
 *
 * ---------------------------------------------------------------------------
 * DE ONDE VEM O NUMERO
 *
 * A pergunta inteira dura {@link TEMPO_LIMITE_MS} (20 s). Cinco segundos e um
 * quarto disso: muito mais do que um clique errado ou uma notificacao que
 * rouba o foco por um instante, e ja o bastante para ler a resposta em outra
 * aba. Abaixo disso a regra puniria distracao honesta; acima, deixaria de
 * punir a consulta rapida - que e exatamente o que se quer coibir.
 */

import { TEMPO_LIMITE_MS } from './regras';

/** Tempo fora da aba, na mesma pergunta, que ja custa a pergunta. */
export const LIMITE_AUSENCIA_MS = 5_000;

/** Quantas ausencias punidas encerram a partida por abandono. */
export const AUSENCIAS_PARA_ABANDONO = 3;

/** A ausencia foi longa o bastante para custar a pergunta? */
export const ausenciaPunivel = (foraMs: number): boolean => foraMs >= LIMITE_AUSENCIA_MS;

/** Esta ausencia (a n-esima da partida) encerra tudo? */
export const ehAbandono = (ausencias: number): boolean => ausencias >= AUSENCIAS_PARA_ABANDONO;

/**
 * O aviso que aparece quando a pessoa volta.
 *
 * Precisa dizer tres coisas, nessa ordem: o que aconteceu, qual foi o custo, e
 * o que acontece se repetir. Sem a terceira parte a punicao seguinte chega sem
 * explicacao e parece defeito.
 */
export const avisoDeAusencia = (foraMs: number, ausencias: number): string => {
  const segundos = Math.max(1, Math.round(foraMs / 1000));

  if (ehAbandono(ausencias)) {
    return `Você saiu da aba ${ausencias} vezes nesta partida. O duelo foi encerrado como derrota.`;
  }

  const restam = AUSENCIAS_PARA_ABANDONO - ausencias;
  return (
    `Você ficou ${segundos}s fora da aba e o relógio não parou — esta pergunta valeu 0. ` +
    `Mais ${restam} ${restam === 1 ? 'vez' : 'vezes'} e a partida é encerrada como derrota.`
  );
};

/** Só para o aviso curto de ausência breve (nada foi perdido). */
export const avisoDeRelogio = (foraMs: number): string =>
  `O relógio correu enquanto você estava fora: ${Math.max(1, Math.round(foraMs / 1000))}s a menos ` +
  `nos ${Math.round(TEMPO_LIMITE_MS / 1000)}s desta pergunta.`;
