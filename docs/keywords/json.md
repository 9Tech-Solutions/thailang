# JSON module

> **Not yet implemented.** Covers `JSON.parse` / `JSON.stringify`.

---

## Module name — to decide

JSON is internationally recognized. Three options:

| Option | Pro | Con |
|---|---|---|
| Keep `JSON` as-is | Matches every other language; no translation cost | Breaks the Thai-first promise |
| `ข้อมูล` (data) | Natural Thai; child-readable | Very common noun (also proposed for other things); risks conflict |
| `เจสัน` (transliteration) | Clear what it is | Non-natural word; teaches a foreign name |

Pick one:

| Proposed | Clash | Notes |
|---|---|---|
| _?_ |  |  |

Recommendation: keep `JSON`. It's a file format, not a Thai concept.
Override if you disagree.

---

## Members

| Current (proposed) | Means | JS target | Clash | Proposed |
|---|---|---|---|---|
| _?_ | parse string → value | `JSON.parse` |  |  |
| _?_ | serialize → string | `JSON.stringify` |  |  |

Suggested candidates (assuming module stays `JSON`):
- `JSON.parse` → `JSON.อ่าน` / `JSON.แปลง`
- `JSON.stringify` → `JSON.เขียน` / `JSON.เป็นข้อความ`

Or if renamed to `ข้อมูล`:
- `.อ่าน` / `.เขียน`
