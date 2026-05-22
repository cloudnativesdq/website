# Agents

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint
npm run typecheck # TypeScript check
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