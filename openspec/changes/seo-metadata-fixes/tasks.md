# Tasks

## 1. Shared metadata constant

- [x] 1.1 Add `src/lib/seo.ts` with `SITE_URL`, `sharedOpenGraph` and `sharedTwitter`; verify `pnpm exec tsc --noEmit` passes
- [x] 1.2 Rebuild the root `layout.tsx` metadata from the constants, drop `keywords`, and use `SITE_URL` for `metadataBase`; verify no markup in `layout.tsx` changed (`git diff` touches only the `metadata` object and imports)

## 2. Per-page metadata

- [x] 2.1 Give `/`, `/events`, `/gallery`, `/team`, `/map`, `/programs`, `/resources`, `/start-a-chapter` and `/contact` their own `openGraph` (`...sharedOpenGraph`, title, description, relative `url`) and `twitter` (`...sharedTwitter`, title, description); drop `keywords` from `src/app/page.tsx`; verify with `pnpm build && pnpm start` and `curl -s localhost:3000/programs | rg 'og:(title|url)|twitter:title'` shows the programs values
- [x] 2.2 Rewrite the `/contact` description in Spanish ("¿Tienes preguntas o quieres colaborar con Cloud Native Santo Domingo? Escríbenos."); verify every `description` in `src/app/**/page.tsx` and `layout.tsx` is Spanish by reading them
- [x] 2.3 Add an e2e test in `tests/e2e/site.spec.ts` that loops over `PAGES` and asserts `og:url` equals the canonical, `og:title`/`twitter:title` match the `<title>`, an `og:image` exists, and no `meta[name=keywords]` or `link[hreflang]` exists; verify `pnpm test:e2e` passes and fails if one page's `openGraph` is removed

## 3. Sitemap

- [x] 3.1 Replace `src/app/sitemap.ts` with the static nine-route list on `SITE_URL` and remove the `getCncfData` import and `parseSitemapDate`; verify `curl -s localhost:3000/sitemap.xml` has nine `<loc>` entries, all starting with `https://cloudnativesdq.org`
- [x] 3.2 Add an e2e assertion that `/sitemap.xml` contains `/events`, `/gallery`, `/team` and no `luma.com`, `lu.ma` or `ocgroups.dev`; verify `pnpm test:e2e` passes

## 4. Structured data

- [x] 4.1 Add optional `startDate`/`endDate` (ISO) to `CommunityEvent` in `src/lib/types.ts` and set them from `ld.startDate`/`ld.endDate` in `luma-scraper.provider.ts`; verify a build log or `/api` response shows both fields on a Luma event
- [x] 4.2 Rewrite the JSON-LD object in `HomeView.tsx` as an `@graph` with `Organization` (`@id`, PNG `logo` via `links.siteLogo`, no `event`), `WebSite` (`inLanguage: 'es'`, `publisher` ref) and top-level `Event` nodes (`organizer` ref, `offers`, real or omitted `endDate`, `isVirtual`-driven mode and location), and fix `alternateName` to "Cloud Native SDQ"; verify no JSX outside the schema object changed
- [x] 4.3 Add an e2e test that parses the home page's `application/ld+json`, asserts the graph shape, that no Event has `endDate === startDate`, and that the logo URL returns a PNG; verify `pnpm test:e2e` passes
- [ ] 4.4 Run the production HTML of `/` through Google's Rich Results Test and the Schema.org validator; verify zero errors for Organization and Event

## 5. Integration

- [x] 5.1 Run `pnpm lint`, `pnpm build` and `pnpm test:e2e`; all pass
- [ ] 5.2 On a preview deploy, paste `/programs`, `/gallery` and `/contact` into the opengraph.xyz or LinkedIn Post Inspector debugger; verify each shows its own title, description and an image
- [ ] 5.3 As the last commit of this PR, run `pnpm exec openspec archive seo-metadata-fixes`; verify `openspec list --specs` shows `page-metadata`, `sitemap` and `structured-data` and strict validation passes

## 6. Domain (maintainer, manual)

- [ ] 6.1 Maintainer: in Vercel → Project → Settings → Domains, set `cloudnativesdq.org` as primary and `www.cloudnativesdq.org` to redirect with 308; verify `curl -sI https://www.cloudnativesdq.org/events` returns `308` with `location: https://cloudnativesdq.org/events`

## Workflow follow-up

- After deploy, resubmit `https://cloudnativesdq.org/sitemap.xml` in Google Search Console.
- Two weeks after deploy, check Search Console > Enhancements > Events for duplicate or invalid event reports (see design risk).
