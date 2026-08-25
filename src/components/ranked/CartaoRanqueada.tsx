'use client';

import { Shield, Trophy } from 'lucide-react';
import { Card, CardTitle, Pill, ProgressBar } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { PatamarBadge } from './PatamarBadge';
import {
  ESTILO_PATAMAR,
  PATAMARES,
  nomeDaDivisao,
  patamarDaDivisao,
  progressoNaDivisao,
} from '@/lib/ranked/patamares';
import { descricaoDoPrazo, type EstadoRanqueada, type TemporadaPassada } from '@/lib/ranked/tipos';
import { cn } from '@/lib/cn';

/**
 * Cartao de ranqueada do perfil.
 *
 * Mostra o patamar atual e o mais alto ja atingido NA TEMPORADA - e, quando
 * existe, a lista das temporadas passadas (so no proprio perfil: recorde
 * antigo de outra pessoa nao acrescenta nada e polui a tela).
 *
 * Os numeros vem de `ranked_stats`, tabela que so o servidor escreve (ver
 * `ranked_aplicar_resultado` em `supabase/migrations/0006_ranqueado.sql`).
 */
export function CartaoRanqueada({
  estado,
  historico = [],
  proprio = false,
}: {
  estado: EstadoRanqueada;
  historico?: TemporadaPassada[];
  /** true quando e o proprio perfil (mostra o atalho para jogar e o histórico). */
  proprio?: boolean;
}) {
  const patamar = PATAMARES[patamarDaDivisao(estado.divisao)];
  const estilo = ESTILO_PATAMAR[patamar];
  const progresso = progressoNaDivisao(estado.elo);
  const bateuORecorde = estado.picoDivisao > estado.divisao;

  return (
    <Card className={cn('bg-gradient-to-br', estilo.cartao)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>
          <Shield className="mr-2 inline h-5 w-5 text-mint-400" aria-hidden />
          Ranqueada
        </CardTitle>
        <Pill tone="neutral">
          Temporada {estado.temporada.numero} · {descricaoDoPrazo(estado.temporada)}
        </Pill>
      </div>

      {estado.partidas === 0 ? (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-slate-400">
            {proprio
              ? 'Você ainda não jogou nenhuma partida ranqueada. Comece no Bronze 1 e suba até Mestre 3 antes da temporada acabar.'
              : 'Essa pessoa ainda não jogou ranqueada nesta temporada.'}
          </p>
          {proprio && (
            <div className="mt-4">
              <LinkButton href="/ranqueado" size="sm">
                <Shield className="h-4 w-4" aria-hidden />
                Jogar ranqueada
              </LinkButton>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="cq-label">Patamar atual</p>
              <p className={cn('mt-1 text-2xl font-extrabold', estilo.texto)}>
                <span className="mr-1" aria-hidden>
                  {estilo.emoji}
                </span>
                {nomeDaDivisao(estado.divisao)}
              </p>
            </div>
            <div className="min-w-0 text-right">
              <p className="cq-label">Elo</p>
              <p className="mt-1 text-2xl font-extrabold text-white">{estado.elo}</p>
            </div>
          </div>

          <div className="mt-3">
            <ProgressBar value={progresso.fracao} tone={estilo.barra} />
            <p className="mt-2 text-xs text-slate-500">
              {progresso.noTopo
                ? 'Topo da escada — não há divisão acima de Mestre 3.'
                : `${progresso.atual} de ${progresso.alvo} para a próxima divisão`}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { rotulo: 'Vitórias', valor: estado.vitorias, cor: 'text-mint-300' },
              { rotulo: 'Derrotas', valor: estado.derrotas, cor: 'text-rose-300' },
              { rotulo: 'Partidas', valor: estado.partidas, cor: 'text-slate-300' },
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

          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Trophy className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
            Mais alto na temporada:
            <PatamarBadge divisao={estado.picoDivisao} tamanho="sm" />
            {!bateuORecorde && estado.picoDivisao === estado.divisao && (
              <span className="text-slate-500">(é onde você está agora)</span>
            )}
          </p>

          {proprio && (
            <div className="mt-4">
              <LinkButton href="/ranqueado" size="sm" variant="ghost">
                <Shield className="h-4 w-4" aria-hidden />
                Nova partida
              </LinkButton>
            </div>
          )}
        </>
      )}

      {proprio && historico.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="cq-label">Temporadas passadas</p>
          <ul className="mt-3 space-y-2">
            {historico.map((temporada) => (
              <li
                key={temporada.numero}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <span className="min-w-0 text-sm font-medium text-slate-300">
                  Temporada {temporada.numero}
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <PatamarBadge divisao={temporada.picoDivisao} tamanho="sm" />
                  <span className="text-xs text-slate-500">
                    {temporada.vitorias}V · {temporada.derrotas}D
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
