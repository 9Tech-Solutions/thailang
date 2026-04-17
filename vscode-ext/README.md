# Thailang for VS Code

Syntax highlighting and language support for [Thailang](https://github.com/9Tech-Solutions/thailang) — a Thai-first programming language that compiles to JavaScript, WebAssembly, and (soon) native binaries.

## Features

- Syntax highlighting for `.th` files (Thai keywords, type annotations, string/number literals, comments, operators)
- Bracket matching and auto-closing for `{}`, `[]`, `()`, and `""`
- Line (`//`) and block (`/* */`) comment toggling via `Ctrl+/`
- Thai-aware word selection — `Ctrl+D` / double-click selects full Thai identifiers without splitting on vowel marks
- Smart indentation after `{`, `[`, `(`

## Example

```thailang
ฟังก์ชัน บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    คืน ก + ข;
}

พิมพ์(บวก(10, 20));   // → 30
```

## Install

**From the Marketplace** (once published):
```
code --install-extension thailang-dev.thailang
```

**From a `.vsix` locally** (built from source):
```
cd vscode-ext && bunx vsce package
code --install-extension thailang-0.1.0.vsix
```

## Development

The TextMate grammar lives at [`syntaxes/thailang.tmLanguage.json`](./syntaxes/thailang.tmLanguage.json) and mirrors the scope conventions used by the [Rust compiler's lexer](https://github.com/9Tech-Solutions/thailang/blob/main/compiler/crates/lexer/src/token.rs).

To add a keyword:
1. Add it to the appropriate keyword set in `compiler/crates/lexer/src/token.rs`
2. Add it to the matching `#keyword-*` repository rule in `syntaxes/thailang.tmLanguage.json`
3. Rebuild and reload VS Code to see the change

## License

MIT — see [LICENSE](./LICENSE) in the repository root.
