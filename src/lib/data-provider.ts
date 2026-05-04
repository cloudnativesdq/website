import type { CommunityData } from "./types";
import type { CommunityDataSource } from "./providers/community-data-source";
import { OcgScraperProvider } from "./providers/ocg-scraper.provider";
import { FallbackProvider } from "./providers/fallback.provider";

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

const provider = createDataSource();
const fallback = new FallbackProvider();

export async function getCommunityData(): Promise<CommunityData> {
  try {
    return await provider.fetchData();
  } catch (error) {
    console.error(`[${provider.name}] failed, using fallback:`, error);
    return fallback.fetchData();
  }
}
