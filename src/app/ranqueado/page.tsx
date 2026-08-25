'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Clock,
  Info,
  ListOrdered,
  Lock,
  Shield,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PatamarBadge } from '@/components/ranked/PatamarBadge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { nomeDoTema } from '@/content/pvp-temas';
import { botDoElo } from '@/lib/ranked/bots';
import {
  PATAMAR_TEMAS_COMPLETOS,
  temTodosOsTemas,
  temasDoPatamar,
} from '@/lib/ranked/temas';
import {
  buscarEstadoRanqueada,
  buscarHistoricoRanqueada,
  iniciarRanqueada,
} from '@/lib/ranked/api';
import {
  ESTILO_PATAMAR,
  PATAMARES,
  eloInicialDoPatamar,
  ganhoDaVitoria,
  nomeDaDivisao,
  patamarDaDivisao,
  perdaDaDerrota,
  progressoNaDivisao,
} from '@/lib/ranked/patamares';
import {
  descricaoDoPrazo,
  type EstadoRanqueada,
  type TemporadaPassada,
} from '@/lib/ranked/tipos';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { cn } from '@/lib/cn';

/**
 * Tela do modo ranqueado.
 *
 * Aqui a pessoa ve onde esta na escada, quanto falta para subir e contra quem
 * vai jogar - e comeca a partida. A partida em si roda na tela de duelo
 * (`/duelo`), que e a mesma da Fase 3: mudou o placar do fim, nao o jogo.
 */
function RanqueadoContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [estado, setEstado] = useState<EstadoRanqueada | null>(null);
  const [historico, setHistorico] = useState<TemporadaPassada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(false);

  const meuId = user?.id ?? '';

  const carregar = useCallback(async () => {
    if (!meuId) return;
    try {
      const [atual, passadas] = await Promise.all([
        buscarEstadoRanqueada(meuId),
        buscarHistoricoRanqueada(meuId),
      ]);
      setEstado(atual);
      setHistorico(passadas);
      setErro(
        atual
          ? null
          : 'A ranqueada ainda não foi criada no banco. Rode a migração 0006 no Supabase.',
      );
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar a ranqueada.');
    } finally {
      setCarregando(false);
    }
  }, [meuId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const jogar = async () => {
    if (!meuId) return;
    setIniciando(true);
    try {
      const matchId = await iniciarRanqueada(meuId);
      router.push(`/duelo/?m=${encodeURIComponent(matchId)}`);
    } catch (falha) {
      showToast({
        icon: '⚠️',
        title: 'Não deu para começar',
        description: falha instanceof Error ? falha.message : 'Tente de novo em instantes.',
        tone: 'rose',
      });
      setIniciando(false);
    }
  };

  if (carregando) {
    return <div className="h-72 animate-pulse rounded-2xl bg-white/5" />;
  }

  if (!estado) {
    return (
      <Card className="border-amber-400/40 text-center">
        <span className="text-4xl" aria-hidden>
          🛡️
        </span>
        <CardTitle className="mt-4">Ranqueada ainda não está disponível</CardTitle>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">{erro}</p>
      </Card>
    );
  }

  const patamar = PATAMARES[patamarDaDivisao(estado.divisao)];
  const estilo = ESTILO_PATAMAR[patamar];
  const progresso = progressoNaDivisao(estado.elo);
  const ganho = ganhoDaVitoria(estado.elo);
  const perda = perdaDaDerrota(estado.elo);
  const adversario = botDoElo(estado.elo);
  const assuntos = temasDoPatamar(patamarDaDivisao(estado.divisao));
  const todosOsAssuntos = temTodosOsTemas(patamarDaDivisao(estado.divisao));
  const eloDoMitico = eloInicialDoPatamar(PATAMAR_TEMAS_COMPLETOS);

  return (
    <div className="space-y-4">
      {/* Onde estou ------------------------------------------------------ */}
      <section className={cn('cq-card bg-gradient-to-br p-5 sm:p-6', estilo.cartao)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label>
            <Shield className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
            Temporada {estado.temporada.numero}
          </Label>
          <Pill tone="neutral">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {descricaoDoPrazo(estado.temporada)}
          </Pill>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className={cn('text-3xl font-extrabold leading-tight sm:text-4xl', estilo.texto)}>
              <span className="mr-2" aria-hidden>
                {estilo.emoji}
              </span>
              {nomeDaDivisao(estado.divisao)}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {estado.elo} de elo · melhor da temporada: {nomeDaDivisao(estado.picoDivisao)}
            </p>
          </div>
          {/* Sem `shrink-0` aqui: com a fonte ampliada do Android estes dois
              selos passam da largura da tela, e `shrink-0` impede o container
              de encolher - entao eles nao quebram linha e o segundo some na
              borda. Mesmo defeito que cortava o "Perfil" na barra de baixo. */}
          <div className="flex min-w-0 flex-wrap gap-2">
            <Pill tone="mint">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />+{ganho} por vitória
            </Pill>
            <Pill tone="rose">
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />−{perda} por derrota
            </Pill>
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar value={progresso.fracao} tone={estilo.barra} />
          <p className="mt-2 text-xs text-slate-500">
            {progresso.noTopo
              ? 'Você está no topo da escada: Mestre é o patamar mais alto e não tem sub-níveis.'
              : `Faltam ${progresso.faltam} de elo para ${nomeDaDivisao(estado.divisao + 1)}.`}
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          {progresso.noTopo
            ? 'Você não cai abaixo de Mestre enquanto a temporada durar. O elo continua contando para a sua posição no leaderboard.'
            : `Você não cai abaixo de ${ESTILO_PATAMAR[patamar].nome} 1 enquanto a temporada durar — o patamar conquistado não se perde, só o sub-nível.`}
        </p>
      </section>

      {/* Adversario ------------------------------------------------------ */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>
            <Bot className="mr-2 inline h-5 w-5 text-electric-400" aria-hidden />
            Seu próximo adversário
          </CardTitle>
          <PatamarBadge divisao={estado.divisao} tamanho="sm" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
            🤖
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold text-white">{adversario.nome}</p>
            <p className="text-sm text-slate-400">
              Acerta cerca de {Math.round(adversario.acerto * 100)}% e responde entre{' '}
              {(adversario.msMin / 1000).toFixed(1)}s e {(adversario.msMax / 1000).toFixed(1)}s.
            </p>
          </div>
        </div>

        <p className="mt-4 flex gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-slate-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span>
            Enquanto não houver gente ranqueada suficiente para formar dupla na hora, a partida é
            contra um adversário da casa. Ele fica mais difícil a cada patamar — e{' '}
            <strong className="text-slate-300">joga no servidor</strong>, com a mesma pontuação e o
            mesmo cronômetro que você.
          </span>
        </p>
      </Card>

      {/* Assuntos e comecar ---------------------------------------------- */}
      <Card>
        <CardTitle>
          <ListOrdered className="mr-2 inline h-5 w-5 text-mint-400" aria-hidden />
          O que cai nesta partida
        </CardTitle>
        <p className="mt-1 text-sm text-slate-400">
          5 perguntas cronometradas. Quem acerta mais — e mais rápido — vence.{' '}
          <strong className="text-slate-300">Você não escolhe o assunto</strong>: quem decide é o
          seu patamar.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {assuntos.map((slug) => (
            <Pill key={slug} tone="mint">
              {nomeDoTema(slug)}
            </Pill>
          ))}
        </div>

        {!todosOsAssuntos && (
          <p className="mt-4 flex gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-slate-400">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <span>
              A partir do <strong className="text-slate-200">Mítico 1</strong> ({eloDoMitico} de
              elo) entram também Java, C# e C++. Até lá a ranqueada cobra só o que a trilha ensina —
              ou vai ensinar em seguida.
            </span>
          </p>
        )}

        {todosOsAssuntos && (
          <p className="mt-4 flex gap-2 rounded-xl border border-violet-400/30 bg-violet-500/[0.07] px-3 py-2.5 text-xs leading-relaxed text-violet-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Do Mítico para cima valem as seis linguagens. Daqui não dá mais para se apoiar só no
              que você estudou na trilha.
            </span>
          </p>
        )}

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2 text-xs leading-relaxed text-amber-200">
            <strong>Modo demonstração:</strong> sem servidor, a temporada e o elo ficam guardados
            neste aparelho. As regras são as mesmas.
          </p>
        )}

        <div className="mt-5">
          <Button className="w-full" size="lg" loading={iniciando} onClick={() => void jogar()}>
            <Shield className="h-5 w-5" aria-hidden />
            Jogar partida ranqueada
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500">
            Uma partida por vez. Sair no meio conta como derrota depois de 5 minutos.
          </p>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 text-center">
          <LinkButton href="/ranking" size="sm" variant="ghost">
            <ListOrdered className="h-4 w-4" aria-hidden />
            Ver o leaderboard da temporada
          </LinkButton>
        </div>
      </Card>

      {/* Temporadas passadas --------------------------------------------- */}
      {historico.length > 0 && (
        <Card>
          <CardTitle>Temporadas passadas</CardTitle>
          <p className="mt-1 text-sm text-slate-400">
            Toda temporada zera para Bronze 1, mas o que você alcançou fica registrado.
          </p>
          <ul className="mt-4 space-y-2">
            {historico.map((temporada) => (
              <li
                key={temporada.numero}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <span className="min-w-0 text-sm font-semibold text-slate-300">
                  Temporada {temporada.numero}
                </span>
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <PatamarBadge divisao={temporada.picoDivisao} tamanho="sm" />
                  <span className="text-xs text-slate-500">
                    {temporada.vitorias}V · {temporada.derrotas}D em {temporada.partidas}{' '}
                    {temporada.partidas === 1 ? 'partida' : 'partidas'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Como funciona --------------------------------------------------- */}
      <Card>
        <CardTitle>Como a escada funciona</CardTitle>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            São <strong className="text-slate-200">7 patamares</strong>, do Bronze ao Mestre. Os
            seis primeiros têm 3 sub-níveis (Bronze 1, Bronze 2, Bronze 3, Prata 1…);{' '}
            <strong className="text-slate-200">Mestre é um só</strong>, sem sub-níveis, e é o topo
            absoluto. Cada divisão custa 100 de elo.
          </li>
          <li>
            Dentro do Mestre o elo continua subindo e descendo — é ele que define a sua posição no
            leaderboard —, mas não existe mais divisão para alcançar.
          </li>
          <li>
            <strong className="text-slate-200">O assunto acompanha o patamar.</strong> Até Diamante
            3 caem Python, Lógica e JavaScript; do Mítico 1 em diante entram Java, C# e C++
            também.
          </li>
          <li>
            Quanto mais alto o patamar,{' '}
            <strong className="text-slate-200">menos elo cada vitória vale</strong>: 40 no Bronze,
            10 no Mestre. Subir de Bronze 1 para Bronze 2 leva 3 vitórias; de Lendário 2 para
            Lendário 3, 7.
          </li>
          <li>
            A temporada dura <strong className="text-slate-200">15 dias</strong>. No fim, todo mundo
            volta para Bronze 1 e o que você alcançou vira histórico.
          </li>
          <li>
            O elo é calculado <strong className="text-slate-200">no servidor</strong>, a partir das
            respostas gravadas. O aplicativo não tem como enviar pontuação nenhuma.
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default function RanqueadoPage() {
  return (
    <AppShell>
      <RanqueadoContent />
    </AppShell>
  );
}
