import type { Metadata } from 'next';
import GalleryPage from "@/components/GalleryPage";

export const metadata: Metadata = {
  title: 'Galería | Cloud Native Santo Domingo',
  description: 'Explora las fotos de nuestros eventos, meetups y encuentros de la comunidad Cloud Native Santo Domingo en República Dominicana.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/gallery',
  },
  openGraph: {
    title: 'Galería | Cloud Native Santo Domingo',
    description: 'Explora las fotos de nuestros eventos y encuentros.',
    url: 'https://cloudnativesdq.org/gallery',
    siteName: 'Cloud Native Santo Domingo',
    locale: 'es_DO',
    type: 'website',
  },
};

export default function Gallery() {
  return <GalleryPage />;
}