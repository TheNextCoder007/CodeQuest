'use client';

import { useEffect, useId, useRef, useState } from 'react';
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
 *
 * ---------------------------------------------------------------------------
 * POR QUE O NOME DO CANAL LEVA UM ID UNICO
 *
 * `supabase.channel(topico)` **nao cria um canal novo** quando o topico ja
 * existe: ele devolve o mesmo objeto (ver `RealtimeClient.channel`). E
 * `canal.on('postgres_changes', ...)` LANCA EXCECAO se o canal ja passou por
 * `subscribe()`:
 *
 *     cannot add `postgres_changes` callbacks for realtime:... after `subscribe()`.
 *
 * Como o `AvisoDeConvite` fica montado no AppShell em TODAS as telas, o
 * topico `partidas-<meuId>` ja estava assinado. Qualquer segunda tela que
 * chamasse este hook com o mesmo id pegava aquele canal, tentava registrar o
 * ouvinte e derrubava a pagina inteira com "Application error" - foi o que
 * aconteceu com a aba Amigos.
 *
 * `useId()` da um sufixo estavel e diferente por componente montado, entao
 * cada assinante tem o proprio canal e nao existe mais essa colisao.
 *
 * ---------------------------------------------------------------------------
 * POR QUE `aoMudar` VAI PARA UMA REF
 *
 * Se o callback mudar de identidade a cada render, o efeito refaz a
 * assinatura junto - derrubando e recriando o canal sem parar. Guardando numa
 * ref, a assinatura depende so do `meuId` e o callback sempre e o mais atual.
 */
/**
 * Nome do canal de partidas de um assinante.
 *
 * O `identificador` vem do `useId()` de quem chamou: e ele que impede dois
 * componentes montados ao mesmo tempo de pedirem o MESMO topico (ver o
 * comentario acima). Exportado para `npm run test:realtime` poder conferir.
 */
export const topicoDePartidas = (meuId: string, identificador: string): string =>
  `partidas-${meuId}-${identificador}`;

/** Nome do canal de respostas de uma partida. Mesmo cuidado do de cima. */
export const topicoDeRespostas = (matchId: string, identificador: string): string =>
  `duelo-${matchId}-${identificador}`;

/**
 * A linha de `matches` que mudou, como o Realtime a entrega.
 *
 * So os campos que alguem usa. Nao ha garantia de `old`: isso exigiria
 * `replica identity full` na tabela, e ninguem aqui precisa saber o valor
 * anterior - basta o novo.
 */
export interface MudancaDePartida {
  id: string;
  status: string;
  modo: string | null;
  host_id: string;
  guest_id: string | null;
  started_at: string | null;
}

export function useAvisoDePartidas(
  meuId: string | undefined,
  aoMudar: (mudanca?: MudancaDePartida) => void,
) {
  const identificador = useId();
  const callback = useRef(aoMudar);
  callback.current = aoMudar;

  useEffect(() => {
    if (!isSupabaseConfigured || !meuId) return;

    const avisar = (evento: { new?: unknown }) =>
      callback.current((evento?.new as MudancaDePartida | undefined) ?? undefined);
    const supabase = getSupabase()!;
    const canal = supabase
      .channel(topicoDePartidas(meuId, identificador))
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `guest_id=eq.${meuId}` },
        avisar,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `host_id=eq.${meuId}` },
        avisar,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [meuId, identificador]);
}

/**
 * Acompanha o adversario durante a partida.
 *
 * Cada resposta dele gera um evento em `match_answers`; a tela so usa isso
 * para mostrar "ele esta na pergunta 3" - o conteudo da resposta nao aparece.
 */
export function useAvisoDeRespostas(matchId: string | null, aoMudar: () => void) {
  // Mesmo cuidado de `useAvisoDePartidas`: topico unico por componente e
  // callback numa ref. Hoje so a tela do duelo usa este hook, mas um segundo
  // consumidor derrubaria a pagina pelo mesmo motivo.
  const identificador = useId();
  const callback = useRef(aoMudar);
  callback.current = aoMudar;

  useEffect(() => {
    if (!isSupabaseConfigured || !matchId) return;

    const supabase = getSupabase()!;
    const canal = supabase
      .channel(topicoDeRespostas(matchId, identificador))
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'match_answers', filter: `match_id=eq.${matchId}` },
        () => callback.current(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [matchId, identificador]);
}
