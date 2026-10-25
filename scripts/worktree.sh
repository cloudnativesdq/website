#!/usr/bin/env bash
# Create a sibling worktree ../<repo-dir>-<branch> and set it up.
# New branches start from origin/main; an existing branch is checked out as is.
# Remove it later with: git worktree remove <dir>
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: pnpm run worktree <branch>" >&2
  exit 2
fi
branch=$1
git check-ref-format --branch "$branch" >/dev/null

root=$(git rev-parse --show-toplevel)
dir="$(dirname "$root")/$(basename "$root")-${branch//\//-}"
if [ -e "$dir" ]; then
  echo "$dir already exists. Remove it first (git worktree remove \"$dir\") or pick another branch." >&2
  exit 1
fi

git -C "$root" fetch origin main
if git -C "$root" show-ref --verify --quiet "refs/heads/$branch"; then
  git -C "$root" worktree add "$dir" "$branch"
else
  git -C "$root" worktree add -b "$branch" "$dir" origin/main
fi

# Local secrets follow the new tree; both paths are git-ignored and stay on this machine.
if [ -f "$root/.env.local" ]; then
  cp "$root/.env.local" "$dir/.env.local"
fi

# Browsers are shared in ~/.cache/ms-playwright, so skip the reinstall.
(cd "$dir" && SKIP_PLAYWRIGHT=1 bash scripts/setup.sh)

cat <<EOF

Worktree ready:
  cd "$dir"
If another tree is running, pick free ports:
  pnpm dev --port 3001
  E2E_PORT=3101 pnpm test:e2e
EOF
