'use client';

import Link from 'next/link';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { ChamadaRanqueada } from '@/components/ranked/ChamadaRanqueada';
import { ChamadaDesafio } from '@/components/desafios/ChamadaDesafio';
import { Card, CardTitle, Label, Pill, ProgressBar, StatCard } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { languageBySlug, lessonXp, moduleById } from '@/content';
import { achievementsWithStatus, displayStreak, levelProgress, levelTitle, studiedToday, xpToNextLevel } from '@/lib/gamification';
import { languageProgress, nextLesson, trackSummary } from '@/lib/progression';
import { cn } from '@/lib/cn';

function DashboardContent() {
  const { user } = useAuth();
  const { state, loading } = usePlayer();

  if (loading || !state) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  const languageSlug = state.profile.current_language ?? 'python';
  const language = languageBySlug(languageSlug) ?? languageBySlug('python')!;
  const completed = state.completedLessonIds;

  const summary = trackSummary(language.slug, completed);
  const proxima = nextLesson(language.slug, completed);
  const modules = languageProgress(language.slug, completed);
  const streak = displayStreak(state.profile.last_study_date, state.profile.streak_count);
  const estudouHoje = studiedToday(state.profile.last_study_date);
  const conquistas = achievementsWithStatus(state.unlockedAchievementIds);
  const desbloqueadas = conquistas.filter((item) => item.unlocked);

  const primeiroNome = (state.profile.name || user?.name || 'Estudante').split(' ')[0];
  const moduloDaProxima = proxima ? moduleById(proxima.moduleId) : null;

  const missoes = [
    { titulo: 'Estudar hoje', feito: estudouHoje, detalhe: 'Conclua ao menos uma lição' },
    { titulo: 'Manter o streak', feito: estudouHoje && streak >= 1, detalhe: `${streak} dia(s) seguidos` },
    {
      titulo: 'Chegar ao nível ' + (state.profile.level + 1),
      feito: false,
      detalhe: `Faltam ${xpToNextLevel(state.profile.xp_total)} XP`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Saudacao + proxima licao ------------------------------------- */}
      <section className="cq-card overflow-hidden bg-gradient-to-br from-mint-600/15 via-night-900/60 to-electric-500/10 p-6 sm:p-8">
        <Label>Bem-vindo de volta</Label>
        <h1 className="mt-2 text-xl font-extrabold text-white sm:text-3xl">
          Olá, {primeiroNome} 👋
        </h1>

        {proxima ? (
          <>
            <p className="mt-2 text-slate-300">
              {summary.completedLessons === 0
                ? 'Sua jornada começa agora. A primeira lição leva menos de 5 minutos.'
                : 'Continue de onde parou — você está indo bem.'}
            </p>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-night-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-mint-400">
                  {moduloDaProxima?.icon} {moduloDaProxima?.title}
                </p>
                <p className="mt-1 truncate text-lg font-bold text-white">{proxima.title}</p>
                <p className="text-sm text-slate-400">
                  {proxima.subtitle} · vale {lessonXp(proxima)} XP
                </p>
              </div>
              <LinkButton href={`/licao/${proxima.id}`} size="lg" className="shrink-0">
                Continuar <ArrowRight className="h-5 w-5" />
              </LinkButton>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-slate-300">
              Você concluiu <strong className="text-white">toda a trilha de {language.name}</strong>.
              Isso é o projeto inteiro do começo ao fim. 🏆
            </p>
            <div className="mt-6">
              <LinkButton href="/perfil" size="lg">
                Ver minhas conquistas
              </LinkButton>
            </div>
          </>
        )}
      </section>

      {/* Metricas ------------------------------------------------------ */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="⭐" label="XP total" value={state.profile.xp_total} hint={`${xpToNextLevel(state.profile.xp_total)} XP para o próximo nível`} />
        <StatCard
          icon="📈"
          label="Nível"
          value={state.profile.level}
          hint={levelTitle(state.profile.level)}
          tone="blue"
        />
        <StatCard
          icon="🔥"
          label="Streak"
          value={`${streak} ${streak === 1 ? 'dia' : 'dias'}`}
          hint={estudouHoje ? 'Você já estudou hoje' : 'Estude hoje para não perder'}
          tone="amber"
        />
        <StatCard
          icon="🏆"
          label="Conquistas"
          value={`${desbloqueadas.length}/${conquistas.length}`}
          hint="Medalhas desbloqueadas"
          tone="violet"
        />
      </section>

      {/* Progresso do nivel ------------------------------------------- */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>Nível {state.profile.level}</CardTitle>
            <p className="mt-0.5 text-sm text-slate-400">{levelTitle(state.profile.level)}</p>
          </div>
          <Pill tone="blue">Nível {state.profile.level + 1} em {xpToNextLevel(state.profile.xp_total)} XP</Pill>
        </div>
        <ProgressBar className="mt-4" value={levelProgress(state.profile.xp_total)} tone="blue" />
      </Card>

      {/* Ranqueada ----------------------------------------------------
        * Fica aqui, e nao na barra de baixo, de proposito: a barra ja tem
        * cinco itens e um sexto nao caberia num Android de 360px com a fonte
        * ampliada (ver o comentario em `AppShell`).
        * ------------------------------------------------------------- */}
      <ChamadaDesafio />

      <ChamadaRanqueada />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Trilha ------------------------------------------------------ */}
        <Card>
          {/* `flex-wrap`: em tela de 320px com a fonte no maximo, o interior do
              card fica com ~176px e o "Ver mapa" nao cabe ao lado do titulo -
              sem quebrar linha ele ficava cortado na borda direita. */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>
                <span className="mr-2" aria-hidden>
                  {language.icon}
                </span>
                Trilha de {language.name}
              </CardTitle>
              <p className="mt-0.5 text-sm text-slate-400">
                {summary.completedLessons} de {summary.totalLessons} lições concluídas
              </p>
            </div>
            <Link
              href={`/trilha/${language.slug}`}
              className="cq-tap shrink-0 text-sm font-semibold text-mint-300 hover:underline"
            >
              Ver mapa
            </Link>
          </div>

          <ProgressBar className="mt-4" value={summary.ratio} />

          <ul className="mt-5 space-y-2">
            {modules.map((item) => (
              <li key={item.module.id}>
                <Link
                  href={item.status === 'locked' ? '#' : `/trilha/${language.slug}`}
                  aria-disabled={item.status === 'locked'}
                  className={cn(
                    'flex min-h-[56px] items-center gap-3 rounded-xl border px-3 py-2.5 transition',
                    item.status === 'locked'
                      ? 'cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50'
                      : 'border-white/10 bg-white/[0.03] hover:border-mint-500/40',
                  )}
                >
                  <span className="text-lg" aria-hidden>
                    {item.module.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      {item.module.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.completedLessons}/{item.totalLessons} lições
                    </span>
                  </span>
                  {item.status === 'completed' && (
                    <Check className="h-4 w-4 shrink-0 text-mint-400" />
                  )}
                  {item.status === 'locked' && <Lock className="h-4 w-4 shrink-0 text-slate-600" />}
                  {item.status === 'available' && (
                    <span className="shrink-0 text-xs font-bold text-mint-300">
                      {Math.round(item.ratio * 100)}%
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="min-w-0 space-y-6">
          {/* Missoes -------------------------------------------------- */}
          <Card>
            <CardTitle>🎯 Missões de hoje</CardTitle>
            <ul className="mt-4 space-y-3">
              {missoes.map((missao) => (
                <li key={missao.titulo} className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                      missao.feito
                        ? 'border-mint-400 bg-mint-500/20 text-mint-300'
                        : 'border-white/20 text-transparent',
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span>
                    <span
                      className={cn(
                        'block text-sm font-semibold',
                        missao.feito ? 'text-slate-500 line-through' : 'text-white',
                      )}
                    >
                      {missao.titulo}
                    </span>
                    <span className="text-xs text-slate-500">{missao.detalhe}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Conquistas recentes -------------------------------------- */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>🏆 Conquistas</CardTitle>
              <Link
                href="/perfil"
                className="cq-tap shrink-0 text-sm font-semibold text-mint-300 hover:underline"
              >
                Ver todas
              </Link>
            </div>

            {desbloqueadas.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                Nenhuma ainda. Conclua sua primeira lição para desbloquear{' '}
                <strong className="text-white">&quot;Primeiro desafio concluído&quot;</strong>.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {desbloqueadas.slice(-3).reverse().map((conquista) => (
                  <li key={conquista.id} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-mint-500/30 bg-mint-500/10 text-lg">
                      {conquista.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {conquista.title}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {conquista.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
