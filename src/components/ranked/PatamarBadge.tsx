'use client';

import {
  ESTILO_PATAMAR,
  PATAMARES,
  patamarDaDivisao,
  subnivelDaDivisao,
} from '@/lib/ranked/patamares';
import { cn } from '@/lib/cn';

/**
 * O selo do patamar ("🥇 Ouro 2").
 *
 * Usa a mesma escada de cores das raridades das tags: quanto mais alto, mais
 * quente e mais chamativo o selo - quem olha de longe reconhece sem ler.
 */
export function PatamarBadge({
  divisao,
  tamanho = 'md',
  className,
}: {
  /** 0 a 20 (Bronze 1 ... Mestre 3). */
  divisao: number;
  tamanho?: 'sm' | 'md';
  className?: string;
}) {
  const patamar = PATAMARES[patamarDaDivisao(divisao)];
  const estilo = ESTILO_PATAMAR[patamar];

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border font-semibold',
        tamanho === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        estilo.chip,
        className,
      )}
    >
      <span aria-hidden>{estilo.emoji}</span>
      <span className="min-w-0 truncate">
        {estilo.nome} {subnivelDaDivisao(divisao)}
      </span>
    </span>
  );
}
