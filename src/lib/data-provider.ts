import type { CommunityData, Organizer } from "./types";
import type { CommunityDataSource } from "./providers/community-data-source";
import { OcgScraperProvider } from "./providers/ocg-scraper.provider";
import { FallbackProvider } from "./providers/fallback.provider";
import { fetchLumaEvents, type LumaEventConfig } from "./providers/luma-scraper.provider";
import { mergeAndClassifyEvents } from "./event-utils";
import { links } from "./links";

function getLumaEventConfigs(): LumaEventConfig[] {
  const raw = process.env.LUMA_EVENT_URLS;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw.split(",").map((url) => ({ url: url.trim(), type: "Meetup" }));
    }
  }
  return links.lumaEvents as LumaEventConfig[];
}

function createDataSource(): CommunityDataSource {
  const source = process.env.DATA_SOURCE || "ocg";

  switch (source) {
    case "ocg":
      return new OcgScraperProvider();
    case "fallback":
      return new FallbackProvider();
    default:
      return new OcgScraperProvider();
  }
}

// Organizers not yet listed on the OCG group page. Skipped once OCG returns someone with the same name.
const extraOrganizers: Organizer[] = [
  {
    name: "Stacy Balbi",
    role: "Ing. de Software",
    company: "Ministerio de la Administración Pública",
    image: "/images/organizers/stacy.jpg",
    profileUrl: "https://ocgroups.dev/cncf/group/cqecyjw",
  },
  {
    name: "Molly Devers Mateo",
    role: "Regional Software Sales Consultant",
    company: "GBM",
    image: "/images/organizers/molly.jpg",
    profileUrl: "https://ocgroups.dev/cncf/group/cqecyjw",
  },
];

function withExtraOrganizers(data: CommunityData): CommunityData {
  const known = new Set(data.organizers.map((o) => o.name.toLowerCase()));
  const extra = extraOrganizers.filter((o) => !known.has(o.name.toLowerCase()));
  return { ...data, organizers: [...data.organizers, ...extra] };
}

const provider = createDataSource();
const fallback = new FallbackProvider();

export async function getCommunityData(): Promise<CommunityData> {
  let ocgData: CommunityData;

  try {
    ocgData = withExtraOrganizers(await provider.fetchData());
  } catch (error) {
    console.error(`[${provider.name}] failed, using fallback:`, error);
    ocgData = withExtraOrganizers(await fallback.fetchData());
  }

  const lumaConfigs = getLumaEventConfigs();
  let lumaEvents: Awaited<ReturnType<typeof fetchLumaEvents>> = [];
  if (lumaConfigs.length > 0) {
    try {
      lumaEvents = await fetchLumaEvents(lumaConfigs);
      console.log(`[data-provider] fetched ${lumaEvents.length} events from Luma`);
    } catch (err) {
      console.error("[data-provider] Luma fetch failed:", err);
    }
  }

  const { upcoming, past, pastCount } = mergeAndClassifyEvents(
    ocgData.upcoming,
    ocgData.past,
    lumaEvents
  );

  return {
    organizers: ocgData.organizers,
    upcoming,
    past,
    pastCount,
    membersCount: ocgData.membersCount,
  };
}
