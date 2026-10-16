// Live data for /map: CNCF chapters (OCG), their upcoming events, Kubestronauts per country (cncf.io),
// upcoming KCDs (cncf.io) and Cloud Native Days (cloudnativedays.org). Refreshed every REVALIDATE seconds.
const REVALIDATE = 21600; // 6 hours
const UA = { "User-Agent": "cloudnativesdq-website/1.0" };
const OCG = "https://ocgroups.dev";
const CNCF_API = "https://www.cncf.io/wp-json/wp/v2";
// Search & Filter forms behind cncf.io/training/kubestronaut and cncf.io/people/ambassadors;
// they return per-country counts without downloading the multi-MB directory pages.
const KUBESTRONAUT_FORM = "https://www.cncf.io/?sfid=105686&sf_action=get_data&sf_data=form";
const AMBASSADOR_FORM = "https://www.cncf.io/?sfid=65957&sf_action=get_data&sf_data=form";

export interface MapEvent {
  name: string;
  start: string; // ISO date
  url: string;
}

export interface Chapter {
  name: string;
  url: string;
  region: string;
  location: string;
  countryCode: string | null; // ISO 3166-1 alpha-2, lowercase
  lat: number | null;
  lng: number | null;
  events: MapEvent[];
}

export interface Country {
  code: string;
  name: string;
  kubestronauts: number;
  ambassadors: number;
}

export interface Kcd extends MapEvent {
  city: string;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
}

export interface MapData {
  chapters: Chapter[];
  countries: Country[];
  kcds: Kcd[];
  cloudNativeDays: (MapEvent & { countryCode: string | null })[];
}

async function get(url: string, init?: RequestInit) {
  const res = await fetch(url, { next: { revalidate: REVALIDATE }, headers: UA, ...init });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res;
}

const decode = (s: string) =>
  s.replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&#39;/g, "'").trim();

// Country names OCG uses that differ from cncf.io's.
const COUNTRY_ALIASES: Record<string, string> = {
  us: "us",
  usa: "us",
  "united states of america": "us",
  uk: "gb",
  "republic of korea": "kr",
  "south korea": "kr",
  "the netherlands": "nl",
  netherlands: "nl",
  "czech republic": "cz",
  turkey: "tr",
  "türkiye": "tr",
  russia: "ru",
  vietnam: "vn",
  "ivory coast": "ci",
  deutschland: "de",
  czechia: "cz",
  pichincha: "ec",
};

// cncf.io country taxonomy: slug is the ISO code. Gives id -> code (for events) and name -> code (for OCG).
async function getCountryTaxonomy() {
  const byId = new Map<number, string>();
  const byName = new Map<string, string>(Object.entries(COUNTRY_ALIASES));
  for (let page = 1; page <= 5; page++) {
    const res = await get(`${CNCF_API}/lf-country?per_page=100&page=${page}&_fields=id,name,slug`).catch(() => null);
    if (!res) break;
    const terms: { id: number; name: string; slug: string }[] = await res.json();
    for (const t of terms) {
      if (t.slug.length !== 2) continue; // skip continents
      byId.set(t.id, t.slug);
      byName.set(decode(t.name).toLowerCase(), t.slug);
    }
    if (terms.length < 100) break;
  }
  return { byId, byName };
}

async function getCountryCounts(formUrl: string): Promise<{ code: string; name: string; count: number }[]> {
  try {
    const { form } = (await (await get(formUrl)).json()) as { form: string };
    const re = /data-sf-count="(\d+)" data-sf-depth="1" value="([a-z]{2})">(?:&nbsp;)*([^<&]+)/g;
    return Array.from(form.matchAll(re), (m) => ({ code: m[2], name: decode(m[3]), count: Number(m[1]) }));
  } catch {
    return [];
  }
}

async function getCountries(): Promise<Country[]> {
  const [kubestronauts, ambassadors] = await Promise.all([
    getCountryCounts(KUBESTRONAUT_FORM),
    getCountryCounts(AMBASSADOR_FORM),
  ]);
  const byCode = new Map<string, Country>();
  for (const k of kubestronauts) byCode.set(k.code, { code: k.code, name: k.name, kubestronauts: k.count, ambassadors: 0 });
  for (const a of ambassadors) {
    const row = byCode.get(a.code) ?? { code: a.code, name: a.name, kubestronauts: 0, ambassadors: 0 };
    row.ambassadors = a.count;
    byCode.set(a.code, row);
  }
  return Array.from(byCode.values());
}

export const ambassadorsUrl = (code: string) => `https://www.cncf.io/people/ambassadors/?_sft_lf-country=${code}`;
export const kubestronautsUrl = (code: string) => `https://www.cncf.io/training/kubestronaut/?_sft_lf-country=${code}`;

type OcgMapGroup = { slug: string; slug_pretty?: string; latitude: number; longitude: number };
type OcgMapEvent = { group_slug: string; name: string; slug: string; starts_at: number };

// OCG's explore page renders full group cards (with location); its JSON endpoint only has coordinates.
async function getChapters(countryByName: Map<string, string>): Promise<Chapter[]> {
  const [coordsRes, eventsRes, ...pages] = await Promise.all([
    get(`${OCG}/explore/groups/search?community%5B0%5D=cncf&view_mode=map`),
    get(`${OCG}/explore/events/search?community%5B0%5D=cncf&view_mode=map`),
    ...[0, 100, 200, 300].map((offset) =>
      get(`${OCG}/explore?entity=groups&community%5B0%5D=cncf&limit=100&offset=${offset}`).then((r) => r.text())
    ),
  ]);
  const coords = new Map<string, OcgMapGroup>();
  for (const g of ((await coordsRes.json()) as { groups: OcgMapGroup[] }).groups) {
    coords.set(g.slug, g);
    if (g.slug_pretty) coords.set(g.slug_pretty, g);
  }
  const eventsBySlug = new Map<string, MapEvent[]>();
  for (const e of ((await eventsRes.json()) as { events: OcgMapEvent[] }).events) {
    const list = eventsBySlug.get(e.group_slug) ?? [];
    list.push({
      name: decode(e.name),
      start: new Date(e.starts_at * 1000).toISOString(),
      url: `${OCG}/cncf/group/${e.group_slug}/event/${e.slug}`,
    });
    eventsBySlug.set(e.group_slug, list);
  }

  const chapters: Chapter[] = [];
  for (const html of pages as string[]) {
    for (const card of html.split('<a href="/cncf/group/').slice(1)) {
      const slug = card.slice(0, card.indexOf('"'));
      const name = card.match(/class="card-title[^"]*"[^>]*>\s*([^<]+?)\s*<\/div>/)?.[1];
      if (!name) continue;
      const region = card.match(/class="card-header">\s*<span>[\s\S]*?·<\/span>\s*([^<]+)<\/span>/)?.[1].trim() ?? "";
      const location = card.match(/icon-location[^>]*><\/div>\s*<span class="truncate">([^<]+)<\/span>/)?.[1].trim() ?? "";
      const country = location.split(",").pop()!.trim().toLowerCase();
      const found = coords.get(slug);
      const c = found && (found.latitude || found.longitude) ? found : undefined; // OCG uses 0,0 for "no location"
      const ocgSlug = found?.slug ?? slug;
      chapters.push({
        name: decode(name),
        url: `${OCG}/cncf/group/${slug}`,
        region,
        location: location === "No location provided" ? "" : decode(location),
        countryCode: countryByName.get(country) ?? (/^[a-z]{2}$/.test(country) ? country : null),
        lat: c?.latitude ?? null,
        lng: c?.longitude ?? null,
        events: (eventsBySlug.get(ocgSlug) ?? []).sort((a, b) => a.start.localeCompare(b.start)),
      });
    }
  }
  return chapters;
}

type WpEvent = {
  title: { rendered: string };
  link: string;
  "lf-country": number[];
  meta: { lf_event_date_start: string; lf_event_date_end: string; lf_event_city: string; lf_event_external_url: string };
};

// KCDs have no coordinates; pin them on a chapter in the same city when there is one.
async function getKcds(countryById: Map<number, string>, chapters: Chapter[]): Promise<Kcd[]> {
  const raw: WpEvent[] = await (await get(`${CNCF_API}/lf_event?per_page=100&_fields=title,link,meta,lf-country`)).json();
  const today = new Date().toISOString().slice(0, 10);
  return raw
    .filter((e) => /\bKCD\b|Kubernetes Community Days/i.test(e.title.rendered))
    .map((e) => {
      const city = e.meta.lf_event_city || "";
      const near = city && chapters.find((c) => c.lat !== null && c.location.toLowerCase().startsWith(city.toLowerCase()));
      return {
        name: decode(e.title.rendered),
        start: e.meta.lf_event_date_start.replace(/\//g, "-"),
        url: e.meta.lf_event_external_url || e.link,
        city,
        countryCode: countryById.get(e["lf-country"]?.[0]) ?? null,
        lat: near ? near.lat : null,
        lng: near ? near.lng : null,
      };
    })
    .filter((e) => e.start >= today)
    .sort((a, b) => a.start.localeCompare(b.start));
}

type CndEntry = { type: string; title: string; date: string; externalUrl: string | null; permalink: string };

async function getCloudNativeDays(countryByName: Map<string, string>): Promise<MapData["cloudNativeDays"]> {
  const entries: CndEntry[] = await (await get("https://cloudnativedays.org/index.json")).json();
  const today = new Date().toISOString().slice(0, 10);
  return entries
    .filter((e) => e.type === "events" && e.permalink !== "/events/")
    .map((e) => ({
      name: `Cloud Native Days ${e.title}`,
      start: new Date(`${e.date} UTC`).toISOString().slice(0, 10),
      url: e.externalUrl || `https://cloudnativedays.org${e.permalink}`,
      countryCode: countryByName.get(e.title.toLowerCase()) ?? null,
    }))
    .filter((e) => e.start >= today)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export async function getMapData(): Promise<MapData> {
  const [taxonomy, countries] = await Promise.all([
    getCountryTaxonomy().catch(() => ({ byId: new Map<number, string>(), byName: new Map<string, string>() })),
    getCountries(),
  ]);
  const chapters = await getChapters(taxonomy.byName).catch(() => []);
  const [kcds, cloudNativeDays] = await Promise.all([
    getKcds(taxonomy.byId, chapters).catch(() => []),
    getCloudNativeDays(taxonomy.byName).catch(() => []),
  ]);
  return { chapters, countries, kcds, cloudNativeDays };
}

export const flag = (code: string | null) =>
  code ? String.fromCodePoint(...code.toUpperCase().split("").map((c) => 0x1f1a5 + c.charCodeAt(0))) : "";
