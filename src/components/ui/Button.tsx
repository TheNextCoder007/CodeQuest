'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-mint-500 to-aqua-400 text-night-950 shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'border border-white/15 bg-white/5 text-slate-100 hover:border-mint-400/50 hover:bg-white/10',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'border border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20',
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
