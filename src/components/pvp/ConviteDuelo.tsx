'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TEMAS_PVP } from '@/content/pvp-temas';
import { convidar } from '@/lib/pvp/api';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { cn } from '@/lib/cn';

/**
 * Escolha do tema e envio do convite.
 *
 * O tema e escolhido ANTES da partida (e vai junto no convite), para as duas
 * pessoas saberem no que estao entrando.
 */
export function ConviteDuelo({
  meuId,
  adversarioId,
  adversarioUsername,
  adversarioNome,
  aberto,
  onFechar,
  onEnviado,
}: {
  meuId: string;
  adversarioId: string;
  adversarioUsername: string;
  adversarioNome: string;
  aberto: boolean;
  onFechar: () => void;
  onEnviado?: (matchId: string) => void;
}) {
  const router = useRouter();
  const [tema, setTema] = useState<string>('todas');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const enviar = async () => {
    setErro(null);
    setEnviando(true);
    try {
      const matchId = await convidar(adversarioUsername, tema, meuId, {
        adversarioId,
        adversarioNome,
      });
      onEnviado?.(matchId);
      onFechar();

      // No modo demonstracao a partida ja comeca (o adversario e simulado);
      // com Supabase, o convite fica esperando a outra pessoa aceitar.
      if (!isSupabaseConfigured) router.push(`/duelo/?m=${encodeURIComponent(matchId)}`);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível convidar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-night-950/80 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Convidar para um duelo"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div className="cq-card w-full max-w-md animate-fade-up p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Swords className="h-5 w-5 shrink-0 text-mint-400" aria-hidden />
              Duelar com {adversarioNome}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              5 perguntas. Quem acerta mais — e mais rápido — vence.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Escolha o tema
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {TEMAS_PVP.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setTema(item.slug)}
              className={cn(
                'flex min-h-[52px] min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition',
                tema === item.slug
                  ? 'border-mint-500/60 bg-mint-500/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25',
              )}
            >
              <span className="shrink-0 text-lg" aria-hidden>
                {item.icon}
              </span>
              <span className="min-w-0 truncate font-semibold">{item.nome}</span>
            </button>
          ))}
        </div>

        {erro && <p className="mt-4 text-sm text-rose-300">{erro}</p>}

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2 text-xs leading-relaxed text-amber-200">
            <strong>Modo demonstração:</strong> sem servidor não há outra pessoa do outro lado, então
            você joga contra um adversário simulado com as mesmas regras de pontuação.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button className="flex-1" loading={enviando} onClick={enviar}>
            {isSupabaseConfigured ? 'Enviar convite' : 'Começar duelo'}
          </Button>
          <Button variant="ghost" onClick={onFechar} disabled={enviando}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
