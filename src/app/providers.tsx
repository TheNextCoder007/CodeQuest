'use client';

import { AuthProvider } from '@/lib/auth/AuthProvider';
import { PlayerProvider } from '@/lib/player/PlayerProvider';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlayerProvider>
        <ToastProvider>{children}</ToastProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}
