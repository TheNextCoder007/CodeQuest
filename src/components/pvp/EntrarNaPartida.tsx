'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAvisoDePartidas, type MudancaDePartida } from '@/lib/presenca';
import { deveEntrarNaPartida } from '@/lib/pvp/entrada';

/**
 * Leva os DOIS jogadores para a partida no mesmo instante.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTAVA FALTANDO
 *
 * Quem aceitava o convite ja era levado para a partida - o `AvisoDeConvite`
 * navega logo depois de responder. Quem CONVIDOU, nao: a partida virava
 * `ativa`, e a unica pista era o botao "Entrar" aparecendo na aba Amigos. Se a
 * pessoa estivesse no painel, no perfil ou na trilha, ficava esperando sem
 * saber que o duelo ja tinha comecado - e o relogio da primeira pergunta ja
 * estava correndo contra ela.
 *
 * Este componente fica montado no AppShell, entao vale em qualquer tela. Ele
 * escuta a MESMA mudanca de `matches` que o aviso de convite ja escutava - nao
 * ha canal novo nem consulta a mais.
 *
 * Quando entrar (e, principalmente, quando NAO entrar) esta em
 * `@/lib/pvp/entrada`, testado por `npm run test:entrada`.
 */
export function EntrarNaPartida() {
  const { user } = useAuth();
  const router = useRouter();
  const caminho = usePathname();

  // Partidas para as quais ja navegamos: sair do duelo nao pode virar um
  // vaivem com o proximo evento que chegar daquela mesma partida.
  const jaLevou = useRef<Set<string>>(new Set());

  // O caminho entra por ref para o callback nao precisar ser refeito a cada
  // navegacao - o hook de Realtime reassina quando o callback muda.
  const caminhoAtual = useRef(caminho);
  caminhoAtual.current = caminho;

  const aoMudar = useCallback(
    (mudanca?: MudancaDePartida) => {
      const permitido = deveEntrarNaPartida(mudanca, {
        meuId: user?.id,
        caminho: caminhoAtual.current,
        jaLevou: jaLevou.current,
      });
      if (!permitido || !mudanca) return;

      jaLevou.current.add(mudanca.id);
      router.push(`/duelo/?m=${encodeURIComponent(mudanca.id)}`);
    },
    [router, user?.id],
  );

  useAvisoDePartidas(user?.id, aoMudar);

  useEffect(() => {
    // Trocou de conta: o historico de "ja levou" era da conta anterior.
    jaLevou.current = new Set();
  }, [user?.id]);

  return null;
}
