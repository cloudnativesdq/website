
import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import ContactView from "@/components/ContactView";

export const metadata: Metadata = {
  title: 'Contacto | Cloud Native Santo Domingo',
  description: '¿Tienes preguntas o quieres colaborar con Cloud Native Santo Domingo? Escríbenos.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/contact',
  },
  openGraph: { ...sharedOpenGraph, title: 'Contacto | Cloud Native Santo Domingo', description: '¿Tienes preguntas o quieres colaborar con Cloud Native Santo Domingo? Escríbenos.', url: '/contact' },
  twitter: { ...sharedTwitter, title: 'Contacto | Cloud Native Santo Domingo', description: '¿Tienes preguntas o quieres colaborar con Cloud Native Santo Domingo? Escríbenos.' },
};

export default function ContactPage() {
  return <ContactView />;
}
