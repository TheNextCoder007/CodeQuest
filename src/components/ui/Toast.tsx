'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Notificacoes do CodeQuest: o "+XP" que sobe na tela e os cartoes de
 * conquista/nivel que aparecem no canto.
 */

type ToastTone = 'mint' | 'blue' | 'amber' | 'rose';

interface ToastItem {
  id: number;
  icon: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface XpBurst {
  id: number;
  amount: number;
}

interface ToastContextValue {
  showXp: (amount: number) => void;
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const tones: Record<ToastTone, string> = {
  mint: 'border-mint-500/40 bg-night-900/95 shadow-glow',
  blue: 'border-electric-400/40 bg-night-900/95 shadow-glow-blue',
  amber: 'border-amber-400/40 bg-night-900/95',
  rose: 'border-rose-500/40 bg-night-900/95',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [bursts, setBursts] = useState<XpBurst[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = (counter.current += 1);
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 5200);
  }, []);

  const showXp = useCallback((amount: number) => {
    if (amount <= 0) return;
    const id = (counter.current += 1);
    setBursts((current) => [...current, { id, amount }]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id));
    }, 1700);
  }, []);

  const value = useMemo(() => ({ showXp, showToast }), [showXp, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* +XP subindo no centro da tela */}
      <div className="pointer-events-none fixed inset-x-0 top-1/3 z-50 flex flex-col items-center gap-2">
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className="animate-xp-pop rounded-full border border-mint-400/50 bg-night-900/90 px-6 py-3 text-2xl font-extrabold text-mint-300 shadow-glow"
          >
            +{burst.amount} XP
          </span>
        ))}
      </div>

      {/* cartoes de conquista / nivel */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3 cq-safe-bottom">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'animate-fade-up rounded-2xl border p-4 backdrop-blur',
              tones[toast.tone],
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none" aria-hidden>
                {toast.icon}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-white">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-sm text-slate-300">{toast.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return context;
};
