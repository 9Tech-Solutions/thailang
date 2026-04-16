# Thailang

> ภาษาโปรแกรมมิงไทย — Thai-first, type-safe, compiled. Feels like JS/TS.

```thailang
พิมพ์("สวัสดีชาวโลก!");
```

## Status

Phase 0 — scaffold. See [`docs/SPEC.md`](./docs/SPEC.md) for the v0.1 language spec and the implementation plan at `~/.claude/plans/linear-cooking-shannon.md`.

## Repo Layout

```
thailang/
├── compiler/         # Rust compiler (Cargo workspace)
│   └── crates/
│       └── thailang-cli/    # `thai` binary
├── stdlib/           # Thai-named standard library (.th)
├── examples/         # Sample programs
├── playground-wasm/  # Browser WASM bridge (Phase 2)
├── web/              # Next.js site (Phase 5)
├── vscode-ext/       # VS Code extension (Phase 4)
└── docs/             # SPEC.md and MDX docs
```

## Quickstart

```bash
cargo run -p thailang-cli
```

## License

MIT — see [LICENSE](./LICENSE).
