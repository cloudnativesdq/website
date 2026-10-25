import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import { getMapData } from "@/lib/chapters";
import { getLfEvents } from "@/lib/cncf-resources";
import MapView from "@/components/MapView";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Cloud Native en el mundo | Cloud Native Santo Domingo',
  description: 'Capítulos CNCF del mundo en un mapa: próximos eventos, KCDs, Cloud Native Days y Kubestronauts por país.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/map',
  },
  openGraph: { ...sharedOpenGraph, title: 'Cloud Native en el mundo | Cloud Native Santo Domingo', description: 'Capítulos CNCF del mundo en un mapa: próximos eventos, KCDs, Cloud Native Days y Kubestronauts por país.', url: '/map' },
  twitter: { ...sharedTwitter, title: 'Cloud Native en el mundo | Cloud Native Santo Domingo', description: 'Capítulos CNCF del mundo en un mapa: próximos eventos, KCDs, Cloud Native Days y Kubestronauts por país.' },
};

export default async function CommunityMap() {
  const [data, lfEvents] = await Promise.all([getMapData(), getLfEvents()]);
  return <MapView data={data} lfEvents={lfEvents} />;
}
