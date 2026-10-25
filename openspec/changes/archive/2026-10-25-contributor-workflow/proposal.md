# Proposal

## Why

The project now plans work with OpenSpec, but nothing tells a contributor or an AI agent to do so, and nothing checks it. Contributor docs are stale or wrong. The README asks for Node 18 and pnpm 9, while the project pins Node 24 (`.nvmrc`, `engines`) and pnpm 11.14 (`packageManager`). AGENTS.md lists Next 16.2.2, TypeScript 5.8 and Tailwind 3.4 (actual: 16.4, 7, 4). Neither doc mentions the `_ds/style-guide` submodule, so a plain `git clone` fails to build. `.env.example` is never committed because `.gitignore` matches `.env*`. Parallel work in git worktrees takes several manual steps per tree.

## What Changes

- **OpenSpec as the contribution path.** Any change to site behavior starts as an OpenSpec change (`openspec/changes/<name>/`), reviewed in the same PR as the code. `@fission-ai/openspec` is pinned to `1.15.0` as a devDependency, so `pnpm exec openspec` gives everyone and CI the same version.
- **Commit the OpenSpec setup**: `openspec/` (config, specs, changes) and the generated agent integrations `.claude/commands/opsx/` and `.claude/skills/openspec-*`, which are untracked today.
- **CI gate** (new workflow `.github/workflows/openspec.yml`):
  - `openspec validate --all --strict` on every PR.
  - A PR that changes `src/**` or `public/**` fails unless it also changes something under `openspec/` or carries the `no-spec` label.
- **PR template** `.github/pull_request_template.md`: link to the OpenSpec change (or the reason for `no-spec`) and the local check commands.
- **Dev environment scripts**:
  - `pnpm run dev:setup` (`scripts/setup.sh`): checks the Node and pnpm versions, initializes the submodule, installs with the frozen lockfile, creates `.env.local` from `.env.example` if missing, and installs Playwright Chromium. Safe to rerun.
  - `pnpm run worktree <branch>` (`scripts/worktree.sh`): creates a sibling worktree `../<repo>-<branch>` from `origin/main` (or checks out an existing branch) and runs setup in it.
- `playwright.config.ts` reads `E2E_PORT` (default `3100`) so e2e runs in two worktrees at once do not collide.
- `.gitignore`: keep `.env.example` tracked (`!.env.example`) and complete it with every variable the code reads (`RESEND_API_KEY`, `GOOGLE_CALENDAR_API_KEY`, `LUMA_EVENT_URLS` are missing).
- **Docs**:
  - Rewrite `CONTRIBUTING.md`: setup, worktrees, the OpenSpec flow with and without an AI assistant, when `no-spec` applies, local checks.
  - Update `AGENTS.md`: correct the stack facts, add the OpenSpec and worktree rules for agents, keep the Next.js agent-rules block.
  - Add `CLAUDE.md` that imports `AGENTS.md`, because Claude Code reads CLAUDE.md and not AGENTS.md.
  - Fix the README prerequisites and clone command, and link to CONTRIBUTING.

## Capabilities

### New Capabilities

- `contribution-workflow`: how changes reach `main`: the OpenSpec requirement and its CI check, the PR template, and the local setup and worktree commands contributors rely on.

### Modified Capabilities

None. No specs exist yet.

## Impact

- New: `.github/workflows/openspec.yml`, `.github/pull_request_template.md`, `scripts/setup.sh`, `scripts/worktree.sh`, `CLAUDE.md`, tracked `.env.example`.
- Edited: `package.json` (devDependency and two scripts), `pnpm-lock.yaml`, `playwright.config.ts`, `.gitignore`, `CONTRIBUTING.md`, `AGENTS.md`, `README.md`.
- Committed for the first time: `openspec/`, `.claude/commands/opsx/`, `.claude/skills/openspec-*`.
- GitHub: create the `no-spec` label. Dependabot PRs touch only `package.json`, `pnpm-lock.yaml` and `.github/`, so the gate does not block them. The freeCodeCamp data workflow pushes straight to `main`, not through a PR, so the gate does not apply to it.
- Scripts are bash. Windows contributors use WSL or Git Bash.
