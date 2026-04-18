# `วันที่`: Date module

> **Not yet implemented.** Covers JS `Date`, creation, current-time helpers,
> and accessors on a date value.

---

## Module name

| Proposed | Means | Clash          | Notes              |
| -------- | ----- | -------------- | ------------------ |
| `วันที่` | date  | low, compound  | direct translation |
| _alt_    |       |                |                    |

---

## Creation / static helpers

| Current (proposed) | Means             | JS target                   | Clash | Proposed |
| ------------------ | ----------------- | --------------------------- | ----- | -------- |
| _?_                | current date-time | `new Date()` / `Date.now()` |       |          |
| _?_                | parse from string | `new Date(str)`             |       |          |
| _?_                | from components   | `new Date(y, m, d, ...)`    |       |          |

Suggested candidates:

- `new Date()` → `วันที่.ตอนนี้()` / `วันที่.เดี๋ยวนี้()`
- `Date.now()` (ms epoch) → `วันที่.เวลาปัจจุบัน()` / `วันที่.เอพอค()`
- `new Date(str)` → `วันที่.จากข้อความ(s)`
- `new Date(y,m,d)` → `วันที่.สร้าง(ปี, เดือน, วัน)`

---

## Accessors on a date value `d`

| Current (proposed) | Means              | JS target             | Clash | Proposed |
| ------------------ | ------------------ | --------------------- | ----- | -------- |
| _?_                | year               | `d.getFullYear()`     |       |          |
| _?_                | month (0-indexed!) | `d.getMonth()`        |       |          |
| _?_                | day of month       | `d.getDate()`         |       |          |
| _?_                | day of week        | `d.getDay()`          |       |          |
| _?_                | hour               | `d.getHours()`        |       |          |
| _?_                | minute             | `d.getMinutes()`      |       |          |
| _?_                | second             | `d.getSeconds()`      |       |          |
| _?_                | millisecond        | `d.getMilliseconds()` |       |          |
| _?_                | epoch ms           | `d.getTime()`         |       |          |
| _?_                | ISO string         | `d.toISOString()`     |       |          |
| _?_                | locale string      | `d.toLocaleString()`  |       |          |

Suggested candidates (short forms preferred for children):

- `.getFullYear` → `.ปี`
- `.getMonth` → `.เดือน`, **warning**: JS is 0-indexed. Consider wrapping to +1 so `.เดือน` returns 1–12 (natural for kids).
- `.getDate` → `.วันที่` (conflicts with module name) / `.วัน`
- `.getDay` → `.วันสัปดาห์` / `.วันที่เท่าไหร่`
- `.getHours` → `.ชั่วโมง`
- `.getMinutes` → `.นาที`
- `.getSeconds` → `.วินาที`
- `.getTime` → `.เวลา` (generic) / `.เอพอค`
- `.toISOString` → `.มาตรฐาน` / `.ไอเอสโอ`
- `.toLocaleString` → `.ไทย` / `.ท้องถิ่น`

---

## Design decisions to make

- **0-indexed vs 1-indexed month**: JS `.getMonth()` returns 0–11. If
  Thailang `.เดือน` returns raw JS (0–11), it's confusing for children.
  Wrapping to 1–12 is small overhead but big UX win.
- **Thai year (พ.ศ.) vs Gregorian (ค.ศ.)**: Thailand uses Buddhist calendar
  (พ.ศ. = ค.ศ. + 543). Should `.ปี` return พ.ศ.? Or add `.ปีพุทธ` as separate
  accessor?
