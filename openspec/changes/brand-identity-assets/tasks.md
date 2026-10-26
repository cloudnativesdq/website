# Tasks

## 1. Mark sources

- [x] 1.1 Copy `openspec/changes/brand-identity-assets/inputs/mark.svg` byte-for-byte to `public/brand/mark.svg`; verify with `cmp` and confirm the viewBox is `0 0 64 64` and the only colors are `#0ea8e6`, `#7ad8fa`, `#ce1126`
- [x] 1.2 Add `public/brand/mark-mono.svg` (same paths, `currentColor`, swell at 0.6 stroke-opacity); verify by inlining it in a page with `color: white` on navy and seeing every shape render white

## 2. Icon generation

- [x] 2.1 Add `"sharp": "0.35.5"` to `package.json` `dependencies` and run `pnpm install`; verify `jq -r .version node_modules/sharp/package.json` prints `0.35.5` and `pnpm-lock.yaml` gains no new package entry (only the importer line)
- [x] 2.2 Write `scripts/generate-brand-icons.mjs` (`import sharp from 'sharp'`) that writes `public/brand/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `src/app/icon.svg`, `src/app/apple-icon.png` and `src/app/favicon.ico`, and add `"brand:icons"` to `package.json` scripts; verify `pnpm brand:icons` runs clean
- [x] 2.3 Pack the ICO from 16/32/48 PNGs inside the script and add an `assert`-based self-check that re-reads the ICO header (3 entries, sizes 16/32/48) and checks that the maskable mark's bounding box fits in the 80% circle and that the apple icon has no transparent pixel; verify the script exits non-zero when an assertion is broken on purpose
- [x] 2.4 Add `public/brand/event-placeholder.png` (1200x800 navy, mark centered at ~22% width) to the script, with an assertion that the mark fits inside the centered 1:1 crop; verify the assertion runs
- [x] 2.5 Inspect outputs: `file` reports the expected sizes, and visual check of `icon-maskable-512.png` with a circular crop and `apple-icon.png` on iOS-style rounding shows no clipping

## 3. Wire icons through Next file conventions

- [x] 3.1 Delete the `icons` block in `src/app/layout.tsx` and add `export const viewport` with dark `#090d16` / light `#f7f9fc` `themeColor`; verify `pnpm build && pnpm start` and the `/` HTML head shows `favicon.ico`, `icon.svg` (`image/svg+xml`), `apple-icon.png` and both `theme-color` metas, with no `favicon.svg` link
- [x] 3.2 Add `src/app/manifest.ts` (name, short_name, `start_url`, `display`, navy colors, 192/512 `any` + 512 `maskable` from `/brand/`); verify `/manifest.webmanifest` returns the JSON, the head links it, and Chrome DevTools > Application > Manifest shows no errors
- [x] 3.3 Delete `public/favicon.svg` and `public/images/logo.png`; point `links.siteLogo` and `links.organizerFallbackImage` at `icon-512.png` and `links.eventFallbackImage` at `/brand/event-placeholder.png`; verify the full mark is visible on an event card with a broken image URL at 412px and 1280px, and `rg -n "favicon\.svg|images/logo\.png" src` returns nothing and both old URLs return 404
- [x] 3.4 Extend `tests/e2e/site.spec.ts` with one test that checks the head icon/manifest/theme-color tags, that `/favicon.ico` and every manifest icon return 200, and that `/favicon.svg` and `/images/logo.png` return 404; verify `pnpm build && pnpm test:e2e` passes

## 4. Lockup

- [x] 4.1 Add `src/components/BrandLockup.tsx` (inline `aria-hidden` mark + "Cloud Native Santo Domingo" in `font-heading font-bold`, two-line break at narrow widths) and use it in `Navbar.tsx` and `Footer.tsx` home links; verify visually in both themes at 360px, 412px and 1280px with no horizontal scroll
- [x] 4.2 Change the footer copyright to "Cloud Native Santo Domingo" and the email `from` display name in `send-email.ts`; verify `rg -n "Cloud Native SDQ|CNCD" src` returns only the schema.org `alternateName` (fixed in `seo-metadata-fixes`)
- [x] 4.3 Update the e2e navigation checks so the navbar and footer home links have accessible name "Cloud Native Santo Domingo"; verify `pnpm test:e2e` passes on desktop and mobile projects

## 5. 404, error page, skip link

- [x] 5.1 Rewrite `src/app/not-found.tsx` as a server component with `metadata` (`robots: { index: false }`) rendering a client `NotFoundView` (Navbar, `<main id="main">`, Footer, `t.notFound.*` in es and en), and remove the `console.error` effect; verify `/no-existe` returns 404 with the lockup and Spanish copy and no console error
- [x] 5.2 Add `src/app/error.tsx` with the same shell, `t.error.*` and a "Reintentar" button calling `reset()`; verify by temporarily throwing in a page locally that the branded error page appears and retry re-renders
- [x] 5.3 Add the skip link as the first element in `Navbar` and `id="main"` on every page's `<main>`; verify Tab on `/`, `/events` and `/contact` shows "Saltar al contenido" and Enter moves focus to main
- [x] 5.4 Add e2e checks: `/no-existe` returns 404 with the lockup and no console errors; the first Tab focuses the skip link; verify `pnpm test:e2e` passes

## 6. Contrast tokens

- [x] 6.1 In `_ds/style-guide/tokens/colors.css`: dark `--text-on-accent` `#04202f`; light `--accent` `#0369a1`, `--accent-hover` `#075985`, `--accent-soft`/`--border-accent`/`--glow` rebased on `#0369a1`; verify by grepping that `#0284c7` and `2,132,199` no longer appear
- [x] 6.2 Mirror in `src/app/globals.css`: dark foreground-on-primary triplets `200.9 84.3% 10%`, light primary/accent/ring/sidebar triplets `201.3 96.3% 32.2%`, with updated hex comments; verify `rg "200.4 98% 39.4%" src/app/globals.css` is empty and a primary button measures 6.20:1 (dark) and 5.93:1 (light) in DevTools

## 7. Design-system docs

- [x] 7.1 In `_ds/style-guide`: replace the "no logo" wording in `readme.md`, `ATTRIBUTION.md`, `github.md` and `guidelines/brand-logo.card.html` with the mark, its variant and the color/symbol rules; replace `assets/favicon.svg` with `assets/mark.svg`; verify `rg -i "no logo|pending new mark|placeholder mark" _ds/style-guide --glob '!_ds_bundle.js'` is empty
- [x] 7.2 Review every brand asset against the protected-symbol list and the ultramarine/vermillion rule; record the check in the PR description

## 8. Integration

- [x] 8.1 Run `pnpm lint`, `pnpm build` and `pnpm test:e2e`; all pass
- [ ] 8.2 Deploy a preview and check the tab icon, an iOS "Add to Home Screen" icon and an Android install prompt icon on real devices
- [ ] 8.3 As the last commit of this PR, run `pnpm exec openspec archive brand-identity-assets` so `openspec/specs/brand-identity/` and `openspec/specs/app-icons/` land on `main` with the code; verify `pnpm exec openspec validate --all --strict` passes and `openspec list --specs` shows both

## 9. Tambora mark

- [x] 9.1 Replace `public/brand/mark.svg` and `mark-mono.svg` with the tambora (iteration "Amarres") and add `public/brand/icon.svg` (iteration "Ícono"); mirror all three in `_ds/style-guide/assets/`
- [x] 9.2 Point `scripts/generate-brand-icons.mjs` square icons and `src/app/icon.svg` at `icon.svg`, keep the event placeholder on `mark.svg`; run `pnpm brand:icons` and its self-checks pass
- [x] 9.3 Update the inline paths in `BrandLockup.tsx` and regenerate `brand-kit/` with `pnpm brand:kit` (avatar uses the icon)
- [ ] 9.4 On the preview deploy, check the tab icon, navbar lockup and `/opengraph-image` show the tambora

## Workflow follow-up

- Commit `_ds/style-guide` changes in the submodule repo first, then bump the submodule pointer in this repo's PR.
