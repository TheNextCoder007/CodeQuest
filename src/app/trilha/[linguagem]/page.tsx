import { languages } from '@/content';
import { TrilhaView } from './TrilhaView';

/**
 * Como o app tambem e exportado estaticamente (para o .apk e o .exe), todas as
 * rotas dinamicas precisam ser conhecidas em tempo de build. As linguagens sao
 * fixas no catalogo, entao basta enumera-las.
 */
export function generateStaticParams() {
  return languages.map((language) => ({ linguagem: language.slug }));
}

export default async function TrilhaPage({
  params,
}: {
  params: Promise<{ linguagem: string }>;
}) {
  const { linguagem } = await params;
  return <TrilhaView slug={linguagem} />;
}
