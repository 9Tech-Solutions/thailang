# Thailang Reserved Keywords: Rename Review

> **How to use:** Fill in the `Proposed` column in any file for rows you want
> to rename. Leave blank to keep as-is. When all edits are in, say "done" and
> the rename sweep runs across the compiler + docs + examples + tests in one
> pass.

Mirrors the shape of MDN's JavaScript reference, each file is one module or
language-concept area. Open a file, edit proposals, save. Markdown tables,
nothing fancy.

---

## Files

### Language core: hard reservations

| File                           | Scope                                                                                                                                               | Count |
| ---                            | ---                                                                                                                                                 | ---   |
| [`language.md`](./language.md) | §1 Declarations · §2 Control flow · §3 Types · §4 Literals · §5 Logical · §6 Data structures · §7 Async · §8 Error handling · §9 Modules · §10 Misc | 42    |

These are **lexer keywords**, the parser refuses them as identifiers.
Renaming touches `compiler/crates/lexer/src/token.rs` first.

### Stdlib modules: soft reservations

These aren't lexer keywords. The emitter rewrites them to JS targets at
compile time, so they're "soft-reserved", user-chosen variables with those
names are silently shadowed. Each file covers one stdlib surface area.

| File                                       | Thai name (proposed)      | JS target                                           | Status                                      |
| ---                                        | ---                       | ---                                                 | ---                                         |
| [`math.md`](./math.md)                     | `คณิต`                    | `Math`                                              | ✓ shipped in Phase 3B                       |
| [`string-methods.md`](./string-methods.md) | _receiver methods_        | `String.prototype.*`                                | partial (5), needs expansion                |
| [`array-methods.md`](./array-methods.md)   | _receiver methods_        | `Array.prototype.*`                                 | partial (6), needs expansion                |
| [`console.md`](./console.md)               | `ระบบ`                    | `console.*`                                         | ✓ shipped: replaces bare `พิมพ์` keyword    |
| [`number.md`](./number.md)                 | `จำนวน`                   | `Number.*` + global `parseInt`/`parseFloat`/`isNaN` | **proposed**                                |
| [`object-methods.md`](./object-methods.md) | `วัตถุ`                   | `Object.*`                                          | **proposed**                                |
| [`date.md`](./date.md)                     | `วันที่`                  | `Date`                                              | **proposed**                                |
| [`json.md`](./json.md)                     | _tbd_                     | `JSON.*`                                            | **proposed**                                |
| [`error.md`](./error.md)                   | `ข้อผิดพลาด`              | `Error` / `TypeError` / `RangeError` / ...          | **proposed**                                |

### Deferred

These need a real `ขนาน`/async story first and touch concurrency, revisit
after Phase 3C:

- `Promise.*` (and `.then`/`.catch`/`.finally` which collide with try/catch keywords)
- `Set` / `WeakSet` / `WeakMap`
- `RegExp`
- `Intl.*`
- `globalThis`

---

## Priority hints (pick the fight to fight)

**Hard keywords (`language.md`):**

1. `ตัวเลข`: biggest single win. "The number" is a natural variable name.
2. `ข้อความ`: "a message" is a very natural variable name.
3. `รายการ`: "an item in a list" is the classic cart/inventory case.

**Soft reservations (stdlib files):**

4. `.ความยาว` (`string-methods.md` / `array-methods.md`), "the length of X" is a natural phrase.
5. `.มี` (`array-methods.md`), "has" is a super common method name.
6. `คณิต` module name, common noun for "math".
7. `.ลด`: "decrease/reduce" is a common verb.

**Shipped renames:** `ฟังก์ชัน→สูตร`, `คืน→ส่งกลับ`,
`ตราบ→ระหว่างที่`, `จริงเท็จ→ถูกผิด`, `อะไรก็ได้→ทั่วไป`, `ไม่คืน→ไม่ส่งกลับ`,
`จริง→ถูก`, `เท็จ→ผิด`, `ไม่→ไม่ใช่`, `รายการ→ชุด`, `แผนที่→คู่`, `โครงสร้าง→โครง`,
`ไม่พร้อม→ขนาน`, `โยน→ฟ้อง`, `พิมพ์→ระบบ.แสดง` (now stdlib, see `console.md`).

---

## Notes / open questions

Call things out here or in a specific file's header:

- **`พิมพ์` refactor** (now shipped): moved from bare keyword to
  `ระบบ.แสดง(...)`. Lexer dropped `Print` token,
  parser/emitter stop special-casing, `ระบบ` module registered in
  stdlib tables. See `console.md`.
- **Keyword collisions inside module method names** (e.g., promise `.catch`
  vs try-`จับ`), the emitter's member-rename table doesn't check if the
  member name is a language keyword today, because members are never lexed.
  Something to keep in mind when designing any method named `จับ`, `สุดท้าย`,
  `ไม่ใช่`, etc.
- **Number of syllables**: for child-friendliness, short > long. Shortlist
  candidate renames with 1–2 syllables when possible.

---

## When you say "done"

The rename sweep runs in this order across:

1. `compiler/crates/lexer/src/token.rs`: hard keyword tokens
2. `compiler/crates/parser/src/parser.rs`: type-annotation paths
3. `compiler/crates/emit-js/src/stdlib.rs`: soft-reservation rewrite tables
4. `compiler/crates/emit-js/src/emitter.rs`: special-cased idents
5. `compiler/crates/types/src/stdlib.rs`: method signatures
6. `compiler/crates/types/src/checker.rs`: error-message Thai labels
7. `docs/SPEC.md`: keyword map + examples
8. `examples/*.th` and `examples/*.expected.txt`
9. `web/src/shared/lib/thailang.tmLanguage.json`: Shiki TextMate grammar
10. `web/src/widgets/hero-playground/highlight.ts`: client tokenizer
11. `vscode-ext/syntaxes/thailang.tmLanguage.json`: VS Code grammar
12. All test fixtures across crates
13. `cargo fmt && cargo clippy -D warnings && cargo test --workspace` until green
