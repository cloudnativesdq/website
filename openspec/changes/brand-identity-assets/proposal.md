# Proposal

## Why

The site has no logo of its own. The navbar and footer render a text wordmark, the favicon (`public/favicon.svg`) is a placeholder of Azure-blue squares unrelated to the community, and `public/images/logo.png` is the generic CNCF community-group template. An approved wave mark now exists, so every icon surface can carry one consistent identity. Two color tokens also fail WCAG AA contrast and are fixed in the same pass because the lockup and icons sit on them.

## What Changes

- Add the approved wave mark (64x64 SVG: cyan `#0ea8e6` curl ending in a node, light cyan `#7ad8fa` inner swell, vermillion `#ce1126` dot near the crest) as the vector source, plus a one-color variant.
- Add a lockup: mark + "Cloud Native Santo Domingo" in Space Grotesk 700. Render it in the navbar and footer instead of the "Cloud Native SDQ" text wordmark.
- Add app icons through Next.js metadata file conventions: `src/app/icon.svg`, `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (180, solid navy background), 192 and 512 PNGs, a maskable 512 PNG, and `src/app/manifest.ts`.
- Set `theme-color` through `export const viewport` in the root layout.
- Generate every PNG (and the ICO) from the SVG with a committed script that uses `sharp`. List `sharp` `0.35.5` in `package.json` `dependencies`. It is the same version `next` already installs, so no new package enters the tree.
- **BREAKING** (asset URLs): delete `public/favicon.svg` and `public/images/logo.png`, and delete the `icons` block in `src/app/layout.tsx`. References to those files (`links.siteLogo`, `links.eventFallbackImage`, `links.organizerFallbackImage`) move to the new brand assets.
- Contrast token fixes, applied in both `src/app/globals.css` and `_ds/style-guide/tokens/colors.css`:
  - dark theme `--text-on-accent` `#ffffff` becomes `#04202f` (2.71:1 fails; 6.20:1 passes on `#0ea8e6`)
  - light theme `--accent` `#0284c7` becomes `#0369a1` (white text 4.10:1 fails; 5.93:1 passes). Light `--accent-hover` was already `#0369a1`, so it moves one step darker to `#075985` to stay distinct.
- Update the design-system docs that say "no logo on file".
- Add an event image placeholder (mark centered on navy, sized for event cards). The square transparent icon would be sliced by the cards' `object-cover` crop.
- Set a naming rule: "Cloud Native Santo Domingo" on every visible surface; "Cloud Native SDQ" only where space forces a short name (manifest `short_name` "CN SDQ"). This changes the footer copyright and the contact email sender name.
- Bring the 404 page into the brand: Spanish copy, navbar and footer with the lockup, no `console.error` per miss. Add `src/app/error.tsx` with the same shell, and a skip-to-content link in the navbar.

## Capabilities

### New Capabilities

- `brand-identity`: the community mark, its approved variants, the lockup, where the lockup appears, the brand color rules and the contrast floor of the accent tokens.
- `app-icons`: favicon, app icons, web app manifest and theme color that browsers and operating systems read.

### Modified Capabilities

None. No specs exist yet.

## Impact

- New files: `public/brand/` (mark sources and generated PNGs), `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`, `src/app/manifest.ts`, `scripts/generate-brand-icons.mjs`, a lockup component.
- Edited: `src/app/layout.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/lib/links.ts`, `src/app/globals.css`, `src/app/not-found.tsx`, `src/lib/translations.ts` (404 and error strings), `src/app/actions/send-email.ts` (sender name only). New: `src/app/error.tsx`, `public/brand/event-placeholder.png`.
- `_ds/style-guide` is a git submodule (`cloudnativesdq/style-guide`). Token and doc edits there need their own commit in that repo and a submodule pointer bump here.
- Deleted: `public/favicon.svg`, `public/images/logo.png`. Any external page that hot-links them breaks.
- Later changes depend on this one: `seo-metadata-fixes` uses the PNG logo in JSON-LD, and `social-preview-images` draws the mark in Open Graph images.
- Dependencies: no new package. `sharp` 0.35.5 already reaches the tree only through `next`, with its build allowed in `pnpm-workspace.yaml`. The top-level `node_modules/sharp` is a stale 0.34.5 leftover that pnpm does not manage. Listing `sharp@0.35.5` directly (user decision) makes `import sharp from 'sharp'` resolve to the managed copy. `social-preview-images` relies on it too.
