# Design

## Context

- The CI workflow (`.github/workflows/ci.yml`) runs lint, `tsc`, build and e2e on every PR, with `submodules: true` and Node from `.nvmrc` (24). The Dependabot workflow auto-merges once the `CI` workflow succeeds (`workflow_run: [CI]`). The freeCodeCamp workflow pushes data straight to `main`.
- `openspec` 1.15.0 is installed globally on the maintainer's machine only. `openspec/` and `.claude/` are untracked on branch `chore/openspec-init`. Four changes are pending there: `brand-identity-assets`, `seo-metadata-fixes`, `social-preview-images` and this one.
- `.claude/` holds OpenSpec-generated files (`commands/opsx/*.md`, `skills/openspec-*`). Other tools get their own files when someone runs `openspec init`/`update` for them.
- `.gitignore` line 1 is `.env*`, so `.env.example` exists locally but was never committed. It lists only `DATA_SOURCE`, `OCG_GROUP_SLUG` and `OCG_BASE_URL`. The code also reads `RESEND_API_KEY`, `GOOGLE_CALENDAR_API_KEY` and `LUMA_EVENT_URLS`.
- `playwright.config.ts` hardcodes port 3100 with `reuseExistingServer` locally, so a second worktree would silently test the first worktree's server.
- `pnpm setup` is a built-in pnpm command (it configures PNPM_HOME). A package script named `setup` only runs through `pnpm run setup`, which is easy to get wrong. That is why the script is named `dev:setup`.
- The maintainer's own `wt` zsh helper creates sibling worktrees named `../<repo>-<branch>`. The repo script uses the same layout so both tools agree.

## Goals / Non-Goals

**Goals:**
- A newcomer goes from clone to a passing `pnpm build` with two commands.
- The rule "plan with OpenSpec first" is written where agents read it and checked where humans cannot skip it silently.

**Non-Goals:**
- Devcontainer or Codespaces config (the user chose scripts only).
- Requiring an AI assistant. The whole flow works with the CLI alone.
- Branch protection settings (repo admin, manual).
- Kubernetes-org contribution rules. This repo is not under that org.

## Decisions

**Separate `openspec.yml` workflow, not a step in `ci.yml`.** The gate must re-run on `labeled`/`unlabeled` events. Adding those triggers to `ci.yml` would rebuild and re-run e2e on every label change, and would change the `workflow_run` timing the Dependabot auto-merge relies on. The new workflow is one cheap job: checkout (`fetch-depth: 0`), pnpm, Node, `pnpm install --frozen-lockfile`, `pnpm exec openspec validate --all --strict`, then the path gate.

```yaml
on:
  pull_request:
    types: [opened, reopened, synchronize, labeled, unlabeled]
```

Path gate in bash:
`git diff --name-only "origin/${{ github.base_ref }}...HEAD"`. It fails when any path matches `^(src|public)/` and no path matches `^openspec/`, unless `contains(github.event.pull_request.labels.*.name, 'no-spec')`. The failure prints which product files changed and the two ways to fix it. Alternative: a third-party "require label/paths" action. Rejected because ten lines of bash do it with no third-party trust.

**Why `src/` and `public/` only.** Those are the product. Docs, CI, `package.json`, lockfile and tests change without a spec. A test-only PR documents existing behavior and does not change it. This keeps Dependabot and docs PRs out of the gate with no special cases. The `no-spec` label covers small product edits that change no requirement: typos, copy tweaks, dependency-driven code fixes.

**Any `openspec/` path satisfies the gate.** That includes proposing, updating, archiving (`openspec/changes/archive/`) and syncing specs (`openspec/specs/`). The gate checks that planning happened in the PR, not which change matches which file. Matching would need parsing tasks to file paths, which is brittle. Reviewers judge the fit using the PR template's link.

**Archive in the implementing PR, not after merge.** A separate archive PR is easy to forget, which would leave `openspec/specs/` empty. The next change touching the same behavior would then have nothing to `MODIFY` and would fork the requirement. Each change's last task runs `pnpm exec openspec archive <name>`, the PR template carries a "change archived" checkbox, and CONTRIBUTING says so. A CI check that the implementing PR also archived its change was considered and rejected. It would need to tell "proposal-only PR" from "implementation PR", which the diff cannot show reliably. The checkbox plus review is enough. Proposal-only PRs (planning without code) are fine and leave the change in `openspec/changes/`.

**Every committed change validates.** The gate runs `validate --all --strict`, so a change committed to `main` must have at least a proposal and spec deltas. Design and tasks can follow later (`language-ssr` and `image-optimization` are in that state). A bare proposal fails validation and would block every PR.

**Baseline specs grow on contact, not in one big change.** Existing behavior (events, map, translations, gallery, API) has no specs. Writing all of it up front is a large change nobody would review closely. Rule instead, stated in CONTRIBUTING and AGENTS.md: when a change touches an area with no spec, its delta first `ADD`s the current behavior it depends on, then changes it. Coverage grows exactly where work happens.

**CI install cost.** The OpenSpec job installs the full tree just to run the CLI. `actions/setup-node` with `cache: pnpm` keys on `pnpm-lock.yaml`, the same key `ci.yml` uses, so after the first CI run the store is warm and install takes seconds. Alternative: `pnpm dlx @fission-ai/openspec@1.15.0`. Rejected because it pins the version in a second place.

**CLI as devDependency.** `"@fission-ai/openspec": "1.15.0"` (exact pin; bump deliberately because `openspec update` regenerates agent files). It requires Node ≥ 20.19, which Node 24 satisfies. Docs use `pnpm exec openspec …`. Dependabot will propose bumps like any other dependency.

**What to commit from `.claude/`.** Commit `.claude/commands/opsx/` and `.claude/skills/openspec-*`. Ignore `.claude/settings.local.json` and `.claude/worktrees/` (personal and session state). The OpenSpec slash commands then work for every Claude Code contributor. Other assistants read `AGENTS.md`, which states the CLI flow.

**`scripts/setup.sh`.** `set -euo pipefail`, run from the repo root (`cd "$(git rev-parse --show-toplevel)"`). Steps, each skipped when already done:
1. Node major from `node -p 'process.versions.node.split(".")[0]'` must equal `.nvmrc`, else exit 1 with "Use Node <n> (nvm use / fnm use)".
2. `pnpm --version` must equal the version in `packageManager`, else print `corepack enable && corepack prepare pnpm@<v> --activate` and exit 1.
3. `git submodule update --init --recursive`.
4. `pnpm install --frozen-lockfile`.
5. `[ -f .env.local ] || cp .env.example .env.local`.
6. `pnpm exec playwright install chromium`, unless `SKIP_PLAYWRIGHT=1`. It skips by itself when the browser is cached.

It ends by printing the next commands (`pnpm dev`, `pnpm test:e2e`). Checked with `shellcheck`.

**`scripts/worktree.sh <branch>`.** It validates the branch name with `git check-ref-format --branch`, then computes `dir="$(dirname "$root")/$(basename "$root")-${branch//\//-}"`. It refuses if `$dir` exists. It runs `git fetch origin main`, then `git worktree add -b "$branch" "$dir" origin/main` when the branch is new, else `git worktree add "$dir" "$branch"`. It runs `scripts/setup.sh` inside `$dir`, with `SKIP_PLAYWRIGHT=1` since browsers are shared in `~/.cache/ms-playwright`. If the main tree has a `.env.local`, it copies it, so local secrets follow. The copy stays on the same machine and both paths are git-ignored. It prints `cd "$dir"` and a reminder to run `pnpm dev --port <free port>` / `E2E_PORT=<port> pnpm test:e2e` when another tree is running. Removal is plain `git worktree remove <dir>`, documented and not scripted. Each worktree has its own `node_modules`, but pnpm hard-links from the shared store, so a second install is fast and adds little disk use.

**Port.** `const PORT = Number(process.env.E2E_PORT ?? 3100);` in `playwright.config.ts`. `next dev` already accepts `--port`, so nothing is needed there.

**Docs layout.**
- `CONTRIBUTING.md` (people):
  - prerequisites (Node 24 via `.nvmrc`, Corepack pnpm)
  - clone with `--recurse-submodules`, then `pnpm run dev:setup`
  - worktrees
  - the OpenSpec flow: explore → propose → review → apply → archive, shown as slash commands for AI users and as CLI commands (`pnpm exec openspec new change`, `instructions`, `validate`, `archive`) for others
  - `no-spec` criteria
  - archive the change as the last commit of the implementing PR
  - when touching an area with no spec, ADD its current behavior first, then change it
  - local checks, mirroring CI: `pnpm lint`, `pnpm exec tsc --noEmit -p .`, `pnpm build`, `pnpm test:e2e`
  - the submodule commit order for `_ds/style-guide` edits
  - the PR process (fork or branch, PR template)

  The existing bug/enhancement and community sections stay.
- `AGENTS.md` (agents): fix the Architecture versions (Next 16.4, React 19, TypeScript 7, Tailwind 4). Add a "Workflow" section:
  - plan any behavior change with OpenSpec before editing code
  - never implement during propose
  - use `pnpm run worktree` for parallel work
  - run the CI checks before declaring done
  - never commit `.env.local`
  - when touching an area with no spec, ADD its current behavior in the delta first
  - edit `_ds/style-guide` in the submodule, then bump the pointer

  Re-check the "Type Updates" list against current files; `EventsSection`/`EventCalendar` may no longer declare their own `Event` interfaces. Keep the `nextjs-agent-rules` block byte-for-byte, because `next dev` rewrites it.
- `CLAUDE.md`: a single line `@AGENTS.md` (Claude Code import syntax), so there is one source.
- `README.md`: Node 24 / pnpm 11 prerequisites, `--recurse-submodules`, `pnpm run dev:setup`, link to CONTRIBUTING. Remove "Edge Runtime" (the site runs on Node).

## Risks / Trade-offs

- [Gate is coarse: any `openspec/` edit passes] → Accepted. The PR template link plus review covers intent; exact matching is brittle.
- [The `no-spec` label gets overused] → Labels are visible in the PR list. Only maintainers can apply labels on PRs from forks, so outside contributors cannot exempt themselves.
- [OpenSpec bump regenerates `.claude/` files and churns diffs] → Exact pin. A bump PR runs `pnpm exec openspec update` and commits the result together.
- [bash scripts exclude native Windows shells] → Documented. WSL and Git Bash work.
- [Fork PRs: `pull_request` from forks runs with a read-only token] → The gate only reads the diff and labels, so a read-only token is enough.

## Migration Plan

1. Merge this change on `chore/openspec-init` together with the first commit of `openspec/` and `.claude/`.
2. Create the `no-spec` label on GitHub (manual, maintainer).
3. Optionally mark the `OpenSpec` check as required in branch protection (manual).

Rollback: delete `openspec.yml`. The docs and scripts can stay without harm.
