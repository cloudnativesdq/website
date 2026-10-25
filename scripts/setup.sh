#!/usr/bin/env bash
# Prepare a dev environment: versions, submodule, dependencies, .env.local, Playwright browser.
# Safe to rerun. Set SKIP_PLAYWRIGHT=1 to skip the browser install.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

want_node=$(tr -d '[:space:]v' < .nvmrc)
have_node=$(node -p 'process.versions.node.split(".")[0]')
if [ "$have_node" != "$want_node" ]; then
  echo "Use Node $want_node (nvm use / fnm use). Active: $(node --version)." >&2
  exit 1
fi

want_pnpm=$(node -p 'require("./package.json").packageManager.split("@")[1]')
have_pnpm=$(pnpm --version)
if [ "$have_pnpm" != "$want_pnpm" ]; then
  echo "Use pnpm $want_pnpm (active: $have_pnpm). Run:" >&2
  echo "  corepack enable && corepack prepare pnpm@$want_pnpm --activate" >&2
  exit 1
fi

git submodule update --init --recursive
pnpm install --frozen-lockfile

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example."
fi

if [ "${SKIP_PLAYWRIGHT:-}" != "1" ]; then
  pnpm exec playwright install chromium
fi

cat <<'EOF'

Ready. Next:
  pnpm dev          # http://localhost:3000
  pnpm build && pnpm test:e2e
EOF
