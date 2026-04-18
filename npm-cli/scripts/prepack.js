#!/usr/bin/env node
/**
 * npm prepack: rebuild the Node-target WASM and copy it into wasm/.
 *
 * npm publishes the contents of `files:` at publish time; WASM is not
 * committed to git. This script runs before `npm publish` / `npm pack`
 * so the published tarball carries a fresh WASM built from HEAD.
 *
 * Requires: wasm-pack, cargo. In CI, see .github/workflows/publish-npm.yml
 * for the toolchain bootstrap.
 */
"use strict";

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..");
const playgroundWasmPkg = path.join(repoRoot, "playground-wasm", "pkg");
const cliWasmDir = path.resolve(__dirname, "..", "wasm");

function run(cmd, cwd) {
  process.stdout.write(`[prepack] $ ${cmd}\n`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

function ensureWasmPack() {
  try {
    execSync("wasm-pack --version", { stdio: "ignore" });
  } catch {
    throw new Error(
      "[prepack] wasm-pack not on PATH. Install from https://rustwasm.github.io/wasm-pack/installer/",
    );
  }
}

function copyWasmArtifacts() {
  if (!fs.existsSync(playgroundWasmPkg)) {
    throw new Error(
      `[prepack] expected wasm-pack output at ${playgroundWasmPkg} — did the build fail?`,
    );
  }
  fs.mkdirSync(cliWasmDir, { recursive: true });

  // Only the runtime artifacts — skip package.json/.gitignore from the
  // wasm-pack output since they'd conflict with our own.
  const wanted = [
    "thailang_wasm.js",
    "thailang_wasm_bg.wasm",
    "thailang_wasm_bg.wasm.d.ts",
    "thailang_wasm.d.ts",
  ];
  for (const file of wanted) {
    const src = path.join(playgroundWasmPkg, file);
    const dst = path.join(cliWasmDir, file);
    if (!fs.existsSync(src)) {
      throw new Error(`[prepack] missing artifact: ${src}`);
    }
    fs.copyFileSync(src, dst);
    process.stdout.write(`[prepack] copied ${file}\n`);
  }
}

function main() {
  ensureWasmPack();
  run("bun run build", path.join(repoRoot, "playground-wasm"));
  copyWasmArtifacts();
  process.stdout.write(`[prepack] done → ${cliWasmDir}\n`);
}

main();
