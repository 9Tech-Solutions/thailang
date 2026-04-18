"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { formatDiagnostic } = require("./diagnostic.js");

function loadWasm() {
  // wasm-pack's nodejs target exposes everything synchronously via a
  // top-level require of the generated glue module.
  // eslint-disable-next-line global-require
  return require("../wasm/thailang_wasm.js");
}

function usage() {
  return [
    "thailang — ภาษาโปรแกรมมิงไทย",
    "",
    "Usage:",
    "  thailang run <file.th>       Type-check, compile, and execute",
    "  thailang emit-js <file.th>   Print emitted JavaScript to stdout",
    "  thailang check <file.th>     Type-check only (exit 1 on errors)",
    "  thailang --version           Print version",
    "  thailang --help              Print this message",
  ].join("\n");
}

function readVersion() {
  const pkg = require("../package.json");
  return pkg.version;
}

function readSourceOrDie(file) {
  try {
    return fs.readFileSync(path.resolve(file), "utf8");
  } catch (err) {
    process.stderr.write(`thailang: could not read ${file}: ${err.message}\n`);
    process.exit(1);
  }
}

function reportDiagnostics(file, source, diagnosticsJson) {
  const diagnostics = JSON.parse(diagnosticsJson);
  for (const diag of diagnostics) {
    process.stderr.write(formatDiagnostic(file, source, diag) + "\n");
  }
  return diagnostics.length;
}

function runFile(file) {
  const source = readSourceOrDie(file);
  const wasm = loadWasm();

  const errorCount = reportDiagnostics(file, source, wasm.typeCheck(source));
  if (errorCount > 0) {
    process.exit(1);
  }

  let js;
  try {
    js = wasm.compileToJs(source);
  } catch (err) {
    // Parse errors surface here when typeCheck reported zero errors AND
    // compile still fails — treat as unexpected.
    process.stderr.write(`thailang: compile failed: ${err.message}\n`);
    process.exit(1);
  }

  try {
    // Fresh context — emitted JS references `console` and JS globals like
    // `Math`, `Number.isInteger`, `Array.isArray`, which we pass through.
    vm.runInNewContext(js, {
      console,
      Math,
      Number,
      Array,
      Object,
      JSON,
      String,
      Boolean,
      Date,
    });
  } catch (err) {
    process.stderr.write(`thailang: runtime error: ${err.message}\n`);
    if (err.stack) {
      process.stderr.write(err.stack + "\n");
    }
    process.exit(1);
  }
}

function emitJsFile(file) {
  const source = readSourceOrDie(file);
  const wasm = loadWasm();

  const errorCount = reportDiagnostics(file, source, wasm.typeCheck(source));
  if (errorCount > 0) {
    process.exit(1);
  }

  try {
    process.stdout.write(wasm.compileToJs(source));
  } catch (err) {
    process.stderr.write(`thailang: compile failed: ${err.message}\n`);
    process.exit(1);
  }
}

function checkFile(file) {
  const source = readSourceOrDie(file);
  const wasm = loadWasm();

  const errorCount = reportDiagnostics(file, source, wasm.typeCheck(source));
  if (errorCount > 0) {
    process.stderr.write(`\n${errorCount} error${errorCount === 1 ? "" : "s"} in ${file}\n`);
    process.exit(1);
  }
  process.stdout.write(`ok: ${file}\n`);
}

function main(argv) {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    process.stdout.write(usage() + "\n");
    return;
  }
  if (argv[0] === "--version" || argv[0] === "-V") {
    process.stdout.write(`thailang ${readVersion()}\n`);
    return;
  }

  const [cmd, file, ...rest] = argv;
  if (rest.length > 0) {
    process.stderr.write(`thailang: unexpected extra arguments: ${rest.join(" ")}\n`);
    process.exit(1);
  }
  if (!file) {
    process.stderr.write(`thailang: '${cmd}' requires a file argument\n\n${usage()}\n`);
    process.exit(1);
  }

  switch (cmd) {
    case "run":
      runFile(file);
      break;
    case "emit-js":
      emitJsFile(file);
      break;
    case "check":
      checkFile(file);
      break;
    default:
      process.stderr.write(`thailang: unknown command '${cmd}'\n\n${usage()}\n`);
      process.exit(1);
  }
}

module.exports = { main };
