# `ข้อผิดพลาด`: Error types

> **Not yet implemented.** Covers JS built-in error classes. Relevant once
> `โยน` (throw) + `ลอง`/`จับ` (try/catch) are exercised with real error
> construction.

---

## Module name

| Proposed     | Means                 | Clash | Notes               |
| ------------ | --------------------- | ----- | ------------------- |
| `ข้อผิดพลาด` | error (long compound) | low   | literal translation |
| `ผิดพลาด`    | error (shorter)       | low   | shorter alternative |
| _alt_        |                       |       |                     |

Consider whether error types deserve a module prefix at all, JS exposes
them as bare globals (`throw new TypeError(...)`). Thailang could do
either:

```thailang
// A) module prefix
โยน ข้อผิดพลาด.ประเภท.ใหม่("x");

// B) bare constructors (like JS)
โยน ข้อผิดพลาดประเภท.ใหม่("x");
```

\*\*use the word `แจ้ง` instead of `โยน`

(B) matches JS more closely and shortens call sites.

---

## Types

| Current (proposed) | Means                   | JS target        | Clash | Proposed            |
| ------------------ | ----------------------- | ---------------- | ----- | ------------------- |
| _?_                | base Error              | `Error`          |       | ข้อผิดพลาด          |
| _?_                | type mismatch           | `TypeError`      |       | ข้อผิดพลาดของประเภท |
| _?_                | range violation         | `RangeError`     |       | ช่วงของข้อผิดพลาด   |
| _?_                | syntax error            | `SyntaxError`    |       | ไวยากรณ์ผิดพลาด     |
| _?_                | reference error         | `ReferenceError` |       | อ้างอิงผิดพลาด      |
| _?_                | URI error               | `URIError`       |       |                     |
| _?_                | eval error (deprecated) | `EvalError`      |       |                     |

Suggested candidates (option B, bare Thai compounds):

- `Error` → `ข้อผิดพลาด`
- `TypeError` → `ข้อผิดพลาดประเภท`
- `RangeError` → `ข้อผิดพลาดช่วง` / `ข้อผิดพลาดขอบเขต`
- `SyntaxError` → `ข้อผิดพลาดไวยากรณ์`
- `ReferenceError` → `ข้อผิดพลาดการอ้างอิง` / `ข้อผิดพลาดอ้างอิง`

---

## Instance accessors on a thrown error `e`

| Current (proposed) | Means         | JS target   | Proposed |
| ------------------ | ------------- | ----------- | -------- |
| _?_                | message text  | `e.message` | .ข้อความ |
| _?_                | error name    | `e.name`    | .ชื่อ    |
| _?_                | stack trace   | `e.stack`   | .ร่องรอย |
| _?_                | chained cause | `e.cause`   | .สาเหตุ  |

Suggested:

- `.message` → `.ข้อความ` (conflicts with `String` type keyword if we
  rename that away, check against `language.md` §3)
- `.name` → `.ชื่อ`
- `.stack` → `.ร่องรอย` / `.สแต็ก`
- `.cause` → `.สาเหตุ`
