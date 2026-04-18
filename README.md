<h1 align="center">Thailang</h1>

<p align="center">
  <strong>ภาษาโปรแกรมมิงไทย</strong> — Thai-first, type-safe, compiles to JavaScript.<br/>
  <em>"เขียนเป็นไทย รันเหมือน Rust"</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/thailang"><img src="https://img.shields.io/npm/v/thailang.svg?color=2ecc71" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/thailang"><img src="https://img.shields.io/npm/dm/thailang.svg" alt="npm downloads"></a>
  <a href="https://github.com/9Tech-Solutions/thailang/actions/workflows/rust.yml"><img src="https://github.com/9Tech-Solutions/thailang/actions/workflows/rust.yml/badge.svg" alt="CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

<p align="center">
  <a href="https://thailang-web.vercel.app">Playground</a>
  &nbsp;•&nbsp;
  <a href="./docs/SPEC.md">Spec</a>
  &nbsp;•&nbsp;
  <a href="./docs/keywords">Keywords</a>
  &nbsp;•&nbsp;
  <a href="./examples">Examples</a>
</p>

---

## What is Thailang?

Thailang is a programming language with **Thai keywords** and a **TypeScript-like type system**. It's built with a Rust compiler, compiles to readable JavaScript, and runs anywhere Node.js runs — no Rust toolchain needed at install time.

```thailang
ฟังก์ชัน บรรยาย(ค่า: ตัวเลข | ข้อความ | ว่าง) {
    ถ้า (ค่า เป็น ข้อความ) {
        พิมพ์("ข้อความ: " + ค่า);
    } ไม่ก็ (ค่า เป็น ตัวเลข) {
        พิมพ์("ตัวเลข: " + ค่า);
    } ไม่งั้น {
        พิมพ์("ว่าง");
    }
}

บรรยาย("สวัสดี");
บรรยาย(42);
บรรยาย(ว่าง);
```

## Install

```sh
# npm
npm install -g thailang

# bun
bun add -g thailang

# scoped alias (same package)
npm install -g @9tech.solutions/thailang
```

Requires Node.js 18+. The package ships with a prebuilt WebAssembly compiler — no Rust toolchain needed.

## Your first Thailang program

Create a file `สวัสดี.th`:

```thailang
พิมพ์("สวัสดีชาวโลก!");
```

Run it:

```sh
thailang run สวัสดี.th
# สวัสดีชาวโลก!
```

Compile to JavaScript:

```sh
thailang emit-js สวัสดี.th
# console.log("สวัสดีชาวโลก!");
```

Type-check without running:

```sh
thailang check narrow.th
```

## What's in the box

- **Thai keywords** — `ให้`, `ฟังก์ชัน`, `ถ้า`, `วน`, `คืน`, `พิมพ์`, and friends. Full map in [`docs/SPEC.md`](./docs/SPEC.md#2-keyword-map).
- **HM-lite type inference** — declare types when you want, let the compiler figure out the rest.
- **Flow-sensitive narrowing** — `ถ้า (ค่า เป็น ข้อความ) { ... }` narrows unions inside the branch.
- **Stdlib with Thai method names** — `คณิต.สูงสุด(...)`, `"hello".เป็นตัวใหญ่()`, `[1,2,3].แปลง(x => x * 2)`. See [`docs/keywords/`](./docs/keywords).
- **JS-readable output** — emitted JavaScript is clean and debuggable, not obfuscated bytecode.
- **Rust-backed compiler** — lexer, parser, type checker, and JS emitter all in Rust; shipped as WASM for the npm CLI.

## Status

v0.1 — Phase 3 complete. Lexer, parser, type checker (with narrowing), JS emitter, and stdlib dispatch are working and on npm.

Upcoming:
- Phase 4 — VS Code extension, LSP diagnostics
- Phase 5 — web playground at [thailang-web.vercel.app](https://thailang-web.vercel.app)
- Tree-sitter grammar for better editor support

See [`docs/SPEC.md`](./docs/SPEC.md) for the full language reference.

## Repo layout

```
thailang/
├── compiler/crates/     # Rust workspace
│   ├── ast/             # AST types
│   ├── lexer/           # Thai-aware tokenizer
│   ├── parser/          # Pratt parser
│   ├── types/           # Type checker + narrowing
│   ├── emit-js/         # JS emitter + stdlib dispatch
│   ├── cli/             # `thai` native binary
│   └── wasm/            # wasm-bindgen exports
├── npm-cli/             # Node CLI (ships the WASM compiler)
├── examples/            # Sample .th programs
├── docs/                # SPEC.md + keyword reference
├── web/                 # Next.js landing + playground
└── vscode-ext/          # VS Code extension (WIP)
```

## Contributing

Issues and PRs welcome. For language design discussions, open an issue before starting work — keyword choices are load-bearing and benefit from input from Thai speakers.

Development setup:

```sh
bun install              # install workspace deps
cargo test --workspace   # run compiler tests
bun run --filter web dev # run the playground locally
```

## License

MIT — see [LICENSE](./LICENSE).
