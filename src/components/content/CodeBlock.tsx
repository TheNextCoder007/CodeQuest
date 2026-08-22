'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Realce de sintaxe proprio, pequeno e sem dependencia externa.
 * Cobre Python (foco do MVP) e degrada bem para as demais linguagens, que
 * compartilham quase todos os tokens relevantes.
 */

const KEYWORDS = new Set([
  'if', 'elif', 'else', 'for', 'while', 'def', 'return', 'break', 'continue',
  'import', 'from', 'as', 'in', 'and', 'or', 'not', 'class', 'try', 'except',
  'finally', 'with', 'pass', 'lambda', 'global', 'raise', 'yield',
  // equivalentes das outras linguagens mostradas nos blocos poliglotas
  'let', 'const', 'var', 'function', 'public', 'static', 'void', 'int',
  'double', 'String', 'new', 'using', 'namespace', 'std',
]);

const BUILTINS = new Set([
  'print', 'input', 'int', 'float', 'str', 'bool', 'len', 'range', 'round',
  'type', 'list', 'sum', 'max', 'min', 'abs', 'sorted', 'console', 'log',
  'System', 'out', 'println', 'printf', 'cout', 'Number', 'prompt',
]);

const LITERALS = new Set(['True', 'False', 'None', 'true', 'false', 'null', 'undefined']);

const TOKEN_PATTERN =
  /(#[^\n]*|\/\/[^\n]*)|(f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*')|\b(\d+\.?\d*)\b|\b([A-Za-z_][A-Za-z0-9_]*)\b/g;

interface Token {
  text: string;
  className: string;
}

const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  let lastIndex = 0;
  TOKEN_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TOKEN_PATTERN.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), className: 'text-slate-300' });
    }

    const [full, comment, string, number, word] = match;

    if (comment) {
      tokens.push({ text: full, className: 'text-slate-500 italic' });
    } else if (string) {
      tokens.push({ text: full, className: 'text-aqua-300' });
    } else if (number) {
      tokens.push({ text: full, className: 'text-electric-400' });
    } else if (word) {
      if (KEYWORDS.has(word)) {
        tokens.push({ text: full, className: 'text-mint-400 font-semibold' });
      } else if (LITERALS.has(word)) {
        tokens.push({ text: full, className: 'text-violet-300' });
      } else if (BUILTINS.has(word)) {
        tokens.push({ text: full, className: 'text-amber-300' });
      } else {
        tokens.push({ text: full, className: 'text-slate-200' });
      }
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), className: 'text-slate-300' });
  }

  return tokens;
};

export function HighlightedCode({ code, language }: { code: string; language?: string }) {
  // Saida de terminal nao recebe realce: e texto puro mesmo.
  if (language === 'text') {
    return <span className="text-slate-300">{code}</span>;
  }

  return (
    <>
      {code.split('\n').map((line, lineIndex) => (
        <span key={lineIndex}>
          {tokenizeLine(line).map((token, tokenIndex) => (
            <span key={tokenIndex} className={token.className}>
              {token.text}
            </span>
          ))}
          {'\n'}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({
  code,
  language = 'py',
  className,
  copyable = true,
}: {
  code: string;
  language?: string;
  className?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard indisponivel (webview antiga) - ignoramos silenciosamente */
    }
  };

  const isTerminal = language === 'text';

  return (
    <div
      className={cn(
        'group relative min-w-0 overflow-hidden rounded-xl border',
        isTerminal ? 'border-white/10 bg-black/50' : 'border-white/10 bg-night-950/80',
        className,
      )}
    >
      {isTerminal && (
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint-500/70" />
          <span className="ml-2 text-[10px] uppercase tracking-widest text-slate-500">saída</span>
        </div>
      )}

      {copyable && !isTerminal && (
        <button
          type="button"
          onClick={copy}
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-night-900/80 text-slate-400 transition hover:text-mint-300 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Copiar código"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}

      <pre className="cq-editor overflow-x-auto p-3 text-[12px] leading-relaxed sm:p-4 sm:text-[13px]">
        <code className="font-mono">
          <HighlightedCode code={code} language={language} />
        </code>
      </pre>
    </div>
  );
}
