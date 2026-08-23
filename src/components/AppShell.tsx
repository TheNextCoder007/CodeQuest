'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CloudOff, Flame, Home, LogOut, Map, RefreshCw, Star, Trophy, User, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { displayStreak, levelFromXp } from '@/lib/gamification';
import { cn } from '@/lib/cn';
import { UsernameGate } from './UsernameGate';
import { Logo } from './Logo';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/trilha/python', label: 'Trilha', icon: Map },
  { href: '/amigos', label: 'Amigos', icon: Users },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/perfil', label: 'Perfil', icon: User },
];

/**
 * Servidor fora do ar e a pessoa ainda sem nada carregado.
 *
 * Existe para nao cair no caso antigo: antes, uma leitura que falhava virava
 * um perfil zerado e a pessoa via "0 XP / 0 licoes" - parecia que o progresso
 * tinha sido apagado. Nada foi apagado; so nao deu para ler.
 */
function OfflineScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <CloudOff className="h-10 w-10 text-slate-500" aria-hidden />
      <div>
        <h1 className="text-lg font-bold text-white">Sem conexão com o servidor</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-mint-500/40 bg-mint-500/10 px-5 text-sm font-semibold text-mint-300 transition hover:bg-mint-500/20"
      >
        <RefreshCw className="h-4 w-4" aria-hidden />
        Tentar de novo
      </button>
    </div>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-mint-400" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

/**
 * Casca das telas autenticadas: barra superior no desktop, barra inferior no
 * celular (formato esperado no .apk) e redirecionamento para /login quando
 * nao ha sessao.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut, demoMode } = useAuth();
  const { state, loading: carregandoProgresso, error: erroProgresso, refresh } = usePlayer();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading) return <LoadingScreen message="Carregando seu progresso..." />;
  if (!user) return <LoadingScreen message="Redirecionando para o login..." />;

  // Nada carregado + erro = nao da para mostrar numero nenhum sem mentir.
  if (!state && !carregandoProgresso && erroProgresso) {
    return <OfflineScreen message={erroProgresso} onRetry={() => void refresh()} />;
  }

  const xp = state?.profile.xp_total ?? 0;
  const streak = displayStreak(state?.profile.last_study_date ?? null, state?.profile.streak_count ?? 0);
  const level = state?.profile.level ?? levelFromXp(xp);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`) ||
    (href === '/trilha/python' && pathname.startsWith('/licao'));

  return (
    // Enquanto o perfil nao tiver @username, o UsernameGate assume a tela
    // inteira e pede para escolher um - inclusive para contas antigas.
    <UsernameGate>
      <div className="min-h-dvh pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-night-950/85 backdrop-blur cq-safe-top">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-4">
          <Link href="/dashboard" className="flex min-h-[44px] min-w-0 items-center">
            <Logo />
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* O bloco da direita nao encolhe: quem cede espaco e o nome escrito
              do logo. Se ele encolhesse, o botao de sair sairia da tela. */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-200 sm:inline-flex">
              <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {streak}
            </span>
            {/* O XP nunca encolhe: com a fonte ampliada quem cede espaco e o
                nome escrito do logo (que vira so o simbolo), nao o numero. */}
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-mint-500/30 bg-mint-500/10 px-3 py-1.5 text-xs font-bold text-mint-300">
              <Star className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {xp} XP
            </span>
            <span className="hidden shrink-0 rounded-full border border-electric-400/30 bg-electric-400/10 px-3 py-1.5 text-xs font-bold text-aqua-300 lg:inline-flex">
              Nv {level}
            </span>

            <button
              type="button"
              onClick={() => {
                void signOut().then(() => router.replace('/'));
              }}
              className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-rose-300"
              aria-label="Sair da conta"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {demoMode && (
          <div className="border-t border-amber-400/20 bg-amber-400/[0.07] px-4 py-1.5 text-center text-[11px] text-amber-200">
            Modo demonstração — seu progresso está salvo apenas neste dispositivo. Configure o
            Supabase no <code className="font-mono">.env.local</code> para sincronizar na nuvem.
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">{children}</main>

      {/* Barra inferior: e a navegacao principal no celular / .apk */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night-950/95 backdrop-blur lg:hidden cq-safe-bottom">
        <div className="mx-auto flex w-full max-w-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  // `min-w-0` + `basis-0`: sem isso cada item fica do tamanho do
                  // proprio rotulo e, com a fonte ampliada do Android, os cinco
                  // somados passam da largura da tela - o ultimo ("Perfil")
                  // simplesmente some da borda.
                  'flex min-w-0 flex-1 basis-0 flex-col items-center gap-1 px-1 py-3 text-[11px] font-medium transition',
                  active ? 'text-mint-300' : 'text-slate-500',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    active && 'drop-shadow-[0_0_6px_rgba(0,227,148,0.6)]',
                  )}
                />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      </div>
    </UsernameGate>
  );
}
