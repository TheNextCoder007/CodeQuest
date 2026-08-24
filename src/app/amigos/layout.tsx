import type { Metadata } from 'next';
import { metadataPrivada } from '@/lib/metadata';

/**
 * Tela que exige sessao: entra com `noindex`.
 *
 * Sem login o `AppShell` manda para `/login`, entao um resultado de busca
 * apontando para ca so levaria a uma tela de carregamento.
 */
export const metadata: Metadata = metadataPrivada('Amigos');

export default function AmigosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
