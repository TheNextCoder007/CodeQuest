'use client';

import { Swords } from 'lucide-react';
import { Card, CardTitle, Pill } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { nomeDoTema } from '@/content/pvp-temas';
import { aproveitamento, type EstatisticasPvp } from '@/lib/pvp/tipos';
import { cn } from '@/lib/cn';

/**
 * Cartao de estatisticas do duelo 1v1.
 *
 * Os numeros vem da tabela `pvp_stats`, que so o servidor escreve (ver
 * `pvp_finalizar` em `supabase/migrations/0005_pvp.sql`) - nao ha como alguem
 * inflar o proprio cartel pelo aplicativo.
 */
export function EstatisticasPvpCard({
  stats,
  proprio = false,
}: {
  stats: EstatisticasPvp;
  /** true quando e o proprio perfil (mostra o atalho para jogar). */
  proprio?: boolean;
}) {
  const taxa = aproveitamento(stats);

  const temaFavorito = Object.entries(stats.vitoriasPorTema)
    .sort((a, b) => b[1] - a[1])
    .at(0);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>
          <Swords className="mr-2 inline h-5 w-5 text-mint-400" aria-hidden />
          Duelos 1v1
        </CardTitle>
        {stats.partidas > 0 && (
          <Pill tone={taxa >= 50 ? 'mint' : 'neutral'}>{taxa}% de aproveitamento</Pill>
        )}
      </div>

      {stats.partidas === 0 ? (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-slate-400">
            {proprio
              ? 'Você ainda não duelou. Chame um amigo para 5 perguntas cronometradas — quem acerta mais e mais rápido leva.'
              : 'Essa pessoa ainda não duelou.'}
          </p>
          {proprio && (
            <div className="mt-4">
              <LinkButton href="/amigos" size="sm">
                <Swords className="h-4 w-4" aria-hidden />
                Desafiar um amigo
              </LinkButton>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { rotulo: 'Vitórias', valor: stats.vitorias, cor: 'text-mint-300' },
              { rotulo: 'Derrotas', valor: stats.derrotas, cor: 'text-rose-300' },
              { rotulo: 'Empates', valor: stats.empates, cor: 'text-slate-300' },
            ].map((item) => (
              <div
                key={item.rotulo}
                className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center"
              >
                <p className={cn('text-2xl font-extrabold', item.cor)}>{item.valor}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-500">
                  {item.rotulo}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-400">
            {stats.partidas} {stats.partidas === 1 ? 'partida' : 'partidas'} ·{' '}
            {stats.pontosTotais} pontos somados
            {temaFavorito && (
              <>
                {' · '}tema favorito:{' '}
                <strong className="text-slate-200">{nomeDoTema(temaFavorito[0])}</strong>
              </>
            )}
          </p>

          {proprio && (
            <div className="mt-4">
              <LinkButton href="/amigos" size="sm" variant="ghost">
                <Swords className="h-4 w-4" aria-hidden />
                Novo duelo
              </LinkButton>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
