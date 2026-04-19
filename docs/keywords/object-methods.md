# `วัตถุ`: Object static methods

> **Not yet implemented.** Covers JS `Object.*` statics, the most useful
> ones for Thai children will be `keys` / `values` / `entries` / `freeze`.

---

## Module name

| Proposed | Means          | Clash                | Notes             |
| -------- | -------------- | -------------------- | ----------------- |
| `วัตถุ`  | object / thing | medium, "an object"  | matches JS naming |
| _alt_    |                |                      |                   |

Possible alternative if `วัตถุ` feels physics-y: `ข้อมูล` (data), but
that's potentially used for `JSON` module too. Pick once.

---

## Statics

| Current (proposed) | Means              | JS target                  | Clash | Proposed     |
| ------------------ | ------------------ | -------------------------- | ----- | ------------ |
| _?_                | keys of object     | `Object.keys`              |       | .ชื่อทั้งหมด |
| _?_                | values of object   | `Object.values`            |       | .ค่าทั้งหมด  |
| _?_                | key-value pairs    | `Object.entries`           |       | .รายการคู่   |
| _?_                | from entries array | `Object.fromEntries`       |       | .จากคู่      |
| _?_                | merge objects      | `Object.assign`            |       | .รวม         |
| _?_                | freeze (immutable) | `Object.freeze`            |       | .ล็อก        |
| _?_                | check frozen       | `Object.isFrozen`          |       | .ล็อกอยู่    |
| _?_                | shallow clone      | `structuredClone` (global) |       | .มีของตัวเอง |
| _?_                | check has own prop | `Object.hasOwn`            |       | .ทำสำเนา     |

Suggested candidates:

- `Object.keys` → `.กุญแจ` / `.ชื่อ` / `.กุญแจทั้งหมด`
- `Object.values` → `.ค่า` / `.ค่าทั้งหมด`
- `Object.entries` → `.คู่` (conflicts with shipped `แผนที่→คู่` Map keyword) / `.รายการคู่`
- `Object.fromEntries` → `.จากคู่`
- `Object.assign` → `.รวม` / `.ผสม`
- `Object.freeze` → `.แช่แข็ง` / `.ตรึง` / `.ล็อก`
- `Object.isFrozen` → `.แช่แข็งอยู่` / `.ตรึงอยู่`
- `Object.hasOwn` → `.มีของตัวเอง`
- `structuredClone` → `.ทำสำเนา` / `.คัดลอก`

---

## Special: spread / destructuring

Thailang doesn't have `...spread` or `{ a, b } = obj` destructuring yet.
These are ES2015+ features that would reduce the need for many `Object.*`
helpers. Out of scope for this rename, Phase 3C or later design decision.
