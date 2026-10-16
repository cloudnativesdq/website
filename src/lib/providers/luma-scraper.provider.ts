import type { CommunityEvent } from "../types";

export interface LumaEventConfig {
  url: string;
  type?: string;
  image?: string;
  location?: string;
}

function parseStructuredDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Santo_Domingo",
      });
    }
  } catch {
    // Luma occasionally returns a date we cannot parse or format; fall back to
    // showing the raw string rather than dropping the event's date entirely.
  }
  return dateStr;
}

async function fetchLumaEvent(config: LumaEventConfig): Promise<CommunityEvent | null> {
  try {
    const res = await fetch(config.url, {
      headers: {
        "User-Agent": "cloudnativesdq-website/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.warn(`[luma-scraper] fetch failed for ${config.url}: ${res.status}`);
      return null;
    }

    const html = await res.text();

    const ldMatch = html.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/
    );

    if (!ldMatch) {
      console.warn(`[luma-scraper] no ld+json found for ${config.url}`);
      return null;
    }

    const ld = JSON.parse(ldMatch[1]);

    const title = ld.name || "";
    const date = ld.startDate || "";
    const endDate = ld.endDate || "";

    let location = config.location;
    if (!location && ld.location) {
      if (typeof ld.location === "string") location = ld.location;
      else if (ld.location.name) location = ld.location.name;
    }

    const imageArr = ld.image;
    let image = config.image || "";
    if (!image && Array.isArray(imageArr) && imageArr.length > 0) {
      image = imageArr[0];
    } else if (!image && typeof imageArr === "string") {
      image = imageArr;
    }

    const type = config.type || "Meetup";

    const formattedDate = date ? parseStructuredDate(date) : "";

    return {
      title,
      type,
      image,
      url: config.url,
      date: formattedDate,
      location,
    };
  } catch (err) {
    console.warn(`[luma-scraper] error fetching ${config.url}:`, err);
    return null;
  }
}

export async function fetchLumaEvents(
  events: LumaEventConfig[]
): Promise<CommunityEvent[]> {
  const fetched = await Promise.all(
    events.map((e) => fetchLumaEvent(e))
  );
  return fetched.filter((e): e is CommunityEvent => e !== null);
}
