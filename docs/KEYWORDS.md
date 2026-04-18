# Thailang Reserved Keywords — Rename Review

> **How to use this doc:** Fill in the **Proposed** column for any row you want
> to rename. Leave blank to keep as-is. When done, ping Claude and the rename
> will be applied across lexer + parser + emitter + spec + examples + tests.
>
> **Goals when picking a replacement** (your call — these are just defaults):
> - Easy for a child or non-programmer to read aloud
> - Short (2–3 syllables beats 4–5)
> - Low everyday-noun clash (so it can stay reserved without eating common Thai words)
> - Still recognizably Thai — avoid English transliteration unless it's already standard Thai tech slang

---

## 1. Declarations

| Current | Means | JS/TS analog | Clash | Proposed |
|---|---|---|---|---|
| `ให้` | let / declare | `let` | low |  |
| `คงที่` | constant | `const` | low |  |
| `ฟังก์ชัน` | function | `function` | low (transliteration) |  |
| `คืน` | return a value | `return` | low |  |
| `พิมพ์` | print | `console.log` | low |  |

## 2. Control Flow

| Current | Means | JS/TS analog | Clash | Proposed |
|---|---|---|---|---|
| `ถ้า` | if | `if` | low |  |
| `ไม่ก็` | else-if | `else if` | low |  |
| `ไม่งั้น` | else | `else` | low |  |
| `ตราบ` | while | `while` | low |  |
| `วน` | for | `for` | low |  |
| `แต่ละ` | for-each | `for…of` | low |  |
| `หยุด` | break | `break` | low |  |
| `ข้าม` | continue / skip | `continue` | low |  |
| `เลือก` | switch / choose | `switch` | medium (common verb) |  |
| `กรณี` | case | `case` | low |  |
| `เริ่มต้น` | default / start | `default` | low |  |

## 3. Types

> **Highest clash surface.** `ตัวเลข` and `ข้อความ` are the most natural nouns
> for those concepts, so reserving them bites hardest.

| Current | Means | TS analog | Clash | Proposed |
|---|---|---|---|---|
| `ตัวเลข` | number | `number` | **high** — "the number" |  |
| `จำนวนเต็ม` | integer | `int` | low — technical |  |
| `ข้อความ` | string / text | `string` | **high** — "a message" |  |
| `จริงเท็จ` | boolean | `boolean` | low — compound |  |
| `อะไรก็ได้` | any | `any` | low — long phrase |  |
| `ไม่คืน` | void | `void` | low — compound |  |

## 4. Boolean & Null Literals

| Current | Means | JS analog | Clash | Proposed |
|---|---|---|---|---|
| `จริง` | true | `true` | medium — adj "real/true" |  |
| `เท็จ` | false | `false` | low |  |
| `ว่าง` | null / empty | `null` | medium — adj "free/empty" |  |

## 5. Logical Operators

> These ALSO accept ASCII aliases (`&&`, `\|\|`, `!`) — the ASCII forms stay
> regardless of what you do to the Thai keywords.

| Current | Means | JS analog | Clash | Proposed |
|---|---|---|---|---|
| `และ` | and | `&&` | **high** — conjunction |  |
| `หรือ` | or | `\|\|` | **high** — conjunction |  |
| `ไม่` | not | `!` | **high** — negation word |  |

## 6. Data Structure Keywords

| Current | Means | TS analog | Clash | Proposed |
|---|---|---|---|---|
| `รายการ` | list / array | `Array` | **high** — "a list item" |  |
| `แผนที่` | map / object | `Map`/`{}` | **high** — "a map" |  |
| `โครงสร้าง` | struct / interface | `interface` | medium |  |

## 7. Async

| Current | Means | JS analog | Clash | Proposed |
|---|---|---|---|---|
| `รอ` | await / wait | `await` | low |  |
| `ไม่พร้อม` | async / not-ready | `async` | low |  |

## 8. Error Handling

| Current | Means | JS analog | Clash | Proposed |
|---|---|---|---|---|
| `ลอง` | try | `try` | low |  |
| `จับ` | catch | `catch` | low |  |
| `สุดท้าย` | finally | `finally` | low |  |
| `โยน` | throw | `throw` | low |  |

## 9. Modules

| Current | Means | JS analog | Clash | Proposed |
|---|---|---|---|---|
| `นำเข้า` | import | `import` | low |  |
| `ส่งออก` | export | `export` | low |  |
| `จาก` | from | `from` | **high** — preposition |  |

## 10. Misc (membership + type guard)

| Current | Means | JS/TS analog | Clash | Proposed |
|---|---|---|---|---|
| `ใน` | in | `in` | **high** — preposition |  |
| `เป็น` | is (type guard) | no direct equiv | **high** — "to be" |  |

---

## Priority hints (pick the fight to fight)

If you only want to touch the highest-pain items:

1. **`ตัวเลข`** — biggest single win. Users expect to write `ให้ ตัวเลข = 42` as a variable.
2. **`ข้อความ`** — same story: "a message" is a very natural variable name.
3. **`รายการ`** — "an item in a list" is the classic inventory/cart example.
4. **`แผนที่`** — less common as a variable but still a real word.

If you want a blanket child-friendly pass, also consider softening:
- `ฟังก์ชัน` (transliterated) → something actually-Thai like `สูตร` or `กลไก`?
- `จำนวนเต็ม` (4 syllables) → shorter noun?
- `อะไรก็ได้` (whole phrase) → single word?

---

## Notes / open questions

Add anything you want to call out here while editing:

-

---

**When you're done editing:** just say "done" (or point at specific rows), and
the rename sweep runs across:
- `compiler/crates/lexer/src/token.rs`
- `compiler/crates/parser/src/parser.rs` (type-annotation paths)
- `compiler/crates/emit-js/src/emitter.rs` (prelude identifier rewrites if any)
- `compiler/crates/types/src/checker.rs` and `stdlib.rs`
- `docs/SPEC.md`
- `examples/*.th` and `*.expected.txt`
- `web/src/shared/lib/thailang.tmLanguage.json` (Shiki + VS Code grammar)
- `vscode-ext/syntaxes/thailang.tmLanguage.json`
- All test fixtures across crates
