# `ระบบ` — Console / I/O module

> **Not yet implemented.** This file captures the design of a new stdlib
> module based on your §1 note ("should change to std related, use the word
> `ระบบ` for console instead").

---

## The migration

Today Thailang has a bare `พิมพ์` language keyword that special-cases to
`console.log`. Your proposal: demote `พิมพ์` from keyword status, introduce a
new `ระบบ` stdlib module, and expose console members on it:

```thailang
// Before (current):
พิมพ์("สวัสดี");

// After (proposed):
ระบบ.พิมพ์("สวัสดี");
```

### What this costs the language

- **Removes** `Print` token from the lexer. Small diff.
- `พิมพ์` becomes a plain identifier. User could shadow it, but since it's
  accessed via `ระบบ.พิมพ์` the risk is local.
- Parser/emitter stop special-casing `พิมพ์`. The `ระบบ` → `globalThis`
  rewrite and `ระบบ.พิมพ์` → `console.log` rewrite go through the existing
  stdlib rewrite tables.
- Every `.th` file + example needs `พิมพ์(...)` → `ระบบ.พิมพ์(...)`.

**Trade-off:** More verbose for the most common call. If a child writes
their first program, `ระบบ.พิมพ์("สวัสดี")` is more to type than `พิมพ์(...)`.
Worth weighing against the "std-related" benefit.

**Alternative:** Keep `พิมพ์` as a shortcut AND expose `ระบบ.พิมพ์` as the
canonical form — both compile to `console.log`. Best of both worlds.

---

## Module name

| Proposed | Means | Clash | Notes |
|---|---|---|---|
| `ระบบ` | system | medium — "the system" | your proposal |
| _alt_ | — | — |  |

---

## Members

Map `ระบบ.X` → JS `console.X`. Child-friendly, Thai-native names:

| Current (proposed) | Means | JS target | Clash | Proposed |
|---|---|---|---|---|
| `.พิมพ์` | print / log | `console.log` | low — already established |  |
| _?_ | warn | `console.warn` |  |  |
| _?_ | error | `console.error` |  |  |
| _?_ | info | `console.info` |  |  |
| _?_ | debug | `console.debug` |  |  |
| _?_ | clear screen | `console.clear` |  |  |
| _?_ | table output | `console.table` |  |  |
| _?_ | start timer | `console.time` |  |  |
| _?_ | stop timer | `console.timeEnd` |  |  |
| _?_ | count | `console.count` |  |  |
| _?_ | group | `console.group` |  |  |
| _?_ | group end | `console.groupEnd` |  |  |

Suggested candidates:
- `console.warn` → `.เตือน`
- `console.error` → `.ผิด` / `.ข้อผิดพลาด` / `.ล้ม`
- `console.info` → `.แจ้ง` / `.ข้อมูล` (but `ข้อมูล` clashes if we use it for `JSON`)
- `console.debug` → `.ตรวจ` / `.ดู`
- `console.clear` → `.ล้าง`
- `console.table` → `.ตาราง`
- `console.time` → `.จับเวลา`
- `console.timeEnd` → `.จบเวลา`
- `console.count` → `.นับ`
