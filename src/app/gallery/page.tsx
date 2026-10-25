import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import GalleryPage from "@/components/GalleryPage";

export const metadata: Metadata = {
  title: 'Galería | Cloud Native Santo Domingo',
  description: 'Explora las fotos de nuestros eventos, meetups y encuentros de la comunidad Cloud Native Santo Domingo en República Dominicana.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/gallery',
  },
  openGraph: { ...sharedOpenGraph, title: 'Galería | Cloud Native Santo Domingo', description: 'Explora las fotos de nuestros eventos y encuentros.', url: '/gallery' },
  twitter: { ...sharedTwitter, title: 'Galería | Cloud Native Santo Domingo', description: 'Explora las fotos de nuestros eventos y encuentros.' },
};

export default function Gallery() {
  return <GalleryPage />;
}