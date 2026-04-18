# Language keywords — hard reservations

> These are **lexer keywords** — the parser refuses them as identifiers.
> Renaming touches `compiler/crates/lexer/src/token.rs` first, then flows
> through parser / emitter / SPEC / grammars / examples.

Total: **42 words** across 10 sections.

---

## 1. Declarations

| Current    | Means          | JS/TS analog  | Clash                 | Proposed                                                              |
| ---------- | -------------- | ------------- | --------------------- | --------------------------------------------------------------------- |
| `ให้`      | let / declare  | `let`         | low                   |                                                                       |
| `คงที่`    | constant       | `const`       | low                   |                                                                       |
| `ฟังก์ชัน` | function       | `function`    | low (transliteration) | `สูตร`                                                                |
| `คืน`      | return a value | `return`      | low                   | `ส่งกลับ`                                                             |
| `พิมพ์`    | print          | `console.log` | low                   | should change to std related, use the word `ระบบ` for console instead |

## 2. Control Flow

| Current    | Means           | JS/TS analog | Clash                | Proposed     |
| ---------- | --------------- | ------------ | -------------------- | ------------ |
| `ถ้า`      | if              | `if`         | low                  |              |
| `ไม่ก็`    | else-if         | `else if`    | low                  |              |
| `ไม่งั้น`  | else            | `else`       | low                  |              |
| `ตราบ`     | while           | `while`      | low                  | `ระหว่างที่` |
| `วน`       | for             | `for`        | low                  |              |
| `แต่ละ`    | for-each        | `for…of`     | low                  |              |
| `หยุด`     | break           | `break`      | low                  |              |
| `ข้าม`     | continue / skip | `continue`   | low                  |              |
| `เลือก`    | switch / choose | `switch`     | medium (common verb) |              |
| `กรณี`     | case            | `case`       | low                  |              |
| `เริ่มต้น` | default / start | `default`    | low                  |              |

## 3. Types

> **Highest clash surface.** `ตัวเลข` and `ข้อความ` are the most natural nouns
> for those concepts, so reserving them bites hardest.

| Current     | Means         | TS analog | Clash                   | Proposed     |
| ----------- | ------------- | --------- | ----------------------- | ------------ |
| `ตัวเลข`    | number        | `number`  | **high** — "the number" |              |
| `จำนวนเต็ม` | integer       | `int`     | low — technical         |              |
| `ข้อความ`   | string / text | `string`  | **high** — "a message"  |              |
| `จริงเท็จ`  | boolean       | `boolean` | low — compound          | `ถูกผิด`     |
| `อะไรก็ได้` | any           | `any`     | low — long phrase       | `ทั่วไป`     |
| `ไม่คืน`    | void          | `void`    | low — compound          | `ไม่ส่งกลับ` |

## 4. Boolean & Null Literals

| Current | Means        | JS analog | Clash                     | Proposed |
| ------- | ------------ | --------- | ------------------------- | -------- |
| `จริง`  | true         | `true`    | medium — adj "real/true"  | `ถูก`    |
| `เท็จ`  | false        | `false`   | low                       | `ผิด`    |
| `ว่าง`  | null / empty | `null`    | medium — adj "free/empty" |          |

## 5. Logical Operators

> These ALSO accept ASCII aliases (`&&`, `\|\|`, `!`) — the ASCII forms stay
> regardless of what you do to the Thai keywords.

| Current | Means | JS analog | Clash                    | Proposed |
| ------- | ----- | --------- | ------------------------ | -------- |
| `และ`   | and   | `&&`      | **high** — conjunction   |          |
| `หรือ`  | or    | `\|\|`    | **high** — conjunction   |          |
| `ไม่`   | not   | `!`       | **high** — negation word | `ไม่ใช่` |

## 6. Data Structure Keywords

| Current     | Means              | TS analog   | Clash                    | Proposed |
| ----------- | ------------------ | ----------- | ------------------------ | -------- |
| `รายการ`    | list / array       | `Array`     | **high** — "a list item" | `ชุด`    |
| `แผนที่`    | map / object       | `Map`/`{}`  | **high** — "a map"       | `คู่`    |
| `โครงสร้าง` | struct / interface | `interface` | medium                   | `โครง`   |

## 7. Async

| Current    | Means             | JS analog | Clash | Proposed |
| ---------- | ----------------- | --------- | ----- | -------- |
| `รอ`       | await / wait      | `await`   | low   |          |
| `ไม่พร้อม` | async / not-ready | `async`   | low   | `ขนาน`   |

## 8. Error Handling

| Current   | Means   | JS analog | Clash | Proposed |
| --------- | ------- | --------- | ----- | -------- |
| `ลอง`     | try     | `try`     | low   |          |
| `จับ`     | catch   | `catch`   | low   |          |
| `สุดท้าย` | finally | `finally` | low   |          |
| `โยน`     | throw   | `throw`   | low   | `ฟ้อง`   |

## 9. Modules

| Current  | Means  | JS analog | Clash                  | Proposed |
| -------- | ------ | --------- | ---------------------- | -------- |
| `นำเข้า` | import | `import`  | low                    |          |
| `ส่งออก` | export | `export`  | low                    |          |
| `จาก`    | from   | `from`    | **high** — preposition |          |

## 10. Misc (membership + type guard)

| Current | Means           | JS/TS analog    | Clash                  | Proposed |
| ------- | --------------- | --------------- | ---------------------- | -------- |
| `ใน`    | in              | `in`            | **high** — preposition |          |
| `เป็น`  | is (type guard) | no direct equiv | **high** — "to be"     |          |
