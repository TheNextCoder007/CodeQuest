import { cn } from '@/lib/cn';

/** Marca do CodeQuest: colchetes de código + gradiente verde-água/azul. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mint-500 to-electric-500 font-mono text-lg font-extrabold text-night-950 shadow-glow">
        {'</>'.slice(0, 2)}
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-tight text-white">
          Code<span className="cq-gradient-text">Quest</span>
        </span>
      )}
    </span>
  );
}
