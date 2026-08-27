'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Trava a navegacao enquanto uma partida esta em andamento.
 *
 * ---------------------------------------------------------------------------
 * O PROBLEMA
 *
 * Trocar de aba do CodeQuest no meio do duelo (ir para Inicio, Amigos...)
 * desmontava a tela da partida. O cronometro da tela parava, e voltar
 * remontava tudo do zero. O placar nunca foi enganado - `pvp_pergunta` carimba
 * a primeira entrega e o servidor conta o tempo de la -, mas a tela virava uma
 * pausa: dava para sair, pensar com calma e voltar.
 *
 * Nao existe API de navegador que impeca alguem de fechar a pagina, e nem
 * deveria. O que da para impedir e a saida por DENTRO do aplicativo, que e
 * justamente o caminho comodo. Os outros dois caminhos ja tem resposta:
 *
 *   - trocar de aba do navegador -> penalidade (ver `@/lib/pvp/ausencia`);
 *   - fechar ou recarregar       -> aviso do proprio navegador, abaixo, e o
 *                                   cronometro do servidor continua correndo.
 *
 * ---------------------------------------------------------------------------
 * COMO SE USA
 *
 * O AppShell fornece o contexto e desabilita a navegacao quando `travada` e
 * verdadeiro. A tela do duelo chama `useTravarNavegacao(true)` enquanto a
 * partida corre - e o `useEffect` destrava sozinho ao desmontar, entao nao ha
 * como a trava ficar presa.
 */

interface Trava {
  travada: boolean;
  travar: (valor: boolean) => void;
}

const Contexto = createContext<Trava>({ travada: false, travar: () => {} });

export function TravaDePartidaProvider({
  travada,
  travar,
  children,
}: {
  travada: boolean;
  travar: (valor: boolean) => void;
  children: React.ReactNode;
}) {
  const valor = useMemo(() => ({ travada, travar }), [travada, travar]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export const useTravaDePartida = (): Trava => useContext(Contexto);

/**
 * Liga a trava enquanto `ativa` for verdadeiro.
 *
 * Tambem pede confirmacao do navegador ao fechar ou recarregar. O texto e
 * escolhido pelo proprio navegador (nao da para personalizar desde 2016) - o
 * que importa e a pessoa saber que esta saindo de uma partida valendo elo.
 */
export function useTravarNavegacao(ativa: boolean): void {
  const { travar } = useTravaDePartida();

  useEffect(() => {
    travar(ativa);
    return () => travar(false);
  }, [ativa, travar]);

  useEffect(() => {
    if (!ativa) return;
    const aviso = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
      // Navegadores antigos exigem que algo seja atribuido aqui.
      evento.returnValue = '';
    };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [ativa]);
}

/** Estado da trava, para quem fornece o contexto (o AppShell). */
export function useEstadoDaTrava() {
  const [travada, setTravada] = useState(false);
  return { travada, travar: setTravada };
}
