# String methods — receiver methods on `ข้อความ`

> **Soft reservations.** The emitter rewrites these member names regardless
> of the receiver's actual type — a user method named `.ความยาว` on a custom
> object gets silently rewritten to `.length`. Method-level reservations, not
> module-level.

Also applies to arrays where there's overlap (`.ความยาว` works on both).

---

## Shipped in Phase 3B

| Current | Means | JS target | Clash | Proposed |
|---|---|---|---|---|
| `.ความยาว` | length | `.length` | **high** — "length" is universal |  |
| `.ตัด` | slice | `.slice` | **high** — "cut" is common verb |  |
| `.เป็นตัวใหญ่` | toUpperCase | `.toUpperCase` | low — long compound |  |
| `.เป็นตัวเล็ก` | toLowerCase | `.toLowerCase` | low — long compound |  |
| `.แยก` | split | `.split` | medium — "separate" |  |

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

| Missing | Means | JS target | Proposed |
|---|---|---|---|
| _?_ | strip whitespace | `.trim` |  |
| _?_ | replace substring | `.replace` |  |
| _?_ | replace all | `.replaceAll` |  |
| _?_ | find substring position | `.indexOf` |  |
| _?_ | last find position | `.lastIndexOf` |  |
| _?_ | contains substring | `.includes` |  |
| _?_ | starts with prefix | `.startsWith` |  |
| _?_ | ends with suffix | `.endsWith` |  |
| _?_ | repeat N times | `.repeat` |  |
| _?_ | concat strings | `.concat` |  |
| _?_ | char at index | `.charAt` |  |
| _?_ | char code at | `.charCodeAt` |  |
| _?_ | pad front | `.padStart` |  |
| _?_ | pad back | `.padEnd` |  |
| _?_ | normalize Unicode | `.normalize` |  |

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
