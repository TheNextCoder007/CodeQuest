'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/cn';
import { CodeBlock } from './CodeBlock';

/**
 * Renderizador de markdown reduzido, feito sob medida para o conteudo das
 * licoes. Suporta exatamente o que o curriculo usa - nada mais, para nao
 * carregar uma biblioteca inteira dentro do .apk e do .exe:
 *
 *   ## titulo        ### subtitulo
 *   paragrafo com **negrito** e `codigo`
 *   - item de lista
 *   > destaque
 *   | tabela | simples |
 *   ~~~py ... ~~~   (ou ``` ... ```)
 */

type Block =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'table'; header: string[]; rows: string[][] };

const FENCE = /^(~~~|```)\s*([a-zA-Z]*)\s*$/;

export function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];

    // bloco de codigo
    const fence = line.match(FENCE);
    if (fence) {
      const marker = fence[1];
      const language = fence[2] || 'py';
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trimEnd().startsWith(marker)) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1; // consome o fechamento
      blocks.push({ kind: 'code', language, code: body.join('\n') });
      continue;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ kind: 'heading', level: 3, text: line.slice(4) });
      index += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({ kind: 'heading', level: 2, text: line.slice(3) });
      index += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      const body: string[] = [];
      while (index < lines.length && lines[index].startsWith('> ')) {
        body.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push({ kind: 'quote', text: body.join(' ') });
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push({ kind: 'list', items });
      continue;
    }

    // tabela: | a | b |  seguida da linha de separacao | --- | --- |
    if (line.trim().startsWith('|') && lines[index + 1]?.includes('---')) {
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((cell) => cell.trim());

      const header = cells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      blocks.push({ kind: 'table', header, rows });
      continue;
    }

    // paragrafo (junta linhas consecutivas)
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith('#') &&
      !lines[index].startsWith('- ') &&
      !lines[index].startsWith('> ') &&
      !lines[index].trim().startsWith('|') &&
      !FENCE.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
  }

  return blocks;
}

/** Aplica **negrito** e `codigo` dentro de um trecho de texto. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="rounded-md border border-white/10 bg-night-950/80 px-1.5 py-0.5 font-mono text-[0.85em] text-mint-300"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

export function MarkdownLite({ source, className }: { source: string; className?: string }) {
  const blocks = parseBlocks(source);

  return (
    <div className={cn('space-y-4', className)}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading':
            return block.level === 2 ? (
              <h2 key={index} className="pt-2 text-xl font-bold text-white sm:text-2xl">
                <Inline text={block.text} />
              </h2>
            ) : (
              <h3 key={index} className="pt-1 text-lg font-bold text-white">
                <Inline text={block.text} />
              </h3>
            );

          case 'paragraph':
            return (
              <p key={index} className="leading-relaxed text-slate-300">
                <Inline text={block.text} />
              </p>
            );

          case 'list':
            return (
              <ul key={index} className="space-y-2">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 leading-relaxed text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-400" aria-hidden />
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );

          case 'quote':
            return (
              <div
                key={index}
                className="rounded-xl border border-mint-500/30 bg-mint-500/[0.07] p-4 text-sm leading-relaxed text-mint-100"
              >
                <Inline text={block.text} />
              </div>
            );

          case 'code':
            return <CodeBlock key={index} code={block.code} language={block.language} />;

          case 'table':
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      {block.header.map((cell, cellIndex) => (
                        <th key={cellIndex} className="px-4 py-2.5 font-semibold text-white">
                          <Inline text={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-white/5">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2.5 text-slate-300">
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
