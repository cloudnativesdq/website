# Agents

## Commands

```bash
pnpm run dev:setup                           # Setup: versions, submodule, install, .env.local, Playwright
pnpm dev                                     # Start dev server
pnpm lint                                    # Lint
pnpm exec tsc --noEmit -p .                  # Typecheck
pnpm build                                   # Production build
pnpm test:e2e                                # Playwright smoke tests against the build
pnpm exec openspec validate --all --strict   # Validate specs and changes
```

## Workflow

- Plan any behavior change with OpenSpec before editing code: `/opsx:propose`, or `pnpm exec openspec new change <name>` and then `pnpm exec openspec instructions <artifact> --change <name>` for each artifact. See CONTRIBUTING.md.
- Never implement during propose. Propose writes the change artifacts only; code comes in apply.
- When a change touches an area with no spec, its delta first ADDs the current behavior, then changes it.
- Archive the change (`pnpm exec openspec archive <name>`) as the last commit of the PR that implements it.
- Use `pnpm run worktree <branch>` for parallel work. If another tree is running, use `pnpm dev --port 3001` and `E2E_PORT=3101 pnpm test:e2e`.
- Run the CI checks (lint, typecheck, build, e2e, openspec validate) before declaring work done.
- Never commit `.env.local`. Document new variables in `.env.example`.
- Edit `_ds/style-guide` in the submodule, commit and push it there first, then commit the bumped pointer here.

## Architecture

- **Framework:** Next.js 16.4 (App Router, Turbopack) + React 19 + TypeScript 7 + Tailwind CSS 4
- **Data source:** OCG scraper (`src/lib/providers/ocg-scraper.provider.ts`) fetches from `https://ocgroups.dev/cncf/group/{slug}`, cached 1 hour
- **Key directories:**
  - `src/lib/providers/` — data source abstractions (OCG scraper, Luma scraper, fallback)
  - `src/components/` — UI components (EventsSection, EventCalendar, HomeView)
  - `src/app/` — Next.js pages and API routes
  - `src/hooks/` — React hooks (use-language.tsx)
  - `openspec/` — specs (`specs/`) and planned changes (`changes/`)
  - `_ds/style-guide/` — design tokens and fonts (git submodule)

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
2. `src/components/EventCard.tsx` (exported `Event` interface and card display, used by EventsSection and UpcomingEventsPreview)
3. `src/components/EventCalendar.tsx` (its own `Event` interface and modal display)
4. `src/lib/providers/ocg-scraper.provider.ts` and `src/lib/providers/luma-scraper.provider.ts` (parsing)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
