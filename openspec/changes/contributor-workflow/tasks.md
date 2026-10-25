# Tasks

## 1. OpenSpec in the repo

- [ ] 1.1 Add `"@fission-ai/openspec": "1.15.0"` to `devDependencies` and run `pnpm install`; verify `pnpm exec openspec --version` prints `1.15.0`
- [ ] 1.2 Add `.claude/settings.local.json` and `.claude/worktrees/` to `.gitignore`, then stage `openspec/`, `.claude/commands/opsx/` and `.claude/skills/openspec-*`; verify `git status --short` lists them and nothing else under `.claude/`
- [ ] 1.3 Run `pnpm exec openspec validate --all --strict`; verify all four pending changes pass

## 2. CI gate and PR template

- [ ] 2.1 Add `.github/workflows/openspec.yml` (triggers incl. `labeled`/`unlabeled`, checkout with `fetch-depth: 0`, frozen install, strict validate, bash path gate with `no-spec` label check); verify `shellcheck` on the extracted gate script and `actionlint` (if available) pass
- [ ] 2.2 Add `.github/pull_request_template.md` (OpenSpec change field or `no-spec` reason, "change archived in this PR" item, checklist: lint, typecheck, build, e2e); verify it renders on a draft PR
- [ ] 2.3 On a throwaway draft PR, check each case: `src/` edit without `openspec/` fails with the fix message, adding `no-spec` passes, removing it fails again, a docs-only edit passes; record results in the PR description

## 3. Dev environment scripts

- [ ] 3.1 Write `scripts/setup.sh` (Node and pnpm version checks, submodule init, frozen install, `.env.local` from example if missing, Playwright Chromium unless `SKIP_PLAYWRIGHT=1`) and add `"dev:setup": "bash scripts/setup.sh"`; verify `shellcheck scripts/setup.sh` is clean, a fresh `git clone` (no `--recurse-submodules`) + `pnpm install && pnpm run dev:setup` + `pnpm build` succeeds, and a second run changes nothing
- [ ] 3.2 Verify the Node check: with Node 22 active, `pnpm run dev:setup` exits 1 naming Node 24 before installing
- [ ] 3.3 Write `scripts/worktree.sh` (ref-name check, `../<repo>-<branch>` path, refuse existing dir, new vs existing branch, `.env.local` copy, setup with `SKIP_PLAYWRIGHT=1`) and add `"worktree": "bash scripts/worktree.sh"`; verify `shellcheck` is clean, `pnpm run worktree feat-x` creates a ready tree on a new branch from `origin/main`, a second run exits non-zero, and `git worktree remove ../cloudnativesdq-website-feat-x` cleans up
- [ ] 3.4 Make `playwright.config.ts` read `E2E_PORT` (default 3100); verify two worktrees run `pnpm test:e2e` and `E2E_PORT=3101 pnpm test:e2e` at the same time and both pass

## 4. Environment template

- [ ] 4.1 Add `!.env.example` to `.gitignore` and extend `.env.example` with commented `RESEND_API_KEY`, `GOOGLE_CALENDAR_API_KEY` and `LUMA_EVENT_URLS` (no real values); verify `git ls-files .env.example` lists it and `rg -o 'process\.env\.\w+' src | sort -u` names only variables present in the file

## 5. Docs

- [ ] 5.1 Rewrite `CONTRIBUTING.md` per design (prerequisites, clone + setup, worktrees, OpenSpec flow with slash commands and CLI equivalents, `no-spec` criteria, archive-in-the-same-PR rule, local checks, submodule order, PR process; keep the issues and community sections); verify by running every command it shows, in order, on a fresh clone
- [ ] 5.2 Update `AGENTS.md`: current stack versions, new Workflow section, re-checked Type Updates list, `nextjs-agent-rules` block unchanged; verify versions against `package.json` and that `git diff` shows the agent-rules block untouched
- [ ] 5.3 Add `CLAUDE.md` containing `@AGENTS.md`; verify a new Claude Code session in the repo lists AGENTS.md content in its loaded memory (`/memory`)
- [ ] 5.4 Fix `README.md` prerequisites (Node 24, pnpm 11 via Corepack), clone with `--recurse-submodules`, `pnpm run dev:setup`, link to CONTRIBUTING, remove "Edge Runtime"; verify the steps match CONTRIBUTING

## 6. Integration

- [ ] 6.1 Run `pnpm lint`, `pnpm exec tsc --noEmit -p .`, `pnpm build`, `pnpm test:e2e` and `pnpm exec openspec validate --all --strict`; all pass
- [ ] 6.2 Maintainer: create the `no-spec` label on GitHub and optionally mark the `OpenSpec` check as required in branch protection; verify the label appears in the PR label picker
- [ ] 6.3 As the last commit of this PR, run `pnpm exec openspec archive contributor-workflow`; verify `openspec list --specs` shows `contribution-workflow`, the other pending changes stay in `openspec/changes/`, and strict validation passes
