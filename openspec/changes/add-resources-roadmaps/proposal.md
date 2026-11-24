# Proposal

## Why

People who join the community often ask where to start and in what order to learn. The Resources page lists courses, certifications and platforms, but no learning paths. Community-maintained roadmaps (roadmap.sh) and the CNCF's own maturity models and guides answer that question and are free.

## What Changes

- Add a "Roadmaps" category ("Rutas de aprendizaje" in Spanish) to the learning resources grid on `/resources`, placed after certifications.
- The category holds nine link cards: the roadmap.sh Kubernetes, DevOps, Docker, Linux and Terraform roadmaps, the CNCF Trail Map, the Cloud Native Maturity Model, the Platform Engineering Maturity Model and the CNCF Landscape Guide. Each card has a one-line description in Spanish and English and opens in a new tab like the other external cards.
- Add a neutral route icon (from Lucide, ISC) as the category icon. roadmap.sh cards use it because the roadmap.sh mark is not licensed for reuse.

## Capabilities

### New Capabilities

- `resources-page`: the learning resources grid on `/resources`, its categories and how its cards open. The delta first records the current categories, then adds Roadmaps.

### Modified Capabilities

None.

## Impact

- Edited: `src/components/ResourcesView.tsx`, `src/lib/links.ts`, `src/lib/translations.ts`, `tests/e2e/site.spec.ts`.
- New: `public/logos/route.svg`.
- No new dependencies or data sources; the links are static.
