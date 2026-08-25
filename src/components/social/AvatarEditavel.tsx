'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { Avatar } from './Avatar';
import { MOLDURA_PODIO } from '@/lib/tags';
import { cn } from '@/lib/cn';

/**
 * Avatar com moldura de pódio e troca de foto.
 *
 * A moldura sai do `posicao` calculado na hora a partir do ranking - nada e
 * fixado a mao, entao quando mais gente entrar o pódio muda sozinho.
 */
export function AvatarComMoldura({
  name,
  url,
  posicao,
  size = 'lg',
  className,
}: {
  name: string;
  url?: string | null;
  posicao?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const moldura = posicao && posicao <= 3 ? MOLDURA_PODIO[posicao] : null;

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <Avatar name={name} url={url} size={size} className={moldura?.anel} />
      {moldura && (
        <span
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-night-950 text-sm"
          title={moldura.rotulo}
          aria-label={moldura.rotulo}
        >
          {moldura.emoji}
        </span>
      )}
    </span>
  );
}

export function AvatarEditavel({
  name,
  url,
  posicao,
  onEscolher,
  onRemover,
}: {
  name: string;
  url?: string | null;
  posicao?: number | null;
  /** Recebe o arquivo cru; quem reduz e envia e `src/lib/avatar.ts`. */
  onEscolher: (arquivo: File) => Promise<void>;
  onRemover: () => Promise<void>;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolher = async (arquivo: File | undefined) => {
    if (!arquivo) return;
    setErro(null);
    setEnviando(true);
    try {
      await onEscolher(arquivo);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível enviar a foto.');
    } finally {
      setEnviando(false);
      if (entrada.current) entrada.current.value = '';
    }
  };

  return (
    <div className="shrink-0">
      <div className="relative inline-flex">
        <AvatarComMoldura name={name} url={url} posicao={posicao} size="lg" />

        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={enviando}
          className="absolute -bottom-2 -left-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-night-900 text-slate-300 shadow-card transition hover:border-mint-400/60 hover:text-mint-300 disabled:opacity-60"
          aria-label="Trocar foto de perfil"
          title="Trocar foto de perfil"
        >
          {enviando ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Camera className="h-4 w-4" aria-hidden />
          )}
        </button>

        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(evento) => void escolher(evento.target.files?.[0])}
        />
      </div>

      {url && (
        <button
          type="button"
          onClick={() => void onRemover()}
          className="mt-3 flex min-h-[32px] items-center gap-1.5 cq-muted transition hover:text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          remover foto
        </button>
      )}

      {erro && <p className="mt-2 max-w-[220px] text-xs text-rose-300">{erro}</p>}
    </div>
  );
}
