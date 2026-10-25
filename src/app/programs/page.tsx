import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import ProgramsView from "@/components/ProgramsView";

export const metadata: Metadata = {
  title: 'Hazte Kubestronaut o CNCF Ambassador | Cloud Native Santo Domingo',
  description: 'Requisitos y beneficios de los programas Kubestronaut, Golden Kubestronaut y CNCF Ambassador.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/programs',
  },
  openGraph: { ...sharedOpenGraph, title: 'Hazte Kubestronaut o CNCF Ambassador | Cloud Native Santo Domingo', description: 'Requisitos y beneficios de los programas Kubestronaut, Golden Kubestronaut y CNCF Ambassador.', url: '/programs' },
  twitter: { ...sharedTwitter, title: 'Hazte Kubestronaut o CNCF Ambassador | Cloud Native Santo Domingo', description: 'Requisitos y beneficios de los programas Kubestronaut, Golden Kubestronaut y CNCF Ambassador.' },
};

export default function Programs() {
  return <ProgramsView />;
}
