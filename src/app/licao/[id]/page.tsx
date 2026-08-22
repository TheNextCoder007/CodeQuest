import { allLessons } from '@/content';
import { LessonView } from './LessonView';

/**
 * Os ids das licoes sao textuais e definidos no proprio curriculo
 * (`py-fund-01`, `py-cond-02`...), o que permite gerar todas as rotas em
 * tempo de build - requisito do export estatico usado pelo .apk e pelo .exe.
 */
export function generateStaticParams() {
  return allLessons().map((lesson) => ({ id: lesson.id }));
}

export default async function LicaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonView lessonId={id} />;
}
