import { MetadataRoute } from 'next'
import { getCncfData } from '@/lib/cncf';

function parseSitemapDate(dateStr: string): Date {
  try {
    const match = dateStr.match(/(\w+)\s+(\d+),\s*(\d+)/);
    if (match) {
      const [, month, day, year] = match;
      const fullYear = year.length === 2 ? `20${year}` : year;
      const parsed = new Date(`${month} ${day}, ${fullYear}`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const fallback = new Date(dateStr);
    if (!isNaN(fallback.getTime())) return fallback;
    return new Date();
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cloudnativesdq.org';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    const data = await getCncfData();
    
    const eventPages: MetadataRoute.Sitemap = [
      ...data.upcoming.map(event => ({
        url: event.url,
        lastModified: parseSitemapDate(event.date),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })),
      ...data.past.slice(0, 10).map(event => ({
        url: event.url,
        lastModified: parseSitemapDate(event.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];

    return [...staticPages, ...eventPages];
  } catch (error) {
    console.error('Failed to fetch events for sitemap:', error);
    return staticPages;
  }
}