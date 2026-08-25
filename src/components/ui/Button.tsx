'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

// `max-w-full` + `[overflow-wrap:anywhere]`: num celular estreito com a fonte
// do Android no maximo, um rotulo de duas palavras fica mais largo que o card
// inteiro. Sem poder quebrar a palavra, o botao vazava para fora da tela em vez
// de encolher. `anywhere` (e nao `break-word`) porque so ele reduz a largura
// minima intrinseca, que e o que decide o tamanho do botao.
// `active:scale-[0.98]` da o retorno tatil que faltava: sem ele o botao so
// mudava de brilho, e num toque rapido no celular nem isso era percebido. A
// escala e minuscula de proposito - passa disso e vira brinquedo.
const base =
  'inline-flex max-w-full items-center justify-center gap-2 rounded-xl text-center font-semibold [overflow-wrap:anywhere] transition duration-200 ease-out active:scale-[0.98] active:duration-75 cq-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-mint-500 to-aqua-400 text-night-950 shadow-glow hover:shadow-glow hover:brightness-110',
  secondary:
    'border border-white/15 bg-white/5 text-slate-100 hover:border-mint-400/40 hover:bg-white/[0.09]',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'border border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/[0.18]',
};

// `min-h` garante alvo de toque confortavel no celular (o piso recomendado
// para toque e ~44px; 40px e o minimo aceitavel para botoes secundarios).
const sizes: Record<Size, string> = {
  sm: 'min-h-[40px] px-3.5 py-2 text-sm',
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[52px] px-6 py-3.5 text-base sm:px-7',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type LinkButtonProps = CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | 'href'
  >;

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
