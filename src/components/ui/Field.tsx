'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Campo de texto do CodeQuest.
 *
 * Existia um `<input>` escrito a mao em seis telas, e os seis divergiam: uns
 * com `bg-night-950/60`, outros com `/70`; uns com altura minima de toque,
 * outros sem; e um deles sem anel de foco nenhum - o que deixava quem navega
 * por teclado sem saber onde estava.
 *
 * Aqui fica a unica versao. Quem precisa de algo diferente passa `className`,
 * mas parte do mesmo lugar.
 */

const campo =
  'w-full min-w-0 rounded-xl border border-white/10 bg-night-950/60 text-white ' +
  'placeholder:text-slate-600 transition-[border-color,box-shadow,background-color] ' +
  'hover:border-white/20 ' +
  'focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/15 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

// `min-h` de 48px: alvo de toque confortavel no celular sem depender da
// altura que o texto por acaso ocupar.
const tamanhos = {
  md: 'min-h-[48px] px-4 py-3 text-base sm:text-sm',
  lg: 'min-h-[52px] px-4 py-3 text-lg font-bold',
} as const;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** `lg` e usado onde o valor digitado e o proprio destaque (o @username). */
  tamanho?: keyof typeof tamanhos;
  /** Deixa a borda vermelha e liga o `aria-invalid`. */
  erro?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, tamanho = 'md', erro = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={erro || undefined}
      className={cn(
        campo,
        tamanhos[tamanho],
        erro && 'border-rose-500/50 focus:border-rose-400/70 focus:ring-rose-400/15',
        className,
      )}
      {...props}
    />
  );
});

/**
 * Campo com rotulo, dica e mensagem de erro ja ligados por `id`.
 *
 * O `aria-describedby` aponta para a dica ou para o erro, entao o leitor de
 * tela anuncia os dois junto com o campo - sem isso a dica fica sendo texto
 * solto ao lado.
 */
export function Field({
  label,
  hint,
  erro,
  className,
  children,
  id,
}: {
  label: string;
  /** Texto de apoio abaixo do campo. */
  hint?: React.ReactNode;
  /** Quando presente, substitui a dica e pinta o rotulo. */
  erro?: string | null;
  className?: string;
  /** Recebe o `id` e o `aria-describedby` prontos. */
  children: (props: { id: string; 'aria-describedby'?: string }) => React.ReactNode;
  id?: string;
}) {
  const gerado = useId();
  const campoId = id ?? gerado;
  const apoioId = `${campoId}-apoio`;
  const temApoio = Boolean(erro || hint);

  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={campoId}
        className={cn(
          'block text-sm font-medium',
          erro ? 'text-rose-200' : 'text-slate-300',
        )}
      >
        {label}
      </label>

      {children({ id: campoId, 'aria-describedby': temApoio ? apoioId : undefined })}

      {temApoio && (
        <p
          id={apoioId}
          className={cn('text-xs leading-relaxed', erro ? 'text-rose-300' : 'text-slate-500')}
        >
          {erro || hint}
        </p>
      )}
    </div>
  );
}
