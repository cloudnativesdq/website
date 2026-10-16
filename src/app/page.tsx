
import type { Metadata } from 'next';
import { getCncfData } from "@/lib/cncf";
import { getDominicanCncfPeople } from "@/lib/cncf-people";
import { getWcnfEvents } from "@/lib/wcnf";
import HomeView from "@/components/HomeView";

export const metadata: Metadata = {
  title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD',
  description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.',
  keywords: [
    'Cloud Native',
    'CNCF',
    'Santo Domingo',
    'República Dominicana',
    'Kubernetes',
    'Docker',
    'DevOps',
    'Comunidad Tech',
    'Eventos de Tecnología',
  ],
  alternates: {
    canonical: 'https://cloudnativesdq.org',
  },
  openGraph: {
    title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF',
    description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos sobre Kubernetes, Docker y Cloud Native en RD.',
    url: 'https://cloudnativesdq.org',
    siteName: 'Cloud Native Santo Domingo',
    locale: 'es_DO',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cloud Native Santo Domingo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Native Santo Domingo',
    description: 'Comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo, República Dominicana.',
    images: ['/og-image.jpg'],
  },
};

export default async function Home() {
  const [data, people, wcnfEvents] = await Promise.all([getCncfData(), getDominicanCncfPeople(), getWcnfEvents()]);
  return <HomeView data={data} kubestronautsCount={people.kubestronauts.length} wcnfEvents={wcnfEvents} />;
}
