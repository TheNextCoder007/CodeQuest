'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AtSign, Check, LogOut, Pencil, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { AvatarEditavel } from '@/components/social/AvatarEditavel';
import { GaleriaTags } from '@/components/social/GaleriaTags';
import { TagBadge } from '@/components/social/TagBadge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar, StatCard } from '@/components/ui/Card';
import { buscarTotalDeDesafios } from '@/lib/desafios/api';
import { Input } from '@/components/ui/Field';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { languageBySlug } from '@/content';
import { isUsernameAvailable } from '@/lib/friends';
import {
  USERNAME_MAX,
  displayUsername,
  esperaRestanteMs,
  formatarEspera,
  normalizeUsername,
  validateUsername,
} from '@/lib/username';
import { tagById } from '@/content/tags';
import { enviarAvatar } from '@/lib/avatar';
import { fetchPosicaoRanking } from '@/lib/perfil-publico';
import { EstatisticasPvpCard } from '@/components/pvp/EstatisticasPvpCard';
import { CartaoRanqueada } from '@/components/ranked/CartaoRanqueada';
import { buscarEstatisticas } from '@/lib/pvp/api';
import { ESTATISTICAS_VAZIAS, type EstatisticasPvp } from '@/lib/pvp/tipos';
import {
  buscarEstadoRanqueada,
  buscarHistoricoRanqueada,
  buscarTopoRanqueado,
} from '@/lib/ranked/api';
import {
  patamarMaximoAlcancado,
  type EstadoRanqueada,
  type TemporadaPassada,
  type TopoRanqueado,
} from '@/lib/ranked/tipos';
import {
  achievementsWithStatus,
  displayStreak,
  levelProgress,
  levelTitle,
  xpToNextLevel,
} from '@/lib/gamification';
import { languageProgress, trackSummary } from '@/lib/progression';
import { cn } from '@/lib/cn';

function PerfilContent() {
  const { user, signOut, demoMode } = useAuth();
  const {
    state,
    loading,
    updateName,
    updateUsername,
    updateAvatar,
    equipTag,
    sincronizarPvp,
    sincronizarRanqueada,
    revisarConquistas,
    sincronizarDesafios,
  } = usePlayer();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  // O @username tem edicao propria: precisa validar formato e conferir se
  // ainda esta livre antes de gravar.
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [usernameErro, setUsernameErro] = useState<string | null>(null);
  const [salvandoUsername, setSalvandoUsername] = useState(false);

  // Posicao no ranking global. E recalculada a cada visita, entao o pódio
  // acompanha sozinho a entrada de gente nova.
  const [posicao, setPosicao] = useState<number | null>(null);
  const xpAtual = state?.profile.xp_total;
  const idAtual = state?.profile.id;

  useEffect(() => {
    if (!idAtual || xpAtual === undefined) return;
    let ativo = true;
    fetchPosicaoRanking(idAtual, xpAtual)
      .then((lugar) => {
        if (ativo) setPosicao(lugar);
      })
      .catch(() => {
        if (ativo) setPosicao(null);
      });
    return () => {
      ativo = false;
    };
  }, [idAtual, xpAtual]);

  // Estatisticas do duelo: vem da tabela que so o servidor escreve. Ao ler,
  // conferimos se alguma tag de PvP ja foi merecida e ainda nao foi concedida.
  const [statsPvp, setStatsPvp] = useState<EstatisticasPvp>({
    ...ESTATISTICAS_VAZIAS,
    vitoriasPorTema: {},
  });

  useEffect(() => {
    if (!idAtual) return;
    let ativo = true;
    buscarEstatisticas(idAtual)
      .then((lidas) => {
        if (!ativo) return;
        setStatsPvp(lidas);
        void sincronizarPvp(lidas.vitorias, lidas.vitoriasPorTema);
      })
      .catch(() => {
        /* sem duelo ainda: o cartao mostra o estado vazio */
      });
    return () => {
      ativo = false;
    };
  }, [idAtual, sincronizarPvp]);

  /*
   * Desafios diarios concluidos.
   *
   * O numero vem de `desafio_total()`, no banco - a tabela de conclusoes nao
   * tem policy de escrita, entao nao ha como o aparelho inflar esse contador.
   * A sincronizacao acontece aqui tambem (e nao so ao concluir um desafio)
   * para que quem jogou no celular receba a tag ao abrir o perfil no
   * computador.
   */
  const [desafiosDiarios, setDesafiosDiarios] = useState(0);

  useEffect(() => {
    if (!idAtual) return;
    let ativo = true;

    buscarTotalDeDesafios(idAtual)
      .then((total) => {
        if (!ativo) return;
        setDesafiosDiarios(total);
        if (total > 0) void sincronizarDesafios(total);
      })
      .catch(() => {
        /* migracao 0008 ainda nao aplicada: o cartao mostra zero */
      });

    return () => {
      ativo = false;
    };
  }, [idAtual, sincronizarDesafios]);

  // Ranqueada: patamar da temporada atual e o historico das passadas. Como as
  // estatisticas de duelo, vem de tabela que so o servidor escreve.
  const [ranqueada, setRanqueada] = useState<EstadoRanqueada | null>(null);
  const [temporadasPassadas, setTemporadasPassadas] = useState<TemporadaPassada[]>([]);
  const [topoRanqueada, setTopoRanqueada] = useState<TopoRanqueado | null>(null);

  useEffect(() => {
    if (!idAtual) return;
    let ativo = true;

    Promise.all([
      buscarEstadoRanqueada(idAtual),
      buscarHistoricoRanqueada(idAtual),
      buscarTopoRanqueado(idAtual).catch(() => null),
    ])
      .then(([atual, passadas, topo]) => {
        if (!ativo || !atual) return;
        setRanqueada(atual);
        setTemporadasPassadas(passadas);
        setTopoRanqueada(topo);
        // Conquista de patamar e permanente: a conferencia usa o maior elo de
        // todas as temporadas, nao o da atual.
        void sincronizarRanqueada(patamarMaximoAlcancado(atual));
      })
      .catch(() => {
        /* migracao 0006 ainda nao aplicada: o cartao simplesmente nao aparece */
      });

    return () => {
      ativo = false;
    };
  }, [idAtual, sincronizarRanqueada]);

  /*
   * Conferencia de fundo, uma vez por visita ao perfil.
   *
   * A avaliacao no aparelho so enxerga o que esta tela carregou - a temporada
   * corrente, o cartel de duelo. Quem empatou numa temporada passada, ou
   * cumpriu um criterio antes de ele existir, nunca receberia a medalha. Esta
   * chamada pede ao banco que reconfira TUDO contra o historico real
   * (`conquistas_reavaliar`, migracao 0010) e concede o que faltou.
   *
   * E de proposito que ela roda no perfil: e a tela onde as conquistas
   * aparecem, entao a medalha nova ja surge na lista logo abaixo.
   */
  const jaRevisou = useRef<string | null>(null);
  useEffect(() => {
    if (!idAtual || jaRevisou.current === idAtual) return;
    // Uma vez por conta, por visita: `revisarConquistas` muda de identidade a
    // cada mudanca de estado, e sem esta trava o efeito repetiria a chamada.
    jaRevisou.current = idAtual;
    void revisarConquistas();
  }, [idAtual, revisarConquistas]);

  const trocarFoto = useCallback(
    async (arquivo: File) => {
      if (!idAtual) return;
      const url = await enviarAvatar(idAtual, arquivo);
      await updateAvatar(url);
    },
    [idAtual, updateAvatar],
  );

  if (loading || !state) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/5" />;
  }

  const profile = state.profile;
  const languageSlug = profile.current_language ?? 'python';
  const language = languageBySlug(languageSlug) ?? languageBySlug('python')!;
  const summary = trackSummary(language.slug, state.completedLessonIds);
  const modules = languageProgress(language.slug, state.completedLessonIds);
  const streak = displayStreak(profile.last_study_date, profile.streak_count);
  const conquistas = achievementsWithStatus(state.unlockedAchievementIds);
  const desbloqueadas = conquistas.filter((item) => item.unlocked).length;
  const tagEquipada = profile.equipped_tag_id ? tagById(profile.equipped_tag_id) : undefined;
  const esperaUsername = esperaRestanteMs(profile.username_changed_at);

  const salvarNome = async () => {
    await updateName(nameDraft);
    setEditing(false);
  };

  const abrirEdicaoUsername = () => {
    setUsernameDraft(profile.username ?? '');
    setUsernameErro(null);
    setEditingUsername(true);
  };

  const salvarUsername = async () => {
    const limpo = normalizeUsername(usernameDraft);
    const problema = validateUsername(limpo);
    if (problema) {
      setUsernameErro(problema);
      return;
    }

    if (limpo === profile.username) {
      setEditingUsername(false);
      return;
    }

    setSalvandoUsername(true);
    setUsernameErro(null);
    try {
      if (!(await isUsernameAvailable(limpo, profile.id))) {
        setUsernameErro('Esse nome de usuário já está em uso.');
        return;
      }
      await updateUsername(limpo);
      setEditingUsername(false);
    } catch (falha) {
      setUsernameErro(falha instanceof Error ? falha.message : 'Não foi possível salvar.');
    } finally {
      setSalvandoUsername(false);
    }
  };

  return (
    <div className="cq-page">
      {/* Identidade --------------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-mint-600/15 via-night-900/60 to-electric-500/10 p-5 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <AvatarEditavel
            name={profile.name}
            url={profile.avatar_url}
            posicao={posicao}
            onEscolher={trocarFoto}
            onRemover={() => updateAvatar(null)}
          />

          <div className="w-full min-w-0 flex-1">
            <Label>Perfil do estudante</Label>

            {editing ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <Input
                  tamanho="lg"
                  autoFocus
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void salvarNome();
                    if (event.key === 'Escape') setEditing(false);
                  }}
                  className="flex-1"
                />
                <Button size="sm" onClick={salvarNome}>
                  <Check className="h-4 w-4" /> Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <h1 className="cq-h1 mt-1 flex flex-wrap items-center gap-1 break-words">
                {profile.name}
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(profile.name);
                    setEditing(true);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-mint-300"
                  aria-label="Editar nome"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </h1>
            )}

            {/* @username: campo novo, separado do nome de exibicao acima */}
            {editingUsername ? (
              <div className="mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-night-950/70 px-3 focus-within:border-mint-400/60">
                    <AtSign className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                    <input
                      autoFocus
                      value={usernameDraft}
                      maxLength={USERNAME_MAX}
                      autoCapitalize="off"
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Nome de usuário"
                      onChange={(event) => {
                        setUsernameDraft(normalizeUsername(event.target.value));
                        setUsernameErro(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') void salvarUsername();
                        if (event.key === 'Escape') setEditingUsername(false);
                      }}
                      className="w-full bg-transparent py-2 font-mono text-sm text-white focus:outline-none"
                    />
                  </div>
                  <Button size="sm" loading={salvandoUsername} onClick={salvarUsername}>
                    <Check className="h-4 w-4" /> Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={salvandoUsername}
                    onClick={() => setEditingUsername(false)}
                  >
                    Cancelar
                  </Button>
                </div>
                <p className={cn('mt-1.5 text-xs', usernameErro ? 'text-rose-300' : 'text-slate-500')}>
                  {usernameErro ??
                    (esperaUsername > 0
                      ? `Você trocou faz pouco tempo. Poderá trocar de novo em ${formatarEspera(esperaUsername)}.`
                      : 'Letras minúsculas, números e _ — você pode trocar uma vez a cada 24 horas.')}
                </p>
              </div>
            ) : (
              <p className="mt-1 flex min-w-0 items-center gap-1.5">
                {/* O @username e uma palavra so, sem espaco: sem `min-w-0` +
                    `truncate` ele nao encolhe nunca, e com a fonte ampliada do
                    Android era o lapis de editar que saia da tela. */}
                <span className="min-w-0 truncate font-mono text-sm text-aqua-300">
                  {profile.username ? displayUsername(profile.username) : 'sem nome de usuário'}
                </span>
                <button
                  type="button"
                  onClick={abrirEdicaoUsername}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-mint-300"
                  aria-label="Editar nome de usuário"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </p>
            )}

            {tagEquipada && (
              <div className="mt-2">
                <TagBadge tag={tagEquipada} />
              </div>
            )}

            <p className="mt-2 break-all text-sm text-slate-400">{user?.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {posicao !== null && (
                <Pill tone={posicao <= 3 ? 'amber' : 'neutral'}>
                  <Trophy className="h-3.5 w-3.5" aria-hidden />
                  {posicao}º no ranking global
                </Pill>
              )}
              <Pill tone="blue">
                Nível {profile.level} · {levelTitle(profile.level)}
              </Pill>
              <Pill tone="mint">
                {language.icon} Estudando {language.name}
              </Pill>
              {demoMode && <Pill tone="amber">Conta local</Pill>}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>Nível {profile.level}</span>
            <span>{xpToNextLevel(profile.xp_total)} XP para o nível {profile.level + 1}</span>
          </div>
          <ProgressBar value={levelProgress(profile.xp_total)} tone="blue" />
        </div>
      </section>

      {/* Metricas ----------------------------------------------------- */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon="⭐" label="XP total" value={profile.xp_total} />
        <StatCard icon="🔥" label="Streak" value={`${streak} dias`} tone="amber" hint={profile.last_study_date ? `Último estudo: ${profile.last_study_date}` : 'Nenhum estudo ainda'} />
        <StatCard
          icon="📚"
          label="Lições concluídas"
          value={`${summary.completedLessons}/${summary.totalLessons}`}
          tone="blue"
        />
        <StatCard
          icon="🏆"
          label="Conquistas"
          value={`${desbloqueadas}/${conquistas.length}`}
          tone="violet"
        />
        <StatCard
          icon="📅"
          label="Desafios diários"
          value={desafiosDiarios}
          tone="amber"
          hint={
            desafiosDiarios === 0
              ? 'Nenhum desafio diário ainda'
              : `${desafiosDiarios} ${desafiosDiarios === 1 ? 'concluído' : 'concluídos'}`
          }
        />
      </section>

      {/* Progresso por modulo ----------------------------------------- */}
      <Card>
        <CardTitle>Progresso na trilha de {language.name}</CardTitle>
        <ProgressBar className="mt-4" value={summary.ratio} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {modules.map((item) => (
            <div
              key={item.module.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <span className="text-lg" aria-hidden>
                {item.module.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">
                  {item.module.title}
                </span>
                <ProgressBar className="mt-1.5 h-1.5" value={item.ratio} />
              </span>
              <span className="shrink-0 text-xs font-medium text-slate-400">
                {item.completedLessons}/{item.totalLessons}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Ranqueada ---------------------------------------------------- */}
      {ranqueada && (
        <CartaoRanqueada
          estado={ranqueada}
          historico={temporadasPassadas}
          topo={topoRanqueada}
          proprio
        />
      )}

      {/* Duelos ------------------------------------------------------- */}
      <EstatisticasPvpCard stats={statsPvp} proprio />

      {/* Tags --------------------------------------------------------- */}
      <GaleriaTags
        desbloqueadas={state.unlockedTagIds}
        equipada={profile.equipped_tag_id}
        isDeveloper={profile.is_developer}
        onEquipar={equipTag}
      />

      {/* Conquistas --------------------------------------------------- */}
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>🏆 Conquistas</CardTitle>
          <span className="text-sm text-slate-400">
            {desbloqueadas} de {conquistas.length}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conquistas.map((conquista) => (
            <div
              key={conquista.id}
              className={cn(
                'flex gap-3 rounded-xl border p-3 transition',
                conquista.unlocked
                  ? 'border-mint-500/40 bg-mint-500/[0.07]'
                  : 'border-white/10 bg-white/[0.02] opacity-50',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg',
                  conquista.unlocked
                    ? 'border-mint-500/40 bg-mint-500/10'
                    : 'border-white/10 bg-white/5 grayscale',
                )}
                aria-hidden
              >
                {conquista.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-white">{conquista.title}</span>
                <span className="block text-xs leading-relaxed text-slate-400">
                  {conquista.description}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Conta -------------------------------------------------------- */}
      <Card>
        <CardTitle>Conta</CardTitle>
        <p className="mt-2 text-sm text-slate-400">
          {demoMode
            ? 'Seu progresso está salvo apenas neste dispositivo. Configure o Supabase para sincronizar entre o site, o celular e o computador.'
            : 'Seu progresso é sincronizado automaticamente entre o site, o app Android e o app de desktop.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <LinkButton href={`/trilha/${language.slug}`} variant="secondary" size="sm">
            Continuar estudando
          </LinkButton>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              void signOut().then(() => router.replace('/'));
            }}
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <AppShell>
      <PerfilContent />
    </AppShell>
  );
}
