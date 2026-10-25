# Proposal

## Why

Every shared link shows the same stock image (`public/og-image.jpg`, glowing hexagons with no name or logo), and gallery and team show none at all. A branded thumbnail per page tells people in WhatsApp, LinkedIn and X which community and which page the link opens before they tap.

## What Changes

- Add one shared render module that draws Open Graph images with Next.js `ImageResponse`, ported from the approved mockups (`openspec/changes/social-preview-images/inputs/og.html`, `og-home.png`, bottom half of `og.png`).
- Add `src/app/opengraph-image.tsx` (home): navy panel on the left with the mark, "Cloud Native Santo Domingo", the headline "La comunidad **Cloud Native** de RD" (accent on "Cloud Native") and a subline; event photo `public/images/gallery/drive-153gkemtahu2.jpg` on the right (the people in it consented); a bottom strip of cyan, ultramarine and vermillion separated by navy gaps.
- Add `opengraph-image.tsx` for `events`, `team`, `gallery`, `programs`, `resources`, `map`, `start-a-chapter` and `contact`: brand row, uppercase eyebrow, Spanish page title, page URL, a large faint mark at the bottom right, same strip.
- Every image is a 1200x630 PNG under 300KB (WhatsApp drops larger previews) and exports its `alt`.
- The home headline is sized and bound so no line holds a single word (the mockup leaves "RD" alone on the last line).
- Fonts: Space Grotesk and Inter from `_ds/style-guide/assets/fonts/`.
- **BREAKING** (asset URL): remove the static `images` entries from the shared Open Graph and Twitter metadata and delete `public/og-image.jpg`.

## Capabilities

### New Capabilities

- `social-preview-images`: the image each route publishes for link previews, its content, size, format and weight.

### Modified Capabilities

None in `openspec/specs/`. This change relaxes one detail of `seo-metadata-fixes` (not yet archived): the shared metadata constant no longer carries a default image, because the file convention now supplies `og:image` for every route.

## Impact

- New: `src/lib/og-image.tsx` (shared render), nine `opengraph-image.tsx` files under `src/app/`.
- Edited: `src/lib/seo.ts` (drop `images`). Deleted: `public/og-image.jpg`.
- Uses `sharp` (listed in `package.json` by `brand-identity-assets`) to palette-quantize the PNGs. The raw home image is about 909KB; quantized it is about 236KB.
- Reads `public/brand/mark.svg` from `brand-identity-assets` and the font files from the `_ds/style-guide` submodule at build time.
- Apply order: `brand-identity-assets`, then `seo-metadata-fixes`, then this change.
