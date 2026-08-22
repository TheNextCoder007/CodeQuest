'use client';

import { useEffect, useState } from 'react';
import { Flame, Trophy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, CardTitle, Label, Pill } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchLeaderboard } from '@/lib/leaderboard';
import { levelTitle } from '@/lib/gamification';
import type { LeaderboardRow } from '@/types/db';
import { cn } from '@/lib/cn';

const medalhas = ['🥇', '🥈', '🥉'];

function Avatar({ row }: { row: LeaderboardRow }) {
  if (row.avatar_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={row.avatar_url}
        alt=""
        className="h-10 w-10 rounded-full border border-white/10 object-cover"
      />
    );
  }
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-mint-500/25 to-electric-500/25 text-sm font-bold text-white">
      {row.name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}

function RankingContent() {
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchLeaderboard()
      .then((data) => {
        if (active) setRows(data);
      })
      .catch((fetchError: Error) => {
        if (active) setError(fetchError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const minhaPosicao = rows?.findIndex((row) => row.id === user?.id) ?? -1;

  return (
    <div className="space-y-6">
      <section className="cq-card bg-gradient-to-br from-electric-500/15 via-night-900/60 to-mint-600/10 p-6">
        <Label>Comparação amigável</Label>
        <h1 className="mt-1.5 flex items-center gap-2 text-2xl font-extrabold text-white sm:text-3xl">
          🥇 Ranking
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Todos os estudantes do CodeQuest ordenados por XP acumulado. Cada lição concluída muda
          essa lista.
        </p>
        {minhaPosicao >= 0 && (
          <div className="mt-4">
            <Pill tone="mint">
              <Trophy className="h-3.5 w-3.5" /> Você está em {minhaPosicao + 1}º lugar
            </Pill>
          </div>
        )}
      </section>

      {error && (
        <Card className="border-rose-500/40">
          <CardTitle>Não foi possível carregar o ranking</CardTitle>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
        </Card>
      )}

      {!rows && !error && (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      )}

      {rows && rows.length === 0 && (
        <Card>
          <CardTitle>Ranking vazio</CardTitle>
          <p className="mt-2 text-sm text-slate-400">
            Ninguém pontuou ainda. Conclua uma lição para ser o primeiro da lista.
          </p>
        </Card>
      )}

      {rows && rows.length > 0 && (
        <ul className="space-y-2">
          {rows.map((row, index) => {
            const euMesmo = row.id === user?.id;
            return (
              <li key={row.id}>
                <div
                  className={cn(
                    'flex items-center gap-4 rounded-xl border px-4 py-3 transition',
                    euMesmo
                      ? 'border-mint-500/50 bg-mint-500/[0.08] shadow-glow'
                      : 'border-white/10 bg-white/[0.03]',
                    index < 3 && !euMesmo && 'border-amber-400/25 bg-amber-400/[0.04]',
                  )}
                >
                  <span className="w-8 shrink-0 text-center text-lg font-bold">
                    {index < 3 ? (
                      <span aria-label={`${index + 1}º lugar`}>{medalhas[index]}</span>
                    ) : (
                      <span className="text-sm text-slate-500">{index + 1}</span>
                    )}
                  </span>

                  <Avatar row={row} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {row.name}
                      {euMesmo && <span className="ml-2 text-xs text-mint-300">(você)</span>}
                    </p>
                    <p className="text-xs text-slate-500">
                      Nível {row.level} · {levelTitle(row.level)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-bold text-mint-300">{row.xp_total} XP</p>
                    <p className="flex items-center justify-end gap-1 text-xs text-slate-500">
                      <Flame className="h-3 w-3 text-amber-400" />
                      {row.streak_count}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function RankingPage() {
  return (
    <AppShell>
      <RankingContent />
    </AppShell>
  );
}
