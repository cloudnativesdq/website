# Proposal

## Why

The Linux Foundation Education Black Friday sale (up to 65% off training and certifications) runs November 27 through December 4, 2026. The Resources page already has a discounts block for LF coupons, and it is where community members look for certification deals, so the sale belongs there for its duration and must disappear when it ends.

## What Changes

- Spec the current discounts block on `/resources`: the coupon read from the techiescamp README, and the fallback text when no coupon can be read.
- Add a time-limited "LF Black Friday" promotion to the discounts block: title, "up to 65% off", the sale dates, the official LF poster, and a link to `https://training.linuxfoundation.org/`.
- Label it "coming soon" before November 27 and as live from November 27; hide it from December 5, 2026 00:00 in Santo Domingo (UTC-4).
- The existing coupon keeps working unchanged next to the promotion.

## Capabilities

### New Capabilities

- `resources-page`: the `/resources` page. This delta only adds its discounts block (current LF coupon and time-limited LF sales); the resource grid is specified by `add-resources-roadmaps`, which introduces the same capability.

### Modified Capabilities

None.

## Impact

- `src/components/ResourcesView.tsx`, `src/app/resources/page.tsx`, `src/lib/cncf-resources.ts`, `src/lib/translations.ts`.
- New image `public/images/lf-black-friday-2026.webp` (the official LF poster, re-encoded).
- One Playwright test in `tests/e2e/site.spec.ts`.
