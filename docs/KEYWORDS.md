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

## 11. Stdlib — `คณิต` module (Math)

> **Soft reservations.** These aren't lexer keywords — the lexer treats them
> as plain identifiers. But the emitter rewrites `คณิต.X` → `Math.X` at
> compile time, so if a user picks `คณิต` as a variable name they get silent
> shadowing. Practically: reserve for stdlib use only.

| Current | Means | JS analog | Clash | Proposed |
|---|---|---|---|---|
| `คณิต` | Math module | `Math` | **high** — common noun "math/arithmetic" |  |
| `คณิต.สูงสุด` | max | `Math.max` | medium — "highest/peak" |  |
| `คณิต.ต่ำสุด` | min | `Math.min` | medium — "lowest" |  |
| `คณิต.สุ่ม` | random | `Math.random` | low |  |
| `คณิต.ปัดขึ้น` | ceil | `Math.ceil` | low |  |
| `คณิต.ปัดลง` | floor | `Math.floor` | low |  |

## 12. Stdlib — String / Array methods

> Same soft-reservation story as §11 — the emitter renames these members at
> compile time regardless of the receiver's actual type. A user method named
> `.ความยาว` on their own object will get silently rewritten to `.length`.

| Current | Means | JS target | Clash | Proposed |
|---|---|---|---|---|
| `.ความยาว` | length (shared str/arr) | `.length` | **high** — "length" is everywhere |  |
| `.ตัด` | slice (string) | `.slice` | **high** — "cut" is very common verb |  |
| `.เป็นตัวใหญ่` | toUpperCase | `.toUpperCase` | low — compound |  |
| `.เป็นตัวเล็ก` | toLowerCase | `.toLowerCase` | low — compound |  |
| `.แยก` | split | `.split` | medium — "separate" |  |
| `.เรียง` | sort (non-mutating) | `.slice().sort` | medium — "arrange/order" |  |
| `.กรอง` | filter | `.filter` | medium — "filter/strain" |  |
| `.แปลง` | map | `.map` | medium — "transform/convert" |  |
| `.ลด` | reduce | `.reduce` | **high** — "decrease/reduce" |  |
| `.มี` | includes / has | `.includes` | **high** — "to have" |  |

---

## Priority hints (pick the fight to fight)

If you only want to touch the highest-pain items:

1. **`ตัวเลข`** — biggest single win. Users expect to write `ให้ ตัวเลข = 42` as a variable.
2. **`ข้อความ`** — same story: "a message" is a very natural variable name.
3. **`รายการ`** — "an item in a list" is the classic inventory/cart example.
4. **`.ความยาว`** — "the length of X" is a natural phrase that may clash with user member names.
5. **`.มี`** — "has" is a very common method name in any domain (`cart.มี(item)`).
6. **`แผนที่`** — less common as a variable but still a real word.

If you want a blanket child-friendly pass, also consider softening:
- `ฟังก์ชัน` (transliterated) → something actually-Thai like `สูตร` or `กลไก`?
- `จำนวนเต็ม` (4 syllables) → shorter noun?
- `อะไรก็ได้` (whole phrase) → single word?
- `.เป็นตัวใหญ่` / `.เป็นตัวเล็ก` — mouthful; `.ใหญ่` / `.เล็ก` shorter?

---

## Notes / open questions

Add anything you want to call out here while editing:

-

---

**When you're done editing:** just say "done" (or point at specific rows), and
the rename sweep runs across:
- `compiler/crates/lexer/src/token.rs` (§1–10 hard keywords)
- `compiler/crates/parser/src/parser.rs` (type-annotation paths)
- `compiler/crates/emit-js/src/stdlib.rs` (§11–12 rewrite tables)
- `compiler/crates/emit-js/src/emitter.rs`
- `compiler/crates/types/src/stdlib.rs` (method signatures)
- `compiler/crates/types/src/checker.rs`
- `docs/SPEC.md`
- `examples/*.th` and `*.expected.txt`
- `web/src/shared/lib/thailang.tmLanguage.json` (Shiki + VS Code grammar)
- `web/src/widgets/hero-playground/highlight.ts` (client tokenizer keyword sets)
- `vscode-ext/syntaxes/thailang.tmLanguage.json`
- All test fixtures across crates
