# Array methods: receiver methods on `ชุด`

> **Soft reservations.** Same pattern as `string-methods.md`, emitter rewrites
> these member names regardless of receiver type.

---

## Shipped in Phase 3B

| Current    | Means               | JS target       | Clash                        | Proposed |
| ---------- | ------------------- | --------------- | ---------------------------- | -------- |
| `.ความยาว` | length              | `.length`       | **high**: universal          | `ขนาด`   |
| `.เรียง`   | sort (non-mutating) | `.slice().sort` | medium, "arrange/order"      |          |
| `.กรอง`    | filter              | `.filter`       | medium, "filter/strain"      |          |
| `.แปลง`    | map                 | `.map`          | medium, "transform/convert"  |          |
| `.ลด`      | reduce              | `.reduce`       | **high**: "decrease"         | `รวบ`    |
| `.มี`      | includes / has      | `.includes`     | **high**: "to have"          |          |

### Child-friendliness notes

- `.ลด` is the most natural Thai word for "reduce" but also extremely
  common as a verb meaning "decrease". In a cart context `ตะกร้า.ลด(...)` is
  ambiguous, does it reduce (fold) or discount (decrease the price)?
- `.มี` ("to have") as a method name is very natural (`ตะกร้า.มี(ของ)`), 
  this is GOOD, not bad. Keeping it is probably the right call despite
  being flagged as **high**.

---

## Missing: to add in Phase 3C

Array methods commonly needed:

| Missing | Means                 | JS target      | Proposed            |
| ------- | --------------------- | -------------- | ------------------- |
| _?_     | append item (mutates) | `.push`        | `ต่อท้าย`           |
| _?_     | remove last           | `.pop`         | `เอาท้ายออก`        |
| _?_     | remove first          | `.shift`       | `เอาหน้าออก`        |
| _?_     | prepend (mutates)     | `.unshift`     | `ต่อหน้า`           |
| _?_     | find first match      | `.find`        | `หา`                |
| _?_     | find first index      | `.findIndex`   | `หาตำแหน่ง`         |
| _?_     | find item index       | `.indexOf`     | `ตำแหน่งของ`        |
| _?_     | last find index       | `.lastIndexOf` | `ตำแหน่งสุดท้ายของ` |
| _?_     | any match             | `.some`        | `บางตัว`            |
| _?_     | all match             | `.every`       | `ทุกตัว`            |
| _?_     | join into string      | `.join`        | `เชื่อม`            |
| _?_     | reverse (mutates)     | `.reverse`     | `ย้อน`              |
| _?_     | flatten one level     | `.flat`        | `ยุบชั้น`           |
| _?_     | map then flatten      | `.flatMap`     | `แปลงยุบ`           |
| _?_     | concatenate arrays    | `.concat`      | `ต่อด้วย`           |
| _?_     | slice copy            | `.slice`       | `หั่น`              |
| _?_     | splice (mutates)      | `.splice`      | `แทนช่วง`           |
| _?_     | fill with value       | `.fill`        | `เติม`              |
| _?_     | shallow entries       | `.entries`     | `คู่ค่า`            |

Suggested candidates:

- `.push` → `.เพิ่ม` / `.ต่อท้าย`
- `.pop` → `.ดึงท้าย` / `.เอาท้ายออก`
- `.shift` → `.ดึงหน้า` / `.เอาหน้าออก`
- `.unshift` → `.ต่อหน้า` / `.แทรกหน้า`
- `.find` → `.หา`
- `.findIndex` → `.หาตำแหน่ง`
- `.indexOf` → `.ตำแหน่ง` (shares with string)
- `.some` → `.บางตัว` / `.บาง`
- `.every` → `.ทุกตัว` / `.ทุก`
- `.join` → `.รวม` / `.เชื่อม`
- `.reverse` → `.กลับ` / `.ย้อน`
- `.flat` → `.แบน`
- `.flatMap` → `.แบนแปลง`
- `.concat` → `.เชื่อม`
- `.slice` → `.ตัด` (conflicts with string, could reuse if we want same verb)
- `.fill` → `.เติม`

---

## For-each: already a language keyword

JS `.forEach` has a built-in language form in Thailang:

```thailang
แต่ละ x ใน ชุด { ... }
```

So there's no `.forEach` / `.แต่ละ` method needed. Users who want the
method form can still use `.แปลง` (map) or write a manual loop.
