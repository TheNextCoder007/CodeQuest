'use client';

import { useState } from 'react';
import { Check, LogOut, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar, StatCard } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { languageBySlug } from '@/content';
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
  const { state, loading, updateName } = usePlayer();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

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

  const salvarNome = async () => {
    await updateName(nameDraft);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Identidade --------------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-mint-600/15 via-night-900/60 to-electric-500/10 p-6">
        <div className="flex flex-wrap items-center gap-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-mint-500/30 to-electric-500/30 text-3xl font-extrabold text-white">
              {profile.name.trim().charAt(0).toUpperCase() || '?'}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <Label>Perfil do estudante</Label>

            {editing ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void salvarNome();
                    if (event.key === 'Escape') setEditing(false);
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-night-950/70 px-3 py-2 text-lg font-bold text-white focus:border-mint-400/60 focus:outline-none"
                />
                <Button size="sm" onClick={salvarNome}>
                  <Check className="h-4 w-4" /> Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-extrabold text-white sm:text-3xl">
                {profile.name}
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(profile.name);
                    setEditing(true);
                  }}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-mint-300"
                  aria-label="Editar nome"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </h1>
            )}

            <p className="mt-1 text-sm text-slate-400">{user?.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
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
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Nível {profile.level}</span>
            <span>{xpToNextLevel(profile.xp_total)} XP para o nível {profile.level + 1}</span>
          </div>
          <ProgressBar value={levelProgress(profile.xp_total)} tone="blue" />
        </div>
      </section>

      {/* Metricas ----------------------------------------------------- */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <span className="shrink-0 text-xs font-semibold text-slate-400">
                {item.completedLessons}/{item.totalLessons}
              </span>
            </div>
          ))}
        </div>
      </Card>

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
