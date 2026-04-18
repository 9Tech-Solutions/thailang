// Smoke test: verify playground-wasm compiles fizzbuzz.th and the result
// produces the expected output when eval'd in Node.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const wasm = require(path.join(ROOT, 'playground-wasm/pkg/thailang_wasm.js'));

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`OK:   ${msg}`);
}

// 1. Compile via WASM
const source = fs.readFileSync(path.join(ROOT, 'examples/fizzbuzz.th'), 'utf8');
const js = wasm.compileToJs(source);
if (typeof js !== 'string' || js.length === 0) {
  fail('compileToJs returned empty / non-string');
}
ok(`compileToJs returned ${js.length} bytes of JS`);

// 2. Execute the JS, capture stdout via console.log shim
const captured = [];
const origLog = console.log;
console.log = (...args) => captured.push(args.map(String).join(' '));
try {
  // biome-ignore lint/security/noGlobalEval: compiled output from our own compiler over a fixed example input, this is the whole point of the smoke test.
  eval(js);
} finally {
  console.log = origLog;
}

// 3. Compare against golden expected output
const expected = fs
  .readFileSync(path.join(ROOT, 'examples/fizzbuzz.expected.txt'), 'utf8')
  .trimEnd()
  .split('\n');

if (captured.length !== expected.length) {
  fail(`line count mismatch, got ${captured.length}, expected ${expected.length}`);
}
for (let i = 0; i < expected.length; i++) {
  if (captured[i] !== expected[i]) {
    fail(`line ${i + 1} mismatch, expected "${expected[i]}", got "${captured[i]}"`);
  }
}
ok(`${captured.length} lines match expected fizzbuzz output`);

// 4. tokenize round-trip, sanity check
const tokensJson = wasm.tokenizeToJson('ให้ x = 42;');
const tokens = JSON.parse(tokensJson);
if (!Array.isArray(tokens) || tokens.length === 0) {
  fail('tokenizeToJson returned empty array');
}
if (tokens[0].kind !== 'Let') {
  fail(`first token kind expected 'Let', got '${tokens[0].kind}'`);
}
ok(`tokenizeToJson returned ${tokens.length} tokens`);

// 5. WASM size budget, under 300 KB gzipped
const wasmPath = path.join(ROOT, 'playground-wasm/pkg/thailang_wasm_bg.wasm');
const rawSize = fs.statSync(wasmPath).size;
const gzippedSize = parseInt(execSync(`gzip -9 -c "${wasmPath}" | wc -c`).toString().trim(), 10);
const KB = 1024;
const BUDGET_KB = 300;
console.log(
  `      WASM size: ${(rawSize / KB).toFixed(1)} KB raw, ${(gzippedSize / KB).toFixed(1)} KB gzipped`,
);
if (gzippedSize > BUDGET_KB * KB) {
  fail(`WASM exceeds ${BUDGET_KB} KB gzipped budget`);
}
ok(`under ${BUDGET_KB} KB gzipped budget`);

console.log('\nAll smoke checks passed.');
