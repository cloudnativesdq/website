import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import PartnersView from "@/components/PartnersView";

const title = 'Comunidades aliadas | Cloud Native Santo Domingo';
const description = 'Comunidades tech de República Dominicana aliadas de Cloud Native Santo Domingo: AAIF Community Santo Domingo (Agentic AI Foundation) y Hard Devs Community.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://cloudnativesdq.org/partners' },
  openGraph: { ...sharedOpenGraph, title, description, url: '/partners' },
  twitter: { ...sharedTwitter, title, description },
};

export default function Partners() {
  return <PartnersView />;
}
