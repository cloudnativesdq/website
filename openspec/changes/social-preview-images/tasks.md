# Tasks

## 1. Shared render module

- [x] 1.1 Add `src/lib/og-image.tsx` with `size`, `contentType`, the font/mark/photo loaders (module scope) and the `sharp` palette pass, plus `renderPageImage({ eyebrow, title, path })` ported from the bottom half of `og.html` (glow, brand row, eyebrow, title, URL, faint mark, five-div strip); verify `pnpm exec tsc --noEmit` passes
- [x] 1.2 Add `src/app/events/opengraph-image.tsx` using it; run `pnpm build && pnpm start`, open `/events/opengraph-image`, and compare side by side with the bottom half of `openspec/changes/social-preview-images/inputs/og.png`; verify the headline renders at weight 700 (if thin, commit static OFL font instances per design and re-check)
- [x] 1.3 Add `renderHomeImage()` (navy panel, photo cropped to 600x630 via `sharp`, gradient fade, headline with `de RD`, subline, strip) and `src/app/opengraph-image.tsx`; verify against `og-home.png` that "RD" is not alone on a line and the photo framing matches

## 2. Inner routes

- [x] 2.1 Add `opengraph-image.tsx` with `alt` and the copy from design.md for `team`, `gallery`, `programs`, `resources`, `map`, `start-a-chapter` and `contact`; verify each `/<route>/opengraph-image` renders its own eyebrow, title and URL with no text overflowing the 1200px canvas
- [x] 2.2 Confirm `pnpm build` output lists all nine `opengraph-image` routes as static (prerendered), not dynamic

## 3. Retire static image

- [x] 3.1 Remove `images` from `sharedOpenGraph` and `sharedTwitter` in `src/lib/seo.ts` and delete `public/og-image.jpg`; verify `rg -n "og-image\.jpg" src` is empty and `/og-image.jpg` returns 404
- [x] 3.2 Check the built HTML of `/` and `/team` for `twitter:image` equal to `og:image`; if missing, add one-line `twitter-image.tsx` re-exports and re-check

## 4. Tests

- [x] 4.1 Extend `tests/e2e/site.spec.ts`: for each route in `PAGES`, read `og:image`, `og:image:alt` and `twitter:image`, fetch the image, and assert status 200, `content-type: image/png`, PNG IHDR 1200x630, body under 307200 bytes, non-empty alt, `twitter:image === og:image`, and that all nine URLs are distinct; verify `pnpm build && pnpm test:e2e` passes
- [x] 4.2 Review all nine images against the protected-symbol list and the strip order (cyan, navy, ultramarine, navy, vermillion); record the check in the PR description

## 5. Integration

- [x] 5.1 Run `pnpm lint`, `pnpm build` and `pnpm test:e2e`; all pass
- [ ] 5.2 On a preview deploy, share `/`, `/events` and `/contact` in WhatsApp and check them in the LinkedIn Post Inspector and opengraph.xyz; verify each shows its own thumbnail
- [ ] 5.3 As the last commit of this PR, run `pnpm exec openspec archive social-preview-images`; verify `openspec list --specs` shows `social-preview-images` and strict validation passes

## Workflow follow-up

- After production deploy, re-scrape `/` and `/events` in the Facebook Sharing Debugger and LinkedIn Post Inspector to clear cached previews.
