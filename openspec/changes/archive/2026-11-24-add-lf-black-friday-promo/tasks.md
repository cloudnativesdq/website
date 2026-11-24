# Tasks

## 1. Promotion

- [x] 1.1 Add `lfPromoState` and its dates to `src/lib/cncf-resources.ts` and pass its value from `src/app/resources/page.tsx`; verify with `pnpm exec tsc --noEmit -p .`
- [x] 1.2 Add the Spanish and English strings to `src/lib/translations.ts`; verify typecheck passes with both languages
- [x] 1.3 Re-encode the LF poster to `public/images/lf-black-friday-2026.webp` and render the promotion in the discounts block of `ResourcesView`, keeping the coupon; verify with screenshots at 375px and 1280px
- [x] 1.4 Add a Playwright test that fakes the clock before and after the end and checks the promotion shows and hides; verify with `pnpm test:e2e`

## 2. Checks

- [x] 2.1 Run `pnpm lint`, `pnpm build` and `pnpm exec openspec validate --all --strict`; all pass

## Workflow follow-up

- Archive the change as the last commit of the implementing PR.
- Remove the promotion constants after the sale, or reuse them for the next one.
