#!/usr/bin/env bash
# Vercel install step — bootstraps the Rust toolchain so `playground-wasm`
# can produce the browser-target `pkg-web/` output that the Next build
# imports from `playground-wasm/web`. Vercel's build image ships Node +
# Bun but not Rust, so we install it per-deploy.
#
# Runs before `buildCommand` (which is just `next build`).

set -euo pipefail

echo "[vercel-install] Installing Rust toolchain…"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
  | sh -s -- -y --default-toolchain stable --profile minimal --no-modify-path
# shellcheck disable=SC1091
. "$HOME/.cargo/env"

echo "[vercel-install] Installing wasm-pack…"
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf \
  | sh -s -- -f

echo "[vercel-install] Installing JS deps…"
bun install --frozen-lockfile

echo "[vercel-install] Building playground-wasm (web target)…"
bun run --filter playground-wasm build:web

echo "[vercel-install] Done."
