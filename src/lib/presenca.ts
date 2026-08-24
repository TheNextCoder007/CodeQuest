'use client';

import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Quem esta online agora.
 *
 * Usa o **Presence** do Supabase Realtime: cada aparelho aberto entra num
 * canal e anuncia o proprio id; o servidor devolve a lista consolidada para
 * todo mundo. Nao existe tabela nem escrita no banco - o estado vive so
 * enquanto a aba estiver aberta, e some sozinho quando ela fecha (inclusive
 * se a internet cair, sem precisar de "ultimo visto" nem faxina agendada).
 *
 * Isso cabe no plano gratuito: o Presence nao consome linhas do banco.
 */
const CANAL = 'codequest-presenca';

export function usePresenca(meuId: string | undefined, meuUsername: string | null | undefined) {
  const [online, setOnline] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isSupabaseConfigured || !meuId) return;

    const supabase = getSupabase()!;
    const canal = supabase.channel(CANAL, {
      config: { presence: { key: meuId } },
    });

    const atualizar = () => {
      const estado = canal.presenceState<{ user_id: string }>();
      const ids = new Set<string>();
      Object.values(estado).forEach((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.user_id) ids.add(entrada.user_id);
        });
      });
      setOnline(ids);
    };

    canal
      .on('presence', { event: 'sync' }, atualizar)
      .on('presence', { event: 'join' }, atualizar)
      .on('presence', { event: 'leave' }, atualizar)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          void canal.track({ user_id: meuId, username: meuUsername ?? null });
        }
      });

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [meuId, meuUsername]);

  return online;
}

/**
 * Avisa quando chega convite novo (ou quando um convite meu muda de estado).
 *
 * Escuta as mudancas da tabela `matches`. O RLS continua valendo no Realtime:
 * so chegam eventos das partidas em que a pessoa aparece.
 */
export function useAvisoDePartidas(meuId: string | undefined, aoMudar: () => void) {
  useEffect(() => {
    if (!isSupabaseConfigured || !meuId) return;

    const supabase = getSupabase()!;
    const canal = supabase
      .channel(`partidas-${meuId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `guest_id=eq.${meuId}` },
        aoMudar,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `host_id=eq.${meuId}` },
        aoMudar,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [meuId, aoMudar]);
}

/**
 * Acompanha o adversario durante a partida.
 *
 * Cada resposta dele gera um evento em `match_answers`; a tela so usa isso
 * para mostrar "ele esta na pergunta 3" - o conteudo da resposta nao aparece.
 */
export function useAvisoDeRespostas(matchId: string | null, aoMudar: () => void) {
  useEffect(() => {
    if (!isSupabaseConfigured || !matchId) return;

    const supabase = getSupabase()!;
    const canal = supabase
      .channel(`duelo-${matchId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'match_answers', filter: `match_id=eq.${matchId}` },
        aoMudar,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [matchId, aoMudar]);
}
