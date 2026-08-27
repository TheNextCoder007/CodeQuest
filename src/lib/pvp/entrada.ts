/**
 * "Este evento do Realtime deve me levar para a tela da partida?"
 *
 * A regra mora aqui, e nao dentro do componente, por dois motivos: ela e a
 * parte que pode dar errado de forma invisivel (arrastar alguem para uma tela
 * que a pessoa nao pediu), e ela precisa ser testavel sem navegador nem
 * servidor - `npm run test:entrada`.
 *
 * ---------------------------------------------------------------------------
 * POR QUE AS TRAVAS
 *
 * Sequestrar a navegacao de alguem e agressivo. "Existe uma partida ativa" NAO
 * e motivo suficiente - se fosse, recarregar a pagina no meio de um duelo
 * antigo, ou abrir o aplicativo com uma partida esquecida em aberto, jogaria a
 * pessoa la dentro sem ela pedir. O motivo suficiente e mais estreito: uma
 * partida em que EU estou ACABOU DE virar ativa, AGORA.
 */

import type { MudancaDePartida } from '@/lib/presenca';

/**
 * Quanto tempo depois do inicio ainda vale puxar quem esta fora da tela.
 *
 * O suficiente para cobrir uma rede lenta ou uma aba que estava escondida
 * quando o evento chegou, e curto o bastante para que uma partida esquecida em
 * aberto nunca arraste ninguem.
 */
export const JANELA_DE_ENTRADA_MS = 45_000;

export interface ContextoDeEntrada {
  /** Quem esta usando o aplicativo. */
  meuId: string | undefined;
  /** Rota atual (`usePathname`). */
  caminho: string | null;
  /** Partidas para as quais esta sessao ja navegou. */
  jaLevou: ReadonlySet<string>;
  /** Injetavel para o teste. */
  agora?: number;
}

export const deveEntrarNaPartida = (
  mudanca: MudancaDePartida | undefined,
  { meuId, caminho, jaLevou, agora = Date.now() }: ContextoDeEntrada,
): boolean => {
  if (!mudanca || !meuId) return false;

  // So o momento em que a partida comeca. 'convite' ainda nao e partida, e
  // 'encerrada' ou 'cancelada' nao tem para onde levar.
  if (mudanca.status !== 'ativa') return false;

  // Evento de partida de outra gente nao chega aqui (o RLS filtra), mas o
  // filtro do canal e por coluna - conferir e barato e fecha a porta.
  if (mudanca.host_id !== meuId && mudanca.guest_id !== meuId) return false;

  // Ja levamos uma vez: se a pessoa saiu da partida de proposito, o proximo
  // evento daquela mesma partida nao pode arrasta-la de volta.
  if (jaLevou.has(mudanca.id)) return false;

  // Ja esta no duelo - inclusive num duelo diferente, que seria pior ainda
  // interromper.
  if (caminho?.startsWith('/duelo')) return false;

  // Partida velha reaparecendo num evento qualquer (uma atualizacao de placar,
  // por exemplo) nao e comeco de partida.
  const comecou = mudanca.started_at ? Date.parse(mudanca.started_at) : Number.NaN;
  if (Number.isFinite(comecou) && agora - comecou > JANELA_DE_ENTRADA_MS) return false;

  return true;
};
