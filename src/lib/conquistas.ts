'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

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

/** Erro que significa "a migracao 0010 ainda nao foi aplicada". */
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
