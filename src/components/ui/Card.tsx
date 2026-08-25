import { cn } from '@/lib/cn';

export function Card({
  className,
  children,
  interativo = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Card que responde ao cursor. Use em qualquer card que seja clicavel -
   * antes cada tela escrevia o proprio hover e existiam 12 variantes.
   */
  interativo?: boolean;
}) {
  return (
    <div
      className={cn('cq-card p-5 sm:p-6', interativo && 'cq-card-hover', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  as: Tag = 'h3',
}: {
  className?: string;
  children: React.ReactNode;
  /** `h2` quando o card e a secao principal da tela. */
  as?: 'h2' | 'h3';
}) {
  return <Tag className={cn('cq-h2', className)}>{children}</Tag>;
}

/** Titulo da tela. Um por pagina, sempre `h1`. */
export function PageTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h1 className={cn('cq-h1', className)}>{children}</h1>;
}

export function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('cq-label', className)}>{children}</p>;
}

/** Barra de progresso usada na trilha, no nivel e nos modulos. */
export function ProgressBar({
  value,
  className,
  tone = 'mint',
}: {
  /** 0 a 1 */
  value: number;
  className?: string;
  tone?: 'mint' | 'blue' | 'amber';
}) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  const tones = {
    mint: 'from-mint-500 to-aqua-400',
    blue: 'from-electric-400 to-aqua-400',
    amber: 'from-amber-400 to-orange-500',
  } as const;

  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/5',
        className,
      )}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', tones[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function Pill({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'mint' | 'blue' | 'amber' | 'rose';
  className?: string;
}) {
  const tones = {
    neutral: 'border-white/15 bg-white/5 text-slate-300',
    mint: 'border-mint-500/40 bg-mint-500/10 text-mint-300',
    blue: 'border-electric-400/40 bg-electric-400/10 text-aqua-300',
    amber: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
    rose: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-5',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Bloco de metrica do dashboard (XP, streak, nivel, ranking). */
export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = 'mint',
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: 'mint' | 'blue' | 'amber' | 'violet';
}) {
  const rings = {
    mint: 'from-mint-500/20 to-transparent border-mint-500/30',
    blue: 'from-electric-400/20 to-transparent border-electric-400/30',
    amber: 'from-amber-400/20 to-transparent border-amber-400/30',
    violet: 'from-violet-500/20 to-transparent border-violet-500/30',
  } as const;

  return (
    <div className={cn('cq-card bg-gradient-to-br p-4 sm:p-5', rings[tone])}>
      {/* `min-w-0` no rotulo e `shrink-0` no icone: com a fonte ampliada do
          Android o rotulo nao cabia, e como ele nao encolhia era o ICONE que
          era empurrado para fora da tela. */}
      {/* `min-h-8` reserva as duas linhas que um rotulo longo ("Lições
          concluídas", "Desafios diários") ocupa. Sem isso, os cards de rotulo
          curto sobem o numero e a fileira inteira fica com as metricas em
          alturas diferentes. E minimo, nao fixo: com a fonte ampliada do
          Android o rotulo cresce a vontade. */}
      <div className="flex min-h-8 items-start justify-between gap-2">
        <p className="cq-label min-w-0">{label}</p>
        <span className="shrink-0 text-xl leading-none" aria-hidden>
          {icon}
        </span>
      </div>
      {/* `tabular-nums`: o XP muda de valor na tela (o +120 do desafio diario,
          o ganho da licao) e sem largura fixa de digito o numero "dança". */}
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-white sm:text-3xl">{value}</p>
      {hint && <p className="cq-muted mt-1.5">{hint}</p>}
    </div>
  );
}
