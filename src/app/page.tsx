'use client';

import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { LinkButton } from '@/components/ui/Button';
import { Card, Pill } from '@/components/ui/Card';
import { CodeBlock } from '@/components/content/CodeBlock';
import { useAuth } from '@/lib/auth/AuthProvider';
import { languages } from '@/content';

const problemas = [
  { titulo: 'Conceitos abstratos', texto: 'Ideias que não têm representação visual imediata.' },
  { titulo: 'Evolução invisível', texto: 'Sem métricas claras, o aluno não percebe o próprio progresso.' },
  { titulo: 'Erros frequentes', texto: 'Exercícios que frustram antes de ensinar, sem feedback adequado.' },
  { titulo: 'Conteúdo complexo', texto: 'Materiais que não foram pensados para iniciantes absolutos.' },
  { titulo: 'Falta de motivação', texto: 'Dificuldade em manter uma rotina consistente de estudos.' },
];

const gamificacao = [
  { icone: '⭐', titulo: 'XP', texto: 'Pontos de experiência ganhos a cada lição concluída.' },
  { icone: '🔥', titulo: 'Streak', texto: 'Sequência de dias consecutivos de estudo.' },
  { icone: '🏆', titulo: 'Conquistas', texto: 'Medalhas desbloqueadas por marcos de aprendizagem.' },
  { icone: '🎯', titulo: 'Missões', texto: 'Objetivos de curto prazo para manter o foco.' },
  { icone: '📈', titulo: 'Níveis', texto: 'Progressão visível conforme o aluno avança.' },
  { icone: '🥇', titulo: 'Ranking', texto: 'Comparação amigável entre estudantes da plataforma.' },
];

const jornada = [
  { numero: '01', icone: '🐣', titulo: 'Fundamentos' },
  { numero: '02', icone: '📦', titulo: 'Variáveis' },
  { numero: '03', icone: '🔀', titulo: 'Condicionais' },
  { numero: '04', icone: '🔁', titulo: 'Repetições' },
  { numero: '05', icone: '⚙️', titulo: 'Funções' },
  { numero: '06', icone: '🧩', titulo: 'Desafios' },
  { numero: '07', icone: '🏆', titulo: 'Projeto final' },
];

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-dvh">
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-night-950/80 backdrop-blur cq-safe-top">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <LinkButton href="/dashboard" size="sm">
                Ir para o dashboard <ArrowRight className="h-4 w-4" />
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Entrar
                </LinkButton>
                <LinkButton href="/cadastro" size="sm">
                  Começar grátis
                </LinkButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="min-w-0 animate-fade-up">
            <Pill tone="mint">
              <Sparkles className="h-3.5 w-3.5" /> Projeto Integrador
            </Pill>

            <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Aprenda a programar
              <br />
              <span className="cq-gradient-text">jogando de verdade</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              O CodeQuest transforma o aprendizado introdutório de programação em uma jornada
              gamificada: você aprende o conceito, resolve o desafio no editor e vê seu progresso
              crescer em XP, níveis, streak e conquistas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={user ? '/dashboard' : '/cadastro'} size="lg">
                {user ? 'Continuar estudando' : 'Começar agora — é grátis'}
                <ArrowRight className="h-5 w-5" />
              </LinkButton>
              <LinkButton href="/ranking" variant="secondary" size="lg">
                Ver o ranking
              </LinkButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-mint-400" /> Python roda no seu navegador
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-mint-400" /> Sem instalar nada
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-mint-400" /> 100% gratuito
              </span>
            </div>
          </div>

          {/* Amostra da tela de lição, como no pitch */}
          <Card className="animate-fade-up border-mint-500/20 bg-night-900/80">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              🎯 Desafio
            </div>
            <p className="text-sm text-slate-300">
              Crie um programa que informe se uma pessoa é maior de idade.
            </p>

            <CodeBlock
              className="mt-4"
              copyable={false}
              code={'idade = int(input("Digite sua idade: "))\nif idade >= 18:\n    print("Maior de idade")'}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-mint-500/40 bg-mint-500/[0.08] p-3">
                <p className="text-lg font-extrabold text-mint-300">+100 XP</p>
                <p className="text-xs text-slate-400">Pontos adicionados ao seu perfil</p>
              </div>
              <div className="rounded-xl border border-aqua-400/40 bg-aqua-400/[0.08] p-3">
                <p className="text-sm font-bold text-white">🏆 Conquista</p>
                <p className="text-xs text-slate-400">&quot;Primeiro desafio concluído&quot;</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* PROBLEMA -------------------------------------------------------- */}
      <section className="border-y border-white/5 bg-night-900/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold sm:text-4xl">O desafio de aprender programação</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Como tornar o aprendizado inicial de programação mais{' '}
            <strong className="text-mint-300">interativo, progressivo e motivador</strong>?
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problemas.map((item) => (
              <Card key={item.titulo} className="cq-card-hover">
                <h3 className="font-bold text-white">{item.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.texto}</p>
              </Card>
            ))}
            <Card className="border-mint-500/40 bg-gradient-to-br from-mint-600/20 to-transparent">
              <p className="text-sm font-semibold leading-relaxed text-mint-100">
                O CodeQuest responde com prática constante, feedback imediato e progresso visível.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* JORNADA --------------------------------------------------------- */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold sm:text-4xl">A jornada do estudante</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            O aluno não recebe todo o conteúdo de uma vez. Ele progride gradualmente e desbloqueia
            novas etapas — cada módulo só abre quando o anterior é concluído.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {jornada.map((etapa, index) => (
              <div
                key={etapa.numero}
                className="cq-card cq-card-hover p-4"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <p className="text-xs font-mono text-slate-500">{etapa.numero}</p>
                <div className="mt-2 h-0.5 w-full rounded-full bg-gradient-to-r from-mint-500 to-electric-500" />
                <p className="mt-3 text-base font-bold text-white">
                  <span className="mr-2" aria-hidden>
                    {etapa.icone}
                  </span>
                  {etapa.titulo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMIFICACAO ----------------------------------------------------- */}
      <section className="border-y border-white/5 bg-night-900/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold sm:text-4xl">
            Transformando aprendizado em progressão
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gamificacao.map((item) => (
              <Card key={item.titulo} className="cq-card-hover">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-mint-500/30 bg-mint-500/10 text-xl">
                    {item.icone}
                  </span>
                  <h3 className="font-bold text-white">{item.titulo}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.texto}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 border-l-2 border-mint-400 pl-4">
            <p className="text-sm text-slate-300">
              <strong className="text-white">+50 XP</strong> — &quot;Você concluiu o desafio de
              condicionais!&quot;
            </p>
          </div>
        </div>
      </section>

      {/* CONCEITO PRIMEIRO ------------------------------------------------ */}
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold sm:text-4xl">Mais do que decorar sintaxe</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              O CodeQuest propõe que o estudante compreenda{' '}
              <strong className="text-white">o que é uma condicional</strong> antes de memorizar
              como escrevê-la em uma linguagem específica.
            </p>
            <p className="mt-3 leading-relaxed text-slate-400">
              Em cada lição, o mesmo conceito aparece aplicado em linguagens diferentes — reforçando
              o raciocínio lógico acima da memorização.
            </p>
            <div className="mt-6 rounded-xl border border-mint-500/40 bg-mint-600/20 px-5 py-4">
              <p className="font-bold text-mint-100">Conceito primeiro. Sintaxe depois.</p>
            </div>
          </div>

          <div className="grid min-w-0 gap-3">
            {[
              { nome: 'Python', codigo: 'if idade >= 18:\n    print("Maior de idade")' },
              { nome: 'JavaScript', codigo: 'if (idade >= 18) {\n  console.log("Maior de idade");\n}' },
              { nome: 'Java', codigo: 'if (idade >= 18) {\n  System.out.println("Maior de idade");\n}' },
            ].map((amostra) => (
              <div key={amostra.nome} className="min-w-0">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {amostra.nome}
                </p>
                <CodeBlock code={amostra.codigo} copyable={false} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINGUAGENS ------------------------------------------------------- */}
      <section className="border-t border-white/5 bg-night-900/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold sm:text-4xl">Linguagens</h2>
          <p className="mt-3 text-slate-400">
            Python está completo no MVP. As demais trilhas já existem na estrutura da plataforma e
            recebem conteúdo nas próximas versões.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {languages.map((language) => (
              <Card
                key={language.id}
                className={language.available ? 'cq-card-hover border-mint-500/30' : 'opacity-60'}
              >
                <span className="text-3xl" aria-hidden>
                  {language.icon}
                </span>
                <h3 className="mt-3 font-bold text-white">{language.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{language.description}</p>
                <div className="mt-3">
                  {language.available ? (
                    <Pill tone="mint">Disponível</Pill>
                  ) : (
                    <Pill>Em breve</Pill>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA -------------------------------------------------------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-extrabold sm:text-4xl">
            Sua primeira linha de código começa hoje
          </h2>
          <p className="mt-4 text-slate-400">
            Crie sua conta gratuita, escolha Python e resolva o primeiro desafio em menos de dois
            minutos.
          </p>
          <div className="mt-8 flex justify-center">
            <LinkButton href={user ? '/dashboard' : '/cadastro'} size="lg">
              {user ? 'Continuar estudando' : 'Criar minha conta'}
              <ArrowRight className="h-5 w-5" />
            </LinkButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <Logo compact className="opacity-70" />
          <p>CodeQuest — Projeto Integrador</p>
          <Link href="/login" className="cq-tap px-2 hover:text-mint-300">
            Entrar
          </Link>
        </div>
      </footer>
    </div>
  );
}
