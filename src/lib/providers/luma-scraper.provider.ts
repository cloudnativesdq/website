import type { CommunityEvent } from "../types";

export interface LumaEventConfig {
  url: string;
  type?: string;
  image?: string;
  location?: string;
}

// Ask Luma's image CDN for an 800px AVIF/WebP instead of the original upload (e.g. 448KB PNG to 30KB AVIF).
// The CDN caches each variant (max-age 31 days), so the site needs no image proxy of its own.
export function lumaImage(url: string): string {
  return url.replace(
    /^https:\/\/images\.lumacdn\.com\/(?:cdn-cgi\/image\/[^/]+\/)?/,
    "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=scale-down,quality=75,width=800/"
  );
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
      // Cached like the OCG data; uncached requests on every render got rate-limited (429) by Luma.
      next: { revalidate: 3600 },
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
      image: lumaImage(image),
      url: config.url,
      date: formattedDate,
      location,
      ...(date && { startDate: date }),
      ...(endDate && { endDate }),
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

type LumaCalendarEntry = {
  event?: {
    name?: string;
    url?: string;
    start_at?: string;
    end_at?: string;
    cover_url?: string;
    location_type?: string;
    geo_address_info?: { address?: string; city_state?: string };
  };
};

// Upcoming events of a public Luma calendar page (e.g. https://luma.com/aaif-santodomingo).
// ponytail: the page embeds only the first ~20 upcoming events and no past ones, so ended partner
// events drop off the site; page through api.lu.ma if a partner calendar outgrows that.
export async function fetchLumaCalendarEvents(
  calendarUrl: string,
  type: string
): Promise<CommunityEvent[]> {
  try {
    const res = await fetch(calendarUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "cloudnativesdq-website/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.warn(`[luma-scraper] calendar fetch failed for ${calendarUrl}: ${res.status}`);
      return [];
    }
    const m = (await res.text()).match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    const entries: LumaCalendarEntry[] =
      (m && JSON.parse(m[1]).props?.pageProps?.initialData?.data?.upcoming?.entries) || [];
    return entries.flatMap(({ event: e }) => {
      if (!e?.name || !e.url || !e.start_at) return [];
      const geo = e.geo_address_info;
      return [{
        title: e.name,
        type,
        image: e.cover_url ? lumaImage(e.cover_url) : "",
        // Calendars can list external events, whose url is absolute.
        url: /^https?:\/\//.test(e.url) ? e.url : `https://luma.com/${e.url}`,
        date: parseStructuredDate(e.start_at),
        location: e.location_type === "online" ? "Online" : geo?.address || geo?.city_state,
        startDate: e.start_at,
        ...(e.end_at && { endDate: e.end_at }),
      }];
    });
  } catch (err) {
    console.warn(`[luma-scraper] error fetching calendar ${calendarUrl}:`, err);
    return [];
  }
}
