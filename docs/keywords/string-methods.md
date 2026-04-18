# String methods — receiver methods on `ข้อความ`

> **Soft reservations.** The emitter rewrites these member names regardless
> of the receiver's actual type — a user method named `.ความยาว` on a custom
> object gets silently rewritten to `.length`. Method-level reservations, not
> module-level.

Also applies to arrays where there's overlap (`.ความยาว` works on both).

---

## Shipped in Phase 3B

| Current        | Means       | JS target      | Clash                            | Proposed |
| -------------- | ----------- | -------------- | -------------------------------- | -------- |
| `.ความยาว`     | length      | `.length`      | **high** — "length" is universal |          |
| `.ตัด`         | slice       | `.slice`       | **high** — "cut" is common verb  |          |
| `.เป็นตัวใหญ่` | toUpperCase | `.toUpperCase` | low — long compound              |          |
| `.เป็นตัวเล็ก` | toLowerCase | `.toLowerCase` | low — long compound              |          |
| `.แยก`         | split       | `.split`       | medium — "separate"              |          |

### Child-friendliness notes

- `.เป็นตัวใหญ่` / `.เป็นตัวเล็ก` are 4–5 syllables. Kids will want something
  shorter. Proposal: `.ใหญ่` / `.เล็ก`? Or `.ตัวใหญ่` / `.ตัวเล็ก`? Or
  `.ใหญ่ขึ้น` / `.เล็กลง`?
- `.ตัด` literally means "cut" — fine for slice, but in Thai programming
  context might suggest destructive. JS `.slice` is non-mutating. No action
  needed but worth noting.

---

## Missing — to add in Phase 3C

String methods commonly needed:

| Missing | Means                   | JS target      | Proposed     |
| ------- | ----------------------- | -------------- | ------------ |
| _?_     | strip whitespace        | `.trim`        | .ตัดช่องว่าง |
| _?_     | replace substring       | `.replace`     | .แทนที่      |
| _?_     | replace all             | `.replaceAll`  | .แทนทั้งหมด  |
| _?_     | find substring position | `.indexOf`     | .ตำแหน่ง     |
| _?_     | last find position      | `.lastIndexOf` | .มี          |
| _?_     | contains substring      | `.includes`    | .ขึ้นต้นด้วย |
| _?_     | starts with prefix      | `.startsWith`  | .ลงท้ายด้วย  |
| _?_     | ends with suffix        | `.endsWith`    | .ลงท้ายด้วย  |
| _?_     | repeat N times          | `.repeat`      | .ซ้ำ         |
| _?_     | concat strings          | `.concat`      | .เชื่อม      |
| _?_     | char at index           | `.charAt`      | .ตัวที่      |
| _?_     | char code at            | `.charCodeAt`  |              |
| _?_     | pad front               | `.padStart`    | .เติมหน้า    |
| _?_     | pad back                | `.padEnd`      | .เติมท้าย    |
| _?_     | normalize Unicode       | `.normalize`   |              |

Suggested candidates:

- `.trim` → `.ตัดช่องว่าง` / `.ตัดว่าง`
- `.replace` → `.แทนที่`
- `.replaceAll` → `.แทนทั้งหมด`
- `.indexOf` → `.ตำแหน่ง`
- `.includes` → `.มี` (currently used for Array — reuse OK since they share JS method name)
- `.startsWith` → `.ขึ้นต้นด้วย`
- `.endsWith` → `.ลงท้ายด้วย`
- `.repeat` → `.ซ้ำ`
- `.concat` → `.เชื่อม` (but `+` works too)
- `.charAt` → `.ตัวที่` / `.อักษรที่`
- `.padStart` → `.เติมหน้า`
- `.padEnd` → `.เติมท้าย`
