'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Clock, Flame, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { ExercisePlayer } from '@/components/exercise/ExercisePlayer';
import { Card, CardTitle, Label, Pill } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { languageOfModule, lessonOfExercise } from '@/content';
import { buscarAmigosNoDesafio, buscarDesafioDeHoje, concluirDesafioDeHoje } from '@/lib/desafios/api';
import type { AmigoNoDesafio, EstadoDesafio } from '@/lib/desafios/tipos';
import { cn } from '@/lib/cn';

/** "3 h 20 min" - quanto falta para o desafio virar. */
const quantoFalta = (ate: Date, agora: Date): string => {
  const ms = ate.getTime() - agora.getTime();
  if (ms <= 0) return 'a qualquer momento';
  const minutos = Math.floor(ms / 60_000);
  const horas = Math.floor(minutos / 60);
  if (horas >= 1) return `${horas} h ${minutos % 60} min`;
  return `${minutos} min`;
};

function DesafioContent() {
  const { user } = useAuth();
  const { state, sincronizarDesafios } = usePlayer();
  const { showXp, showToast } = useToast();

  const [estado, setEstado] = useState<EstadoDesafio | null>(null);
  const [amigos, setAmigos] = useState<AmigoNoDesafio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [indisponivel, setIndisponivel] = useState(false);
  const [concluindo, setConcluindo] = useState(false);
  const [agora, setAgora] = useState(() => new Date());

  /*
   * Quando mostrar o painel de "ja fez o de hoje" no lugar do exercicio.
   *
   * NAO e o mesmo que `estado.jaCompletou`. Quem acabou de acertar tem o
   * desafio registrado no servidor (jaCompletou vira true na hora), mas
   * precisa continuar vendo o feedback do ExercisePlayer - com a explicacao
   * do exercicio, que e a parte que ensina. O painel so entra quando a pessoa
   * clica em "Concluir desafio", ou ja de saida se o dia estava fechado.
   */
  const [mostrarResumo, setMostrarResumo] = useState(false);

  const meuId = user?.id;

  useEffect(() => {
    if (!meuId) return;
    let ativo = true;

    buscarDesafioDeHoje()
      .then((atual) => {
        if (!ativo) return;
        if (!atual) setIndisponivel(true);
        setEstado(atual);
        if (atual?.jaCompletou) setMostrarResumo(true);
      })
      .catch(() => {
        if (ativo) setIndisponivel(true);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    buscarAmigosNoDesafio()
      .then((lista) => {
        if (ativo) setAmigos(lista);
      })
      .catch(() => {
        /* comparacao com amigos e opcional */
      });

    return () => {
      ativo = false;
    };
  }, [meuId]);

  // O contador regressivo anda de minuto em minuto - segundo a segundo seria
  // um re-render por segundo sem ganho nenhum de informacao.
  useEffect(() => {
    const timer = window.setInterval(() => setAgora(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const exercicio = estado?.exercicio ?? null;

  const linguagem = useMemo(() => {
    if (!exercicio) return 'python';
    const licao = lessonOfExercise(exercicio.id);
    return licao ? (languageOfModule(licao.moduleId)?.slug ?? 'python') : 'python';
  }, [exercicio]);

  const concluir = useCallback(async () => {
    if (!estado || concluindo || estado.jaCompletou) return;
    setConcluindo(true);

    try {
      const resultado = await concluirDesafioDeHoje(state?.profile.xp_total ?? 0);

      setEstado((atual) =>
        atual ? { ...atual, jaCompletou: true, total: resultado.total } : atual,
      );

      if (!resultado.jaTinha) showXp(resultado.xpGanho);

      // Uma unica escrita de estado: os premios e o XP que o SERVIDOR pagou.
      // O cliente nao soma nada - `resultado.novoXp` ja veio calculado.
      const premios = await sincronizarDesafios(
        resultado.total,
        resultado.jaTinha
          ? undefined
          : { total: resultado.novoXp, nivel: resultado.novoNivel },
      );
      premios.conquistas.forEach((conquista) =>
        showToast({
          icon: conquista.icon,
          title: conquista.title,
          description: conquista.description,
          tone: 'amber',
        }),
      );
      premios.tags.forEach((tag) =>
        showToast({
          icon: tag.icon,
          title: `Nova tag: ${tag.name}`,
          description: tag.description,
          tone: 'mint',
        }),
      );

      setAmigos(await buscarAmigosNoDesafio().catch(() => amigos));
    } catch (falha) {
      showToast({
        icon: '⚠️',
        title: 'Não deu para registrar',
        description: falha instanceof Error ? falha.message : 'Tente de novo em instantes.',
        tone: 'rose',
      });
    } finally {
      setConcluindo(false);
    }
  }, [estado, concluindo, state, showXp, sincronizarDesafios, showToast, amigos]);

  if (carregando) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (indisponivel || !estado) {
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden>
          🗓️
        </p>
        <CardTitle className="mt-3">Desafio diário indisponível</CardTitle>
        <p className="mt-2 text-sm text-slate-400">
          O desafio de hoje ainda não pôde ser carregado. Se você acabou de publicar o projeto,
          confira se a migração <code className="font-mono text-slate-300">0008</code> foi aplicada
          no Supabase.
        </p>
        <LinkButton href="/dashboard" variant="secondary" className="mt-5">
          Voltar ao painel
        </LinkButton>
      </Card>
    );
  }

  if (estado.desconhecido || !exercicio) {
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden>
          📦
        </p>
        <CardTitle className="mt-3">Este desafio é mais novo que o seu app</CardTitle>
        <p className="mt-2 text-sm text-slate-400">
          O servidor sorteou um exercício que esta versão instalada ainda não conhece. Atualize o
          aplicativo para jogar o desafio de hoje.
        </p>
        <LinkButton href="/dashboard" variant="secondary" className="mt-5">
          Voltar ao painel
        </LinkButton>
      </Card>
    );
  }

  const licao = lessonOfExercise(exercicio.id);
  const jaFeito = estado.jaCompletou;

  return (
    <div className="space-y-6">
      {/* Cabecalho ---------------------------------------------------- */}
      <Card
        className={cn(
          'bg-gradient-to-br',
          jaFeito
            ? 'border-mint-500/30 from-mint-500/15 to-transparent'
            : 'border-amber-400/30 from-amber-400/15 to-transparent',
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Label>
              <Flame className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
              Desafio diário
            </Label>
            <h1 className="mt-1 text-2xl font-extrabold text-white">
              {jaFeito ? 'Desafio de hoje concluído' : 'O desafio de hoje'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              É o mesmo exercício para todo mundo, hoje. Não acumula: à meia-noite ele é trocado e
              o de hoje não volta mais.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Pill tone={jaFeito ? 'mint' : 'amber'}>+{estado.xp} XP</Pill>
            {jaFeito && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-mint-500/40 bg-mint-500/10 px-3 py-1 text-xs font-bold text-mint-200">
                <Check className="h-3.5 w-3.5" aria-hidden />
                concluído
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <Clock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            expira em {quantoFalta(estado.expiraEm, agora)}
          </span>
          <span className="text-slate-400">
            <strong className="font-bold text-white">{estado.total}</strong>{' '}
            {estado.total === 1 ? 'desafio concluído' : 'desafios concluídos'} no total
          </span>
          {licao && (
            <Link
              href={`/licao/${licao.id}`}
              className="cq-tap text-sm font-semibold text-mint-300 hover:underline"
            >
              vem da lição “{licao.title}”
            </Link>
          )}
        </div>
      </Card>

      {/* O exercicio -------------------------------------------------- */}
      {mostrarResumo ? (
        <Card className="text-center">
          <p className="text-4xl" aria-hidden>
            ✅
          </p>
          <CardTitle className="mt-3">Você já fez o de hoje</CardTitle>
          <p className="mt-2 text-sm text-slate-400">
            Volte amanhã: à meia-noite entra um exercício novo, e o contador sobe de novo.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <LinkButton href="/dashboard" variant="secondary">
              Voltar ao painel
            </LinkButton>
            {licao && <LinkButton href={`/licao/${licao.id}`}>Revisar a lição</LinkButton>}
          </div>
        </Card>
      ) : (
        <ExercisePlayer
          key={exercicio.id}
          languageSlug={linguagem}
          exercise={exercicio}
          index={0}
          total={1}
          isLast
          rotuloFinal="Concluir desafio"
          onSolved={() => {
            // Registra ja no acerto: se a pessoa fechar a aba antes de clicar
            // em "Concluir desafio", o desafio conta do mesmo jeito.
            void concluir();
          }}
          onNext={() => setMostrarResumo(true)}
        />
      )}

      {/* Amigos ------------------------------------------------------- */}
      {amigos.length > 0 && (
        <Card>
          <CardTitle>
            <Users className="mr-2 inline h-4 w-4" aria-hidden />
            Seus amigos hoje
          </CardTitle>
          <ul className="mt-4 space-y-2">
            {amigos.map((amigo) => (
              <li
                key={amigo.userId}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm',
                    amigo.concluido
                      ? 'bg-mint-500/20 text-mint-300'
                      : 'bg-white/5 text-slate-500',
                  )}
                  aria-hidden
                >
                  {amigo.concluido ? <Check className="h-4 w-4" /> : '·'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {amigo.nome}
                  </span>
                  <span className="text-xs text-slate-500">
                    {amigo.concluido ? 'fez o de hoje' : 'ainda não fez hoje'} · {amigo.total} no
                    total
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

export default function DesafioPage() {
  return (
    <AppShell>
      <DesafioContent />
    </AppShell>
  );
}
