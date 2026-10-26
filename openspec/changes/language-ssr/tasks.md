# Tasks

## 1. Language resolution

- [x] 1.1 Add `src/lib/language.ts` with pure `resolveLanguage(cookieValue, acceptLanguage)` and `tests/e2e/language.spec.ts` covering cookie override, `en-US,en;q=0.9` → en, `fr,es;q=0.8` → es, `de` → es, empty → es; verify `pnpm test:e2e language.spec.ts` passes
- [x] 1.2 Make `src/app/layout.tsx` async: read `cookies()` and `headers()`, call `resolveLanguage`, render `<html lang={lang}>` and pass `initialLanguage` to `LanguageProvider` (read `node_modules/next/dist/docs/` on `cookies`/`headers` first); verify `curl -s -H 'Cookie: lang=en' localhost:3000/ | rg '<html lang="en"'` after `pnpm build && pnpm start`

## 2. Provider and UI

- [x] 2.1 Seed `LanguageProvider` from `initialLanguage`, delete the detection effect, the `invisible` wrapper and `mounted`; make `setLanguage` update state, `document.documentElement.lang` and the `lang` cookie (1 year, Path=/, SameSite=Lax, Secure on https); verify toggling in the browser updates `<html lang>` and `document.cookie`
- [x] 2.2 Add the one-time localStorage migration (no cookie + stored lang differs → `setLanguage(stored)`, then remove the key); verify by setting `localStorage.lang='en'` with no cookie, reloading, and seeing English plus a new cookie and no localStorage key
- [x] 2.3 `HeroSection`: render real stat values in server HTML; `CountUp` animates only after mount and respects `prefers-reduced-motion`; verify with JavaScript disabled that `/` shows the real member and event counts
- [x] 2.4 Remove the page-level `revalidate` exports on `/map` and `/resources` (data revalidation stays in fetch options); verify `pnpm build` marks pages dynamic (ƒ) and metadata routes, OG images and `/api/*` stay static

## 3. Tests and measurement

- [x] 3.1 Add e2e tests: JavaScript disabled `/events` shows its h1; a `lang=en` cookie context gets `<html lang="en">` and English nav text in the server HTML; toggling writes the cookie and updates `<html lang>`; verify `pnpm test:e2e` passes on desktop and mobile
- [ ] 3.2 Record Lighthouse mobile TTFB and LCP (median of 3) for `/` and `/events` on production before the change and on the PR preview after; put both tables in the PR description; verify LCP did not regress

## 4. Integration

- [x] 4.1 Run `pnpm lint`, `pnpm exec tsc --noEmit -p .`, `pnpm build`, `pnpm test:e2e`, `pnpm exec openspec validate --all --strict`; all pass
- [ ] 4.2 As the last commit of the PR, run `pnpm exec openspec archive language-ssr`; verify `openspec list --specs` shows `site-language`

## Workflow follow-up

- One week after deploy, check Speed Insights TTFB p75 for `/`. If above 800 ms, plan the option B fallback described in design.md.
