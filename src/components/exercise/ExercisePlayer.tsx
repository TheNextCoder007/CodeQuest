'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Lightbulb, Play, RotateCcw, X } from 'lucide-react';
import type { Exercise } from '@/types/content';
import { Button } from '@/components/ui/Button';
import { Card, Pill } from '@/components/ui/Card';
import { MarkdownLite } from '@/components/content/MarkdownLite';
import { CodeEditor, Terminal } from './CodeEditor';
import { justRun, validateExercise, type ValidationResult } from '@/lib/exercises/validate';
import { onPythonReady, pythonIsReady, warmUpPython } from '@/lib/python/runner';
import { cn } from '@/lib/cn';

/**
 * Um exercicio na tela: enunciado, resposta (editor / alternativas / campo),
 * verificacao e feedback imediato - o fluxo do slide "Como seria uma lição?".
 */
export function ExercisePlayer({
  exercise,
  index,
  total,
  onSolved,
  onNext,
  isLast,
}: {
  exercise: Exercise;
  index: number;
  total: number;
  /** Chamado na primeira vez que este exercicio e resolvido. */
  onSolved: (attempts: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const isCode = exercise.validationType === 'output_match';

  const [code, setCode] = useState(exercise.starterCode ?? '');
  const [choice, setChoice] = useState('');
  const [blank, setBlank] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [runOutput, setRunOutput] = useState<{ stdout: string; error: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [pyReady, setPyReady] = useState(false);

  // Reinicia o estado ao trocar de exercicio.
  useEffect(() => {
    setCode(exercise.starterCode ?? '');
    setChoice('');
    setBlank('');
    setResult(null);
    setRunOutput(null);
    setAttempts(0);
    setSolved(false);
    setShowHint(false);
  }, [exercise.id, exercise.starterCode]);

  // O Pyodide comeca a carregar assim que um exercicio de codigo aparece.
  useEffect(() => {
    if (!isCode) return;
    warmUpPython();
    setPyReady(pythonIsReady());
    return onPythonReady(() => setPyReady(true));
  }, [isCode]);

  const answer = useMemo(() => {
    if (exercise.validationType === 'multiple_choice') return choice;
    if (exercise.validationType === 'fill_blank') return blank;
    return code;
  }, [exercise.validationType, choice, blank, code]);

  const canSubmit = answer.trim().length > 0 && !busy && !solved;

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    const output = await justRun(code, exercise);
    setRunOutput({ stdout: output.stdout, error: output.error });
    setRunning(false);
  };

  const handleCheck = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setShowHint(false);

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const validation = await validateExercise(exercise, answer);
    setResult(validation);
    if (validation.stdout !== undefined) {
      setRunOutput({ stdout: validation.stdout, error: validation.error ?? null });
    }

    if (validation.correct) {
      setSolved(true);
      onSolved(nextAttempts);
    }

    setBusy(false);
  };

  const handleRetry = () => {
    setResult(null);
  };

  return (
    <Card className="space-y-5">
      {/* Cabecalho ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>
            🎯
          </span>
          <h2 className="text-lg font-bold text-white">
            Desafio {index + 1} <span className="text-slate-500">de {total}</span>
          </h2>
        </div>
        <Pill tone="mint">+{exercise.xpReward} XP</Pill>
      </div>

      {/* Enunciado ---------------------------------------------------- */}
      <MarkdownLite source={exercise.prompt} className="text-[15px]" />

      {/* Resposta ----------------------------------------------------- */}
      {exercise.validationType === 'multiple_choice' && (
        <div className="space-y-2">
          {exercise.options?.map((option) => {
            const selected = choice === option;
            const isCorrectOption = solved && option === exercise.expectedAnswer;

            return (
              <button
                key={option}
                type="button"
                disabled={solved}
                onClick={() => {
                  setChoice(option);
                  setResult(null);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition min-h-[52px]',
                  isCorrectOption
                    ? 'border-mint-500/60 bg-mint-500/10 text-mint-100'
                    : selected
                      ? 'border-electric-400/60 bg-electric-400/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25',
                  solved && !isCorrectOption && 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                    selected || isCorrectOption ? 'border-current' : 'border-white/25',
                  )}
                >
                  {(selected || isCorrectOption) && (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                <span className="font-mono text-[13px]">{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {exercise.validationType === 'fill_blank' && (
        <input
          type="text"
          value={blank}
          disabled={solved}
          onChange={(event) => {
            setBlank(event.target.value);
            setResult(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void handleCheck();
          }}
          placeholder="Digite sua resposta"
          className="w-full rounded-xl border border-white/10 bg-night-950/70 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/15"
        />
      )}

      {isCode && (
        <div className="space-y-3">
          <CodeEditor value={code} onChange={setCode} disabled={solved} />

          {exercise.stdin && exercise.stdin.length > 0 && (
            <p className="text-xs text-slate-500">
              Entradas simuladas para o <code className="font-mono text-slate-400">input()</code>:{' '}
              <span className="font-mono text-aqua-300">{exercise.stdin.join(', ')}</span>
            </p>
          )}

          <Terminal
            output={runOutput?.stdout}
            error={runOutput?.error}
            running={running || (busy && !result)}
            empty={
              pyReady
                ? 'Clique em Executar para ver a saída do seu programa.'
                : 'Preparando o Python (isso acontece só na primeira vez)...'
            }
          />
        </div>
      )}

      {/* Dica --------------------------------------------------------- */}
      {exercise.hint && !solved && (
        <div>
          {showHint ? (
            <div className="flex gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] p-4 text-sm text-amber-100">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-300" />
              <span>{exercise.hint}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="cq-tap text-sm font-medium text-amber-300 hover:underline"
            >
              <Lightbulb className="h-4 w-4" />
              Preciso de uma dica
            </button>
          )}
        </div>
      )}

      {/* Feedback ----------------------------------------------------- */}
      {result && (
        <div
          className={cn(
            'animate-fade-up rounded-xl border p-4',
            result.correct
              ? 'border-mint-500/50 bg-mint-500/[0.08]'
              : 'border-rose-500/50 bg-rose-500/[0.08]',
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full',
                result.correct ? 'bg-mint-500 text-night-950' : 'bg-rose-500 text-white',
              )}
            >
              {result.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </span>
            <p className={cn('font-bold', result.correct ? 'text-mint-200' : 'text-rose-200')}>
              {result.message}
            </p>
          </div>

          {(result.correct || attempts >= 2) && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <MarkdownLite source={exercise.explanation} className="text-sm" />
            </div>
          )}

          {!result.correct && attempts < 2 && (
            <p className="mt-2 text-sm text-slate-300">
              Revise o enunciado e tente de novo — errar faz parte do processo.
            </p>
          )}

          {!result.correct && isCode && (
            <p className="mt-3 text-xs text-slate-400">
              Saída esperada:{' '}
              <code className="font-mono text-mint-300">
                {exercise.expectedAnswer.split('\n').join(' ⏎ ')}
              </code>
            </p>
          )}
        </div>
      )}

      {/* Acoes -------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-3">
        {solved ? (
          <Button onClick={onNext} size="lg" className="w-full sm:w-auto">
            {isLast ? 'Concluir lição' : 'Próximo desafio'}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleCheck}
              loading={busy}
              disabled={!canSubmit}
              size="lg"
              className="w-full sm:w-auto"
            >
              Verificar resposta
            </Button>

            {isCode && (
              <Button
                variant="secondary"
                onClick={handleRun}
                loading={running}
                disabled={busy}
                className="flex-1 sm:flex-none"
              >
                <Play className="h-4 w-4" />
                Executar
              </Button>
            )}

            {result && !result.correct && (
              <Button variant="ghost" onClick={handleRetry} className="flex-1 sm:flex-none">
                <RotateCcw className="h-4 w-4" />
                Tentar de novo
              </Button>
            )}

            {isCode && exercise.starterCode !== null && (
              <button
                type="button"
                onClick={() => setCode(exercise.starterCode ?? '')}
                className="cq-tap text-xs text-slate-500 hover:text-slate-300"
              >
                restaurar código inicial
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
