# tree-sitter-thailang

Tree-sitter grammar for [Thailang](https://github.com/9Tech-Solutions/thailang), a Thai-language programming language.

Supplies an incremental parser + highlight queries used by:

- **Editors** — Neovim, Helix, Zed, Emacs (via tree-sitter-langs or built-in), and the VS Code extension (via the `tree-sitter-wasm` runtime).
- **GitHub Linguist** — once merged, `.th` files render with syntax colors on github.com.
- **Future Thailang playground** — Monaco + tree-sitter-wasm for real-time highlighting + outline panes.

## Status

v0.1 preview. Grammar covers all 41 hard keywords from the current Thailang lexer plus full expression/statement/type grammar. Parses every file in `examples/*.th` without ERROR nodes. Corpus tests at `test/corpus/basics.txt`.

## Usage (local)

```sh
# Regenerate parser after editing grammar.js
bunx tree-sitter-cli@^0.24 generate

# Run corpus tests
bunx tree-sitter-cli@^0.24 test

# Parse a file
bunx tree-sitter-cli@^0.24 parse ../examples/fizzbuzz.th

# Interactive playground (WASM-backed)
bunx tree-sitter-cli@^0.24 playground

# Rebuild WASM and stage it for the web playground
bun run build:wasm
```

The WASM artifact lands at `../web/public/thailang.wasm`, where the future `/playground` Monaco route loads it via `web-tree-sitter`.

## Files

| Path | Purpose |
|---|---|
| `grammar.js` | Grammar definition (edit this) |
| `src/parser.c` | Generated C parser (committed so npm consumers don't need tree-sitter-cli) |
| `src/grammar.json` | Generated grammar manifest |
| `src/node-types.json` | Generated AST node type info |
| `queries/highlights.scm` | Standard tree-sitter highlight captures |
| `test/corpus/*.txt` | Corpus tests |
| `tree-sitter.json` | Tree-sitter package config |

## Source of truth

The grammar mirrors `compiler/crates/lexer/src/token.rs` and `compiler/crates/parser/src/parser.rs` in the main repo. When the compiler adds or renames a keyword, the sweep order is:

1. Lexer tokens (Rust)
2. Parser (Rust)
3. Emit-js stdlib + types stdlib (Rust)
4. `grammar.js` here
5. `queries/highlights.scm` here
6. Regenerate: `bunx tree-sitter-cli@^0.24 generate`
7. Corpus tests + example parse
8. VS Code extension grammar + `web/src/shared/lib/thailang.tmLanguage.json`

## License

MIT, see the [repo LICENSE](https://github.com/9Tech-Solutions/thailang/blob/main/LICENSE).
