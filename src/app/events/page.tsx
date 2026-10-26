import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import { getCncfData } from "@/lib/cncf";
import EventsPage from "@/components/EventsPage";

export const metadata: Metadata = {
  title: 'Eventos | Cloud Native Santo Domingo',
  description: 'Explora todos los eventos de la comunidad Cloud Native Santo Domingo. Meetups, charlas, workshops y más sobre Kubernetes, Docker y Cloud Native en República Dominicana.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/events',
  },
  openGraph: { ...sharedOpenGraph, title: 'Eventos | Cloud Native Santo Domingo', description: 'Explora todos los eventos de la comunidad Cloud Native Santo Domingo.', url: '/events' },
  twitter: { ...sharedTwitter, title: 'Eventos | Cloud Native Santo Domingo', description: 'Explora todos los eventos de la comunidad Cloud Native Santo Domingo.' },
};

export default async function Events() {
  const data = await getCncfData();
  return <EventsPage data={data} />;
}