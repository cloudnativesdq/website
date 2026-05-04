import type { CommunityData, Organizer, CommunityEvent } from "../types";
import type { CommunityDataSource } from "./community-data-source";

const OCG_BASE_URL = "https://ocgroups.dev";

interface OcgUserChip {
  user_id: string;
  username: string;
  company?: string;
  name: string;
  photo_url?: string;
  title?: string;
}

const LOCAL_ORGANIZER_IMAGES: Record<string, string> = {
  "fdb0d8b43af30293e93e60c9c88456a4dbc0a836964486599b8df96614c960dd.jpg": "/images/organizers/enmanuel.jpg",
  "e1ce229b5b1421ab9243e1916434985df0e6fa9afc8d0d0c86d5be79b0a6811a.jpg": "/images/organizers/ayesha.jpg",
  "ffae15ca0f72b449de23e3fe949ea2b3ad44c47ec695f6844512d65c6988d646.jpeg": "/images/organizers/miguel.jpeg",
  "ae4b06c6adf642d80dafcf9b1211f3cf0afc6aeb98e82cbff5409d68739f05e9.jpg": "/images/organizers/lester.jpg",
};

function resolveImageUrl(path: string | undefined, baseUrl: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const filename = path.split("/").pop() || "";
  if (LOCAL_ORGANIZER_IMAGES[filename]) {
    return LOCAL_ORGANIZER_IMAGES[filename];
  }

  return `/api/ocg-image?path=${encodeURIComponent(path)}`;
}

function parseMembersCount(html: string): number {
  const match = html.match(/(\d+)\s+members/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseOrganizers(html: string, baseUrl: string): Organizer[] {
  const organizers: Organizer[] = [];
  const chipRegex = /<user-chip[^>]*user='([^']*)'[^>]*>/g;
  let match;

  while ((match = chipRegex.exec(html)) !== null) {
    try {
      const decoded = match[1]
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      const user: OcgUserChip = JSON.parse(decoded);

      organizers.push({
        name: user.name || "",
        role: user.title || "",
        company: user.company || "",
        image: resolveImageUrl(user.photo_url, baseUrl),
        profileUrl: `${baseUrl}/cncf/group/cqecyjw`,
      });
    } catch {
      // Skip malformed user-chip entries
    }
  }

  return organizers;
}

function parseEvents(html: string, baseUrl: string): {
  upcoming: CommunityEvent[];
  past: CommunityEvent[];
} {
  const upcoming = parseEventSection(html, "Upcoming Events", baseUrl);
  const past = parseEventSection(html, "Past Events", baseUrl);
  return { upcoming, past };
}

function parseEventSection(
  html: string,
  sectionTitle: string,
  baseUrl: string
): CommunityEvent[] {
  const events: CommunityEvent[] = [];

  const sectionStart = html.indexOf(sectionTitle);
  if (sectionStart === -1) return events;

  const eventLinkRegex =
    /<a\s+href="(\/cncf\/group\/[^"]+\/event\/[^"]+)"[^>]*>[\s\S]*?<\/a>/g;
  eventLinkRegex.lastIndex = sectionStart;

  let match;
  let count = 0;
  const maxEvents = 50;

  while ((match = eventLinkRegex.exec(html)) !== null && count < maxEvents) {
    const block = match[0];
    const eventUrl = match[1];

    // Stop if we've entered the next major section
    if (count > 0) {
      const nextSection = html.indexOf(
        '<div class="uppercase text-lg',
        sectionStart + sectionTitle.length + count * 10
      );
      if (nextSection !== -1 && match.index > nextSection) break;
    }

    const title = extractTextBetween(block, "card-title", "</div>");
    if (!title) continue;

    const dateText = extractDateText(block);
    const locationText = extractLocationText(block);
    const imageStyle = block.match(
      /background-image:\s*url\('([^']+)'\)/
    );
    const image = resolveImageUrl(
      imageStyle ? imageStyle[1] : undefined,
      baseUrl
    );

    // Extract category/type from card-header
    const typeMatch = block.match(
      /<div class="card-header">\s*<span>([^<]*)<\/span>/
    );
    const type = typeMatch ? typeMatch[1].trim() : "Meetup";

    events.push({
      title: title.trim(),
      type,
      image,
      url: `${baseUrl}${eventUrl}`,
      date: dateText || new Date().toISOString(),
      location: locationText || undefined,
    });

    count++;
  }

  return events;
}

function extractTextBetween(
  html: string,
  afterClass: string,
  endTag: string
): string {
  const idx = html.indexOf(afterClass);
  if (idx === -1) return "";

  const afterBlock = html.substring(idx);
  const lineClampMatch = afterBlock.match(
    /line-clamp-2[^>]*>\s*([\s\S]*?)\s*<\/div>/
  );
  if (lineClampMatch) {
    return lineClampMatch[1].replace(/<[^>]+>/g, "").trim();
  }

  return "";
}

function extractDateText(block: string): string {
  const dateMatch = block.match(
    /icon-date[^>]*>[\s\S]*?<span class="truncate">([^<]+)<\/span>/
  );
  return dateMatch ? dateMatch[1].trim() : "";
}

function extractLocationText(block: string): string {
  const locMatch = block.match(
    /icon-location[^>]*>[\s\S]*?<span class="truncate">([^<]+)<\/span>/
  );
  return locMatch ? locMatch[1].trim() : "";
}

export class OcgScraperProvider implements CommunityDataSource {
  readonly name = "ocg-scraper";
  private groupSlug: string;
  private baseUrl: string;

  constructor(
    groupSlug: string = process.env.OCG_GROUP_SLUG || "cqecyjw",
    baseUrl: string = process.env.OCG_BASE_URL || OCG_BASE_URL
  ) {
    this.groupSlug = groupSlug;
    this.baseUrl = baseUrl;
  }

  async fetchData(): Promise<CommunityData> {
    const url = `${this.baseUrl}/cncf/group/${this.groupSlug}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "cloudnativesdq-website/1.0",
      },
    });

    if (!res.ok) {
      throw new Error(`OCG fetch failed: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();

    const membersCount = parseMembersCount(html);
    const organizers = parseOrganizers(html, this.baseUrl);
    const { upcoming, past } = parseEvents(html, this.baseUrl);

    return {
      organizers,
      upcoming,
      past,
      pastCount: past.length || 0,
      membersCount,
    };
  }
}
