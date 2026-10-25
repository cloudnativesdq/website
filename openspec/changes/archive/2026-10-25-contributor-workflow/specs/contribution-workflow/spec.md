# Spec Delta

## Purpose

Defines how a change reaches `main`: behavior changes are planned as OpenSpec changes and checked in CI, and contributors (human or AI) can set up a dev environment or a parallel git worktree with one command.

## ADDED Requirements

### Requirement: Pinned OpenSpec CLI
The repository SHALL provide the OpenSpec CLI as a pinned devDependency so `pnpm exec openspec` runs the same version locally and in CI, with no global install.

#### Scenario: Fresh clone
- **WHEN** a contributor runs `pnpm install` in a fresh clone and then `pnpm exec openspec --version`
- **THEN** it prints the pinned version

### Requirement: Specs and changes validate on every PR
CI SHALL run strict validation of all OpenSpec specs and changes on every pull request and fail the check when any item is invalid.

#### Scenario: Invalid change
- **WHEN** a PR adds a change whose spec has a requirement without a scenario
- **THEN** the OpenSpec check fails and names the invalid item

#### Scenario: Valid tree
- **WHEN** every spec and change is valid
- **THEN** the validation step passes

### Requirement: Behavior changes need an OpenSpec change
A pull request that modifies files under `src/` or `public/` SHALL fail the OpenSpec check unless the same PR also modifies a file under `openspec/` or carries the `no-spec` label. Adding or removing the label SHALL re-run the check.

#### Scenario: Code without a change
- **WHEN** a PR edits `src/components/Navbar.tsx` and nothing under `openspec/`, with no `no-spec` label
- **THEN** the check fails with a message saying to add an OpenSpec change or the `no-spec` label

#### Scenario: Code with a change
- **WHEN** a PR edits `src/app/sitemap.ts` and adds `openspec/changes/seo-metadata-fixes/`
- **THEN** the check passes

#### Scenario: Labeled exemption
- **WHEN** a PR fixing a typo in `src/lib/translations.ts` carries the `no-spec` label
- **THEN** the check passes, and removing the label makes it fail again

#### Scenario: Non-product paths
- **WHEN** a Dependabot PR changes only `package.json` and `pnpm-lock.yaml`
- **THEN** the check passes without a label

### Requirement: Archive in the implementing PR
A PR that implements an OpenSpec change SHALL archive that change in the same PR, so `openspec/specs/` on `main` always describes the merged behavior. The PR template and CONTRIBUTING.md SHALL state this, and each change's `tasks.md` SHALL end with an archive task.

#### Scenario: Merged change
- **WHEN** a PR implementing change `foo` is merged
- **THEN** `main` has no `openspec/changes/foo/` directory, and `openspec/specs/` contains the requirements from `foo`'s deltas

#### Scenario: Reviewer check
- **WHEN** a reviewer opens a PR that implements a change and the PR has not archived it
- **THEN** the PR template's unchecked "change archived" item shows what is missing

### Requirement: PR template
New pull requests SHALL open with a template asking for the OpenSpec change name (or the reason for `no-spec`), a "change archived in this PR" item, and a checklist of the local checks: lint, typecheck, build, e2e.

#### Scenario: Opening a PR
- **WHEN** a contributor opens a PR on GitHub
- **THEN** the description is pre-filled with the OpenSpec field and the checklist

### Requirement: One-command dev setup
`pnpm run dev:setup` SHALL prepare a working dev environment: verify Node matches `.nvmrc` and pnpm matches `packageManager`, initialize the `_ds/style-guide` submodule, install with the frozen lockfile, create `.env.local` from `.env.example` only when it does not exist, and install the Playwright Chromium browser. Rerunning it SHALL change nothing that is already set up.

#### Scenario: Fresh clone without submodule
- **WHEN** a contributor clones without `--recurse-submodules` and runs `pnpm install && pnpm run dev:setup`
- **THEN** `_ds/style-guide` is populated and `pnpm build` succeeds

#### Scenario: Wrong Node version
- **WHEN** the active Node major version differs from `.nvmrc`
- **THEN** setup stops with a message naming the required version, before installing anything

#### Scenario: Existing env file kept
- **WHEN** `.env.local` already exists
- **THEN** setup leaves it unchanged

### Requirement: One-command worktree
`pnpm run worktree <branch>` SHALL create a git worktree at `../<repo-dir>-<branch>`, on a new branch from `origin/main` or on the existing branch of that name, and run the dev setup inside it. It SHALL refuse to overwrite an existing directory.

#### Scenario: New branch
- **WHEN** a contributor runs `pnpm run worktree feat-x` and `feat-x` does not exist
- **THEN** `../cloudnativesdq-website-feat-x` exists on new branch `feat-x` based on `origin/main`, with submodule and dependencies ready

#### Scenario: Directory taken
- **WHEN** `../cloudnativesdq-website-feat-x` already exists
- **THEN** the command exits non-zero without touching it

### Requirement: Parallel e2e runs
The e2e server port SHALL come from `E2E_PORT` when set, defaulting to 3100, so two worktrees can run e2e at once.

#### Scenario: Two worktrees
- **WHEN** one worktree runs `pnpm test:e2e` and another runs `E2E_PORT=3101 pnpm test:e2e`
- **THEN** both suites run against their own server

### Requirement: Documented env variables
`.env.example` SHALL be tracked and SHALL list every environment variable the code reads, with a comment on each, and no real secret values.

#### Scenario: Variable coverage
- **WHEN** a reviewer compares `process.env.*` names in `src/` with `.env.example`
- **THEN** every name appears in `.env.example`

### Requirement: Contributor and agent docs
`CONTRIBUTING.md` SHALL describe setup, worktrees, the OpenSpec flow (propose, apply, archive, with and without an AI assistant), the `no-spec` rule and the local checks. `AGENTS.md` SHALL state the same rules for AI agents along with current stack facts. `CLAUDE.md` SHALL import `AGENTS.md`.

#### Scenario: Agent reads the rules
- **WHEN** Claude Code or another agent starts in the repo
- **THEN** its instruction file tells it to plan behavior changes with OpenSpec before editing code and to use a worktree for parallel work

#### Scenario: Commands in docs work
- **WHEN** a contributor runs each command shown in `CONTRIBUTING.md` in order on a fresh clone
- **THEN** every command succeeds
