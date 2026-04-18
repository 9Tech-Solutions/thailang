# `คณิต` — Math module

> **Soft reservation.** Not a lexer keyword. Emitter rewrites `คณิต.X` → `Math.X`
> at compile time, so user-declared `คณิต` as a variable gets silently shadowed.
> Shipped in Phase 3B.

**Module name proposal:** `คณิต` (current) — common Thai noun for "math".
Consider if `คณิต` by itself is too generic a variable name to reserve.

| Current | Means            | JS target | Clash                        | Proposed (module) |
| ------- | ---------------- | --------- | ---------------------------- | ----------------- |
| `คณิต`  | Math module root | `Math`    | **high** — "math/arithmetic" |                   |

---

## Members

| Current    | Means       | JS target     | Clash              | Proposed |
| ---------- | ----------- | ------------- | ------------------ | -------- |
| `.สูงสุด`  | max of args | `Math.max`    | medium — "highest" |          |
| `.ต่ำสุด`  | min of args | `Math.min`    | medium — "lowest"  |          |
| `.สุ่ม`    | random 0..1 | `Math.random` | low                |          |
| `.ปัดขึ้น` | ceiling     | `Math.ceil`   | low                |          |
| `.ปัดลง`   | floor       | `Math.floor`  | low                |          |

---

## Missing (to add in Phase 3C)

Commonly needed but not yet wired. Fill in a Thai name if you want to reserve:

| Missing | Means            | JS target    | Proposed    |
| ------- | ---------------- | ------------ | ----------- |
| _?_     | absolute value   | `Math.abs`   | สัมบูรณ์    |
| _?_     | round nearest    | `Math.round` | ปัดเศษ      |
| _?_     | power            | `Math.pow`   | ยกกำลัง     |
| _?_     | square root      | `Math.sqrt`  | ราก         |
| _?_     | PI constant      | `Math.PI`    | พาย         |
| _?_     | sine             | `Math.sin`   | ไซน์        |
| _?_     | cosine           | `Math.cos`   | โคไซน์      |
| _?_     | log (natural)    | `Math.log`   | ล็อก        |
| _?_     | exponent (e^x)   | `Math.exp`   | เลขชี้กำลัง |
| _?_     | sign (+1/0/−1)   | `Math.sign`  | suggest one |
| _?_     | truncate         | `Math.trunc` | suggest one |
| _?_     | hypot (√(x²+y²)) | `Math.hypot` | suggest one |

Suggested candidates (edit as you like):

- `Math.abs` → `.ค่าสัมบูรณ์` / `.บวก` — latter is shorter but reads oddly
- `Math.round` → `.ปัดเศษ` / `.ปัด`
- `Math.pow` → `.ยกกำลัง`
- `Math.sqrt` → `.รากที่สอง` / `.ราก`
- `Math.PI` → `.พาย`
- `Math.sin/cos/tan` → `.ไซน์ / .โคไซน์ / .แทน` (transliteration — standard Thai math term)
