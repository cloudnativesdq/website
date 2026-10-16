// Collects every freeCodeCamp YouTube video about Kubernetes, Docker/containers and the CNCF
// certifications, with its publish date and thumbnail, into src/data/freecodecamp-videos.json.
//
// YouTube blocks requests from Vercel's servers, so the site cannot fetch this at request time.
// The "Update freeCodeCamp videos" workflow runs this script daily from GitHub Actions and commits
// the JSON when it changes. Run it locally with: node scripts/update-freecodecamp-videos.mjs
import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../src/data/freecodecamp-videos.json", import.meta.url);
const CHANNEL_ID = "UC8butISFwT-Wl7EV0hUK0BQ";
const DEVOPS_PLAYLIST = "PLWKjhJtqVAbkzvvpY12KkfiIGso9A_Ixs";
const SEARCHES = ["kubernetes", "docker", "KCNA", "KCSA", "CKA", "CKAD", "CKS", "cloud native", "helm", "containers"];
const TOPICS = /kubernetes|k8s|docker|container|\b(KCNA|KCSA|CKA|CKAD|CKS|CGOA|PCA|ICA|CCA|KCA)\b|kubestronaut|cloud native|CNCF|helm|istio|argo ?cd|prometheus|kubebuilder|operator/i;
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  "Accept-Language": "en-US,en",
};

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function text(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.text();
}

// { id, title } for each video in one channel search, from the page's ytInitialData.
async function searchChannel(query) {
  const html = await text(`https://www.youtube.com/@freecodecamp/search?query=${encodeURIComponent(query)}`).catch(() => "");
  const json = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)?.[1];
  if (!json) return [];
  const out = [];
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== "object") return;
    const v = o.videoRenderer;
    if (v?.videoId) out.push({ id: v.videoId, title: (v.title?.runs ?? []).map((r) => r.text).join("") });
    Object.values(o).forEach(walk);
  };
  walk(JSON.parse(json));
  return out;
}

// Latest 15 items of a channel or playlist feed, with dates.
async function feed(query) {
  const xml = await text(`https://www.youtube.com/feeds/videos.xml?${query}`).catch(() => "");
  return xml
    .split("<entry>")
    .slice(1)
    .flatMap((entry) => {
      const id = entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]+)<\/title>/)?.[1];
      const date = entry.match(/<published>([^<]+)<\/published>/)?.[1];
      return id && title && date ? [{ id, title: decode(title), date }] : [];
    });
}

async function publishDate(id) {
  const html = await text(`https://www.youtube.com/watch?v=${id}`).catch(() => "");
  return html.match(/itemprop="datePublished" content="([^"]+)"/)?.[1] ?? html.match(/"publishDate":"([^"]+)"/)?.[1] ?? null;
}

const found = new Map(); // id -> { title, date? }
for (const v of [...(await feed(`channel_id=${CHANNEL_ID}`)), ...(await feed(`playlist_id=${DEVOPS_PLAYLIST}`))]) {
  if (TOPICS.test(v.title)) found.set(v.id, { title: v.title, date: v.date });
}
for (const q of SEARCHES) {
  for (const v of await searchChannel(q)) if (TOPICS.test(v.title) && !found.has(v.id)) found.set(v.id, { title: decode(v.title) });
}

const previous = JSON.parse(await readFile(OUT, "utf8").catch(() => "[]"));
const previousDates = new Map(previous.map((v) => [v.id, v.date]));

const videos = [];
for (const [id, v] of found) {
  const date = v.date ?? previousDates.get(id) ?? (await publishDate(id));
  if (!date) continue;
  videos.push({
    id,
    title: v.title,
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    date,
  });
}

// Never replace a good list with a smaller one from a blocked or partial run; keep old entries too.
for (const v of previous) if (!videos.some((n) => n.id === v.id)) videos.push(v);
videos.sort((a, b) => new Date(b.date) - new Date(a.date));

if (!videos.length) {
  console.error("No videos found; keeping the existing file.");
  process.exit(0);
}
await writeFile(OUT, JSON.stringify(videos, null, 2) + "\n");
console.log(`Wrote ${videos.length} videos (${videos.length - previous.length} new).`);
