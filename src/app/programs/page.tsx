import type { Metadata } from 'next';
import ProgramsView from "@/components/ProgramsView";

export const metadata: Metadata = {
  title: 'Hazte Kubestronaut o CNCF Ambassador | Cloud Native Santo Domingo',
  description: 'Requisitos y beneficios de los programas Kubestronaut, Golden Kubestronaut y CNCF Ambassador.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/programs',
  },
};

export default function Programs() {
  return <ProgramsView />;
}
