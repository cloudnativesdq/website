import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import { getCncfData } from "@/lib/cncf";
import { getDominicanCncfPeople } from "@/lib/cncf-people";
import TeamPage from "@/components/TeamPage";

export const metadata: Metadata = {
  title: 'Equipo | Cloud Native Santo Domingo',
  description: 'Conoce al equipo detrás de la comunidad Cloud Native Santo Domingo. Organizadores, voluntarios y apasionados por las tecnologías cloud native en República Dominicana.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/team',
  },
  openGraph: { ...sharedOpenGraph, title: 'Equipo | Cloud Native Santo Domingo', description: 'Conoce al equipo detrás de la comunidad Cloud Native Santo Domingo.', url: '/team' },
  twitter: { ...sharedTwitter, title: 'Equipo | Cloud Native Santo Domingo', description: 'Conoce al equipo detrás de la comunidad Cloud Native Santo Domingo.' },
};

export default async function Team() {
  const [data, people] = await Promise.all([getCncfData(), getDominicanCncfPeople()]);
  return <TeamPage data={data} people={people} />;
}