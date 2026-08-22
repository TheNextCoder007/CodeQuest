import { cn } from '@/lib/cn';

/**
 * Marca do CodeQuest.
 *
 * O simbolo e exatamente o mesmo desenho de `public/icon.svg` (o favicon):
 * quadrado escuro arredondado, os sinais de menor/maior em gradiente
 * verde-agua -> azul e um ponto no centro. Manter os dois iguais e o que faz
 * a aba do navegador, o cabecalho, o .apk e o .exe parecerem o mesmo produto.
 */

/** Simbolo isolado - use quando so o icone couber (barras estreitas). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      role="img"
      aria-label="CodeQuest"
      className={cn('h-9 w-9 shrink-0', className)}
    >
      <defs>
        {/* id fixo: se houver mais de um logo na pagina, todos apontam para o
            mesmo gradiente - que e identico de qualquer forma. */}
        <linearGradient id="cq-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e394" />
          <stop offset="55%" stopColor="#38d6f5" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="112" fill="#04070f" />
      <rect
        x="24"
        y="24"
        width="464"
        height="464"
        rx="92"
        fill="url(#cq-logo-grad)"
        opacity="0.16"
      />
      <g
        fill="none"
        stroke="url(#cq-logo-grad)"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="196,168 118,256 196,344" />
        <polyline points="316,168 394,256 316,344" />
      </g>
      <circle cx="256" cy="256" r="26" fill="url(#cq-logo-grad)" />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  /** Mostra apenas o simbolo, sem o nome escrito. */
  compact?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      {!compact && (
        <span className="text-base font-extrabold tracking-tight text-white sm:text-lg">
          Code<span className="cq-gradient-text">Quest</span>
        </span>
      )}
    </span>
  );
}
