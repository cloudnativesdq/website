# Agents

## Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Lint
```

## Architecture

- **Framework:** Next.js 16.2.2 (App Router, Turbopack) + React 19 + TypeScript 5.8.3 + Tailwind CSS 3.4
- **Data source:** OCG scraper (`src/lib/providers/ocg-scraper.provider.ts`) fetches from `https://ocgroups.dev/cncf/group/{slug}`, cached 1 hour
- **Key directories:**
  - `src/lib/providers/` — data source abstractions (OCG scraper, fallback)
  - `src/components/` — UI components (EventsSection, EventCalendar, HomeView)
  - `src/app/` — Next.js pages and API routes
  - `src/hooks/` — React hooks (use-language.tsx)

## Event System

- Events come from OCG (Online Community Groups) API at `https://ocgroups.dev/cncf/group/cqecyjw`
- `CommunityEvent` type in `src/lib/types.ts` defines event shape
- Sold out detection: scraper looks for text patterns (`sold out`, `full`, `waitlist`, `agotado`, `sin cupos`)
- Individual event pages contain `Capacity: (Remaining: X)` — fetch per-event for spots data

## i18n

- Translations in `src/lib/translations.ts` — keyed by `language` ("es" | "en")
- Use `useLanguage()` hook to access `t` (translations) and `language`
- Never hardcode display strings — use `t.keyName` instead

## Type Updates

When adding properties to `CommunityEvent`, update:
1. `src/lib/types.ts` (interface)
2. `src/components/EventsSection.tsx` (Event interface and display)
3. `src/components/EventCalendar.tsx` (Event interface and modal display)
4. `src/lib/providers/ocg-scraper.provider.ts` (parsing)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
