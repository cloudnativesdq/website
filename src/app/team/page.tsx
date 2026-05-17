import type { Metadata } from 'next';
import { getCncfData } from "@/lib/cncf";
import TeamPage from "@/components/TeamPage";

export const metadata: Metadata = {
  title: 'Equipo | Cloud Native Santo Domingo',
  description: 'Conoce al equipo detrás de la comunidad Cloud Native Santo Domingo. Organizadores, voluntarios y apasionados por las tecnologías cloud native en República Dominicana.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/team',
  },
  openGraph: {
    title: 'Equipo | Cloud Native Santo Domingo',
    description: 'Conoce al equipo detrás de la comunidad Cloud Native Santo Domingo.',
    url: 'https://cloudnativesdq.org/team',
    siteName: 'Cloud Native Santo Domingo',
    locale: 'es_DO',
    type: 'website',
  },
};

export default async function Team() {
  const data = await getCncfData();
  return <TeamPage data={data} />;
}