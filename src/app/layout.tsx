
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/hooks/use-language";
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cloudnativesdq.org'),
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
  openGraph: {
    title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF',
    description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos sobre Kubernetes, Docker y Cloud Native en RD.',
    url: 'https://cloudnativesdq.org',
    siteName: 'Cloud Native Santo Domingo',
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Native Santo Domingo',
    description: 'Comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo, República Dominicana.',
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://cloudnativesdq.org',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <TooltipProvider>
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
