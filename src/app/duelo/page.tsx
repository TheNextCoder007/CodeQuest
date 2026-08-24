'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Loader2, Swords, Timer, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { MarkdownLite } from '@/components/content/MarkdownLite';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { useToast } from '@/components/ui/Toast';
import { useAvisoDeRespostas } from '@/lib/presenca';
import {
  buscarEstado,
  buscarEstatisticas,
  buscarPergunta,
  finalizarPartida,
  responderPergunta,
} from '@/lib/pvp/api';
import { TEMPO_LIMITE_MS } from '@/lib/pvp/regras';
import { nomeDoTema } from '@/content/pvp-temas';
import type { EstadoPartida, PerguntaPvp, ResultadoResposta } from '@/lib/pvp/tipos';
import { cn } from '@/lib/cn';

type Fase = 'carregando' | 'perguntando' | 'respondida' | 'aguardando' | 'fim' | 'erro';

function DueloContent() {
  const parametros = useSearchParams();
  const { user } = useAuth();
  const { sincronizarPvp } = usePlayer();
  const { showToast } = useToast();
  const matchId = parametros.get('m') ?? '';

  const [fase, setFase] = useState<Fase>('carregando');
  const [erro, setErro] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoPartida | null>(null);
  const [pergunta, setPergunta] = useState<PerguntaPvp | null>(null);
  const [resultado, setResultado] = useState<ResultadoResposta | null>(null);
  const [escolha, setEscolha] = useState('');
  const [meusPontos, setMeusPontos] = useState(0);
  const [restanteMs, setRestanteMs] = useState(TEMPO_LIMITE_MS);
  const [enviando, setEnviando] = useState(false);

  const inicioDaPergunta = useRef<number>(0);
  // Evita responder duas vezes quando o tempo estoura junto com o clique.
  const jaRespondeu = useRef(false);

  const souHost = estado ? estado.hostId === user?.id : true;
  const minhasRespondidas = estado
    ? souHost
      ? estado.hostRespondidas
      : estado.guestRespondidas
    : 0;
  const deleRespondidas = estado
    ? souHost
      ? estado.guestRespondidas
      : estado.hostRespondidas
    : 0;

  const recarregarEstado = useCallback(async () => {
    if (!matchId) return null;
    try {
      const atual = await buscarEstado(matchId);
      setEstado(atual);
      return atual;
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar a partida.');
      setFase('erro');
      return null;
    }
  }, [matchId]);

  // O adversario respondeu alguma coisa: atualiza o placar de avanco.
  useAvisoDeRespostas(matchId || null, () => void recarregarEstado());

  /** Carrega a pergunta `n` e (re)inicia o cronometro da tela. */
  const abrirPergunta = useCallback(
    async (n: number) => {
      try {
        const proxima = await buscarPergunta(matchId, n);
        setPergunta(proxima);
        setResultado(null);
        setEscolha('');
        jaRespondeu.current = false;
        inicioDaPergunta.current = Date.now();
        setRestanteMs(TEMPO_LIMITE_MS);
        setFase('perguntando');
      } catch (falha) {
        setErro(falha instanceof Error ? falha.message : 'Não foi possível abrir a pergunta.');
        setFase('erro');
      }
    },
    [matchId],
  );

  const responder = useCallback(
    async (valor: string) => {
      if (!pergunta || jaRespondeu.current) return;
      jaRespondeu.current = true;
      setEnviando(true);
      try {
        const r = await responderPergunta(matchId, pergunta.num, valor);
        setResultado(r);
        setMeusPontos((total) => total + r.ganhos);
        setFase('respondida');
        void recarregarEstado();
      } catch (falha) {
        setErro(falha instanceof Error ? falha.message : 'Não foi possível enviar a resposta.');
        setFase('erro');
      } finally {
        setEnviando(false);
      }
    },
    [matchId, pergunta, recarregarEstado],
  );

  /* --- inicializacao ---------------------------------------------------- */
  useEffect(() => {
    if (!matchId) {
      setErro('Nenhuma partida informada.');
      setFase('erro');
      return;
    }
    let ativo = true;
    (async () => {
      const atual = await buscarEstado(matchId).catch((falha: unknown) => {
        if (!ativo) return null;
        setErro(falha instanceof Error ? falha.message : 'Partida não encontrada.');
        setFase('erro');
        return null;
      });
      if (!ativo || !atual) return;

      setEstado(atual);
      if (atual.status === 'encerrada') {
        setFase('fim');
        return;
      }
      if (atual.status !== 'ativa') {
        setErro(
          atual.status === 'convite'
            ? 'Esse convite ainda não foi aceito.'
            : 'Essa partida não está mais em andamento.',
        );
        setFase('erro');
        return;
      }

      const jaFeitas = atual.hostId === user?.id ? atual.hostRespondidas : atual.guestRespondidas;
      if (jaFeitas >= atual.total) {
        setFase('aguardando');
        return;
      }
      await abrirPergunta(jaFeitas + 1);
    })();

    return () => {
      ativo = false;
    };
    // `abrirPergunta` e estavel o bastante; rodar so na entrada e o desejado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, user?.id]);

  /* --- cronometro ------------------------------------------------------- */
  useEffect(() => {
    if (fase !== 'perguntando') return;
    const timer = window.setInterval(() => {
      const decorrido = Date.now() - inicioDaPergunta.current;
      const resta = Math.max(0, TEMPO_LIMITE_MS - decorrido);
      setRestanteMs(resta);
      // Estourou: manda resposta vazia. Quem decide que vale 0 e o servidor.
      if (resta === 0) void responder('');
    }, 100);
    return () => window.clearInterval(timer);
  }, [fase, responder]);

  /* --- aguardando o adversario ------------------------------------------ */
  useEffect(() => {
    if (fase !== 'aguardando') return;
    let ativo = true;

    const tentar = async () => {
      const fim = await finalizarPartida(matchId).catch(() => null);
      if (!ativo) return;
      if (fim && fim.status === 'encerrada') {
        await recarregarEstado();
        setFase('fim');
      }
    };

    void tentar();
    const timer = window.setInterval(tentar, 3000);
    return () => {
      ativo = false;
      window.clearInterval(timer);
    };
  }, [fase, matchId, recarregarEstado]);

  /* --- tags de duelo ao terminar ----------------------------------------
   * As estatisticas so existem depois que o servidor fecha a partida, entao
   * e aqui que conferimos se alguma tag de PvP foi conquistada.
   * -------------------------------------------------------------------- */
  useEffect(() => {
    if (fase !== 'fim' || !user?.id) return;
    let ativo = true;

    buscarEstatisticas(user.id)
      .then(async (stats) => {
        if (!ativo) return;
        const novas = await sincronizarPvp(stats.vitorias, stats.vitoriasPorTema);
        novas.forEach((tag, indice) => {
          window.setTimeout(() => {
            showToast({
              icon: tag.icon,
              title: `Nova tag: ${tag.name}`,
              description: `${tag.description} Escolha ela no seu perfil.`,
              tone: 'blue',
            });
          }, 500 * (indice + 1));
        });
      })
      .catch(() => {
        /* estatisticas sao um extra; a tela de resultado ja apareceu */
      });

    return () => {
      ativo = false;
    };
  }, [fase, user?.id, sincronizarPvp, showToast]);

  const avancar = async () => {
    if (!pergunta || !estado) return;
    if (pergunta.num >= pergunta.total) {
      setFase('aguardando');
      return;
    }
    await abrirPergunta(pergunta.num + 1);
  };

  /* --- telas ------------------------------------------------------------ */

  if (fase === 'carregando') {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/5" />;
  }

  if (fase === 'erro') {
    return (
      <div className="space-y-4">
        <Link href="/amigos" className="cq-tap text-sm font-semibold text-slate-400 hover:text-mint-300">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
        </Link>
        <Card className="border-rose-500/40 text-center">
          <span className="text-4xl" aria-hidden>
            ⚔️
          </span>
          <CardTitle className="mt-4">Não deu para continuar o duelo</CardTitle>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">{erro}</p>
          <div className="mt-6">
            <LinkButton href="/amigos">Voltar para Amigos</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  if (fase === 'fim' && estado) {
    const meus = souHost ? estado.hostPontos : estado.guestPontos;
    const dele = souHost ? estado.guestPontos : estado.hostPontos;
    const venci = estado.winnerId === user?.id;
    const empatou = estado.winnerId === null;

    return (
      <div className="space-y-6">
        <Card
          className={cn(
            'text-center',
            venci
              ? 'border-mint-500/50 bg-gradient-to-br from-mint-600/15 to-transparent'
              : empatou
                ? 'border-white/15'
                : 'border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-transparent',
          )}
        >
          <span className="text-5xl" aria-hidden>
            {venci ? '🏆' : empatou ? '🤝' : '💪'}
          </span>
          <CardTitle className="mt-4 text-2xl">
            {venci ? 'Você venceu!' : empatou ? 'Empate!' : 'Você perdeu essa'}
          </CardTitle>
          <p className="mt-2 text-sm text-slate-400">
            Tema: {nomeDoTema(estado.tema)} · {estado.total} perguntas
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-slate-500">Você</p>
              <p className="text-3xl font-extrabold text-mint-300">{meus}</p>
            </div>
            <span className="text-2xl text-slate-600" aria-hidden>
              ×
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-slate-500">Adversário</p>
              <p className="text-3xl font-extrabold text-slate-300">{dele}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/amigos">
              <Swords className="h-4 w-4" aria-hidden />
              Jogar de novo
            </LinkButton>
            <LinkButton href="/perfil" variant="ghost">
              Ver minhas estatísticas
            </LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  if (fase === 'aguardando' && estado) {
    return (
      <Card className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-mint-400" aria-hidden />
        <CardTitle className="mt-4">Você terminou!</CardTitle>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          Somou <strong className="text-mint-300">{meusPontos} pontos</strong>. Agora é esperar o
          adversário responder — ele está na pergunta {Math.min(deleRespondidas + 1, estado.total)} de{' '}
          {estado.total}.
        </p>
        <div className="mx-auto mt-6 max-w-xs">
          <ProgressBar value={deleRespondidas / estado.total} />
        </div>
      </Card>
    );
  }

  if (!pergunta || !estado) return <div className="h-64 animate-pulse rounded-2xl bg-white/5" />;

  const segundos = Math.ceil(restanteMs / 1000);
  const acabando = restanteMs <= 5000;

  return (
    <div className="space-y-4">
      {/* Cabecalho do duelo ------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-electric-500/15 via-night-900/60 to-mint-600/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Label>Duelo · {nomeDoTema(estado.tema)}</Label>
            <p className="mt-1 text-lg font-extrabold text-white">
              Pergunta {pergunta.num} de {pergunta.total}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="mint">{meusPontos} pts</Pill>
            <Pill tone={acabando ? 'rose' : 'neutral'}>
              <Timer className="h-3.5 w-3.5" aria-hidden />
              {segundos}s
            </Pill>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar
            value={restanteMs / TEMPO_LIMITE_MS}
            tone={acabando ? 'amber' : 'mint'}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Você: {minhasRespondidas}/{estado.total} · Adversário: {deleRespondidas}/{estado.total}
        </p>
      </section>

      {/* Pergunta ----------------------------------------------------- */}
      <Card>
        <MarkdownLite source={pergunta.enunciado} className="text-[15px]" />

        {pergunta.tipo === 'multiple_choice' && pergunta.alternativas && (
          <div className="mt-5 space-y-2">
            {pergunta.alternativas.map((opcao) => {
              const selecionada = escolha === opcao;
              const respondida = fase === 'respondida';
              const certa = respondida && resultado?.gabarito === opcao;
              const erradaEscolhida = respondida && selecionada && !resultado?.certa;

              return (
                <button
                  key={opcao}
                  type="button"
                  disabled={respondida || enviando}
                  onClick={() => setEscolha(opcao)}
                  className={cn(
                    'flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                    certa
                      ? 'border-mint-500/60 bg-mint-500/10 text-mint-100'
                      : erradaEscolhida
                        ? 'border-rose-500/60 bg-rose-500/10 text-rose-100'
                        : selecionada
                          ? 'border-electric-400/60 bg-electric-400/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25',
                    respondida && !certa && !erradaEscolhida && 'opacity-50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                      selecionada || certa ? 'border-current' : 'border-white/25',
                    )}
                  >
                    {(selecionada || certa) && <span className="h-2 w-2 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 font-mono text-[13px]">{opcao}</span>
                </button>
              );
            })}
          </div>
        )}

        {pergunta.tipo === 'fill_blank' && (
          <input
            type="text"
            value={escolha}
            disabled={fase === 'respondida' || enviando}
            autoFocus
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            aria-label="Sua resposta"
            onChange={(evento) => setEscolha(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' && escolha.trim()) void responder(escolha);
            }}
            placeholder="digite o que falta"
            className="mt-5 w-full rounded-xl border border-white/10 bg-night-950/70 px-4 py-3 font-mono text-base text-white placeholder:text-slate-600 focus:border-mint-400/60 focus:outline-none disabled:opacity-60"
          />
        )}

        {/* Feedback ------------------------------------------------- */}
        {fase === 'respondida' && resultado && (
          <div
            className={cn(
              'mt-5 rounded-xl border p-4',
              resultado.certa
                ? 'border-mint-500/40 bg-mint-500/[0.07]'
                : 'border-rose-500/40 bg-rose-500/[0.07]',
            )}
          >
            <p className="flex flex-wrap items-center gap-2 font-bold text-white">
              {resultado.certa ? (
                <>
                  <Check className="h-5 w-5 shrink-0 text-mint-400" aria-hidden />
                  Certa! +{resultado.ganhos} pontos
                </>
              ) : (
                <>
                  <X className="h-5 w-5 shrink-0 text-rose-400" aria-hidden />
                  Errou — a resposta era{' '}
                  <code className="min-w-0 break-all font-mono text-mint-300">
                    {resultado.gabarito}
                  </code>
                </>
              )}
            </p>
            {resultado.explicacao && (
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{resultado.explicacao}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Tempo: {(resultado.tempoMs / 1000).toFixed(1)}s
            </p>
          </div>
        )}

        {/* Acao ----------------------------------------------------- */}
        <div className="mt-5">
          {fase === 'respondida' ? (
            <Button className="w-full" onClick={avancar}>
              {pergunta.num >= pergunta.total ? 'Ver resultado' : 'Próxima pergunta'}
            </Button>
          ) : (
            <Button
              className="w-full"
              loading={enviando}
              disabled={!escolha.trim()}
              onClick={() => void responder(escolha)}
            >
              Responder
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function DueloPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/5" />}>
        <DueloContent />
      </Suspense>
    </AppShell>
  );
}
