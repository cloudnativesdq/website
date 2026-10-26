# Proposal

> Decision (maintainer, 2026-10-25): option A, cookie-driven server rendering.

## Why

`LanguageProvider` (`src/hooks/use-language.tsx`) wraps the whole site in a `div` that stays `invisible` until client JavaScript reads `localStorage`/`navigator.language` after hydration. As a result:
- First paint and LCP wait for JavaScript.
- Visitors and crawlers without JavaScript get a blank page.
- `<html lang="es">` never changes when a visitor picks English, so screen readers read English text with Spanish pronunciation.

## What Changes

- Render the page visible from the server, in the visitor's chosen language when one is known.
- Keep `<html lang>` in sync with the language shown.
- Persist the choice so the server can read it on the next request (a cookie instead of, or in addition to, `localStorage`).
- Remove the `invisible` wrapper.
- Render real numbers in the hero stats from the server; `CountUp` only animates after load (today they read "0" until JavaScript runs).

**Options considered (A chosen):**
- **A. Cookie-driven SSR.** The server reads a `lang` cookie (then `Accept-Language`) and renders that language. The output is exact for every visitor, but reading cookies makes pages dynamic and drops the current static/ISR caching (`revalidate` on map, resources).
- **B. Static Spanish plus client swap.** The server always renders visible Spanish. Visitors who chose English see Spanish briefly, then English after hydration. All caching stays, and only English-preferring visitors see the swap.
- **C. Separate `/en` routes.** Fully static in both languages, and hreflang becomes possible. Largest change: every route and link doubles.

## Capabilities

### New Capabilities

- `site-language`: which language each page renders in, how the choice persists, and how the document declares it.

### Modified Capabilities

None.

## Impact

- `src/hooks/use-language.tsx`, `src/app/layout.tsx`, the language toggle in `Navbar.tsx`. Under option A, also every page's caching.
- Interacts with `seo-metadata-fixes` (metadata is Spanish only) and the e2e language toggle test.
