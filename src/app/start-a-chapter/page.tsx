import type { Metadata } from 'next';
import StartChapterView from "@/components/StartChapterView";

export const metadata: Metadata = {
  title: 'Abre tu capítulo CNCF | Cloud Native Santo Domingo',
  description: 'Cómo iniciar un Cloud Native Community Group en tu ciudad: pasos, beneficios y recursos oficiales de la CNCF.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/start-a-chapter',
  },
};

export default function StartChapter() {
  return <StartChapterView />;
}
