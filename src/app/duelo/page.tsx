'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, EyeOff, Loader2, Lock, Shield, Swords, Timer, TrendingDown, TrendingUp, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { MarkdownLite } from '@/components/content/MarkdownLite';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill, ProgressBar } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { useToast } from '@/components/ui/Toast';
import { useAvisoDeRespostas } from '@/lib/presenca';
import {
  abandonarPartida,
  buscarEstado,
  buscarEstatisticas,
  buscarPergunta,
  finalizarPartida,
  responderPergunta,
} from '@/lib/pvp/api';
import { TEMPO_LIMITE_MS } from '@/lib/pvp/regras';
import {
  ausenciaPunivel,
  avisoDeAusencia,
  avisoDeRelogio,
  ehAbandono,
} from '@/lib/pvp/ausencia';
import { useTravarNavegacao } from '@/lib/trava-de-partida';
import { nomeDoTema } from '@/content/pvp-temas';
import { PatamarBadge } from '@/components/ranked/PatamarBadge';
import { buscarEstadoRanqueada, buscarResultadoRanqueado } from '@/lib/ranked/api';
import { nomeDaDivisao } from '@/lib/ranked/patamares';
import { patamarMaximoAlcancado, type ResultadoRanqueado } from '@/lib/ranked/tipos';
import type { EstadoPartida, PerguntaPvp, ResultadoResposta } from '@/lib/pvp/tipos';
import { cn } from '@/lib/cn';

type Fase = 'carregando' | 'perguntando' | 'respondida' | 'aguardando' | 'fim' | 'erro';

function DueloContent() {
  const parametros = useSearchParams();
  const { user } = useAuth();
  const { sincronizarPvp, sincronizarRanqueada, revisarConquistas } = usePlayer();
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
  // So preenchido em partida ranqueada: quanto elo mudou.
  const [ranqueada, setRanqueada] = useState<ResultadoRanqueado | null>(null);

  const inicioDaPergunta = useRef<number>(0);
  // Evita responder duas vezes quando o tempo estoura junto com o clique.
  const jaRespondeu = useRef(false);

  /* --- troca de aba ------------------------------------------------------
   * Ver `@/lib/pvp/ausencia` para as regras e para o porque dos numeros.
   * Aqui ficam so o instante da saida, o contador da partida e o aviso que
   * aparece na volta.
   * -------------------------------------------------------------------- */
  const saiuEm = useRef<number | null>(null);
  const ausencias = useRef(0);
  const [aviso, setAviso] = useState<{ texto: string; grave: boolean } | null>(null);

  /*
   * A trava vale enquanto o cronometro corre - e SO enquanto ele corre.
   *
   * `perguntando` e `respondida` sao as fases em que sair e voltar seria uma
   * pausa de graca. `aguardando` fica de fora de proposito: ali a pessoa ja
   * respondeu tudo, nao ha nada a ganhar saindo, e o adversario pode demorar
   * ate o limite de 5 minutos do servidor - prender alguem nessa tela seria
   * punir quem terminou primeiro.
   */
  useTravarNavegacao(fase === 'perguntando' || fase === 'respondida');

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

        /*
         * O cronometro comeca onde o SERVIDOR disse que comecou.
         *
         * `pvp_pergunta` carimba a primeira entrega e nao mexe nesse carimbo
         * nas seguintes - entao sair da tela e voltar reentrega a pergunta com
         * o tempo que sobrou, e nao com 20 s de novo. Antes a tela usava o
         * `Date.now()` do aparelho e mostrava o relogio cheio, enquanto o
         * servidor continuava contando desde o inicio: a pessoa respondia com
         * calma e levava 0 sem entender.
         *
         * Sem o carimbo (migracao 0011 ainda nao aplicada) cai no relogio
         * local, que e o comportamento antigo.
         */
        const carimbo = proxima.comecouEm ? Date.parse(proxima.comecouEm) : Number.NaN;
        inicioDaPergunta.current = Number.isFinite(carimbo) ? carimbo : Date.now();

        // A ausencia foi cobrada na pergunta anterior; o aviso nao acompanha.
        saiuEm.current = null;
        setAviso(null);
        setRestanteMs(Math.max(0, TEMPO_LIMITE_MS - (Date.now() - inicioDaPergunta.current)));
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

  /* --- troca de partida --------------------------------------------------
   *
   * Nada de uma partida pode sobrar na seguinte.
   *
   * Ir para outra partida nem sempre desmonta esta tela (a rota e a mesma, so
   * muda o `?m=`), e ai `useState`/`useRef` sobrevivem. Foi assim que a
   * pontuacao da partida anterior apareceu na pergunta 1 da seguinte - e que o
   * contador de ausencias, herdado, fez uma partida GANHA exibir a mensagem de
   * abandono.
   *
   * Este efeito roda antes dos outros que dependem de `matchId`, entao o
   * estado ja esta limpo quando a partida nova carrega.
   * -------------------------------------------------------------------- */
  useEffect(() => {
    setMeusPontos(0);
    setPergunta(null);
    setResultado(null);
    setEscolha('');
    setRanqueada(null);
    setAviso(null);
    setErro(null);
    setRestanteMs(TEMPO_LIMITE_MS);
    ausencias.current = 0;
    saiuEm.current = null;
    jaRespondeu.current = false;
    inicioDaPergunta.current = 0;
  }, [matchId]);

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

  /* --- cronometro -------------------------------------------------------
   *
   * Uma batida por SEGUNDO, e nao dez.
   *
   * A versao anterior rodava a cada 100 ms e chamava `setRestanteMs` toda vez:
   * dez renderizacoes da arvore inteira por segundo, so para o texto "12s"
   * mudar uma vez. Num celular isso e o bastante para a rolagem engasgar.
   *
   * Quem desenha o movimento continuo agora e a barra, por animacao CSS de
   * `transform` (ver `@keyframes cq-cronometro`) - a GPU cuida dela na taxa do
   * aparelho, sem JavaScript por quadro. Ao JavaScript sobra o que so ele pode
   * fazer: contar os segundos e disparar o fim do tempo.
   *
   * O calculo continua sendo por relogio de parede, entao a aba escondida (que
   * o navegador congela) nao ganha tempo: ao voltar, o valor certo aparece
   * imediatamente.
   * -------------------------------------------------------------------- */
  useEffect(() => {
    if (fase !== 'perguntando') return;

    const bater = () => {
      const resta = Math.max(0, TEMPO_LIMITE_MS - (Date.now() - inicioDaPergunta.current));
      setRestanteMs(resta);
      // Estourou: manda resposta vazia. Quem decide que vale 0 e o servidor.
      if (resta === 0) void responder('');
    };

    bater();
    const timer = window.setInterval(bater, 1000);
    return () => window.clearInterval(timer);
  }, [fase, responder]);

  /* --- troca de aba ------------------------------------------------------
   *
   * Nao da para impedir a saida - nenhum site consegue. O que este efeito faz
   * e cobrar o preco quando a pessoa volta:
   *
   *   - o relogio ja correu (ele e calculado por `Date.now()`, e nao por
   *     contagem de ticks, entao o congelamento da aba escondida nao ajuda);
   *   - sumir por mais de 5 s custa a pergunta, que vai em branco;
   *   - na terceira vez a partida encerra como derrota, com o elo de sempre.
   *
   * Tudo acontece NA VOLTA, de proposito: enquanto a aba esta escondida o
   * navegador congela o JavaScript de qualquer jeito, e a partida nao pode
   * ficar parada esperando - o adversario continua jogando.
   * -------------------------------------------------------------------- */
  useEffect(() => {
    if (fase !== 'perguntando' && fase !== 'respondida') return;

    const aoTrocar = () => {
      if (document.visibilityState === 'hidden') {
        saiuEm.current = Date.now();
        return;
      }

      const saida = saiuEm.current;
      saiuEm.current = null;
      if (saida === null) return;

      const foraMs = Date.now() - saida;

      // Voltou rapido: nada e cobrado alem do tempo que ja correu sozinho.
      if (!ausenciaPunivel(foraMs)) {
        if (fase === 'perguntando') setAviso({ texto: avisoDeRelogio(foraMs), grave: false });
        return;
      }

      ausencias.current += 1;
      setAviso({ texto: avisoDeAusencia(foraMs, ausencias.current), grave: true });

      if (ehAbandono(ausencias.current)) {
        jaRespondeu.current = true;
        /*
         * Quem encerra a partida e o SERVIDOR.
         *
         * A versao anterior chamava `pvp_abandonar` e ia para a tela de fim de
         * qualquer jeito, inclusive quando a chamada falhava (a migracao 0010
         * ainda nao aplicada, por exemplo). O resultado era uma tela de fim
         * inventada, com o placar parcial e uma mensagem de abandono que o
         * banco nunca registrou. Agora so recarregamos o estado: se o servidor
         * encerrou, o proprio estado diz isso; se nao encerrou, a partida
         * continua e o erro aparece.
         */
        void abandonarPartida(matchId)
          .then(() => recarregarEstado())
          .then((atual) => {
            if (atual?.status === 'encerrada') setFase('fim');
          })
          .catch((falha: unknown) => {
            setAviso({
              texto:
                'Você saiu da aba vezes demais, mas não consegui encerrar a partida no servidor. ' +
                'Continue jogando — o resultado sai normalmente.',
              grave: true,
            });
            console.warn('[CodeQuest] abandono nao aplicado', falha);
          });
        return;
      }

      // A pergunta atual foi perdida: resposta em branco, que o servidor
      // pontua como zero. Se ela ja tinha sido respondida, nao ha o que fazer.
      if (fase === 'perguntando' && !jaRespondeu.current) void responder('');
    };

    document.addEventListener('visibilitychange', aoTrocar);
    return () => {
      document.removeEventListener('visibilitychange', aoTrocar);
      // Sair da pergunta com a aba escondida nao pode deixar a saida pendente
      // para ser cobrada na pergunta seguinte.
      saiuEm.current = null;
    };
  }, [fase, matchId, responder, recarregarEstado]);

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

  /* --- premios ao terminar -----------------------------------------------
   * Tanto o cartel de duelo quanto o elo so existem depois que o SERVIDOR
   * fecha a partida - por isso a conferencia acontece aqui, e nao no momento
   * em que a ultima resposta foi enviada.
   *
   * Ranqueada e amistoso premiam coisas diferentes de proposito: ranqueada
   * mexe em elo e conquistas de patamar; amistoso mexe no cartel 1v1 e nas
   * tags de duelo. Ver `pvp_finalizar` em `0006_ranqueado.sql`.
   * -------------------------------------------------------------------- */
  const ehRanqueada = estado?.modo === 'ranqueado';

  useEffect(() => {
    if (fase !== 'fim' || !user?.id || !estado) return;
    let ativo = true;

    if (ehRanqueada) {
      (async () => {
        const mudanca = await buscarResultadoRanqueado(user.id, matchId).catch(() => null);
        if (!ativo || !mudanca) return;
        setRanqueada(mudanca);

        const atual = await buscarEstadoRanqueada(user.id).catch(() => null);
        if (!ativo || !atual) return;

        // Os empates da ranqueada valem a medalha de empate tanto quanto os do
        // duelo entre amigos - o que nao se mistura sao as VITORIAS.
        const novas = await sincronizarRanqueada(patamarMaximoAlcancado(atual), atual.empates);

        /*
         * E o servidor confere o resto.
         *
         * `atual.empates` e so da temporada corrente: quem empatou numa
         * temporada passada nao apareceria aqui. `conquistas_reavaliar()`
         * (migracao 0010) olha o historico inteiro e concede o que faltou.
         */
        const revisadas = await revisarConquistas();
        const pendentes = [
          ...novas,
          ...revisadas.filter((c) => !novas.some((n) => n.id === c.id)),
        ];

        if (!ativo) return;
        pendentes.forEach((conquista, indice) => {
          window.setTimeout(() => {
            showToast({
              icon: conquista.icon,
              title: conquista.title,
              description: conquista.description,
              tone: 'amber',
            });
          }, 500 * (indice + 1));
        });
      })();

      return () => {
        ativo = false;
      };
    }

    buscarEstatisticas(user.id)
      .then(async (stats) => {
        if (!ativo) return;
        const novas = await sincronizarPvp(stats.vitorias, stats.vitoriasPorTema, stats.empates);
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
    // `estado` entra so pelo `modo`; o resto do objeto muda a cada sondagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fase,
    user?.id,
    ehRanqueada,
    matchId,
    sincronizarPvp,
    sincronizarRanqueada,
    revisarConquistas,
    showToast,
  ]);

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
      <div className="cq-page">
        <Link href="/amigos" className="cq-tap text-sm font-medium text-slate-400 hover:text-mint-300">
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

    // `meuDesfecho` vem do servidor e e a fonte da verdade. `winnerId` sozinho
    // nao serve na ranqueada: o bot nao tem perfil, entao quando ELE ganha o
    // campo fica nulo - e uma derrota apareceria como empate.
    const venci = estado.meuDesfecho
      ? estado.meuDesfecho === 'vitoria'
      : estado.winnerId === user?.id;
    const empatou = estado.meuDesfecho
      ? estado.meuDesfecho === 'empate'
      : estado.winnerId === null;
    const nomeDoAdversario = estado.adversario ?? 'Adversário';
    // Quem abandonou, segundo o servidor. Sem migracao 0011 vem nulo, e a tela
    // simplesmente nao fala em abandono - melhor calar do que inventar.
    const abandonei = Boolean(estado.abandonadaPor) && estado.abandonadaPor === user?.id;
    const subiu = ranqueada ? ranqueada.divisaoDepois > ranqueada.divisaoAntes : false;
    const caiu = ranqueada ? ranqueada.divisaoDepois < ranqueada.divisaoAntes : false;

    return (
      <div className="cq-page">
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
            {abandonei
              ? 'Partida encerrada por abandono'
              : venci
                ? 'Você venceu!'
                : empatou
                  ? 'Empate!'
                  : 'Você perdeu essa'}
          </CardTitle>
          <p className="mt-2 text-sm text-slate-400">
            {ehRanqueada
              ? `Ranqueada · ${estado.total} perguntas`
              : `Tema: ${nomeDoTema(estado.tema)} · ${estado.total} perguntas`}
          </p>

          {/*
            * O placar abaixo pode ate estar a favor: quem sai perde de todo
            * jeito, e a tela precisa dizer por que.
            *
            * A condicao vem do BANCO (`abandonada_por`), e nao de um contador
            * do navegador. O contador sobrevivia entre partidas e ja fez uma
            * partida ganha exibir esta mensagem.
            */}
          {abandonei && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-rose-200">
              Você saiu da partida antes do fim. O duelo foi encerrado como derrota, com a perda de
              elo normal.
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-slate-500">Você</p>
              <p className="text-3xl font-extrabold text-mint-300">{meus}</p>
            </div>
            <span className="text-2xl text-slate-600" aria-hidden>
              ×
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-widest text-slate-500">
                {nomeDoAdversario}
              </p>
              <p className="text-3xl font-extrabold text-slate-300">{dele}</p>
            </div>
          </div>

          {/* Elo -------------------------------------------------------- */}
          {ehRanqueada && ranqueada && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <PatamarBadge divisao={ranqueada.divisaoAntes} tamanho="sm" />
                <span
                  className={cn(
                    'flex items-center gap-1 text-lg font-extrabold',
                    ranqueada.delta > 0
                      ? 'text-mint-300'
                      : ranqueada.delta < 0
                        ? 'text-rose-300'
                        : 'text-slate-400',
                  )}
                >
                  {ranqueada.delta > 0 ? (
                    <TrendingUp className="h-4 w-4" aria-hidden />
                  ) : ranqueada.delta < 0 ? (
                    <TrendingDown className="h-4 w-4" aria-hidden />
                  ) : null}
                  {ranqueada.delta > 0 ? '+' : ''}
                  {ranqueada.delta} elo
                </span>
                {(subiu || caiu) && <PatamarBadge divisao={ranqueada.divisaoDepois} tamanho="sm" />}
              </div>

              <p className="mt-3 text-sm text-slate-400">
                {subiu ? (
                  <>
                    Subiu para{' '}
                    <strong className="text-mint-300">{nomeDaDivisao(ranqueada.divisaoDepois)}</strong>
                    !
                  </>
                ) : caiu ? (
                  <>
                    Caiu para{' '}
                    <strong className="text-rose-300">{nomeDaDivisao(ranqueada.divisaoDepois)}</strong>
                    .
                  </>
                ) : empatou ? (
                  'Empate não mexe no elo.'
                ) : ranqueada.delta === 0 ? (
                  /*
                   * Delta zero SEM empate quer dizer que a derrota bateu no
                   * piso do patamar. Antes a tela deduzia "empate" so pelo
                   * delta, e quem perdia estando no piso via "Empate não mexe
                   * no elo" logo abaixo de "Você perdeu essa".
                   */
                  <>
                    Você está no piso de{' '}
                    <strong className="text-slate-200">
                      {nomeDaDivisao(ranqueada.divisaoDepois)}
                    </strong>
                    : o patamar conquistado não se perde, então a derrota não tirou elo.
                  </>
                ) : (
                  <>
                    Agora com <strong className="text-slate-200">{ranqueada.eloDepois} de elo</strong>{' '}
                    em {nomeDaDivisao(ranqueada.divisaoDepois)}.
                  </>
                )}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ehRanqueada ? (
              <LinkButton href="/ranqueado">
                <Shield className="h-4 w-4" aria-hidden />
                Próxima ranqueada
              </LinkButton>
            ) : (
              <LinkButton href="/amigos">
                <Swords className="h-4 w-4" aria-hidden />
                Jogar de novo
              </LinkButton>
            )}
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
          Somou <strong className="text-mint-300">{meusPontos} pontos</strong>. Agora é esperar{' '}
          {estado.adversario ?? 'o adversário'} responder — está na pergunta{' '}
          {Math.min(deleRespondidas + 1, estado.total)} de {estado.total}.
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

  /*
   * De onde a barra parte e quanto tempo ela leva.
   *
   * Calculado a partir do carimbo do servidor, e nao do estado que a batida de
   * 1 s atualiza: assim a animacao ja nasce no lugar certo, sem esperar a
   * primeira batida.
   */
  const msNoInicio = Math.max(
    0,
    TEMPO_LIMITE_MS - (Date.now() - (inicioDaPergunta.current || Date.now())),
  );
  const fracaoInicial = msNoInicio / TEMPO_LIMITE_MS;

  return (
    <div className="cq-page">
      {/*
        * Aviso de troca de aba.
        *
        * Sem ele, a pergunta ir a zero sozinha parece defeito do aplicativo -
        * a pessoa nao liga uma coisa a outra. `role="alert"` porque isso
        * mudou o resultado sem a pessoa ter feito nada na tela.
        */}
      {aviso && (
        <div
          role="alert"
          className={cn(
            'flex items-start gap-3 rounded-2xl border p-4 text-sm',
            aviso.grave
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
              : 'border-amber-400/30 bg-amber-400/10 text-amber-100',
          )}
        >
          <EyeOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p className="min-w-0 leading-relaxed">{aviso.texto}</p>
        </div>
      )}

      {/* Cabecalho do duelo ------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-electric-500/15 via-night-900/60 to-mint-600/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {/* Na ranqueada o `tema` guarda o POOL que valeu (ver
                `src/lib/ranked/temas.ts`), nao um assunto do seletor - entao
                nao ha nome de tema para mostrar aqui. */}
            <Label>
              {estado.modo === 'ranqueado' ? 'Ranqueada' : `Duelo · ${nomeDoTema(estado.tema)}`}
            </Label>
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
          {/*
            * Barra propria, e nao o `ProgressBar` comum: aqui o valor muda
            * continuamente, e o componente compartilhado anima `width` (que
            * refaz o layout a cada quadro). Esta anima `transform`, que a GPU
            * resolve sozinha.
            *
            * O `key` reinicia a animacao a cada pergunta; a duracao e o tempo
            * que REALMENTE resta, e `--cq-inicio` e a fracao de onde ela parte
            * (voltar para uma pergunta ja comecada nao devolve barra cheia).
            */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/5">
            <div
              key={`${pergunta.num}-${inicioDaPergunta.current}`}
              className={cn(
                'h-full origin-left rounded-full bg-gradient-to-r',
                acabando ? 'from-amber-400 to-orange-500' : 'from-mint-500 to-aqua-400',
              )}
              style={{
                '--cq-inicio': fracaoInicial,
                animation: `cq-cronometro ${msNoInicio}ms linear forwards`,
              } as React.CSSProperties}
            />
          </div>
        </div>

        <p className="mt-3 truncate cq-muted">
          Você: {minhasRespondidas}/{estado.total} · {estado.adversario ?? 'Adversário'}:{' '}
          {deleRespondidas}/{estado.total}
        </p>

        {/* Sem esta linha, a navegacao apagada parece defeito. */}
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
          <Lock className="h-3 w-3 shrink-0" aria-hidden />
          Navegação bloqueada até o fim da partida — o relógio não para.
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
            <p className="mt-2 cq-muted">
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
