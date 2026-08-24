'use client';

import { useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { TagCard } from './TagBadge';
import { tagsComEstado } from '@/lib/tags';
import { RARIDADES, type Raridade } from '@/content/tags';
import { ESTILO_RARIDADE } from '@/lib/tags';
import { cn } from '@/lib/cn';

/**
 * Galeria de tags do proprio perfil: mostra tudo que existe, marca o que ja
 * foi desbloqueado e deixa escolher qual aparece ao lado do nome.
 */
export function GaleriaTags({
  desbloqueadas,
  equipada,
  isDeveloper,
  onEquipar,
}: {
  desbloqueadas: string[];
  equipada: string | null;
  isDeveloper: boolean;
  onEquipar: (tagId: string | null) => Promise<void>;
}) {
  const [erro, setErro] = useState<string | null>(null);

  const lista = useMemo(
    () => tagsComEstado(desbloqueadas, isDeveloper),
    [desbloqueadas, isDeveloper],
  );

  const total = lista.filter((tag) => !tag.escondida).length;
  const conquistadas = lista.filter((tag) => tag.unlocked).length;

  const escolher = async (tagId: string) => {
    setErro(null);
    try {
      // Clicar de novo na tag que ja esta no perfil tira ela de la.
      await onEquipar(equipada === tagId ? null : tagId);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar.');
    }
  };

  // Contagem por raridade, so das desbloqueadas - vira uma linha de resumo.
  const porRaridade = RARIDADES.map((raridade) => ({
    raridade,
    quantidade: lista.filter((tag) => tag.unlocked && tag.rarity === raridade).length,
  })).filter((item) => item.quantidade > 0);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>🏷️ Tags</CardTitle>
        <span className="text-xs text-slate-500">
          {conquistadas} de {total} desbloqueadas
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Toque em uma tag desbloqueada para exibi-la ao lado do seu nome. Toque de novo para tirar.
      </p>

      {porRaridade.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {porRaridade.map(({ raridade, quantidade }) => (
            <span
              key={raridade}
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                ESTILO_RARIDADE[raridade as Raridade].chip,
              )}
            >
              {ESTILO_RARIDADE[raridade as Raridade].rotulo} · {quantidade}
            </span>
          ))}
        </div>
      )}

      {erro && <p className="mt-3 text-sm text-rose-300">{erro}</p>}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {lista.map((tag) => (
          <TagCard
            key={tag.id}
            tag={tag}
            selecionada={equipada === tag.id}
            onSelecionar={tag.unlocked ? () => void escolher(tag.id) : undefined}
          />
        ))}
      </div>
    </Card>
  );
}
