import type { Metadata } from 'next';

// Next merges `openGraph` and `twitter` shallowly: a page that sets either one replaces the parent's
// whole object. Every page spreads these and adds its own title, description and url.
export const SITE_URL = 'https://cloudnativesdq.org';

export const sharedOpenGraph = {
  siteName: 'Cloud Native Santo Domingo',
  locale: 'es_DO',
  type: 'website',
} satisfies NonNullable<Metadata['openGraph']>;

// No images here: each route's opengraph-image.tsx supplies og:image, and Next copies it to
// twitter:image when twitter.images is unset.
export const sharedTwitter = {
  card: 'summary_large_image',
} satisfies NonNullable<Metadata['twitter']>;
