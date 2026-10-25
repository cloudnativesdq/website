# Design

## Context

- Next.js merges `metadata` shallowly across segments. A page that omits `openGraph` inherits the root layout's whole `openGraph` object, including its `url`, `title` and `description`. A page that sets `openGraph` replaces the root object entirely, which drops `images` unless the page repeats them. `twitter` behaves the same way. This explains every finding in proposal.md for pages and tags.
- Today: `layout.tsx` and `page.tsx` (home) each declare full `openGraph` + `twitter` + `keywords`. `events` declares both. `gallery` and `team` declare `openGraph` without images. `contact`, `map`, `programs`, `resources` and `start-a-chapter` declare neither. Every page already sets its own `alternates.canonical` on `https://cloudnativesdq.org`, and `metadataBase` is set in the layout.
- `sitemap.ts` lists six static pages, then appends `getCncfData()` events whose `url` points at ocgroups.dev or luma.com.
- `HomeView.tsx` (client component) builds one `Organization` object with nested `member` and `event` arrays, and renders it in a `<script type="application/ld+json">`. Event dates come from `CommunityEvent.date`, a display string (OCG card text, or Luma's ISO start reformatted to `"Nov 12, 2026, 6:00 PM"` in `America/Santo_Domingo`). The Luma provider reads `ld.endDate` and then discards it.
- `links.siteLogo` already points at `/brand/icon-512.png` after `brand-identity-assets`.

## Goals / Non-Goals

**Goals:**
- One source for shared social fields, so a new page cannot silently inherit home tags.
- JSON-LD that passes Google's Rich Results Test for Event with no errors.

**Non-Goals:**
- Changing page copy visible on screen, layout markup or components other than the JSON-LD object.
- Translating metadata per visitor language (later change on language SSR).
- Generated OG images (change `social-preview-images`).
- `twitter:site` / `twitter:creator`. The community lists no X account in `links.ts` or `sameAs`. Add one if an account is created.

## Decisions

**Shared constant, not a helper.** New `src/lib/seo.ts`:

```ts
export const SITE_URL = 'https://cloudnativesdq.org';
export const sharedOpenGraph = {
  siteName: 'Cloud Native Santo Domingo',
  locale: 'es_DO',
  type: 'website',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Cloud Native Santo Domingo' }],
} satisfies OpenGraph;
export const sharedTwitter = { card: 'summary_large_image', images: ['/og-image.jpg'] } satisfies Twitter;
```

Each page writes `openGraph: { ...sharedOpenGraph, title, description, url: '/programs' }` and `twitter: { ...sharedTwitter, title, description }`. Title and description stay literal in each page, so a reviewer can read a page's tags in one place. Alternative: a `pageMetadata({ title, description, path })` function that also sets canonical. It would be shorter, but it hides which tags each page emits and adds an abstraction the user did not ask for. `og:url` and canonical are relative paths resolved by `metadataBase`, so the host appears once (`SITE_URL`, used by `metadataBase` and the sitemap).

**Root layout keeps defaults.** `layout.tsx` keeps `metadataBase`, default title/description, `robots`, and `openGraph`/`twitter` built from the shared constants with home text, so `not-found` and any future page still get valid tags. `keywords` is removed from both `layout.tsx` and the home `page.tsx`. The home copy is the same unused field, and the spec forbids the tag on every page.

**Contact description.** "¿Tienes preguntas o quieres colaborar con Cloud Native Santo Domingo? Escríbenos." This matches the current English meaning. Page Open Graph and Twitter descriptions reuse each page's meta description unless a shorter one already exists (events, gallery, team).

**Sitemap.** Static array of the nine own routes on `SITE_URL`. The `getCncfData()` call, `parseSitemapDate` and the try/catch go away because no remote data is needed. `lastModified: new Date()` stays as today. `changeFrequency` and `priority` keep current values, and new entries use `/events` weekly 0.9, `/gallery` monthly 0.5, `/team` monthly 0.6. Off-host event pages are discoverable through the hosts' own sitemaps.

**JSON-LD graph.** One script with `{"@context": "https://schema.org", "@graph": [org, website, ...events]}`. IDs: `${SITE_URL}/#organization`, `${SITE_URL}/#website`. Events reference `{ "@id": org id }` for `organizer`. `member` stays on the Organization. The JSON-LD stays in `HomeView` because the user scoped the change to the existing object. Moving it to a server component is a performance concern for the later change.

**Event times.** Add optional `startDate?: string` and `endDate?: string` (ISO 8601 with offset) to `CommunityEvent`. The Luma provider sets them from `ld.startDate` / `ld.endDate`, which it already parses. OCG events have only display text, so `startDate` falls back to the existing `parseEventDate(date)` emitted as `YYYY-MM-DD` (date only), and `endDate` is omitted. Alternative: invent `start + 2h`. Rejected because a fabricated end time is worse than none, and schema.org and Google treat `endDate` as recommended, not required. The new fields also appear in `/api` responses. This is additive and optional, so existing consumers do not break.

**Attendance mode.** One `isVirtual = /virtual|online/i.test(location ?? '')` drives both `eventAttendanceMode` and the location type, so they cannot disagree again.

**Offers.** Community events are free: `{ "@type": "Offer", price: 0, priceCurrency: "USD", url, availability }`. USD because international ticket platforms (Luma) list free events in USD, and the value is 0 either way. `availability` comes from `soldOut`.

**Vercel domain.** Manual. Project → Settings → Domains: set `cloudnativesdq.org` as primary and `www.cloudnativesdq.org` to redirect with 308. The code needs no change.

## Risks / Trade-offs

- [Pages added later forget the shared spread] → The spec's per-route scenarios become an e2e check that loops over `PAGES` in `tests/e2e/site.spec.ts`, so a new route added there is checked automatically.
- [Date-only `startDate` for OCG events loses the time] → Accepted until the OCG scraper extracts times. This is still more correct than the current midnight-UTC instant, which can fall on the wrong day.
- [Our Event nodes duplicate the Event markup that Luma and OCG publish on the pages our `url` points to] → Kept because the user asked for top-level Events. Each node's `url` names the canonical external page, which tells search engines which page is authoritative. If Search Console reports duplicate or invalid events, drop the Event nodes and keep Organization + WebSite. This only deletes nodes, so it needs no spec rewrite beyond removing the event requirements.
- [Removing event URLs from the sitemap reduces discovery of those external pages] → They are not ours to submit. Search engines reject cross-host sitemap entries anyway.

## Migration Plan

Apply after `brand-identity-assets`. One PR. Rollback = revert. After deploy, the maintainer flips the Vercel domain setting and resubmits `/sitemap.xml` in Google Search Console.
