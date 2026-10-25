# Proposal

> Status: proposal and specs only. Design and tasks come later through `/opsx:propose image-optimization` (continue).

## Why

`next.config.ts` sets `images.unoptimized: true`, so every `next/image` serves its original file and the `sizes` attributes do nothing. The gallery (`public/images/gallery`, 15 photos, 4MB, 1600px wide) downloads at full size on phones. The flag was added in `2794af598f` "for OCG compatibility": OCG (ocgroups.dev) images only load with a Referer header, which is why the `/api/ocg-image` proxy route exists.

## What Changes

- Turn image optimization back on for images the optimizer can fetch: local files under `public/` and the remote hosts already in `remotePatterns`.
- Keep OCG images working:
  - either mark those images `unoptimized` per image,
  - or point them at the local `/api/ocg-image` proxy and allow that path through `images.localPatterns`.
- Set `sizes` correctly where it is missing or wrong, and `priority` only on the hero.
- Check the Vercel Image Optimization usage the change implies against the project's plan limits.

## Capabilities

### New Capabilities

- `image-delivery`: how the site sizes, encodes and serves images to each device.

### Modified Capabilities

None.

## Impact

- `next.config.ts`, components that render OCG images (`EventCard`, `OrganizersSection`, providers' image URLs), `GalleryPage`.
- Vercel billing: optimized source images count toward plan usage.
- Interacts with `brand-identity-assets`, whose placeholder PNGs would then be optimized too. No conflict.
