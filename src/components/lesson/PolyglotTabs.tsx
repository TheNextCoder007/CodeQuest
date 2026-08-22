'use client';

import { useState } from 'react';
import type { PolyglotSample } from '@/types/content';
import { CodeBlock } from '@/components/content/CodeBlock';
import { cn } from '@/lib/cn';

/**
 * "Conceito primeiro, sintaxe depois": o mesmo conceito mostrado em varias
 * linguagens, para o aluno perceber que muda a escrita, nao a ideia.
 */
export function PolyglotTabs({ samples }: { samples: PolyglotSample[] }) {
  const [active, setActive] = useState(0);
  if (samples.length === 0) return null;

  return (
    <div className="cq-card border-electric-400/20 bg-gradient-to-br from-electric-500/[0.08] to-transparent p-5">
      <p className="text-sm font-bold text-white">O conceito é o mesmo. A sintaxe muda.</p>
      <p className="mt-1 text-xs text-slate-400">
        Veja como esta mesma ideia é escrita em outras linguagens.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {samples.map((sample, index) => (
          <button
            key={sample.language}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
              index === active
                ? 'border-mint-500/50 bg-mint-500/15 text-mint-200'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
            )}
          >
            {sample.language}
          </button>
        ))}
      </div>

      <CodeBlock className="mt-3" code={samples[active].code} />
    </div>
  );
}
