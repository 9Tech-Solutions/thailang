# `จำนวน` — Number module + global numeric helpers

> **Not yet implemented.** Covers `Number.*` statics and the global numeric
> parsing/validation functions (`parseInt`, `parseFloat`, `isNaN`, `isFinite`).

---

## Module name

| Proposed | Means | Clash | Notes |
|---|---|---|---|
| `จำนวน` | number / count / quantity | medium — "count/amount" | stem of `จำนวนเต็ม` (int type keyword) |
| _alt_ | — | — |  |

Note: `จำนวน` stands alone (doesn't collide with `จำนวนเต็ม` token because
logos uses longest-match). Safe.

---

## Parsing — global helpers

JS exposes these at global scope. Thailang namespaces them under `จำนวน.*`:

| Current (proposed) | Means | JS target | Clash | Proposed |
|---|---|---|---|---|
| _?_ | parse integer from string | `parseInt` / `Number.parseInt` |  |  |
| _?_ | parse float from string | `parseFloat` / `Number.parseFloat` |  |  |
| _?_ | check not-a-number | `Number.isNaN` |  |  |
| _?_ | check finite | `Number.isFinite` |  |  |
| _?_ | check integer | `Number.isInteger` |  |  |
| _?_ | check safe integer | `Number.isSafeInteger` |  |  |

Suggested candidates:
- `parseInt` → `.จากข้อความ` / `.แปลงเป็นเต็ม` / `.อ่าน`
- `parseFloat` → `.จากข้อความทศนิยม` / `.อ่านทศนิยม`
- `Number.isNaN` → `.ไม่ใช่ตัวเลข` (long) / `.ไม่เป็นเลข`
- `Number.isFinite` → `.จำกัด` / `.มีขอบเขต`
- `Number.isInteger` → `.เป็นเต็ม` / `.เป็นจำนวนเต็ม`

---

## Constants

| Current (proposed) | Means | JS target | Clash | Proposed |
|---|---|---|---|---|
| _?_ | max safe integer | `Number.MAX_SAFE_INTEGER` |  |  |
| _?_ | min safe integer | `Number.MIN_SAFE_INTEGER` |  |  |
| _?_ | max double | `Number.MAX_VALUE` |  |  |
| _?_ | min positive double | `Number.MIN_VALUE` |  |  |
| _?_ | machine epsilon | `Number.EPSILON` |  |  |
| _?_ | positive infinity | `Number.POSITIVE_INFINITY` |  |  |
| _?_ | negative infinity | `Number.NEGATIVE_INFINITY` |  |  |
| _?_ | NaN | `Number.NaN` |  |  |

Suggested candidates:
- `MAX_SAFE_INTEGER` → `.สูงสุด` (but conflicts with `คณิต.สูงสุด` — prefix with something like `.ค่าสูงสุด` or `.เต็มสูงสุด`)
- `MIN_SAFE_INTEGER` → `.ต่ำสุด` (same conflict)
- `POSITIVE_INFINITY` → `.อนันต์` (infinity)
- `NEGATIVE_INFINITY` → `.อนันต์ลบ`
- `NaN` → `.ไม่ใช่เลข` / `.ไม่เป็นเลข`

---

## Instance methods on number values

Not typically used in child code but worth tabling:

| Current (proposed) | Means | JS target | Proposed |
|---|---|---|---|
| _?_ | to fixed decimals | `.toFixed` |  |
| _?_ | to precision | `.toPrecision` |  |
| _?_ | to string (radix) | `.toString` |  |
| _?_ | to locale string | `.toLocaleString` |  |

Suggested:
- `.toFixed` → `.ทศนิยม(n)` (take n-decimals)
- `.toString` → `.เป็นข้อความ`
