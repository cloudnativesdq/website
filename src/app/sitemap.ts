import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

const routes: [path: string, changeFrequency: Freq, priority: number][] = [
  ['', 'weekly', 1],
  ['/events', 'weekly', 0.9],
  ['/gallery', 'monthly', 0.5],
  ['/team', 'monthly', 0.6],
  ['/map', 'daily', 0.8],
  ['/programs', 'monthly', 0.7],
  ['/resources', 'daily', 0.8],
  ['/start-a-chapter', 'monthly', 0.6],
  ['/contact', 'monthly', 0.8],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
