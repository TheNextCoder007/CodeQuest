'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { PatamarBadge } from './PatamarBadge';
import { useAuth } from '@/lib/auth/AuthProvider';
import { buscarEstadoRanqueada } from '@/lib/ranked/api';
import {
  ESTILO_PATAMAR,
  PATAMARES,
  nomeDaDivisao,
  patamarDaDivisao,
  progressoNaDivisao,
} from '@/lib/ranked/patamares';
import { descricaoDoPrazo, type EstadoRanqueada } from '@/lib/ranked/tipos';
import { cn } from '@/lib/cn';

/**
 * Faixa de chamada da ranqueada no painel.
 *
 * Some sozinha quando a migracao 0006 ainda nao foi aplicada - assim publicar
 * o codigo antes de rodar o SQL nao deixa um cartao quebrado no painel.
 */
export function ChamadaRanqueada() {
  const { user } = useAuth();
  const [estado, setEstado] = useState<EstadoRanqueada | null>(null);

  const meuId = user?.id;

  useEffect(() => {
    if (!meuId) return;
    let ativo = true;

    buscarEstadoRanqueada(meuId)
      .then((atual) => {
        if (ativo) setEstado(atual);
      })
      .catch(() => {
        /* ranqueada indisponivel: a faixa nao aparece */
      });

    return () => {
      ativo = false;
    };
  }, [meuId]);

  if (!estado) return null;

  const patamar = PATAMARES[patamarDaDivisao(estado.divisao)];
  const estilo = ESTILO_PATAMAR[patamar];
  const progresso = progressoNaDivisao(estado.elo);

  return (
    <Link
      href="/ranqueado"
      className={cn(
        'cq-card group flex flex-wrap items-center gap-4 bg-gradient-to-br p-5 transition hover:brightness-110',
        estilo.cartao,
      )}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-night-950/40 text-3xl">
        {estilo.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <p className="cq-label">
          <Shield className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
          Ranqueada · temporada {estado.temporada.numero}
        </p>
        <p className={cn('mt-1 text-xl font-extrabold', estilo.texto)}>
          {nomeDaDivisao(estado.divisao)}
        </p>
        <p className="mt-0.5 text-sm text-slate-400">
          {estado.partidas === 0
            ? 'Você ainda não jogou nesta temporada.'
            : progresso.noTopo
              ? 'Topo da escada alcançado.'
              : `Faltam ${progresso.faltam} de elo para ${nomeDaDivisao(estado.divisao + 1)}.`}{' '}
          A temporada {descricaoDoPrazo(estado.temporada)}.
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-2">
        <PatamarBadge divisao={estado.picoDivisao} tamanho="sm" className="hidden sm:inline-flex" />
        <ArrowRight
          className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-mint-300"
          aria-hidden
        />
      </span>
    </Link>
  );
}
