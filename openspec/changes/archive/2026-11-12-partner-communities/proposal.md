# Proposal

## Why

Cloud Native Santo Domingo works with two other Dominican tech communities: AAIF Community Santo Domingo (the local Agentic AI Foundation chapter) and Hard Devs Community. The site does not mention them, so visitors cannot find them and search engines do not connect them. AAIF events are relevant to our members but have to be added to the site by hand today, and Luma covers download as full-size originals (about 450KB each).

## What Changes

- Add a `/partners` page that lists each partner community with its logo, name, a short description in Spanish and English, a link to the community and to its Luma calendar, and a "Join as a partner community" button that emails organizers@cloudnativesdq.org. The page publishes its own title, description, canonical URL, Open Graph image and an `ItemList` of `Organization` JSON-LD.
- Link `/partners` from the navbar "Community" menu, the footer and the sitemap.
- Load upcoming events from the AAIF Community Santo Domingo Luma calendar (`luma.com/aaif-santodomingo`) and merge them into the site's events with an "AAIF" badge. Hard Devs events are not loaded for now: their calendar (`luma.com/harddevscommunity`) also lists events worldwide.
- Request Luma event images from Luma's image CDN at 800px in AVIF/WebP instead of the original upload (448KB PNG to 30KB AVIF for the AAIF cover). The CDN caches each variant for 31 days. Turning on Next.js image optimization stays in `image-optimization`.
- Partner events in the home page JSON-LD name the partner, not Cloud Native Santo Domingo, as `organizer`.

## Capabilities

### New Capabilities

- `partner-communities`: the partners page and the partner events merged into the site's events.

### Modified Capabilities

- `structured-data`: Event `organizer` names the partner community for partner events.

## Impact

- New: `src/app/partners/page.tsx`, `src/app/partners/opengraph-image.tsx`, `src/components/PartnersView.tsx`, `public/logos/aaif-wordmark.svg` (official AAIF logo from aaif.io), `public/logos/harddevs.svg` (from community.harddevs.com).
- Edited: `src/lib/links.ts`, `src/lib/providers/luma-scraper.provider.ts`, `src/lib/data-provider.ts`, `src/components/HomeView.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/lib/translations.ts`, `src/app/sitemap.ts`, `tests/e2e/site.spec.ts`.
- Reads the AAIF Luma calendar page once per hour (same cache as the other Luma events). The page embeds only upcoming events (about 20), so partner events disappear after they end.
