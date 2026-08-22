import { cn } from '@/lib/cn';

/**
 * Avatar do estudante: usa a foto do Google quando existe, senao mostra a
 * inicial do nome de exibicao sobre o gradiente da marca.
 */
export function Avatar({
  name,
  url,
  size = 'md',
  className,
}: {
  name: string;
  url?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const tamanhos = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-20 w-20 rounded-2xl text-3xl',
  } as const;

  const base = cn(
    'shrink-0 border border-white/10',
    size === 'lg' ? 'rounded-2xl' : 'rounded-full',
    tamanhos[size],
    className,
  );

  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className={cn(base, 'object-cover')} />;
  }

  return (
    <span
      className={cn(
        base,
        'flex items-center justify-center bg-gradient-to-br from-mint-500/25 to-electric-500/25 font-bold text-white',
      )}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}
