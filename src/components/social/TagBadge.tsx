import { Lock } from 'lucide-react';
import type { TagDefinition } from '@/content/tags';
import { ESTILO_RARIDADE, type TagComEstado } from '@/lib/tags';
import { cn } from '@/lib/cn';

/**
 * Chip da tag exibida no perfil.
 *
 * Cada raridade tem sua cor (ver ESTILO_RARIDADE). A de desenvolvedor foge da
 * escala de proposito: gradiente cheio da marca, para nao ser confundida com
 * nenhuma raridade que se conquista jogando.
 */
export function TagBadge({
  tag,
  tamanho = 'md',
  className,
}: {
  tag: Pick<TagDefinition, 'name' | 'icon' | 'rarity'>;
  tamanho?: 'sm' | 'md';
  className?: string;
}) {
  const estilo = ESTILO_RARIDADE[tag.rarity];

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border font-semibold',
        tamanho === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        estilo.chip,
        className,
      )}
      title={`${tag.name} · ${estilo.rotulo}`}
    >
      <span aria-hidden>{tag.icon}</span>
      <span className="truncate">{tag.name}</span>
    </span>
  );
}

/**
 * Card da tag na galeria do perfil.
 *
 * Secreta ainda nao descoberta aparece mascarada: a pessoa sabe que existe
 * algo ali, mas nao o que e nem como pegar.
 */
export function TagCard({
  tag,
  selecionada,
  onSelecionar,
}: {
  tag: TagComEstado;
  selecionada: boolean;
  onSelecionar?: () => void;
}) {
  const estilo = ESTILO_RARIDADE[tag.rarity];
  const podeSelecionar = tag.unlocked && Boolean(onSelecionar);

  if (tag.escondida) {
    return (
      <div className="flex min-h-[76px] min-w-0 items-center gap-3 rounded-xl border border-dashed border-white/12 bg-white/[0.02] p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-600">
          <Lock className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-500">Tag secreta</span>
          <span className="block truncate text-xs text-slate-600">
            Alguma coisa por aí desbloqueia esta.
          </span>
        </span>
      </div>
    );
  }

  const Elemento = podeSelecionar ? 'button' : 'div';

  return (
    <Elemento
      {...(podeSelecionar ? { type: 'button' as const, onClick: onSelecionar } : {})}
      className={cn(
        'flex min-h-[76px] w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition',
        tag.unlocked
          ? selecionada
            ? cn('bg-white/[0.06]', estilo.borda, 'ring-1 ring-inset', estilo.borda)
            : cn('bg-white/[0.03]', estilo.borda, 'hover:bg-white/[0.06]')
          : 'border-white/8 bg-white/[0.02] opacity-55',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg',
          tag.unlocked ? estilo.borda : 'border-white/10',
        )}
        aria-hidden
      >
        {tag.unlocked ? tag.icon : <Lock className="h-4 w-4 text-slate-600" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2">
          <span className="truncate text-sm font-semibold text-white">{tag.name}</span>
          <span className={cn('text-[10px] font-bold uppercase tracking-wider', estilo.texto)}>
            {estilo.rotulo}
          </span>
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-500">{tag.description}</span>
      </span>

      {selecionada && (
        <span className="shrink-0 rounded-full bg-mint-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mint-300">
          no perfil
        </span>
      )}
    </Elemento>
  );
}
