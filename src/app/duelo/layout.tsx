import type { Metadata } from 'next';
import { metadataPrivada } from '@/lib/metadata';

/**
 * Tela que exige sessao: entra com `noindex`.
 *
 * Sem login o `AppShell` manda para `/login`, entao um resultado de busca
 * apontando para ca so levaria a uma tela de carregamento.
 */
export const metadata: Metadata = metadataPrivada('Duelo 1v1');

export default function DueloLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
