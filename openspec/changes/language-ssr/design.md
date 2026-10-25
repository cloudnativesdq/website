# Design

## Context

- `LanguageProvider` (client) starts at `"es"`. After hydration it reads `localStorage.lang` or `navigator.language`, then flips `mounted`. Until then the whole tree sits in a `div.invisible`. `HeroSection` also renders `"0"` for each stat until `mounted`.
- 21 files call `useLanguage()`. Every visible string comes from `translations[language]` on the client. Server components (`page.tsx` files) only fetch data and pass it to client views.
- Data is cached at the fetch layer (`fetch(..., { next: { revalidate } })` in `src/lib/*`, `unstable_cache` in `cncf-people.ts`). Page-level `revalidate` exports exist on `/map` and `/resources`.
- `<html lang="es">` is hardcoded in `src/app/layout.tsx`.
- Page metadata stays Spanish only (`seo-metadata-fixes`). Crawlers send no `lang` cookie and usually no English `Accept-Language`, so they get Spanish.
- No `cacheComponents` / `"use cache"` in use. `next.config.ts` has no experimental flags.

## Goals / Non-Goals

**Goals:**
- The first HTML response is visible and in the visitor's language. No wait for JavaScript.
- `<html lang>` is right on first paint and after toggling.

**Non-Goals:**
- English metadata or English URLs (option C was not chosen).
- Translating server-fetched content (event titles stay as their sources publish them).

## Decisions

**Resolve the language once, in the root layout.** `layout.tsx` becomes `async` and computes `lang` as follows:
1. `(await cookies()).get('lang')?.value` when it is `'es'` or `'en'`;
2. otherwise the first `es`/`en` primary tag in `(await headers()).get('accept-language')`, by order, ignoring q-values below 0.5;
3. otherwise `'es'`.

The logic is a pure `resolveLanguage(cookieValue, acceptLanguage)` in `src/lib/language.ts`. The project has no unit runner, so `tests/e2e/language.spec.ts` imports the function and checks it with plain `expect` calls (Playwright runs it like any test, with no browser needed): `en-US,en;q=0.9` gives `en`, `fr,es;q=0.8` gives `es`, `de` gives `es`, and the cookie overrides the header. The layout renders `<html lang={lang}>` and passes `initialLanguage={lang}` to `LanguageProvider`.

**Provider becomes server-seeded.** `useState(initialLanguage)`, no detection effect, no `invisible` wrapper. The `mounted` flag is dropped from the context. `setLanguage(lang)` does three things: it updates state, sets `document.documentElement.lang = lang`, and writes `document.cookie = 'lang=<lang>; Path=/; Max-Age=31536000; SameSite=Lax'` (plus `Secure` on https). Client state already re-renders every string, so no `router.refresh()` is needed.

**One-time migration from localStorage.** Existing visitors have `localStorage.lang` and no cookie. A mount effect runs once: if there is no `lang` cookie and `localStorage.lang` differs from `initialLanguage`, it calls `setLanguage(stored)` and then removes the localStorage key. Those visitors see one swap on their first visit after deploy, and never again. Alternative: ignore old preferences. Rejected because English-choosing visitors would silently revert to Spanish.

**Hero stats.** Render `stat.value` directly in the server HTML. `CountUp` takes the final value and animates from 0 only after its own effect runs, honoring `prefers-reduced-motion`. No-JS visitors see the real numbers.

**Caching consequence (accepted with option A).** Reading `cookies()`/`headers()` in the root layout makes every page dynamic. HTML is rendered per request and the CDN does not cache it. Data stays cached because the fetch cache and `unstable_cache` are unaffected, so a render reuses cached data and only runs React. The `revalidate` exports on `/map` and `/resources` keep governing their data fetches through the fetch options, so the page-level exports become redundant. Remove them so nobody believes the HTML is ISR. These do not read cookies and stay static: metadata routes (`sitemap`, `robots`, `manifest`, icons, `opengraph-image`) and `/api/*`.

**Measure, don't assume.** Before and after on a preview deploy, record TTFB and LCP for `/` and `/events` (Lighthouse mobile, 3 runs, median). Expected: LCP improves, because content no longer waits for hydration. TTFB rises by the render time. If TTFB p75 on production exceeds 800 ms in Speed Insights a week after deploy, the fallback is option B. That only touches `layout.tsx` and the provider seed, not the spec, because B also satisfies "visible without JS" and "lang matches". "Lang persists" would then rest on client state only.

**e2e updates.** The language toggle test keeps working. Add:
- with JavaScript disabled, `/events` shows its heading
- a context with cookie `lang=en` gets `<html lang="en">` and English nav text in the first HTML
- toggling sets the cookie and `document.documentElement.lang`

## Risks / Trade-offs

- [Per-request rendering cost and TTFB] → Data stays cached, and Fluid Compute reuses instances. Measured and gated as above, with B as the fallback.
- [Cookie set by client JS only] → Lax, non-sensitive and readable. No server-set cookie is needed.
- [Old localStorage visitors see one swap] → One time only, then the cookie takes over.
- [Third-party crawlers with English Accept-Language get English text, while metadata stays Spanish] → Rare, and acceptable. The canonical language is still Spanish.

## Migration Plan

Ship after the current rollout (brand, seo, social). One PR, with a preview measured before merge. Rollback = revert. Visitors keep their cookie, which the old code ignores.
