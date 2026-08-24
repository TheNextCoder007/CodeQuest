import type { Metadata } from 'next';
import { metadataPrivada } from '@/lib/metadata';

/**
 * Tela que exige sessao: entra com `noindex`.
 *
 * Sem login o `AppShell` manda para `/login`, entao um resultado de busca
 * apontando para ca so levaria a uma tela de carregamento.
 */
export const metadata: Metadata = metadataPrivada('Ranking');

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
