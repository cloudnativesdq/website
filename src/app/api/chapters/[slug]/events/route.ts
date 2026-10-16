import { fetchGroupUpcomingEvents } from "@/lib/providers/ocg-scraper.provider";
import { json } from "@/lib/api";

export const revalidate = 3600;

// Upcoming events for one CNCF chapter, e.g. /api/chapters/cqecyjw/events
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,80}$/i.test(slug)) return json({ error: "invalid chapter slug" }, 400);
  try {
    return json({ slug, events: await fetchGroupUpcomingEvents(slug) });
  } catch {
    return json({ error: "could not load events from ocgroups.dev" }, 502);
  }
}
