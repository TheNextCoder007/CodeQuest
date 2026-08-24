import type { Metadata } from 'next';
import { metadataPublica } from '@/lib/metadata';

/**
 * A pagina de login e um componente de cliente e nao pode exportar `metadata`.
 * Este layout de servidor existe so para carregar as tags dela.
 */
export const metadata: Metadata = metadataPublica({
  titulo: 'Entrar',
  descricao:
    'Entre no CodeQuest e continue de onde parou na sua trilha de programação. Login com e-mail ou com a conta do Google.',
  caminho: '/login',
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
