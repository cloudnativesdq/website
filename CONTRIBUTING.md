# Contributing to Cloud Native Santo Domingo Website

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to our community website.

## 🤝 How Can I Contribute?

### Reporting Bugs
- Check the [Issues](https://github.com/cloudnativesdq/website/issues) to see if the bug has already been reported.
- If not, open a new issue with a clear title and description, providing as much relevant information as possible.

### Suggesting Enhancements
- Open a new issue with the tag "enhancement".
- Explain the feature you would like to see and why it would be useful.

## 🛠️ Development Setup

### Prerequisites

- Node.js 24 (the version in `.nvmrc`). With nvm or fnm: `nvm use` or `fnm use`.
- pnpm 11.14.0 through Corepack, which ships with Node:
  ```bash
  corepack enable
  ```
  Corepack reads the version from `packageManager` in `package.json`.
- Git and bash. On Windows, use WSL or Git Bash.

### Clone and set up

```bash
git clone --recurse-submodules https://github.com/cloudnativesdq/website.git
cd website
pnpm run dev:setup
pnpm dev
```

`pnpm run dev:setup` runs `scripts/setup.sh`. It checks the Node and pnpm versions, initializes the `_ds/style-guide` submodule (so a clone without `--recurse-submodules` also works), runs `pnpm install --frozen-lockfile`, copies `.env.example` to `.env.local` if `.env.local` does not exist, and installs the Playwright Chromium browser. Set `SKIP_PLAYWRIGHT=1` to skip the browser. It is safe to rerun.

Use `pnpm run dev:setup`, not `pnpm setup`. `pnpm setup` is a built-in pnpm command that does something else.

Then open [http://localhost:3000](http://localhost:3000). `.env.example` describes each environment variable. The defaults are enough to run the site.

### Working in parallel with worktrees

To work on more than one branch at a time, create a git worktree:

```bash
pnpm run worktree feat-x
cd ../website-feat-x
```

This creates `../<repo-dir>-<branch>` next to your clone (slashes in the branch name become dashes, so `fix/navbar` gives `../website-fix-navbar`). The branch is created from `origin/main`, or checked out if it already exists. The script copies your `.env.local` and runs the setup in the new tree, without reinstalling the Playwright browser. It refuses to overwrite an existing directory.

If another tree already has a dev server or e2e run going, use other ports:

```bash
pnpm dev --port 3001
E2E_PORT=3101 pnpm test:e2e
```

When done, remove the tree from the main clone. Git refuses to remove a worktree that contains a submodule without `--force`, so commit or push anything you want to keep first:

```bash
git worktree remove --force ../website-feat-x
```

## 📐 Planning Changes with OpenSpec

Changes to site behavior are planned with [OpenSpec](https://github.com/Fission-AI/OpenSpec) before code is written. Specs live in `openspec/specs/`, planned changes in `openspec/changes/<name>/`. The CLI is a pinned devDependency, so run it with `pnpm exec openspec`. No global install and no AI assistant is needed.

The flow is explore, propose, review, apply, archive:

| Step | Claude Code | CLI |
|------|-------------|-----|
| Explore an idea | `/opsx:explore` | `pnpm exec openspec list`, `pnpm exec openspec list --specs`, `pnpm exec openspec show <name>` |
| Propose a change | `/opsx:propose` | `pnpm exec openspec new change <name>`, then write each artifact using `pnpm exec openspec instructions <artifact> --change <name>` (artifacts: `proposal`, `specs`, `design`, `tasks`) |
| Review | Open a PR with the change folder | `pnpm exec openspec validate --all --strict` |
| Apply | `/opsx:apply` | `pnpm exec openspec instructions apply --change <name>`, then work through `tasks.md` |
| Archive | `/opsx:archive` | `pnpm exec openspec archive <name>` |

`/opsx:update` and `/opsx:sync` also exist in `.claude/commands/opsx/`. Other AI assistants read `AGENTS.md`, which describes the CLI flow.

Rules:

- **Archive in the implementing PR.** Archiving the change is the last commit of the PR that implements it, so `openspec/specs/` on `main` always matches the merged behavior. A PR that only proposes or updates a change leaves it in `openspec/changes/`.
- **Specs grow on contact.** Most existing behavior has no spec yet. When your change touches an area with no spec, its spec delta first ADDs the current behavior it depends on, then changes it.
- **Every committed change must validate.** A change needs at least a proposal and spec deltas to pass `validate --all --strict`.

### The `no-spec` label

The OpenSpec CI check fails a PR that changes `src/` or `public/` without also changing something under `openspec/`. A maintainer can apply the `no-spec` label to exempt a PR that changes no requirement:

- typos
- copy tweaks
- code fixes forced by a dependency update

If unsure, ask in the PR. Docs, CI, tests, `package.json` and the lockfile are outside the gate and need no label.

## ✅ Local Checks

Run what CI runs before you open a PR:

```bash
pnpm lint
pnpm exec tsc --noEmit -p .
pnpm build
pnpm test:e2e
pnpm exec openspec validate --all --strict
```

`pnpm test:e2e` starts the production build from `pnpm build` on port 3100 (or `E2E_PORT`) and runs the Playwright smoke tests, so run `pnpm build` first.

## 🎨 Editing the Style Guide Submodule

`_ds/style-guide` is a submodule pointing to [cloudnativesdq/style-guide](https://github.com/cloudnativesdq/style-guide). To change it:

1. Commit and push the change inside the submodule first, to the style-guide repo (or your fork of it):
   ```bash
   cd _ds/style-guide
   git switch -c my-change
   git commit -am "Describe the change"
   git push -u origin my-change
   ```
   Get it merged there.
2. Then update the pointer in this repo and commit it:
   ```bash
   cd _ds/style-guide
   git switch main
   git pull
   cd ../..
   git add _ds/style-guide
   git commit -m "Bump style-guide"
   ```

Never commit a pointer to a submodule commit that is not pushed, or every other clone fails to check it out.

## 🔀 Pull Requests

1. Fork the repo, or create a branch from `main` if you have write access.
2. Plan the change with OpenSpec (see above), unless it qualifies for `no-spec`.
3. Make the change and run the local checks.
4. Open the PR. The template asks for the OpenSpec change, whether it is archived, and which checks you ran.

## 📜 Code Style

- We use **TypeScript** for type safety.
- We use **Tailwind CSS** for styling.
- We follow the standard Next.js App Router structure.
- Display strings go in `src/lib/translations.ts`, not in components.

## 🌍 Community

Join our community on [Instagram](https://www.instagram.com/cncfsdq) and [LinkedIn](https://www.linkedin.com/company/cloud-native-santo-domingo).

---

Thank you for being part of Cloud Native Santo Domingo! 🇩🇴
