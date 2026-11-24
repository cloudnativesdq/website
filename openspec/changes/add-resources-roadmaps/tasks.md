# Tasks

## 1. Roadmaps category

- [x] 1.1 Add the nine roadmap URLs to `src/lib/links.ts` and the Spanish and English category label and descriptions to `src/lib/translations.ts`; verify with `pnpm exec tsc --noEmit -p .`
- [x] 1.2 Add `public/logos/route.svg` and the `roadmaps` category and cards to `src/components/ResourcesView.tsx`; verify the Roadmaps tab shows nine cards on `/resources`
- [x] 1.3 Add an e2e check that the Roadmaps tab lists the nine links and they open in a new tab; verify with `pnpm test:e2e`

## 2. Checks

- [x] 2.1 Run lint, typecheck, build, e2e and `openspec validate --all --strict`
- [x] 2.2 Screenshot `/resources` at 375px and 1280px in Spanish and English and check the cards render without overflow

## Workflow follow-up

- Archive the change as the last commit of the implementing PR.
