# Language keywords: hard reservations

> These are **lexer keywords**, the parser refuses them as identifiers.
> Renaming touches `compiler/crates/lexer/src/token.rs` first, then flows
> through parser / emitter / SPEC / grammars / examples.

Total: **41 words** across 10 sections. (`พิมพ์` is no longer a lexer keyword,
it lives in the stdlib as `ระบบ.แสดง`, see `console.md`.)

---

## 1. Declarations

| Current    | Means          | JS/TS analog  | Clash                 | Proposed |
| ---------- | -------------- | ------------- | --------------------- | -------- |
| `ให้`      | let / declare  | `let`         | low                   |          |
| `คงที่`    | constant       | `const`       | low                   |          |
| `สูตร`     | function       | `function`    | low                   |          |
| `ส่งกลับ`  | return a value | `return`      | low                   |          |

> `console.log` maps to `ระบบ.แสดง(...)` as a stdlib call (see `console.md`),
> not a language keyword.

## 2. Control Flow

| Current      | Means           | JS/TS analog | Clash                | Proposed |
| ------------ | --------------- | ------------ | -------------------- | -------- |
| `ถ้า`        | if              | `if`         | low                  |          |
| `ไม่ก็`      | else-if         | `else if`    | low                  |          |
| `ไม่งั้น`    | else            | `else`       | low                  |          |
| `ระหว่างที่` | while           | `while`      | low                  |          |
| `วน`         | for             | `for`        | low                  |          |
| `แต่ละ`      | for-each        | `for…of`     | low                  |          |
| `หยุด`       | break           | `break`      | low                  |          |
| `ข้าม`       | continue / skip | `continue`   | low                  |          |
| `เลือก`      | switch / choose | `switch`     | medium (common verb) |          |
| `กรณี`       | case            | `case`       | low                  |          |
| `เริ่มต้น`   | default / start | `default`    | low                  |          |

## 3. Types

> **Highest clash surface.** `ตัวเลข` and `ข้อความ` are the most natural nouns
> for those concepts, so reserving them bites hardest.

| Current      | Means         | TS analog | Clash                   | Proposed |
| -----------  | ------------- | --------- | ----------------------- | -------- |
| `ตัวเลข`     | number        | `number`  | **high**: "the number"  |          |
| `จำนวนเต็ม`  | integer       | `int`     | low, technical          |          |
| `ข้อความ`    | string / text | `string`  | **high**: "a message"   |          |
| `ถูกผิด`     | boolean       | `boolean` | low, compound           |          |
| `ทั่วไป`     | any           | `any`     | low                     |          |
| `ไม่ส่งกลับ` | void          | `void`    | low, compound           |          |

## 4. Boolean & Null Literals

| Current | Means        | JS analog | Clash                     | Proposed |
| ------- | ------------ | --------- | ------------------------- | -------- |
| `ถูก`   | true         | `true`    | medium, adj "correct"     |          |
| `ผิด`   | false        | `false`   | medium, adj "wrong"       |          |
| `ว่าง`  | null / empty | `null`    | medium, adj "free/empty"  |          |

## 5. Logical Operators

> These ALSO accept ASCII aliases (`&&`, `\|\|`, `!`), the ASCII forms stay
> regardless of what you do to the Thai keywords.

| Current  | Means | JS analog | Clash                    | Proposed |
| -------- | ----- | --------- | ------------------------ | -------- |
| `และ`    | and   | `&&`      | **high**: conjunction    |          |
| `หรือ`   | or    | `\|\|`    | **high**: conjunction    |          |
| `ไม่ใช่` | not   | `!`       | medium, negation phrase  |          |

## 6. Data Structure Keywords

| Current  | Means              | TS analog   | Clash                    | Proposed |
| -------- | ------------------ | ----------- | ------------------------ | -------- |
| `ชุด`    | list / array       | `Array`     | medium, "a set/kit"      |          |
| `คู่`    | map / object       | `Map`/`{}`  | medium, "a pair"         |          |
| `โครง`   | struct / interface | `interface` | low, "frame"             |          |

## 7. Async

| Current | Means             | JS analog | Clash | Proposed |
| ------- | ----------------- | --------- | ----- | -------- |
| `รอ`    | await / wait      | `await`   | low   |          |
| `ขนาน`  | async / parallel  | `async`   | low   |          |

## 8. Error Handling

| Current   | Means   | JS analog | Clash | Proposed |
| --------- | ------- | --------- | ----- | -------- |
| `ลอง`     | try     | `try`     | low   |          |
| `จับ`     | catch   | `catch`   | low   |          |
| `สุดท้าย` | finally | `finally` | low   |          |
| `ฟ้อง`    | throw   | `throw`   | low   |          |

## 9. Modules

| Current  | Means  | JS analog | Clash                  | Proposed |
| -------- | ------ | --------- | ---------------------- | -------- |
| `นำเข้า` | import | `import`  | low                    |          |
| `ส่งออก` | export | `export`  | low                    |          |
| `จาก`    | from   | `from`    | **high**: preposition  |          |

## 10. Misc (membership + type guard)

| Current | Means           | JS/TS analog    | Clash                  | Proposed |
| ------- | --------------- | --------------- | ---------------------- | -------- |
| `ใน`    | in              | `in`            | **high**: preposition  |          |
| `เป็น`  | is (type guard) | no direct equiv | **high**: "to be"      |          |
