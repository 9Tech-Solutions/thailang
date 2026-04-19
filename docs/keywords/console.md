# `ระบบ`: Console / I/O module

> **Shipped.** `พิมพ์` is no longer a lexer keyword; console output now
> goes through the `ระบบ` stdlib module.

---

## The migration

Thailang used to have a bare `พิมพ์` language keyword that special-cased to
`console.log`. That's been demoted: `ระบบ` is a stdlib module and `.แสดง` is
its log member.

```thailang
// Before:
พิมพ์("สวัสดี");

// Now:
ระบบ.แสดง("สวัสดี");
```

### What this cost the language

- **Removed** `Print` token from the lexer. Small diff.
- `พิมพ์` is now a plain identifier available for user code.
- Parser/emitter no longer special-case `พิมพ์`. The `ระบบ` → `console`
  module rewrite and `ระบบ.แสดง` → `console.log` member rewrite go
  through the existing stdlib rewrite tables.
- Every `.th` file + example updated to `ระบบ.แสดง(...)`.

---

## Module name

| Shipped | Means  | Clash                 | Notes         |
| ------- | ------ | --------------------- | ------------- |
| `ระบบ`  | system | medium, "the system"  |               |

---

## Members

Map `ระบบ.X` → JS `console.X`. Child-friendly, Thai-native names:

| Shipped | Proposed        | Means        | JS target          | Clash                     |
| ------- | --------------- | ------------ | ------------------ | ------------------------- |
| `.แสดง` |                 | print / log  | `console.log`      | low                       |
|         | `.เตือน`        | warn         | `console.warn`     |                           |
|         | `.ผิดพลาด`      | error        | `console.error`    |                           |
|         | `.แจ้ง`         | info         | `console.info`     |                           |
|         | `.ตรวจ`         | debug        | `console.debug`    |                           |
|         | `.ล้าง`         | clear screen | `console.clear`    |                           |
|         | `.ตาราง`        | table output | `console.table`    |                           |
|         | `.จับเวลา`      | start timer  | `console.time`     |                           |
|         | `.หยุดจับเวลา`  | stop timer   | `console.timeEnd`  |                           |
|         | `.นับ`          | count        | `console.count`    |                           |
|         | `.จับกลุ่ม`     | group        | `console.group`    |                           |
|         | `.เลิกจับกลุ่ม` | group end    | `console.groupEnd` |                           |

Suggested candidates for the remaining slots:

- `console.warn` → `.เตือน`
- `console.error` → `.ผิด` / `.ข้อผิดพลาด` / `.ล้ม`
- `console.info` → `.แจ้ง` / `.ข้อมูล` (but `ข้อมูล` clashes if we use it for `JSON`)
- `console.debug` → `.ตรวจ` / `.ดู`
- `console.clear` → `.ล้าง`
- `console.table` → `.ตาราง`
- `console.time` → `.จับเวลา`
- `console.timeEnd` → `.จบเวลา`
- `console.count` → `.นับ`
