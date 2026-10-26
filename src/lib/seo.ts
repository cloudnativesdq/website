import type { Metadata } from 'next';

// Next merges `openGraph` and `twitter` shallowly: a page that sets either one replaces the parent's
// whole object. Every page spreads these and adds its own title, description and url.
export const SITE_URL = 'https://cloudnativesdq.org';

export const sharedOpenGraph = {
  siteName: 'Cloud Native Santo Domingo',
  locale: 'es_DO',
  type: 'website',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Cloud Native Santo Domingo' }],
} satisfies NonNullable<Metadata['openGraph']>;

export const sharedTwitter = {
  card: 'summary_large_image',
  images: ['/og-image.jpg'],
} satisfies NonNullable<Metadata['twitter']>;
