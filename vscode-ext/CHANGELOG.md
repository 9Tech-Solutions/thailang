# Changelog

## 0.1.1: 2026-04-19

- Add Marketplace icon + gallery banner
- Refresh description for Marketplace listing
- Grammar audited against post-rename lexer (14 keyword renames, `พิมพ์ → ระบบ.แสดง` stdlib move); no keyword drift detected

## 0.1.0: 2026-04-17

Initial release.

- TextMate grammar for `.th` files covering every keyword in the Thailang v0.1 spec (declarations, control flow, type annotations, logical/arithmetic operators, string/number literals, comments)
- Language configuration: line + block comments, bracket matching, auto-closing pairs, Thai-aware `wordPattern` so `Ctrl+D` selects full Thai identifiers
- Smart indentation on `{`, `[`, `(`
