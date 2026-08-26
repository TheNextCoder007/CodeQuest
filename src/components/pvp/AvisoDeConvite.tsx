'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Swords, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAvisoDePartidas } from '@/lib/presenca';
import { convitesRecebidos, responderConvite } from '@/lib/pvp/api';
import { nomeDoTema } from '@/content/pvp-temas';
import { fetchPerfilPublicoPorId } from '@/lib/perfil-publico';
import type { ResumoPartida } from '@/lib/pvp/tipos';

/**
 * Faixa que avisa "fulano te chamou para um duelo".
 *
 * Fica montada dentro do AppShell, entao o convite aparece em qualquer tela em
 * que a pessoa estiver. A chegada e por Realtime (escutando `matches`), com
 * uma leitura na montagem para pegar convite que chegou com o app fechado.
 */
export function AvisoDeConvite() {
  const { user } = useAuth();
  const router = useRouter();

  const [convite, setConvite] = useState<ResumoPartida | null>(null);
  const [quem, setQuem] = useState<string>('Alguém');
  const [respondendo, setRespondendo] = useState(false);
  const [recusados, setRecusados] = useState<string[]>([]);

  const carregar = useCallback(async () => {
    if (!user?.id) return;
    try {
      const lista = await convitesRecebidos(user.id);
      const pendente = lista.find((item) => !recusados.includes(item.id)) ?? null;
      setConvite(pendente);

      if (pendente) {
        const perfil = await fetchPerfilPublicoPorId(pendente.adversarioId).catch(() => null);
        setQuem(perfil?.name ?? 'Alguém');
      }
    } catch {
      // Convite e um extra: se a leitura falhar, a tela segue normal.
    }
  }, [user?.id, recusados]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useAvisoDePartidas(user?.id, () => void carregar());

  if (!convite) return null;

  const responder = async (aceitar: boolean) => {
    const alvo = convite.id;
    setRespondendo(true);

    if (!aceitar) {
      try {
        await responderConvite(alvo, false);
      } catch {
        /* recusar e o unico caminho a partir daqui, deu certo ou nao */
      }
      setRecusados((atual) => [...atual, alvo]);
      setConvite(null);
      setRespondendo(false);
      return;
    }

    /*
     * Aceitar SEMPRE leva para a partida.
     *
     * Antes, qualquer erro do RPC caia no `catch` que descartava o convite -
     * e sem navegacao. O caso mais comum era justamente o inofensivo: o
     * Realtime avisa o outro lado, a partida ja consta como aceita e a
     * chamada volta reclamando. Resultado: a partida existia, estava ativa, e
     * a pessoa ficava parada na tela em que estava, tendo de ir ate Amigos
     * para achar o botao "Entrar".
     *
     * Agora o erro so e registrado: se a partida nao estiver mesmo jogavel,
     * quem explica isso e a tela do duelo, que ja sabe distinguir "convite nao
     * aceito" de "partida encerrada".
     */
    try {
      await responderConvite(alvo, true);
    } catch (falha) {
      console.warn('[CodeQuest] aceitar convite respondeu com erro', falha);
    }
    router.push(`/duelo/?m=${encodeURIComponent(alvo)}`);
  };

  return (
    <div className="border-b border-mint-500/25 bg-gradient-to-r from-mint-600/15 via-night-900/60 to-electric-500/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Swords className="h-5 w-5 shrink-0 text-mint-400" aria-hidden />

        <p className="min-w-0 flex-1 text-sm text-slate-200">
          <strong className="text-white">{quem}</strong> te chamou para um duelo de{' '}
          <strong className="text-mint-300">{nomeDoTema(convite.tema)}</strong>.
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={respondendo}
            onClick={() => void responder(true)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-mint-500 to-aqua-400 px-4 text-sm font-bold text-night-950 transition hover:opacity-90 disabled:opacity-60"
          >
            <Check className="h-4 w-4" aria-hidden />
            Aceitar
          </button>
          <button
            type="button"
            disabled={respondendo}
            onClick={() => void responder(false)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
          >
            <X className="h-4 w-4" aria-hidden />
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}
