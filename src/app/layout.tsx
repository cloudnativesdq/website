
import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "next-themes";
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

// Icons come from the file conventions in this folder (favicon.ico, icon.svg, apple-icon.png) and
// manifest.ts. theme-color follows the OS color scheme, not the in-page theme toggle.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
    { media: '(prefers-color-scheme: light)', color: '#f7f9fc' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      {/* Fonts are self-hosted from the design system — see the @font-face rules
          in _ds/style-guide/tokens/fonts.css, imported by globals.css. The
          previous Google Fonts <link> was removed: it duplicated the download
          and only shipped static weights (Inter 400/500/600, Space Grotesk
          400-700), which cannot render font-black headings or the design
          system's full 100-900 / 300-700 variable ranges. */}
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            <TooltipProvider>
              {children}
              <Analytics />
              <SpeedInsights />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
