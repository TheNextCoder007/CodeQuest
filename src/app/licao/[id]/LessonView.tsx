'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, PartyPopper } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar } from '@/components/ui/Card';
import { MarkdownLite } from '@/components/content/MarkdownLite';
import { PolyglotTabs } from '@/components/lesson/PolyglotTabs';
import { ExercisePlayer } from '@/components/exercise/ExercisePlayer';
import { useToast } from '@/components/ui/Toast';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { languageOfModule, lessonById, lessonXp, moduleById } from '@/content';
import { lessonStatus, nextLesson } from '@/lib/progression';
import type { CompletionResult } from '@/lib/player/PlayerProvider';

type Phase = 'theory' | 'exercises' | 'done';

function LessonContent({ lessonId }: { lessonId: string }) {
  const { state, loading, completeLesson } = usePlayer();
  const { showXp, showToast } = useToast();

  const lesson = lessonById(lessonId);
  const module = lesson ? moduleById(lesson.moduleId) : undefined;
  const language = lesson ? languageOfModule(lesson.moduleId) : undefined;

  const [phase, setPhase] = useState<Phase>('theory');
  const [current, setCurrent] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [completion, setCompletion] = useState<CompletionResult | null>(null);
  const [finishing, setFinishing] = useState(false);

  // Marca quando a tela de desafios abriu: e o cronometro da tag secreta
  // "Relâmpago" (lição inteira em menos de 30 segundos, sem errar nada).
  const inicioDosDesafios = useRef<number | null>(null);

  const proxima = useMemo(
    () =>
      language && state
        ? nextLesson(
            language.slug,
            // considera a licao atual como concluida para sugerir a proxima
            [...state.completedLessonIds, lessonId],
          )
        : null,
    [language, state, lessonId],
  );

  const finalizar = useCallback(
    async (attempts: number) => {
      if (!lesson) return;
      setFinishing(true);

      const flawless = attempts === lesson.exercises.length;
      const duracaoMs = inicioDosDesafios.current
        ? Date.now() - inicioDosDesafios.current
        : undefined;
      const result = await completeLesson(lesson.id, lessonXp(lesson), flawless, duracaoMs);

      setCompletion(result);
      setPhase('done');
      setFinishing(false);

      if (result.xpEarned > 0) showXp(result.xpEarned);

      if (result.leveledUp) {
        showToast({
          icon: '📈',
          title: `Nível ${result.newLevel} alcançado!`,
          description: 'Sua barra de progresso subiu.',
          tone: 'blue',
        });
      }

      result.newAchievements.forEach((achievement, index) => {
        window.setTimeout(() => {
          showToast({
            icon: achievement.icon,
            title: `🏆 ${achievement.title}`,
            description: achievement.description,
            tone: 'mint',
          });
        }, 400 * (index + 1));
      });

      const atraso = 400 * (result.newAchievements.length + 1);
      result.newTags.forEach((tag, index) => {
        window.setTimeout(() => {
          showToast({
            icon: tag.icon,
            title: `Nova tag: ${tag.name}`,
            description: `${tag.description} Escolha ela no seu perfil.`,
            tone: 'blue',
          });
        }, atraso + 400 * index);
      });
    },
    [lesson, completeLesson, showXp, showToast],
  );

  if (!lesson || !module || !language) {
    return (
      <Card>
        <CardTitle>Lição não encontrada</CardTitle>
        <p className="mt-2 text-sm text-slate-400">
          O identificador <code className="font-mono">{lessonId}</code> não existe no currículo.
        </p>
        <div className="mt-4">
          <LinkButton href="/trilha/python" size="sm">
            Voltar para a trilha
          </LinkButton>
        </div>
      </Card>
    );
  }

  if (loading || !state) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/5" />;
  }

  const status = lessonStatus(lesson, state.completedLessonIds);
  if (status === 'locked') {
    return (
      <Card className="text-center">
        <Lock className="mx-auto h-8 w-8 text-slate-500" />
        <CardTitle className="mt-4">Lição bloqueada</CardTitle>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          A progressão do CodeQuest é sequencial: conclua a lição anterior deste módulo (e o módulo
          anterior da trilha) para liberar esta aqui.
        </p>
        <div className="mt-6">
          <LinkButton href={`/trilha/${language.slug}`}>Ver o mapa da trilha</LinkButton>
        </div>
      </Card>
    );
  }

  const jaConcluida = state.completedLessonIds.includes(lesson.id);

  return (
    <div className="space-y-6">
      {/* Cabecalho ---------------------------------------------------- */}
      <div>
        <Link
          href={`/trilha/${language.slug}`}
          className="cq-tap text-sm text-slate-400 transition hover:text-mint-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {module.icon} {module.title}
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold leading-snug text-white sm:text-3xl">{lesson.title}</h1>
            <p className="mt-1 text-slate-400">{lesson.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {jaConcluida && <Pill tone="mint">Já concluída</Pill>}
            <Pill tone="blue">{lessonXp(lesson)} XP</Pill>
          </div>
        </div>

        {phase === 'exercises' && (
          <ProgressBar className="mt-4" value={current / lesson.exercises.length} />
        )}
      </div>

      {/* Teoria ------------------------------------------------------- */}
      {phase === 'theory' && (
        <>
          <Card>
            <MarkdownLite source={lesson.content} />
          </Card>

          {lesson.polyglot && <PolyglotTabs samples={lesson.polyglot} />}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                inicioDosDesafios.current = Date.now();
                setPhase('exercises');
              }}
            >
              Ir para os desafios ({lesson.exercises.length})
              <ArrowRight className="h-5 w-5" />
            </Button>
            <span className="text-sm text-slate-500">
              Você pode voltar à teoria a qualquer momento.
            </span>
          </div>
        </>
      )}

      {/* Exercicios --------------------------------------------------- */}
      {phase === 'exercises' && (
        <>
          <ExercisePlayer
            key={lesson.exercises[current].id}
            exercise={lesson.exercises[current]}
            index={current}
            total={lesson.exercises.length}
            isLast={current === lesson.exercises.length - 1}
            onSolved={(attempts) => setTotalAttempts((total) => total + attempts)}
            onNext={() => {
              if (current < lesson.exercises.length - 1) {
                setCurrent((value) => value + 1);
              } else {
                void finalizar(totalAttempts);
              }
            }}
          />

          <button
            type="button"
            onClick={() => setPhase('theory')}
            className="cq-tap text-sm text-slate-500 hover:text-slate-300"
            disabled={finishing}
          >
            ← revisar a teoria desta lição
          </button>
        </>
      )}

      {/* Conclusao ---------------------------------------------------- */}
      {phase === 'done' && completion && (
        <Card className="animate-fade-up border-mint-500/40 bg-gradient-to-br from-mint-600/15 to-transparent text-center">
          <PartyPopper className="mx-auto h-10 w-10 text-mint-400" />
          <Label className="mt-4">Lição concluída</Label>
          <h2 className="mt-2 text-2xl font-extrabold text-white">{lesson.title}</h2>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:justify-center">
            <div className="rounded-xl border border-mint-500/40 bg-mint-500/10 px-6 py-4">
              <p className="text-2xl font-extrabold text-mint-300">
                {completion.xpEarned > 0 ? `+${completion.xpEarned}` : '0'} XP
              </p>
              <p className="text-xs text-slate-400">
                {completion.alreadyCompleted ? 'lição já concluída antes' : 'adicionados ao perfil'}
              </p>
            </div>
            <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-6 py-4">
              <p className="text-2xl font-extrabold text-amber-300">🔥 {completion.streak}</p>
              <p className="text-xs text-slate-400">dias de streak</p>
            </div>
            <div className="rounded-xl border border-electric-400/40 bg-electric-400/10 px-6 py-4">
              <p className="text-2xl font-extrabold text-aqua-300">Nv {completion.newLevel}</p>
              <p className="text-xs text-slate-400">
                {completion.leveledUp ? 'você subiu de nível!' : 'nível atual'}
              </p>
            </div>
          </div>

          {completion.newAchievements.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-semibold text-white">🏆 Conquistas desbloqueadas</p>
              <div className="flex flex-wrap justify-center gap-2">
                {completion.newAchievements.map((achievement) => (
                  <Pill key={achievement.id} tone="mint">
                    <span aria-hidden>{achievement.icon}</span> {achievement.title}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {proxima ? (
              <LinkButton href={`/licao/${proxima.id}`} size="lg" className="w-full sm:w-auto">
                Próxima lição: {proxima.title}
                <ArrowRight className="h-5 w-5" />
              </LinkButton>
            ) : (
              <LinkButton href="/perfil" size="lg" className="w-full sm:w-auto">
                Ver minhas conquistas
              </LinkButton>
            )}
            <LinkButton href={`/trilha/${language.slug}`} variant="secondary" size="lg" className="w-full sm:w-auto">
              Voltar para a trilha
            </LinkButton>
          </div>
        </Card>
      )}
    </div>
  );
}

export function LessonView({ lessonId }: { lessonId: string }) {
  return (
    <AppShell>
      <LessonContent lessonId={lessonId} />
    </AppShell>
  );
}
