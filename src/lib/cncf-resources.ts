// Live data for /resources. Each fetch is cached by Next and refreshed every REVALIDATE seconds;
// on failure a section falls back to its static link instead of breaking the page.
const REVALIDATE = 21600; // 6 hours
const UA = { "User-Agent": "cloudnativesdq-website/1.0" };
const CNCF_API = "https://www.cncf.io/wp-json/wp/v2";
const COUPON_README = "https://raw.githubusercontent.com/techiescamp/linux-foundation-coupon/main/README.md";

export interface Coupon {
  title: string;
  code: string;
  url: string;
}

export interface CncfEvent {
  title: string;
  start: string; // YYYY-MM-DD
  end: string;
  city: string;
  url: string;
  image?: string | null;
}

export interface CncfCourse {
  title: string;
  url: string;
}

const decode = (s: string) =>
  s.replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&amp;/g, "&").replace(/&#038;/g, "&");

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE }, headers: UA });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

// The README leads with the current sale: "## <title>" then "**Coupon:** Use code **CODE** at [x](url)".
export async function getCoupon(): Promise<Coupon | null> {
  try {
    const res = await fetch(COUPON_README, { next: { revalidate: REVALIDATE }, headers: UA });
    if (!res.ok) return null;
    const md = await res.text();
    const title = md.match(/^## (.+)$/m)?.[1];
    const coupon = md.match(/\*\*Coupon:\*\*\s*Use code \*\*([A-Z0-9]+)\*\* at \[[^\]]+\]\(([^)]+)\)/);
    if (!title || !coupon) return null;
    return { title: title.replace(/\[|\]/g, "").trim(), code: coupon[1], url: coupon[2] };
  } catch {
    return null;
  }
}

type WpCourse = { title: { rendered: string }; link: string; meta: { lf_course_free: boolean } };

export async function getFreeCourses(): Promise<CncfCourse[]> {
  try {
    const raw = await getJson<WpCourse[]>(`${CNCF_API}/lf_course?per_page=100&_fields=title,link,meta`);
    return raw.filter((c) => c.meta.lf_course_free).map((c) => ({ title: decode(c.title.rendered), url: c.link }));
  } catch {
    return [];
  }
}

export interface Article {
  title: string;
  url: string;
  date: string;
}

async function getRss(url: string): Promise<Article[]> {
  const xml = await fetch(url, { next: { revalidate: REVALIDATE }, headers: UA })
    .then((r) => (r.ok ? r.text() : ""))
    .catch(() => "");
  const items: Article[] = [];
  for (const item of xml.split("<item>").slice(1)) {
    const title = item.match(/<title>\s*(?:<!\[CDATA\[\s*)?([\s\S]*?)\s*(?:\]\]>\s*)?<\/title>/)?.[1];
    const url = item.match(/<link>([^<]+)<\/link>/)?.[1];
    const date = new Date(item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] ?? "");
    if (title && url && !isNaN(date.getTime())) items.push({ title: decode(title), url, date: date.toISOString() });
  }
  return items;
}

const latest = (items: Article[], limit: number) =>
  Array.from(new Map(items.map((a) => [a.url, a])).values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
}

const FCC_CHANNEL = "UC8butISFwT-Wl7EV0hUK0BQ";
const FCC_DEVOPS_PLAYLIST = "PLWKjhJtqVAbkzvvpY12KkfiIGso9A_Ixs";
const CLOUD_NATIVE_TOPICS = /kubernetes|k8s|docker|container|devops|cloud|aws|azure|gcp|terraform|helm|linux|platform engineering|observability|microservices/i;

async function getYouTubeFeed(query: string): Promise<Video[]> {
  const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?${query}`, { next: { revalidate: REVALIDATE } })
    .then((r) => (r.ok ? r.text() : ""))
    .catch(() => "");
  return xml
    .split("<entry>")
    .slice(1)
    .flatMap((entry) => {
      const id = entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]+)<\/title>/)?.[1];
      const date = entry.match(/<published>([^<]+)<\/published>/)?.[1];
      if (!id || !title || !date) return [];
      return [{ id, title: decode(title), url: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, date }];
    });
}

// freeCodeCamp videos on cloud native topics: its DevOps playlist plus recent channel uploads
// that match CLOUD_NATIVE_TOPICS, newest first. YouTube's feeds return the latest 15 items each.
export async function getFreeCodeCampVideos(limit = 6): Promise<Video[]> {
  const [playlist, channel] = await Promise.all([
    getYouTubeFeed(`playlist_id=${FCC_DEVOPS_PLAYLIST}`),
    getYouTubeFeed(`channel_id=${FCC_CHANNEL}`),
  ]);
  const videos = [...playlist, ...channel.filter((v) => CLOUD_NATIVE_TOPICS.test(v.title))];
  return Array.from(new Map(videos.map((v) => [v.id, v])).values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

// kubernetes.io (user blog) and kubernetes.dev (contributor blog).
export async function getKubernetesBlogs(limit = 5) {
  const [io, dev] = await Promise.all([
    getRss("https://kubernetes.io/feed.xml"),
    getRss("https://www.kubernetes.dev/blog/index.xml"),
  ]);
  return { io: latest(io, limit), dev: latest(dev.filter((a) => a.url.includes("/blog/")), limit) };
}

export interface Orientation {
  title: string;
  start: string; // ISO datetime
  url: string;
}

// New Contributor Orientation sessions from the public Kubernetes community calendar.
// Needs GOOGLE_CALENDAR_API_KEY (any Google Cloud key with the Calendar API enabled); without it the page links to the calendar.
export async function getNewContributorOrientations(limit = 4): Promise<Orientation[]> {
  const key = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!key) return [];
  const params = new URLSearchParams({
    key,
    q: "New Contributor Orientation",
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: new Date().toISOString(),
    maxResults: String(limit),
  });
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/calendar%40kubernetes.io/events?${params}`,
      { next: { revalidate: REVALIDATE } }
    );
    if (!res.ok) return [];
    const { items } = (await res.json()) as {
      items: { summary: string; htmlLink: string; start: { dateTime?: string; date?: string } }[];
    };
    return items.map((e) => ({ title: e.summary, start: e.start.dateTime ?? e.start.date ?? "", url: e.htmlLink }));
  } catch {
    return [];
  }
}

type LfPage = {
  title: { rendered: string };
  link: string;
  featured_media: number;
  meta: { lfes_date_start: string; lfes_date_end: string; lfes_city: string; lfes_external_url: string };
};

export interface LfEvents {
  kubecons: CncfEvent[];
  aaif: CncfEvent[];
}

// Upcoming KubeCon + CloudNativeCon and Agentic AI Foundation (AGNTCon + MCPCon, MCP Dev Summit,
// Agentics Day) events from the Linux Foundation events site. Top-level pages are the events.
export async function getLfEvents(): Promise<LfEvents> {
  const fields = "title,link,featured_media,meta.lfes_date_start,meta.lfes_date_end,meta.lfes_city,meta.lfes_external_url";
  const pages = await Promise.all(
    [1, 2, 3, 4].map((page) =>
      getJson<LfPage[]>(`https://events.linuxfoundation.org/wp-json/wp/v2/pages?parent=0&per_page=100&page=${page}&_fields=${fields}`).catch(
        () => [] as LfPage[]
      )
    )
  );
  const today = new Date().toISOString().slice(0, 10);
  const events = pages
    .flat()
    .filter((p) => p.meta?.lfes_date_start)
    .map((p) => ({
      title: decode(p.title.rendered),
      start: p.meta.lfes_date_start.replace(/\//g, "-"),
      end: (p.meta.lfes_date_end || p.meta.lfes_date_start).replace(/\//g, "-"),
      city: p.meta.lfes_city,
      url: p.meta.lfes_external_url || p.link,
      media: p.featured_media,
    }))
    .filter((e) => e.end >= today)
    .sort((a, b) => a.start.localeCompare(b.start))
    .filter((e) => /KubeCon|AGNTCon|MCPCon|MCP Dev Summit|Agentics Day/i.test(e.title));

  // One request for every featured image.
  const ids = Array.from(new Set(events.map((e) => e.media).filter(Boolean)));
  const media = ids.length
    ? await getJson<{ id: number; source_url: string; media_details?: { sizes?: Record<string, { source_url: string }> } }[]>(
        `https://events.linuxfoundation.org/wp-json/wp/v2/media?include=${ids.join(",")}&per_page=100&_fields=id,source_url,media_details.sizes`
      ).catch(() => [])
    : [];
  const imageById = new Map(media.map((m) => [m.id, m.media_details?.sizes?.medium_large?.source_url ?? m.source_url]));
  const withImages = events.map(({ media: id, ...e }) => ({ ...e, image: imageById.get(id) ?? null }));

  return {
    kubecons: withImages.filter((e) => /KubeCon/i.test(e.title)),
    aaif: withImages.filter((e) => /AGNTCon|MCPCon|MCP Dev Summit|Agentics Day/i.test(e.title)),
  };
}
