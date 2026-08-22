'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Check, ChevronRight, Lock } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, CardTitle, Label, Pill, ProgressBar } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { languageBySlug, lessonXp, languages } from '@/content';
import { languageProgress, lessonStatus, trackSummary } from '@/lib/progression';
import { cn } from '@/lib/cn';

function TrilhaContent({ slug }: { slug: string }) {
  const { state, loading, setCurrentLanguage } = usePlayer();
  const language = languageBySlug(slug);

  // Escolher uma trilha define a "linguagem em progresso" do perfil.
  useEffect(() => {
    if (language?.available) void setCurrentLanguage(language.slug);
  }, [language, setCurrentLanguage]);

  if (!language) {
    return (
      <Card>
        <CardTitle>Linguagem não encontrada</CardTitle>
        <p className="mt-2 text-sm text-slate-400">
          A trilha <code className="font-mono">{slug}</code> não existe no CodeQuest.
        </p>
        <div className="mt-4">
          <LinkButton href="/trilha/python" size="sm">
            Ir para a trilha de Python
          </LinkButton>
        </div>
      </Card>
    );
  }

  if (!language.available) {
    return (
      <div className="space-y-6">
        <Card className="text-center">
          <span className="text-5xl" aria-hidden>
            {language.icon}
          </span>
          <CardTitle className="mt-4">Trilha de {language.name} em produção</CardTitle>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            A estrutura desta linguagem já existe na plataforma e no banco de dados. O conteúdo será
            populado nas próximas versões — no MVP, a trilha completa é a de Python.
          </p>
          <div className="mt-6">
            <LinkButton href="/trilha/python">Estudar Python agora</LinkButton>
          </div>
        </Card>

        <OutrasLinguagens atual={language.slug} />
      </div>
    );
  }

  if (loading || !state) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  const completed = state.completedLessonIds;
  const modules = languageProgress(language.slug, completed);
  const summary = trackSummary(language.slug, completed);

  return (
    <div className="space-y-6">
      {/* Cabecalho da trilha ------------------------------------------ */}
      <section className="cq-card bg-gradient-to-br from-mint-600/15 via-night-900/60 to-electric-500/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Label>Trilha de aprendizado</Label>
            <h1 className="mt-1.5 text-2xl font-extrabold text-white sm:text-3xl">
              <span className="mr-2" aria-hidden>
                {language.icon}
              </span>
              {language.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {summary.completedLessons} de {summary.totalLessons} lições ·{' '}
              {summary.earnedXp} de {summary.totalXp} XP
            </p>
          </div>
          <Pill tone="mint">{Math.round(summary.ratio * 100)}% concluído</Pill>
        </div>
        <ProgressBar className="mt-5" value={summary.ratio} />
      </section>

      {/* Mapa de modulos ---------------------------------------------- */}
      <ol className="space-y-4">
        {modules.map((item, index) => {
          const bloqueado = item.status === 'locked';

          return (
            <li key={item.module.id} className="relative">
              {/* linha vertical ligando os modulos */}
              {index < modules.length - 1 && (
                <span
                  className="absolute left-[41px] top-[74px] hidden h-[calc(100%-58px)] w-px bg-gradient-to-b from-white/15 to-transparent sm:block"
                  aria-hidden
                />
              )}

              <Card
                className={cn(
                  'transition',
                  bloqueado ? 'opacity-55' : 'cq-card-hover',
                  item.status === 'completed' && 'border-mint-500/30',
                )}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xl sm:h-14 sm:w-14 sm:text-2xl',
                      item.status === 'completed'
                        ? 'border-mint-500/50 bg-mint-500/15'
                        : bloqueado
                          ? 'border-white/10 bg-white/[0.03]'
                          : 'border-electric-400/40 bg-electric-400/10 animate-pulse-ring',
                    )}
                    aria-hidden
                  >
                    {bloqueado ? <Lock className="h-5 w-5 text-slate-500" /> : item.module.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">
                        {String(item.module.orderIndex).padStart(2, '0')}
                      </span>
                      <h2 className="text-lg font-bold text-white">{item.module.title}</h2>
                      {item.status === 'completed' && <Pill tone="mint">Concluído</Pill>}
                      {bloqueado && <Pill>Bloqueado</Pill>}
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {item.module.description}
                    </p>

                    {bloqueado ? (
                      <p className="mt-3 text-xs text-slate-500">
                        Conclua o módulo anterior para desbloquear.
                      </p>
                    ) : (
                      <>
                        <div className="mt-3 flex items-center gap-3">
                          <ProgressBar value={item.ratio} className="flex-1" />
                          <span className="shrink-0 text-xs font-semibold text-slate-400">
                            {item.completedLessons}/{item.totalLessons}
                          </span>
                        </div>

                        <ul className="mt-4 space-y-1.5">
                          {item.module.lessons.map((lesson) => {
                            const status = lessonStatus(lesson, completed);
                            const licaoBloqueada = status === 'locked';

                            const conteudo = (
                              <>
                                <span
                                  className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                                    status === 'completed'
                                      ? 'border-mint-400 bg-mint-500/20 text-mint-300'
                                      : licaoBloqueada
                                        ? 'border-white/10 text-slate-600'
                                        : 'border-electric-400/50 text-aqua-300',
                                  )}
                                >
                                  {status === 'completed' ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    lesson.orderIndex
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-medium leading-snug text-slate-200">
                                    {lesson.title}
                                  </span>
                                  <span className="block truncate text-xs text-slate-500">
                                    {lesson.subtitle} · {lessonXp(lesson)} XP
                                  </span>
                                </span>
                                {licaoBloqueada ? (
                                  <Lock className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                                )}
                              </>
                            );

                            return (
                              <li key={lesson.id}>
                                {licaoBloqueada ? (
                                  <div className="flex min-h-[52px] cursor-not-allowed items-center gap-3 rounded-lg px-2 py-2 opacity-50">
                                    {conteudo}
                                  </div>
                                ) : (
                                  <Link
                                    href={`/licao/${lesson.id}`}
                                    className="flex min-h-[52px] items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/5"
                                  >
                                    {conteudo}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>

      <OutrasLinguagens atual={language.slug} />
    </div>
  );
}

function OutrasLinguagens({ atual }: { atual: string }) {
  const outras = languages.filter((language) => language.slug !== atual);

  return (
    <Card>
      <CardTitle>Outras linguagens</CardTitle>
      <p className="mt-1 text-sm text-slate-400">
        O mesmo conceito, outra sintaxe. Trilhas em produção para as próximas versões.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {outras.map((language) => (
          <Link
            key={language.id}
            href={`/trilha/${language.slug}`}
            className={cn(
              'flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:border-mint-500/40',
              !language.available && 'opacity-60',
            )}
          >
            <span className="text-xl" aria-hidden>
              {language.icon}
            </span>
            <span className="text-sm font-semibold text-white">{language.name}</span>
            {!language.available && (
              <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500">
                em breve
              </span>
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function TrilhaView({ slug }: { slug: string }) {
  return (
    <AppShell>
      <TrilhaContent slug={slug} />
    </AppShell>
  );
}
