# Proposal

## Why

An SEO audit found that shared links and search results show the wrong information. Five inner pages show the home page's title, description and URL when shared. One page has an English description on a Spanish site. The sitemap lists URLs on other domains and misses three pages. The home page JSON-LD has wrong event dates and attendance modes, and an SVG logo that Google does not accept.

## What Changes

- **Canonical domain**: keep `https://cloudnativesdq.org` (bare domain) in code. The maintainer changes the Vercel domain settings so the bare domain is primary and `www` answers with a 308 redirect to it. This change adds a task for that, with a check.
- **Per-page social metadata**: move the shared Open Graph and Twitter fields (site name, locale, type, card, default image) into one constant. Every page (home, events, gallery, team, map, programs, resources, start-a-chapter, contact) sets its own Open Graph title, description and URL and its own Twitter block on top of it. Today contact, map, programs, resources and start-a-chapter inherit the home `openGraph` block through Next's shallow merge, gallery and team set `openGraph` without images, and every page except events inherits the home `twitter` block.
- **Spanish metadata**: rewrite the English description in `src/app/contact/page.tsx` in Spanish. All titles and descriptions stay Spanish because the server always renders `lang="es"`.
- **Sitemap**: remove the luma.com and ocgroups.dev event URLs from `src/app/sitemap.ts` (a sitemap may only list URLs on its own host). Add `/events`, `/gallery` and `/team`.
- **JSON-LD** (`src/components/HomeView.tsx`):
  - emit a real `endDate` when the source has one and omit it otherwise, instead of copying `startDate`
  - use the PNG logo from `brand-identity-assets` for the Organization
  - mark virtual events with `OnlineEventAttendanceMode`
  - make each event a top-level `Event` with `organizer` and `offers`, not nested in the Organization
  - add a `WebSite` node
  - fix the Organization `alternateName` typo "CNCD SDQ" to "Cloud Native SDQ"
- Drop the `keywords` field in `src/app/layout.tsx` and the identical one in `src/app/page.tsx`. Search engines ignore the field.

Out of scope: hreflang (no separate English URLs exist), visual layout or UI changes, server-side language rendering, performance work, and generated Open Graph images (change `social-preview-images`).

## Capabilities

### New Capabilities

- `page-metadata`: per-page title, description, canonical URL, Open Graph and Twitter tags, and the language of that metadata.
- `sitemap`: which URLs the sitemap lists.
- `structured-data`: the schema.org JSON-LD the site publishes for the organization, the website and community events.

### Modified Capabilities

None. No specs exist yet.

## Impact

- New: `src/lib/seo.ts` (shared metadata constant).
- Edited: `src/app/layout.tsx` (metadata object only, no markup), the nine `page.tsx` files, `src/app/sitemap.ts`, `src/components/HomeView.tsx` (JSON-LD object only), `src/lib/types.ts` and `src/lib/providers/luma-scraper.provider.ts` (carry the event start and end timestamps the Luma page already provides).
- Depends on `brand-identity-assets` for `public/brand/icon-512.png` and the updated `links.siteLogo`. Apply that change first.
- `social-preview-images` later removes the default image from the shared constant.
- External: Vercel project domain settings (manual).
