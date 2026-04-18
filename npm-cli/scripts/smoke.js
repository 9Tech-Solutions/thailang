#!/usr/bin/env node
/**
 * End-to-end smoke test: run a handful of real `.th` examples through the
 * bundled `thailang` CLI and diff against their expected output.
 *
 * Assumes `wasm/` is populated (either via `npm prepack` or a manual
 * `bun run --filter playground-wasm build` + copy).
 */
"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

const repoRoot = path.resolve(__dirname, "..", "..");
const examples = path.join(repoRoot, "examples");
const bin = path.resolve(__dirname, "..", "bin", "thailang.js");

function wasmPresent() {
  return fs.existsSync(path.resolve(__dirname, "..", "wasm", "thailang_wasm.js"));
}

function run(file) {
  return execFileSync("node", [bin, "run", file], { encoding: "utf8" });
}

function checkPair(name) {
  const src = path.join(examples, `${name}.th`);
  const expected = path.join(examples, `${name}.expected.txt`);
  if (!fs.existsSync(src) || !fs.existsSync(expected)) {
    process.stdout.write(`[smoke] skip ${name}, fixture missing\n`);
    return;
  }
  const got = run(src);
  const want = fs.readFileSync(expected, "utf8");
  assert.strictEqual(got, want, `${name}: output mismatch`);
  process.stdout.write(`[smoke] ok   ${name}\n`);
}

function main() {
  if (!wasmPresent()) {
    process.stdout.write(
      "[smoke] wasm/ not populated, run `node scripts/prepack.js` first, or `bun run --filter playground-wasm build && cp playground-wasm/pkg/thailang_wasm*.{js, wasm, d.ts} npm-cli/wasm/`\n",
    );
    process.exit(0);
  }

  checkPair("fizzbuzz");
  checkPair("สวัสดี");
  checkPair("บวก");
  checkPair("narrow");
  checkPair("stdlib");

  process.stdout.write("[smoke] all green\n");
}

main();
