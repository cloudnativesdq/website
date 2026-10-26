
import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "next-themes";
import { SITE_URL, sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import { LANGUAGE_COOKIE, resolveLanguage } from '@/lib/language';
import { cookies, headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD',
  description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.',
  openGraph: { ...sharedOpenGraph, title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD', description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.', url: '/' },
  twitter: { ...sharedTwitter, title: 'Cloud Native Santo Domingo | Comunidad Oficial CNCF en RD', description: 'Únete a la comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native en República Dominicana.' },
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

// Reading the cookie and Accept-Language makes every page render per request, in the visitor's
// language. Data stays cached at the fetch layer.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = resolveLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value, (await headers()).get('accept-language'));
  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      {/* Fonts are self-hosted from the design system — see the @font-face rules
          in _ds/style-guide/tokens/fonts.css, imported by globals.css. The
          previous Google Fonts <link> was removed: it duplicated the download
          and only shipped static weights (Inter 400/500/600, Space Grotesk
          400-700), which cannot render font-black headings or the design
          system's full 100-900 / 300-700 variable ranges. */}
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <LanguageProvider initialLanguage={lang}>
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
