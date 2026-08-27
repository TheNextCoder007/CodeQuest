'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Flame, Globe, Shield, Star, Swords, Timer, Trophy, UserPlus, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Avatar } from '@/components/social/Avatar';
import { LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { PatamarBadge } from '@/components/ranked/PatamarBadge';
import { buscarRankingRanqueada } from '@/lib/ranked/api';
import type { LinhaRankingRanqueada, RecorteRanking } from '@/lib/ranked/tipos';
import { fetchLeaderboard } from '@/lib/leaderboard';
import { fetchFriendsLeaderboard } from '@/lib/friends';
import { displayUsername } from '@/lib/username';
import { TagBadge } from '@/components/social/TagBadge';
import { tagById } from '@/content/tags';
import { levelTitle } from '@/lib/gamification';
import type { LeaderboardRow } from '@/types/db';
import { cn } from '@/lib/cn';

const medalhas = ['🥇', '🥈', '🥉'];

/**
 * Bloco do nome no ranking. Vira link para o perfil publico quando a pessoa
 * tem @username; sem username nao ha perfil para abrir.
 */
function LinhaDoRanking({
  username,
  children,
}: {
  username: string | null;
  children: React.ReactNode;
}) {
  if (!username) return <div className="min-w-0 flex-1">{children}</div>;
  return (
    <Link
      href={`/usuario/?u=${encodeURIComponent(username)}`}
      className="min-w-0 flex-1 transition hover:opacity-80"
    >
      {children}
    </Link>
  );
}

type Aba = 'global' | 'amigos';

/**
 * Duas listas diferentes na mesma tela.
 *
 * `xp` e o ranking de sempre (esforco acumulado na trilha). `ranqueada` e o da
 * temporada, por patamar e elo. Cada um responde a uma pergunta diferente -
 * "quem mais estudou" contra "quem esta jogando melhor agora" -, e por isso
 * nao daria para juntar os dois numa lista so.
 */
type Modo = 'xp' | 'ranqueada';

const abas = [
  { id: 'global' as const, label: 'Global', icon: Globe },
  { id: 'amigos' as const, label: 'Amigos', icon: Users },
];

const modos = [
  { id: 'xp' as const, label: 'XP', icon: Star },
  { id: 'ranqueada' as const, label: 'Ranqueada', icon: Shield },
];

/**
 * So aparece dentro da ranqueada: a temporada corrente ou o historico inteiro.
 *
 * O ranking de XP nao tem esse par porque XP nunca zera - la "todos os
 * tempos" ja e a unica lista possivel.
 */
const recortes = [
  { id: 'temporada' as const, label: 'Temporada atual', icon: Timer },
  { id: 'historico' as const, label: 'Todos os tempos', icon: Crown },
];

function RankingContent() {
  const { user } = useAuth();
  const { state } = usePlayer();

  const [modo, setModo] = useState<Modo>('xp');
  const [recorte, setRecorte] = useState<RecorteRanking>('temporada');
  const [ranqueada, setRanqueada] = useState<LinhaRankingRanqueada[] | null>(null);
  const [aba, setAba] = useState<Aba>('global');
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(
    async (qual: Modo, alvo: Aba, qualRecorte: RecorteRanking) => {
      setRows(null);
      setRanqueada(null);
      setErro(null);
      try {
        if (qual === 'ranqueada') {
          setRanqueada(
            await buscarRankingRanqueada(
              alvo,
              {
                id: user?.id ?? '',
                nome: user?.name ?? '',
                username: state?.profile.username ?? null,
                avatarUrl: state?.profile.avatar_url ?? null,
              },
              50,
              qualRecorte,
            ),
          );
          return;
        }
        const dados =
          alvo === 'global' ? await fetchLeaderboard() : await fetchFriendsLeaderboard(user?.id ?? '');
        setRows(dados);
      } catch (falha) {
        setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar o ranking.');
      }
    },
    [user?.id, user?.name, state?.profile.username, state?.profile.avatar_url],
  );

  useEffect(() => {
    void carregar(modo, aba, recorte);
  }, [modo, aba, recorte, carregar]);

  const lista = modo === 'xp' ? rows : ranqueada;
  const minhaPosicao = lista?.findIndex((linha) => linha.id === user?.id) ?? -1;

  // Na aba de amigos, o proprio usuario sempre aparece - entao "sozinho na
  // lista" significa que ele ainda nao tem nenhum amigo confirmado.
  const semAmigos = aba === 'amigos' && lista !== null && lista.length <= 1;

  return (
    <div className="cq-page">
      {/* Cabecalho ---------------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-electric-500/15 via-night-900/60 to-mint-600/10 p-5 sm:p-6">
        <Label>Comparação amigável</Label>
        <h1 className="mt-1.5 flex items-center gap-2 cq-h1">
          🥇 Ranking
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          {modo === 'ranqueada'
            ? recorte === 'historico'
              ? aba === 'global'
                ? 'O maior patamar que cada pessoa já alcançou, somando todas as temporadas. Esta lista não zera.'
                : 'Você e seus amigos confirmados, pelo recorde de todas as temporadas.'
              : aba === 'global'
                ? 'Quem está jogando melhor a temporada, por patamar e elo. Zera a cada 15 dias.'
                : 'Você e seus amigos confirmados na temporada de ranqueada.'
            : aba === 'global'
              ? 'Todos os estudantes do CodeQuest ordenados por XP acumulado. Cada lição concluída muda essa lista.'
              : 'Só você e seus amigos confirmados. Uma disputa mais justa — e bem mais divertida.'}
        </p>

        {minhaPosicao >= 0 && !semAmigos && (
          <div className="mt-4">
            <Pill tone="mint">
              <Trophy className="h-3.5 w-3.5" /> Você está em {minhaPosicao + 1}º lugar
              {aba === 'amigos' ? ' entre seus amigos' : ''}
            </Pill>
          </div>
        )}
      </section>

      {/* XP ou ranqueada ------------------------------------------------ */}
      <div
        role="tablist"
        aria-label="Qual ranking"
        className="flex gap-1 rounded-xl border border-white/10 bg-night-900/60 p-1"
      >
        {modos.map((item) => {
          const Icon = item.icon;
          const ativo = modo === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={ativo}
              type="button"
              onClick={() => setModo(item.id)}
              className={cn(
                'flex min-h-[44px] min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition sm:px-3',
                ativo
                  ? 'bg-gradient-to-r from-electric-500 to-aqua-400 text-night-950 shadow-glow-blue'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Temporada ou historico (so na ranqueada) ---------------------- */}
      {modo === 'ranqueada' && (
        <div
          role="tablist"
          aria-label="Recorte do ranking de ranqueada"
          className="flex gap-1 rounded-xl border border-white/10 bg-night-900/60 p-1"
        >
          {recortes.map((item) => {
            const Icon = item.icon;
            const ativo = recorte === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={ativo}
                type="button"
                onClick={() => setRecorte(item.id)}
                className={cn(
                  'flex min-h-[44px] min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition sm:px-3',
                  ativo
                    ? 'bg-gradient-to-r from-amber-400 to-mint-400 text-night-950 shadow-glow'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Abas ---------------------------------------------------------- */}
      <div
        role="tablist"
        aria-label="Escopo do ranking"
        className="flex gap-1 rounded-xl border border-white/10 bg-night-900/60 p-1"
      >
        {abas.map((item) => {
          const Icon = item.icon;
          const ativa = aba === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={ativa}
              type="button"
              onClick={() => setAba(item.id)}
              className={cn(
                'flex min-h-[44px] min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition sm:px-3',
                ativa
                  ? 'bg-gradient-to-r from-mint-500 to-aqua-400 text-night-950 shadow-glow'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {erro && (
        <Card className="border-rose-500/40">
          <CardTitle>Não foi possível carregar o ranking</CardTitle>
          <p className="mt-2 text-sm text-slate-400">{erro}</p>
        </Card>
      )}

      {!lista && !erro && (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((indice) => (
            <div key={indice} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      )}

      {/* Aba de amigos sem ninguem ------------------------------------- */}
      {semAmigos && (
        <Card className="border-mint-500/30 bg-gradient-to-br from-mint-600/10 to-transparent text-center">
          <span className="text-4xl" aria-hidden>
            🤝
          </span>
          <CardTitle className="mt-4">Seu ranking de amigos está te esperando</CardTitle>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            Você ainda não tem amigos confirmados, então só aparece você aqui. Adicione um colega
            pelo <span className="font-mono text-aqua-300">@usuario</span> dele e acompanhem o
            progresso um do outro — estudar com alguém é o jeito mais fácil de manter o streak.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/amigos">
              <UserPlus className="h-4 w-4" />
              Adicionar amigos
            </LinkButton>
            <button
              type="button"
              onClick={() => setAba('global')}
              className="min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-mint-400/50 hover:bg-white/10"
            >
              Ver o ranking global
            </button>
          </div>
        </Card>
      )}

      {modo === 'xp' && rows && rows.length === 0 && aba === 'global' && (
        <Card>
          <CardTitle>Ranking vazio</CardTitle>
          <p className="mt-2 text-sm text-slate-400">
            Ninguém pontuou ainda. Conclua uma lição para ser o primeiro da lista.
          </p>
        </Card>
      )}

      {/* Ranqueada sem ninguem ------------------------------------------ */}
      {modo === 'ranqueada' && ranqueada && ranqueada.length === 0 && !semAmigos && (
        <Card className="text-center">
          <span className="text-4xl" aria-hidden>
            🛡️
          </span>
          <CardTitle className="mt-4">Ninguém jogou ainda nesta temporada</CardTitle>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            O leaderboard mostra só quem já disputou pelo menos uma partida ranqueada. Seja o
            primeiro.
          </p>
          <div className="mt-6">
            <LinkButton href="/ranqueado">
              <Swords className="h-4 w-4" aria-hidden />
              Jogar ranqueada
            </LinkButton>
          </div>
        </Card>
      )}

      {/* Lista da ranqueada --------------------------------------------- */}
      {modo === 'ranqueada' && ranqueada && ranqueada.length > 0 && !semAmigos && (
        <ul className="space-y-2">
          {ranqueada.map((linha, indice) => {
            const euMesmo = linha.id === user?.id;
            const tag = linha.equippedTagId ? tagById(linha.equippedTagId) : undefined;
            return (
              <li key={linha.id}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-3 transition sm:gap-4 sm:px-4',
                    euMesmo
                      ? 'border-mint-500/50 bg-mint-500/[0.08] shadow-glow'
                      : 'border-white/10 bg-white/[0.03]',
                    indice < 3 && !euMesmo && 'border-amber-400/25 bg-amber-400/[0.04]',
                  )}
                >
                  <span className="w-7 shrink-0 text-center text-lg font-bold sm:w-8">
                    {indice < 3 ? (
                      <span aria-label={`${indice + 1}º lugar`}>{medalhas[indice]}</span>
                    ) : (
                      <span className="text-sm text-slate-500">{indice + 1}</span>
                    )}
                  </span>

                  <Avatar name={linha.name} url={linha.avatarUrl} />

                  <LinhaDoRanking username={linha.username}>
                    <p className="truncate font-semibold text-white">
                      {linha.name}
                      {euMesmo && <span className="ml-2 text-xs text-mint-300">(você)</span>}
                    </p>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5">
                      <PatamarBadge divisao={linha.divisao} tamanho="sm" />
                      {tag && <TagBadge tag={tag} tamanho="sm" />}
                    </span>
                  </LinhaDoRanking>

                  <div className="min-w-0 text-right">
                    <p className="font-bold text-mint-300">{linha.elo}</p>
                    {/*
                      * No historico o numero e o PICO, nao o elo de hoje - e o
                      * rotulo precisa dizer isso, senao a lista parece estar
                      * mostrando o elo atual errado.
                      */}
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">
                      {recorte === 'historico' ? 'pico de elo' : 'elo'}
                    </p>
                    <p className="cq-muted">
                      {linha.vitorias}V · {linha.derrotas}D
                      {recorte === 'historico' && linha.temporadas
                        ? ` · ${linha.temporadas} ${linha.temporadas === 1 ? 'temporada' : 'temporadas'}`
                        : ''}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Lista de XP ----------------------------------------------------- */}
      {modo === 'xp' && rows && rows.length > 0 && !semAmigos && (
        <ul className="space-y-2">
          {rows.map((linha, indice) => {
            const euMesmo = linha.id === user?.id;
            const tag = linha.equipped_tag_id ? tagById(linha.equipped_tag_id) : undefined;
            return (
              <li key={linha.id}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-3 transition sm:gap-4 sm:px-4',
                    euMesmo
                      ? 'border-mint-500/50 bg-mint-500/[0.08] shadow-glow'
                      : 'border-white/10 bg-white/[0.03]',
                    indice < 3 && !euMesmo && 'border-amber-400/25 bg-amber-400/[0.04]',
                  )}
                >
                  <span className="w-7 shrink-0 text-center text-lg font-bold sm:w-8">
                    {indice < 3 ? (
                      <span aria-label={`${indice + 1}º lugar`}>{medalhas[indice]}</span>
                    ) : (
                      <span className="text-sm text-slate-500">{indice + 1}</span>
                    )}
                  </span>

                  <Avatar name={linha.name} url={linha.avatar_url} />

                  {/* O nome leva ao perfil publico de quem estiver na linha. */}
                  <LinhaDoRanking username={linha.username}>
                    <p className="truncate font-semibold text-white">
                      {linha.name}
                      {euMesmo && <span className="ml-2 text-xs text-mint-300">(você)</span>}
                    </p>
                    <p className="truncate cq-muted">
                      {linha.username && (
                        <span className="font-mono text-aqua-300">
                          {displayUsername(linha.username)}
                          {' · '}
                        </span>
                      )}
                      Nível {linha.level} · {levelTitle(linha.level)}
                    </p>
                    {tag && (
                      <span className="mt-1 flex">
                        <TagBadge tag={tag} tamanho="sm" />
                      </span>
                    )}
                  </LinhaDoRanking>

                  <div className="min-w-0 text-right">
                    <p className="font-bold text-mint-300">{linha.xp_total} XP</p>
                    <p className="flex items-center justify-end gap-1 cq-muted">
                      <Flame className="h-3 w-3 text-amber-400" />
                      {linha.streak_count}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Atalho para quem ja tem amigos --------------------------------- */}
      {aba === 'amigos' && !semAmigos && lista && lista.length > 1 && (
        <div className="text-center">
          <LinkButton href="/amigos" variant="ghost" size="sm">
            Gerenciar amigos
          </LinkButton>
        </div>
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
