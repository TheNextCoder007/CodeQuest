'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Flame } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { buscarDesafioDeHoje } from '@/lib/desafios/api';
import type { EstadoDesafio } from '@/lib/desafios/tipos';
import { cn } from '@/lib/cn';

/**
 * Faixa do desafio diario no painel.
 *
 * Some sozinha quando a migracao 0008 ainda nao foi aplicada - assim publicar
 * o codigo antes de rodar o SQL nao deixa um cartao quebrado no painel.
 */
export function ChamadaDesafio() {
  const { user } = useAuth();
  const [estado, setEstado] = useState<EstadoDesafio | null>(null);

  const meuId = user?.id;

  useEffect(() => {
    if (!meuId) return;
    let ativo = true;

    buscarDesafioDeHoje()
      .then((atual) => {
        if (ativo) setEstado(atual);
      })
      .catch(() => {
        /* desafio indisponivel: a faixa nao aparece */
      });

    return () => {
      ativo = false;
    };
  }, [meuId]);

  if (!estado || estado.desconhecido) return null;

  const feito = estado.jaCompletou;

  return (
    <Link
      href="/desafio"
      className={cn(
        'cq-card group flex flex-wrap items-center gap-4 bg-gradient-to-br p-5 transition hover:brightness-110',
        feito
          ? 'from-mint-500/15 to-aqua-400/10 border-mint-500/30'
          : 'from-amber-400/15 to-orange-500/10 border-amber-400/30',
      )}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-night-950/40 text-3xl">
        {feito ? '✅' : '🔥'}
      </span>

      <div className="min-w-0 flex-1">
        <p className="cq-label">
          <Flame className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
          Desafio diário
        </p>
        <p
          className={cn(
            'mt-1 text-xl font-extrabold',
            feito ? 'text-mint-200' : 'text-amber-200',
          )}
        >
          {feito ? 'Feito por hoje!' : 'Disponível agora'}
        </p>
        <p className="mt-0.5 text-sm text-slate-400">
          {feito
            ? `${estado.total} desafio${estado.total === 1 ? '' : 's'} no total. O próximo chega à meia-noite.`
            : `Um exercício de código, o mesmo para todo mundo. Vale ${estado.xp} XP e expira hoje.`}
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-2">
        {feito && (
          <span className="hidden items-center gap-1.5 rounded-full border border-mint-500/40 bg-mint-500/10 px-3 py-1 text-xs font-bold text-mint-200 sm:inline-flex">
            <Check className="h-3.5 w-3.5" aria-hidden />
            concluído
          </span>
        )}
        <ArrowRight
          className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-mint-300"
          aria-hidden
        />
      </span>
    </Link>
  );
}
