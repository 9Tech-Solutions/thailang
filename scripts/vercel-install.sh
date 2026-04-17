#!/usr/bin/env bash
# Vercel install step — makes sure `playground-wasm` can produce the
# browser-target `pkg-web/` output that the Next build imports from
# `playground-wasm/web`.
#
# Vercel's build image *ships Rust pre-installed at /rust/bin* (not via
# rustup), so we just need to put it on PATH and fetch `wasm-pack`.

set -euo pipefail

export PATH="/rust/bin:$PATH"

if ! command -v cargo >/dev/null 2>&1; then
  echo "[vercel-install] cargo not on PATH — Vercel build image layout may have changed." >&2
  echo "[vercel-install] PATH=$PATH" >&2
  exit 1
fi
echo "[vercel-install] $(cargo --version)"

# wasm-pack isn't pre-installed. Grab the upstream prebuilt binary —
# much faster than `cargo install wasm-pack` from source.
if ! command -v wasm-pack >/dev/null 2>&1; then
  WASM_PACK_VERSION="v0.13.1"
  WASM_PACK_TRIPLE="x86_64-unknown-linux-musl"
  WASM_PACK_ARCHIVE="wasm-pack-${WASM_PACK_VERSION}-${WASM_PACK_TRIPLE}"
  WASM_PACK_URL="https://github.com/rustwasm/wasm-pack/releases/download/${WASM_PACK_VERSION}/${WASM_PACK_ARCHIVE}.tar.gz"

  echo "[vercel-install] Fetching ${WASM_PACK_ARCHIVE}…"
  WASM_PACK_BIN_DIR="$HOME/.local/bin"
  mkdir -p "$WASM_PACK_BIN_DIR"
  curl -L --fail --silent --show-error "$WASM_PACK_URL" | tar -xz -C /tmp
  mv "/tmp/${WASM_PACK_ARCHIVE}/wasm-pack" "${WASM_PACK_BIN_DIR}/wasm-pack"
  chmod +x "${WASM_PACK_BIN_DIR}/wasm-pack"
  export PATH="${WASM_PACK_BIN_DIR}:$PATH"
fi
echo "[vercel-install] $(wasm-pack --version)"

echo "[vercel-install] Installing JS deps…"
bun install --frozen-lockfile

echo "[vercel-install] Building playground-wasm (web target)…"
bun run --filter playground-wasm build:web

echo "[vercel-install] Done."
