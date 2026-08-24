'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Flame, Star, Trophy, UserPlus } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { AvatarComMoldura } from '@/components/social/AvatarEditavel';
import { TagBadge } from '@/components/social/TagBadge';
import { LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchPerfilPublico } from '@/lib/perfil-publico';
import { EstatisticasPvpCard } from '@/components/pvp/EstatisticasPvpCard';
import { CartaoRanqueada } from '@/components/ranked/CartaoRanqueada';
import { buscarEstatisticas } from '@/lib/pvp/api';
import { buscarEstadoRanqueada } from '@/lib/ranked/api';
import type { EstadoRanqueada } from '@/lib/ranked/tipos';
import { ESTATISTICAS_VAZIAS, type EstatisticasPvp } from '@/lib/pvp/tipos';
import { achievementsWithStatus, levelProgress, levelTitle } from '@/lib/gamification';
import { tagsComEstado } from '@/lib/tags';
import { tagById } from '@/content/tags';
import { displayUsername } from '@/lib/username';
import type { PerfilPublico } from '@/types/db';
import { cn } from '@/lib/cn';

/**
 * Perfil publico de outra pessoa.
 *
 * A rota usa `?u=<username>` em vez de `/u/<username>` de proposito: o app e
 * exportado como site estatico para caber dentro do .apk e do .exe, e nesse
 * modo o Next precisa conhecer todos os caminhos no momento do build - o que
 * e impossivel com nome de usuario, que nasce depois. Com a busca na query,
 * a mesma pagina serve para qualquer pessoa nas tres plataformas.
 */
function PerfilPublicoContent() {
  const parametros = useSearchParams();
  const { user } = useAuth();
  const alvo = (parametros.get('u') ?? '').trim().toLowerCase();

  const [perfil, setPerfil] = useState<PerfilPublico | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  // O patamar aparece no perfil publico; o historico de temporadas, nao -
  // recorde antigo de outra pessoa nao acrescenta nada a quem esta visitando.
  const [ranqueada, setRanqueada] = useState<EstadoRanqueada | null>(null);
  const [statsPvp, setStatsPvp] = useState<EstatisticasPvp>({
    ...ESTATISTICAS_VAZIAS,
    vitoriasPorTema: {},
  });

  useEffect(() => {
    if (!alvo) {
      setCarregando(false);
      return;
    }
    let ativo = true;
    setCarregando(true);
    setErro(null);

    fetchPerfilPublico(alvo)
      .then((resultado) => {
        if (!ativo) return;
        setPerfil(resultado);
        if (resultado) {
          buscarEstatisticas(resultado.id)
            .then((lidas) => {
              if (ativo) setStatsPvp(lidas);
            })
            .catch(() => {
              /* perfil sem duelo ainda */
            });

          buscarEstadoRanqueada(resultado.id)
            .then((lida) => {
              if (ativo) setRanqueada(lida);
            })
            .catch(() => {
              /* migracao 0006 pendente ou perfil sem ranqueada */
            });
        }
      })
      .catch((falha) => {
        if (ativo) setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [alvo]);

  if (carregando) {
    return (
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="space-y-4">
        <Link
          href="/ranking"
          className="cq-tap text-sm font-semibold text-slate-400 hover:text-mint-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
        </Link>
        <Card className="text-center">
          <span className="text-4xl" aria-hidden>
            🔍
          </span>
          <CardTitle className="mt-4">
            {erro ? 'Não foi possível carregar esse perfil' : 'Perfil não encontrado'}
          </CardTitle>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            {erro ??
              (alvo
                ? `Ninguém por aqui usa ${displayUsername(alvo)}.`
                : 'Escolha alguém no ranking ou busque pelo nome de usuário.')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/ranking">Ver o ranking</LinkButton>
            <LinkButton href="/amigos" variant="ghost">
              Buscar por @usuário
            </LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  const euMesmo = perfil.id === user?.id;
  const tagEquipada = perfil.equipped_tag_id ? tagById(perfil.equipped_tag_id) : undefined;
  const conquistas = achievementsWithStatus(perfil.unlockedAchievementIds);
  const desbloqueadas = conquistas.filter((item) => item.unlocked);
  const tagsDaPessoa = tagsComEstado(perfil.unlockedTagIds, perfil.is_developer).filter(
    (tag) => tag.unlocked,
  );

  return (
    <div className="space-y-6">
      <Link
        href="/ranking"
        className="cq-tap text-sm font-semibold text-slate-400 hover:text-mint-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao ranking
      </Link>

      {/* Identidade ---------------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-electric-500/15 via-night-900/60 to-mint-600/10 p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <AvatarComMoldura
            name={perfil.name}
            url={perfil.avatar_url}
            posicao={perfil.posicao}
            size="lg"
          />

          <div className="w-full min-w-0 flex-1">
            <Label>{euMesmo ? 'Seu perfil público' : 'Perfil de estudante'}</Label>

            <h1 className="mt-1 break-words text-2xl font-extrabold text-white sm:text-3xl">
              {perfil.name}
            </h1>

            <p className="mt-1 font-mono text-sm text-aqua-300">
              {displayUsername(perfil.username)}
            </p>

            {tagEquipada && (
              <div className="mt-2">
                <TagBadge tag={tagEquipada} />
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone={perfil.posicao <= 3 ? 'amber' : 'neutral'}>
                <Trophy className="h-3.5 w-3.5" aria-hidden />
                {perfil.posicao}º no ranking global
              </Pill>
              <Pill tone="blue">
                Nível {perfil.level} · {levelTitle(perfil.level)}
              </Pill>
              <Pill tone="mint">
                <Star className="h-3.5 w-3.5" aria-hidden />
                {perfil.xp_total} XP
              </Pill>
              {perfil.streak_count > 0 && (
                <Pill tone="amber">
                  <Flame className="h-3.5 w-3.5" aria-hidden />
                  {perfil.streak_count} dias
                </Pill>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>Nível {perfil.level}</span>
            <span>{perfil.xp_total} XP acumulados</span>
          </div>
          <ProgressBar value={levelProgress(perfil.xp_total)} tone="blue" />
        </div>

        {!euMesmo && (
          <div className="mt-6">
            <LinkButton href="/amigos" size="sm" variant="ghost">
              <UserPlus className="h-4 w-4" aria-hidden />
              Adicionar como amigo
            </LinkButton>
          </div>
        )}
      </section>

      {/* Duelos -------------------------------------------------------- */}
      {ranqueada && <CartaoRanqueada estado={ranqueada} />}

      <EstatisticasPvpCard stats={statsPvp} />

      {/* Tags ---------------------------------------------------------- */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>🏷️ Tags conquistadas</CardTitle>
          <span className="text-xs text-slate-500">{tagsDaPessoa.length}</span>
        </div>

        {tagsDaPessoa.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Nenhuma tag ainda. Elas aparecem conforme o nível sobe.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {tagsDaPessoa.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </Card>

      {/* Conquistas ---------------------------------------------------- */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>🏆 Conquistas</CardTitle>
          <span className="text-sm text-slate-400">
            {desbloqueadas.length} de {conquistas.length}
          </span>
        </div>

        {desbloqueadas.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Nenhuma conquista desbloqueada ainda.</p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {desbloqueadas.map((conquista) => (
              <div
                key={conquista.id}
                className={cn(
                  'flex min-w-0 gap-3 rounded-xl border border-mint-500/40 bg-mint-500/[0.07] p-3',
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {conquista.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{conquista.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-400">
                    {conquista.description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function PerfilPublicoPage() {
  return (
    <AppShell>
      {/* useSearchParams exige limite de Suspense no App Router. */}
      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-white/5" />}>
        <PerfilPublicoContent />
      </Suspense>
    </AppShell>
  );
}
