import type { Metadata } from 'next';
import { metadataPublica } from '@/lib/metadata';

export const metadata: Metadata = metadataPublica({
  titulo: 'Criar conta grátis',
  descricao:
    'Crie sua conta grátis no CodeQuest em menos de um minuto e comece a aprender programação resolvendo desafios com correção imediata.',
  caminho: '/cadastro',
});

export default function CadastroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
