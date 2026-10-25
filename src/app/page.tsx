
import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import { getCncfData } from "@/lib/cncf";
import { getDominicanCncfPeople } from "@/lib/cncf-people";
import { getWcnfEvents } from "@/lib/wcnf";
import HomeView from "@/components/HomeView";

export const metadata: Metadata = {
  title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD',
  description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.',
  alternates: {
    canonical: 'https://cloudnativesdq.org',
  },
  openGraph: { ...sharedOpenGraph, title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD', description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.', url: '/' },
  twitter: { ...sharedTwitter, title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD', description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.' },
};

export default async function Home() {
  const [data, people, wcnfEvents] = await Promise.all([getCncfData(), getDominicanCncfPeople(), getWcnfEvents()]);
  return <HomeView data={data} kubestronautsCount={people.kubestronauts.length} wcnfEvents={wcnfEvents} />;
}
