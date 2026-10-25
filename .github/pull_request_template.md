## OpenSpec change

<!-- Link the change folder, e.g. openspec/changes/<name>/. If the PR changes src/ or public/
without a change, explain why it qualifies for the no-spec label (typo, copy tweak,
dependency-driven fix: no requirement changes). See CONTRIBUTING.md. -->

Change:

- [ ] Change archived in this PR (`pnpm exec openspec archive <name>`), or this PR only proposes or updates a change

## What changed

## Checks run locally

- [ ] `pnpm lint`
- [ ] `pnpm exec tsc --noEmit -p .`
- [ ] `pnpm build`
- [ ] `pnpm test:e2e`
- [ ] `pnpm exec openspec validate --all --strict`
