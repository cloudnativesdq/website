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

type WpEvent = {
  title: { rendered: string };
  link: string;
  meta: { lf_event_date_start: string; lf_event_date_end: string; lf_event_city: string; lf_event_external_url: string };
};

export async function getUpcomingEvents(limit = 8): Promise<CncfEvent[]> {
  try {
    const raw = await getJson<WpEvent[]>(`${CNCF_API}/lf_event?per_page=100&_fields=title,link,meta`);
    const today = new Date().toISOString().slice(0, 10);
    const events = raw
      .map((e) => ({
        title: decode(e.title.rendered),
        start: e.meta.lf_event_date_start.replace(/\//g, "-"),
        end: (e.meta.lf_event_date_end || e.meta.lf_event_date_start).replace(/\//g, "-"),
        city: e.meta.lf_event_city,
        url: e.meta.lf_event_external_url || e.link,
      }))
      .filter((e) => e.end >= today)
      .sort((a, b) => a.start.localeCompare(b.start));

    // KubeCon co-located events share a date and city; keep only the KubeCon entry.
    const byVenue = new Map<string, CncfEvent>();
    for (const e of events) {
      const key = `${e.start}|${e.city}`;
      const kept = byVenue.get(key);
      if (!kept || (/kubecon/i.test(e.title) && !/kubecon/i.test(kept.title))) byVenue.set(key, e);
    }
    return Array.from(byVenue.values()).slice(0, limit);
  } catch {
    return [];
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

// Latest freeCodeCamp articles tagged kubernetes or cloud-native.
export async function getFreeCodeCampArticles(limit = 8): Promise<Article[]> {
  const feeds = await Promise.all(
    ["kubernetes", "cloud-native"].map((tag) => getRss(`https://www.freecodecamp.org/news/tag/${tag}/rss/`))
  );
  return latest(feeds.flat(), limit);
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
