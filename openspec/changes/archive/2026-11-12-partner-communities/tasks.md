# Tasks

## 1. Partner events

- [x] 1.1 Add `partnerCommunities` to `src/lib/links.ts` (name, link, Luma link, logo; Luma calendar and badge for AAIF only)
- [x] 1.2 Add a Luma calendar loader that reads upcoming events from the calendar page
- [x] 1.3 Merge partner events in `src/lib/data-provider.ts`; name the partner as JSON-LD `organizer` in `src/components/HomeView.tsx`

## 2. Partners page

- [x] 2.1 Add the logos under `public/logos/`, `src/components/PartnersView.tsx`, `src/app/partners/page.tsx` and its `opengraph-image.tsx`
- [x] 2.2 Add Spanish and English strings, navbar, footer and sitemap entries, and `/partners` to the e2e page list
- [x] 2.3 Add the "Join as a partner community" mailto button and the Luma links on the cards

## 3. Images

- [x] 3.1 Rewrite Luma image URLs to the 800px CDN variant

## 4. Checks

- [x] 4.1 Run lint, typecheck, build, e2e and `openspec validate --all --strict`
- [x] 4.2 Open `/partners` and `/events` and check both logos render, the AAIF event appears and no Hard Devs events do
