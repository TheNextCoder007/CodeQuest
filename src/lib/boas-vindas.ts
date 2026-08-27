'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * "Esta pessoa esta vendo o painel pela primeira vez?"
 *
 * ---------------------------------------------------------------------------
 * POR QUE NAO DA PARA DEDUZIR ISSO
 *
 * Tres caminhos que parecem servir e nao servem:
 *
 *   - `auth.users.last_sign_in_at`: muda a cada renovacao de sessao, entao
 *     comparar com o `created_at` acerta so quem cria a conta e entra no mesmo
 *     minuto. Quem cria hoje e volta amanha seria tratado como veterano.
 *   - "progresso zerado": quem se cadastrou e nunca estudou continuaria vendo
 *     "Bem-vindo" para sempre - o que e justamente o contrario do pedido.
 *   - `localStorage`: some ao trocar de aparelho, e a mesma conta veria a
 *     saudacao de novato de novo no celular.
 *
 * A pergunta so tem resposta se alguem guardar a resposta. Por isso a
 * migracao 0010 criou `profiles.boas_vindas_em`: nulo enquanto a pessoa nao
 * viu o painel, carimbado depois. `marcar_boas_vindas()` responde e carimba na
 * mesma chamada, entao a segunda visita ja devolve `false` - e um gatilho
 * impede que o carimbo volte a ser nulo por update direto na tabela.
 *
 * No modo demonstracao nao existe servidor: ali o carimbo mora no proprio
 * aparelho, que tambem e onde a conta inteira mora.
 */

const CHAVE_DEMO = (userId: string) => `cq:demo:boas-vindas:${userId}`;

export const conferirPrimeiraVisita = async (userId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    if (typeof window === 'undefined') return false;
    try {
      if (window.localStorage.getItem(CHAVE_DEMO(userId))) return false;
      window.localStorage.setItem(CHAVE_DEMO(userId), new Date().toISOString());
      return true;
    } catch {
      // Navegador com armazenamento bloqueado: trata como visita repetida.
      return false;
    }
  }

  try {
    const { data, error } = await getSupabase()!.rpc('marcar_boas_vindas', {});
    // Migracao 0010 ainda nao aplicada: a saudacao segue como sempre foi.
    if (error) return false;
    return data === true;
  } catch {
    return false;
  }
};
