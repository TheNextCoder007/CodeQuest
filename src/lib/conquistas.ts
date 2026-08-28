'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { empatesQueValemLocais } from '@/lib/pvp/local';

/**
 * Reavaliacao das conquistas contra o historico real, no servidor.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ISTO EXISTE
 *
 * As conquistas sao avaliadas no aplicativo, no instante em que o feito
 * acontece. Isso funciona bem para o caso normal e nao funciona nunca para
 * dois casos:
 *
 *   1. criterio que passou a existir DEPOIS de a pessoa ja ter cumprido o
 *      requisito - ninguem volta para conferir;
 *   2. dado que o aplicativo nao tem na mao naquele momento - o exemplo real
 *      foram os empates de temporadas passadas, que a tela do perfil nem
 *      carrega.
 *
 * `conquistas_reavaliar()` (migracao 0010) confere cada criterio contra o que
 * esta gravado no banco e concede o que faltou. Ela ja escreveu em
 * `user_achievements` quando responde - aqui so trazemos a lista para a tela
 * poder avisar e para o estado local ficar em dia.
 *
 * No modo demonstracao nao ha servidor: quem cobre esse caso e
 * `evaluateAchievements`, no proprio aparelho.
 */

/** Erro que significa "a migracao que criou esta funcao ainda nao foi aplicada". */
const migracaoPendente = (mensagem: string): boolean =>
  /does not exist|schema cache|could not find the function/i.test(mensagem);

interface LinhaConcedida {
  conquista: string;
}

/**
 * Devolve os ids das conquistas concedidas AGORA (lista vazia e o caso comum).
 *
 * Nunca lanca: uma reavaliacao que falha nao pode derrubar a tela que a
 * chamou - ela e um conserto de fundo, nao o assunto da pagina.
 */
export const reavaliarConquistas = async (): Promise<string[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await getSupabase()!.rpc('conquistas_reavaliar', {});
    if (error) {
      if (!migracaoPendente(error.message)) {
        console.warn('[CodeQuest] reavaliacao de conquistas falhou', error.message);
      }
      return [];
    }
    return ((data as LinhaConcedida[] | null) ?? []).map((linha) => linha.conquista);
  } catch (falha) {
    console.warn('[CodeQuest] reavaliacao de conquistas falhou', falha);
    return [];
  }
};

/**
 * Quantos empates da pessoa VALEM a medalha de empate.
 *
 * ---------------------------------------------------------------------------
 * POR QUE NAO SERVE O CONTADOR DE EMPATES
 *
 * "Empate tecnico" e a medalha mais rara do jogo: placar identico ate o bonus
 * de velocidade, que e contado em milesimos de segundo. Menos o 0 a 0, que e o
 * contrario disso - basta os dois lados errarem tudo, e contra o bot da
 * ranqueada da para conseguir de proposito sem responder nada.
 *
 * `pvp_stats.empates` e `ranked_stats.empates` somam os dois casos, e nao ha
 * como separa-los depois. Quem sabe a diferenca e o historico de partidas, que
 * guarda o placar - e e de la que a migracao 0013 tira este numero.
 *
 * Precisa ser consultado, e nao deduzido, porque a tela concede a medalha no
 * aparelho: se ela errar para mais, a reavaliacao do servidor nao desfaz (ela
 * so concede).
 *
 * Nunca lanca. Diante de qualquer duvida devolve 0 - a medalha atrasa um
 * pouco (a reavaliacao do servidor a concede depois) em vez de ser dada errado.
 */
export const contarEmpatesQueValem = async (userId?: string): Promise<number> => {
  // Modo demonstracao: quem conta e o proprio aparelho.
  if (!isSupabaseConfigured) return userId ? empatesQueValemLocais(userId) : 0;

  try {
    const { data, error } = await getSupabase()!.rpc('conquistas_empates_meus', {});
    if (error) {
      if (!migracaoPendente(error.message)) {
        console.warn('[CodeQuest] contagem de empates falhou', error.message);
      }
      return 0;
    }
    return typeof data === 'number' ? data : 0;
  } catch (falha) {
    console.warn('[CodeQuest] contagem de empates falhou', falha);
    return 0;
  }
};
