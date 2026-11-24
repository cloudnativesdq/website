# Design

## Context

`/resources` is rendered per request (`ƒ` in the build output) because the root layout reads `cookies()` and `headers()` for the language; its data fetches are cached separately for 6 hours. `ResourcesView` is a client component. If the route ever becomes static or ISR, a server-only date check would keep the promotion in cached HTML after the sale ends.

## Goals / Non-Goals

**Goals:** show the promotion only within its window, with no hydration mismatch and no extra requests.

**Non-Goals:** a general promotions system or CMS. The next sale can reuse the pattern or replace the constants.

## Decisions

- **Two constants and one function** (`lfPromoState(now = Date.now())` in `src/lib/cncf-resources.ts`): returns `"upcoming"`, `"live"` or `null`. Start `2026-11-27T04:00:00Z`, end `2026-12-05T04:00:00Z` (midnight in Santo Domingo, UTC-4, no DST).
- **Evaluate on the server and again in the browser.** `page.tsx` passes `lfPromoState()` as a prop, so the HTML is correct for crawlers and no-JS visitors at generation time. `ResourcesView` reads it through `useSyncExternalStore` with the prop as the server snapshot and `lfPromoState()` as the client snapshot: hydration matches the HTML, then React re-renders with the visitor's clock if it differs. Today the server answer is already current; the client re-check keeps the gate correct if the HTML is ever cached and lets the e2e test fake the date with Playwright's clock. Alternatives: a server-only check is correct today but untestable without waiting for the date and silently breaks if the route turns static; a `useEffect` + `setState` flips state in an effect, which the React lint rules flag.
- **Poster:** the official LF 1200x628 poster, re-encoded to WebP with the installed `sharp` (the PNG is 717 KB and `images.unoptimized` is on), rendered with `next/image`.

## Risks / Trade-offs

- [Visitor clock is wrong] → Only affects that visitor's view; the server HTML still drops the promotion at the next regeneration after the end.
- [Constants left in code after the sale] → Harmless (renders nothing); remove them with the next sale.
