'use client';

import { useRef } from 'react';
import { HighlightedCode } from '@/components/content/CodeBlock';
import { cn } from '@/lib/cn';

/**
 * Editor de codigo simples: um `textarea` transparente sobre um bloco com
 * realce de sintaxe. Sem dependencia externa - o que mantem o bundle leve
 * para o .apk e o .exe.
 *
 * Dois confortos importantes para quem esta aprendendo Python:
 *  - Tab insere 4 espacos (em vez de sair do campo);
 *  - Enter mantem a indentacao da linha e adiciona um nivel depois de ":".
 */
export function CodeEditor({
  value,
  onChange,
  disabled,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const replaceSelection = (insert: string, caretOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const next = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
    onChange(next);

    const caret = selectionStart + (caretOffset ?? insert.length);
    window.requestAnimationFrame(() => {
      textarea.selectionStart = caret;
      textarea.selectionEnd = caret;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      replaceSelection('    ');
      return;
    }

    if (event.key === 'Enter') {
      const textarea = event.currentTarget;
      const before = value.slice(0, textarea.selectionStart);
      const currentLine = before.slice(before.lastIndexOf('\n') + 1);
      const indent = currentLine.match(/^[ \t]*/)?.[0] ?? '';
      const extra = currentLine.trimEnd().endsWith(':') ? '    ' : '';

      if (indent || extra) {
        event.preventDefault();
        replaceSelection(`\n${indent}${extra}`);
      }
    }
  };

  // O `​` final garante que a ultima linha vazia ocupe altura no <pre>,
  // mantendo o alinhamento com o textarea.
  const highlighted = `${value}​`;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10 bg-night-950/80 focus-within:border-mint-400/50 focus-within:ring-2 focus-within:ring-mint-400/15',
        disabled && 'opacity-60',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          main.py
        </span>
        <span className="text-[10px] text-slate-600">Tab = 4 espaços</span>
      </div>

      <div className="relative">
        <pre
          aria-hidden
          className="cq-editor pointer-events-none min-h-[9rem] whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed"
        >
          <code>
            <HighlightedCode code={highlighted} />
          </code>
        </pre>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Editor de código Python"
          className="cq-editor absolute inset-0 h-full w-full resize-none whitespace-pre-wrap break-words bg-transparent p-4 font-mono text-[13px] leading-relaxed text-transparent caret-mint-300 outline-none"
        />
      </div>
    </div>
  );
}

/** Painel que mostra a saida do programa, no estilo de um terminal. */
export function Terminal({
  output,
  error,
  running,
  empty = 'Clique em Executar para ver a saída do seu programa.',
}: {
  output?: string;
  error?: string | null;
  running?: boolean;
  empty?: string;
}) {
  const hasContent = Boolean(output?.length) || Boolean(error);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint-500/70" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-slate-500">terminal</span>
        {running && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-mint-300">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-mint-400" />
            executando
          </span>
        )}
      </div>

      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed">
        {hasContent ? (
          <>
            {output && <span className="text-slate-200">{output}</span>}
            {error && <span className="text-rose-300">{error}</span>}
          </>
        ) : (
          <span className="text-slate-600">{running ? 'Carregando o Python...' : empty}</span>
        )}
      </pre>
    </div>
  );
}
