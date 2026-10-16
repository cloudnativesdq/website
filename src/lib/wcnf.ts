// Women in Cloud Native LATAM (WCNF) events, loaded from the Luma profiles of its organizers.
// An event counts as WCNF when at least two organizers host it or its name mentions WCNF/women,
// so other events an organizer hosts (e.g. Hard Devs) are left out.
const REVALIDATE = 21600; // 6 hours

export const wcnfOrganizers = [
  { name: "Ayesha Yege", lumaId: "usr-xTp2Vh7yTBHXpFg", image: "/images/organizers/ayesha.jpg", linkedin: "https://www.linkedin.com/in/ayesha-yege/" },
  { name: "Molly Devers Mateo", lumaId: "usr-xV2GU63pySUHCDw", image: "/images/organizers/molly.jpg", linkedin: "https://www.linkedin.com/in/molly-devers-mateo-539b4615a/" },
  { name: "Stacy Balbi", lumaId: "usr-YZCdJgeb6A2GTpz", image: "/images/organizers/stacy.jpg", linkedin: "https://www.linkedin.com/in/stacybalbi" },
];

const WCNF_NAME = /WCNF|women in cloud|mujeres/i;

export interface WcnfEvent {
  name: string;
  start: string; // ISO datetime
  url: string;
  cover: string;
  location: string;
  upcoming: boolean;
}

type LumaEntry = {
  event: {
    api_id: string;
    name: string;
    start_at: string;
    end_at: string;
    url: string;
    cover_url: string;
    location_type: string;
    geo_address_info?: { city_state?: string; address?: string };
  };
};

async function getHosted(userId: string, period: "future" | "past"): Promise<LumaEntry[]> {
  try {
    const res = await fetch(
      `https://api.lu.ma/user/profile/events-hosting?user_api_id=${userId}&pagination_limit=50&period=${period}`,
      { next: { revalidate: REVALIDATE } }
    );
    if (!res.ok) return [];
    return (await res.json()).entries ?? [];
  } catch {
    return [];
  }
}

export async function getWcnfEvents(): Promise<WcnfEvent[]> {
  const lists = await Promise.all(
    wcnfOrganizers.flatMap((o) => [getHosted(o.lumaId, "future"), getHosted(o.lumaId, "past")])
  );
  const hostCount = new Map<string, number>();
  const byId = new Map<string, LumaEntry["event"]>();
  for (const list of lists) {
    for (const { event } of list) {
      hostCount.set(event.api_id, (hostCount.get(event.api_id) ?? 0) + 1);
      byId.set(event.api_id, event);
    }
  }
  const now = new Date().toISOString();
  return Array.from(byId.values())
    // Each organizer appears in two lists (future, past) but an event only in one of them.
    .filter((e) => (hostCount.get(e.api_id) ?? 0) >= 2 || WCNF_NAME.test(e.name))
    .map((e) => ({
      name: e.name,
      start: e.start_at,
      url: `https://luma.com/${e.url}`,
      cover: e.cover_url,
      location: e.location_type === "online" ? "Online" : e.geo_address_info?.city_state ?? "",
      upcoming: e.end_at >= now,
    }))
    .sort((a, b) => Number(b.upcoming) - Number(a.upcoming) || (a.upcoming ? a.start.localeCompare(b.start) : b.start.localeCompare(a.start)));
}
