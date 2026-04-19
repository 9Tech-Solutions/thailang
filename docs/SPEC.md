# 🇹🇭 Thailang: Language Design Spec v0.1

> **Thai-first. Type-safe. Compiled. Feels like JS/TS.**
>
> ภาษาโปรแกรมมิงไทยตัวแรกที่ compile จริง ใช้ Rust เป็น backend

---

## 1. Philosophy

```
"เขียนเป็นไทย รันเหมือน Rust"
```

- **Keyword ไทยทั้งหมด**: ให้คนไทยอ่านโค้ดแล้วเข้าใจได้ทันที
- **Syntax คุ้นเคย**: โครงสร้างเหมือน JS/TS ไม่ต้องเรียนใหม่
- **Type-safe แต่ไม่บังคับ**: ประกาศ type ก็ได้ ไม่ประกาศ compiler เดาให้
- **Compiled ด้วย Rust**: ได้ performance จริง ไม่ใช่แค่ interpreter

---

## 2. Keyword Map

### Core Keywords

| Thailang  | เทียบ JS/TS     | ความหมาย                   |
| --------- | -------------   | ----------                 |
| `ให้`     | `let` / `const` | ประกาศตัวแปร               |
| `คงที่`   | `const`         | ประกาศค่าคงที่ (immutable) |
| `สูตร`    | `function`      | ประกาศฟังก์ชัน             |
| `ส่งกลับ` | `return`        | คืนค่า                     |

> `ระบบ.แสดง(...)` เป็น stdlib (ดู §8) แทน `console.log` ไม่ใช่ keyword

### Control Flow

| Thailang     | เทียบ JS/TS   | ความหมาย       |
| ----------   | ------------- | ----------     |
| `ถ้า`        | `if`          | เงื่อนไข       |
| `ไม่ก็`      | `else if`     | เงื่อนไขเพิ่ม  |
| `ไม่งั้น`    | `else`        | กรณีอื่น       |
| `ระหว่างที่` | `while`       | วนลูป while    |
| `วน`         | `for`         | วนลูป for      |
| `แต่ละ`      | `for...of`    | วนลูป for-each |
| `หยุด`       | `break`       | หยุดลูป        |
| `ข้าม`       | `continue`    | ข้ามรอบ        |
| `เลือก`      | `switch`      | switch-case    |
| `กรณี`       | `case`        | case           |
| `เริ่มต้น`   | `default`     | default case   |

### Types

| Thailang     | เทียบ TS   | ความหมาย             |
| ----------   | ---------- | ----------           |
| `ตัวเลข`     | `number`   | ตัวเลข (f64 default) |
| `จำนวนเต็ม`  | `int`      | จำนวนเต็ม (i64)      |
| `ข้อความ`    | `string`   | string               |
| `ถูกผิด`     | `boolean`  | boolean              |
| `ว่าง`       | `null`     | null                 |
| `ทั่วไป`     | `any`      | any type             |
| `ไม่ส่งกลับ` | `void`     | void                 |

### Boolean & Logic

| Thailang   | เทียบ JS   | ความหมาย   |
| ---------- | ---------- | ---------- |
| `ถูก`      | `true`     | true       |
| `ผิด`      | `false`    | false      |
| `และ`      | `&&`       | AND        |
| `หรือ` | `\|\|` | OR |
| `ไม่ใช่`   | `!`        | NOT        |

### Data Structures

| Thailang   | เทียบ TS             | ความหมาย                 |
| ---------- | ----------           | ----------               |
| `ชุด`      | `Array` / `[]`       | array                    |
| `คู่`      | `Map` / `{}`         | object / map             |
| `โครง`     | `interface` / `type` | struct / type definition |

### Async

| Thailang   | เทียบ JS   | ความหมาย   |
| ---------- | ---------- | ---------- |
| `รอ`       | `await`    | await      |
| `ขนาน`     | `async`    | async      |

### Error Handling

| Thailang   | เทียบ JS   | ความหมาย   |
| ---------- | ---------- | ---------- |
| `ลอง`      | `try`      | try        |
| `จับ`      | `catch`    | catch      |
| `สุดท้าย`  | `finally`  | finally    |
| `ฟ้อง`     | `throw`    | throw      |

### Module System

| Thailang   | เทียบ JS/TS   | ความหมาย   |
| ---------- | ------------- | ---------- |
| `นำเข้า`   | `import`      | import     |
| `ส่งออก`   | `export`      | export     |
| `จาก`      | `from`        | from       |

---

## 3. Syntax Examples

### 3.1 Hello World

```thailang
ระบบ.แสดง("สวัสดีชาวโลก!");
```

### 3.2 ตัวแปร: ประกาศ type หรือไม่ก็ได้

```thailang
// แบบ inferred, compiler เดา type ให้
ให้ ชื่อ = "สมชาย";
ให้ อายุ = 25;
ให้ สูง = 175.5;
ให้ เป็นนักเรียน = ถูก;

// แบบ explicit, ประกาศ type ชัดเจน
ให้ ชื่อ: ข้อความ = "สมชาย";
ให้ อายุ: จำนวนเต็ม = 25;
ให้ สูง: ตัวเลข = 175.5;
ให้ เป็นนักเรียน: ถูกผิด = ถูก;

// ค่าคงที่, เปลี่ยนแปลงไม่ได้
คงที่ PI = 3.14159;
คงที่ ชื่อแอป: ข้อความ = "Thailang";
```

### 3.3 ฟังก์ชัน

```thailang
// แบบ inferred return type
สูตร ทักทาย(ชื่อ: ข้อความ) {
    ส่งกลับ "สวัสดี " + ชื่อ + "!";
}

// แบบ explicit return type
สูตร บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    ส่งกลับ ก + ข;
}

// Arrow function style (แบบสั้น)
ให้ คูณสอง = (x: ตัวเลข) => x * 2;

// เรียกใช้
ระบบ.แสดง(ทักทาย("สมชาย"));     // สวัสดี สมชาย!
ระบบ.แสดง(บวก(10, 20));          // 30
ระบบ.แสดง(คูณสอง(21));           // 42
```

### 3.4 Control Flow

```thailang
ให้ อายุ = 20;

// if-else
ถ้า (อายุ >= 18) {
    ระบบ.แสดง("เป็นผู้ใหญ่แล้ว");
} ไม่ก็ (อายุ >= 13) {
    ระบบ.แสดง("เป็นวัยรุ่น");
} ไม่งั้น {
    ระบบ.แสดง("ยังเป็นเด็ก");
}

// ternary-style (แบบสั้น)
ให้ สถานะ = ถ้า (อายุ >= 18) "ผู้ใหญ่" ไม่งั้น "เด็ก";
```

### 3.5 Loops

```thailang
// while loop
ให้ i = 0;
ระหว่างที่ (i < 5) {
    ระบบ.แสดง(i);
    i = i + 1;
}

// for loop (C-style)
วน (ให้ i = 0; i < 10; i += 1) {
    ถ้า (i == 5) ข้าม;
    ระบบ.แสดง(i);
}

// for-each
ให้ ผลไม้ = ["มะม่วง", "ทุเรียน", "มังคุด"];
แต่ละ (ผล ใน ผลไม้) {
    ระบบ.แสดง(ผล);
}
```

### 3.6 Data Structures

```thailang
// Array
ให้ คะแนน: ชุด<ตัวเลข> = [95, 87, 92, 78];
ให้ ชื่อนักเรียน = ["สมชาย", "สมหญิง", "สมศักดิ์"];

ระบบ.แสดง(คะแนน.ความยาว);          // 4
ระบบ.แสดง(ชื่อนักเรียน[0]);          // สมชาย

// Map / Object
ให้ นักเรียน: คู่ = {
    ชื่อ: "สมชาย",
    อายุ: 20,
    คณะ: "วิศวกรรม",
};

ระบบ.แสดง(นักเรียน.ชื่อ);            // สมชาย

// Struct / Type Definition
โครง ผู้ใช้ {
    ชื่อ: ข้อความ,
    อายุ: จำนวนเต็ม,
    อีเมล: ข้อความ,
}

ให้ คนใหม่: ผู้ใช้ = {
    ชื่อ: "วิชัย",
    อายุ: 28,
    อีเมล: "wichai@thailang.dev",
};
```

### 3.7 String Interpolation

```thailang
ให้ ชื่อ = "สมชาย";
ให้ อายุ = 25;

// ใช้ template literal แบบ JS (backtick)
ระบบ.แสดง(`${ชื่อ} อายุ ${อายุ} ปี`);

// output: สมชาย อายุ 25 ปี
```

### 3.8 Error Handling

```thailang
สูตร หาร(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    ถ้า (ข == 0) {
        ฟ้อง "หารด้วยศูนย์ไม่ได้!";
    }
    ส่งกลับ ก / ข;
}

ลอง {
    ให้ ผลลัพธ์ = หาร(10, 0);
    ระบบ.แสดง(ผลลัพธ์);
} จับ (ข้อผิดพลาด) {
    ระบบ.แสดง("เกิดข้อผิดพลาด: " + ข้อผิดพลาด);
} สุดท้าย {
    ระบบ.แสดง("จบการทำงาน");
}
```

### 3.9 Async/Await

```thailang
ขนาน สูตร ดึงข้อมูล(url: ข้อความ) -> ข้อความ {
    ให้ ผล = รอ fetch(url);
    ให้ ข้อมูล = รอ ผล.json();
    ส่งกลับ ข้อมูล;
}

ขนาน สูตร หลัก() {
    ให้ ข้อมูล = รอ ดึงข้อมูล("https://api.example.com/data");
    ระบบ.แสดง(ข้อมูล);
}
```

### 3.10 Modules

```thailang
// ไฟล์: คณิตศาสตร์.th

ส่งออก สูตร บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    ส่งกลับ ก + ข;
}

ส่งออก คงที่ PI = 3.14159;
```

```thailang
// ไฟล์: หลัก.th

นำเข้า { บวก, PI } จาก "./คณิตศาสตร์";

ระบบ.แสดง(บวก(1, 2));    // 3
ระบบ.แสดง(PI);            // 3.14159
```

---

## 4. Type System Design

### Inference Rules

```thailang
// Compiler เดา type จากค่าที่กำหนด
ให้ x = 42;            // → จำนวนเต็ม
ให้ y = 3.14;          // → ตัวเลข
ให้ z = "สวัสดี";       // → ข้อความ
ให้ ok = ถูก;          // → ถูกผิด
ให้ list = [1, 2, 3];  // → ชุด<จำนวนเต็ม>

// ถ้าค่า mixed → compiler บังคับให้ประกาศ
ให้ mixed: ชุด<ตัวเลข | ข้อความ> = [1, "สอง", 3];
```

### Union Types

```thailang
// รองรับ union type แบบ TypeScript
ให้ ค่า: ตัวเลข | ข้อความ = 42;
ค่า = "สวัสดี";   // OK

// Type narrowing ทำงานอัตโนมัติ
ถ้า (ค่า เป็น ข้อความ) {
    ระบบ.แสดง(ค่า.ความยาว);   // compiler รู้ว่าเป็น ข้อความ
}
```

### Generics

```thailang
สูตร แรก<ท>(รายการ: ชุด<ท>) -> ท | ว่าง {
    ถ้า (รายการ.ความยาว > 0) {
        ส่งกลับ รายการ[0];
    }
    ส่งกลับ ว่าง;
}

ให้ x = แรก([1, 2, 3]);         // → จำนวนเต็ม | ว่าง
ให้ y = แรก(["ก", "ข", "ค"]);   // → ข้อความ | ว่าง
```

---

## 5. Compiler Architecture

```
                    Thailang Compiler (Rust)
                    ═══════════════════════

  .th source ──→ [ Lexer ] ──→ Tokens
                                  │
                                  ▼
                             [ Parser ] ──→ AST
                                  │
                                  ▼
                          [ Type Checker ] ──→ Typed AST
                                  │
                                  ▼
                           [ IR Generator ] ──→ Intermediate Representation
                                  │
                        ┌─────────┼─────────┐
                        ▼         ▼         ▼
                   [ LLVM ]  [ WASM ]  [ JS Emit ]
                      │         │         │
                      ▼         ▼         ▼
                   Native    Browser    Node.js
                   Binary   (.wasm)   (.js/.mjs)
```

### Compilation Targets

| Target     | ใช้กับ                    | คำสั่ง                                 |
| --------   | -------                   | --------                               |
| **Native** | CLI tools, servers        | `thailang build หลัก.th`               |
| **WASM**   | Browser, Edge             | `thailang build หลัก.th --target wasm` |
| **JS**     | ใช้กับ Node/Bun ecosystem | `thailang build หลัก.th --target js`   |

---

## 6. CLI Design

```bash
# รัน
thailang รัน หลัก.th

# Compile
thailang build หลัก.th
thailang build หลัก.th --target wasm
thailang build หลัก.th --target js

# REPL
thailang

# สร้างโปรเจกต์ใหม่
thailang ใหม่ ชื่อโปรเจกต์

# จัดการ packages
thailang เพิ่ม ชื่อแพ็กเกจ
thailang ลบ ชื่อแพ็กเกจ

# Format & Lint
thailang จัด หลัก.th
thailang ตรวจ หลัก.th
```

---

## 7. File Extension

- `.th`: สั้น ชัดเจน ย่อมาจาก **Th**ailang และ **Th**ai

---

## 8. Standard Library (Built-in)

```thailang
// คณิตศาสตร์
คณิต.สูงสุด(1, 2, 3)        // 3
คณิต.ต่ำสุด(1, 2, 3)        // 1
คณิต.สุ่ม()                  // 0.0 - 1.0
คณิต.ปัดขึ้น(3.2)            // 4
คณิต.ปัดลง(3.8)             // 3

// ระบบ (console / I/O)
ระบบ.แสดง("สวัสดี")          // console.log("สวัสดี")

// ข้อความ
"สวัสดี".ความยาว              // 6
"สวัสดี".ตัด(0, 3)            // "สวั"
"hello".เป็นตัวใหญ่()          // "HELLO"
"a,b,c".แยก(",")             // ["a", "b", "c"]

// ชุด (array)
[3,1,2].เรียง()               // [1, 2, 3]
[1,2,3].กรอง((x) => x > 1)   // [2, 3]
[1,2,3].แปลง((x) => x * 2)   // [2, 4, 6]
[1,2,3].ลด((sum, x) => sum + x, 0) // 6
[1,2,3].มี(2)                 // ถูก

// ไฟล์ (async)
นำเข้า { อ่านไฟล์, เขียนไฟล์ } จาก "ไฟล์";
ให้ เนื้อหา = รอ อ่านไฟล์("ข้อมูล.txt");
รอ เขียนไฟล์("ผลลัพธ์.txt", เนื้อหา);

// HTTP Server
นำเข้า { สร้างเซิร์ฟเวอร์ } จาก "เน็ต";

สร้างเซิร์ฟเวอร์((ร้องขอ, ตอบกลับ) => {
    ตอบกลับ.json({ ข้อความ: "สวัสดีชาวโลก" });
}).ฟัง(3000);

ระบบ.แสดง("เซิร์ฟเวอร์ทำงานที่ port 3000");
```

---

## 9. FizzBuzz: ตัวอย่างเต็ม

```thailang
// fizzbuzz.th, โปรแกรมแรกของ Thailang

วน (ให้ i = 1; i <= 100; i += 1) {
    ถ้า (i % 15 == 0) {
        ระบบ.แสดง("FizzBuzz");
    } ไม่ก็ (i % 3 == 0) {
        ระบบ.แสดง("Fizz");
    } ไม่ก็ (i % 5 == 0) {
        ระบบ.แสดง("Buzz");
    } ไม่งั้น {
        ระบบ.แสดง(i);
    }
}
```

---

## 10. Comparison: Thailang vs Others

```
// JavaScript
let name = "Somchai";
if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Kid");
}

// TypeScript
let name: string = "Somchai";
if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Kid");
}

// Thailang
ให้ ชื่อ: ข้อความ = "สมชาย";
ถ้า (อายุ >= 18) {
    ระบบ.แสดง("ผู้ใหญ่");
} ไม่งั้น {
    ระบบ.แสดง("เด็ก");
}
```

---

## 11. Roadmap

### Phase 1: MVP (เดือน 1-3)
- [ ] Lexer + Parser ใน Rust (รองรับ keyword ไทย + Unicode)
- [ ] Type checker พื้นฐาน (inferred + explicit)
- [ ] Compile to JS (ง่ายสุด ใช้ได้เร็วสุด)
- [ ] CLI: `thailang รัน`, `thailang build --target js`
- [ ] REPL
- [ ] Web playground

### Phase 2: Type System (เดือน 3-6)
- [ ] Union types, Generics
- [ ] Type narrowing
- [ ] โครง (struct/interface)
- [ ] Standard library พื้นฐาน (คณิต, ข้อความ, ชุด, ระบบ)

### Phase 3: Native Compile (เดือน 6-12)
- [ ] LLVM backend → native binary
- [ ] WASM target
- [ ] Async runtime
- [ ] Package manager (`thailang เพิ่ม`)

### Phase 4: Ecosystem (ปีที่ 2)
- [ ] VS Code extension (syntax highlight + LSP)
- [ ] Formatter + Linter
- [ ] Documentation site (thailang.dev)
- [ ] npm interop (ใช้ npm packages ได้)

---

## 12. Project Structure

```
thailang/
├── compiler/              # Rust compiler source
│   ├── src/
│   │   ├── lexer.rs       # Tokenizer (รองรับ Unicode/Thai)
│   │   ├── parser.rs      # AST generator
│   │   ├── typeck.rs      # Type checker
│   │   ├── codegen_js.rs  # JS code generation
│   │   ├── codegen_llvm.rs # LLVM code generation (Phase 3)
│   │   └── main.rs        # CLI entry point
│   └── Cargo.toml
├── stdlib/                # Standard library
│   ├── คณิต.th
│   ├── ข้อความ.th
│   └── ไฟล์.th
├── playground/            # Web playground (React)
├── vscode-ext/            # VS Code extension
├── examples/              # ตัวอย่างโปรแกรม
│   ├── สวัสดี.th
│   ├── fizzbuzz.th
│   └── เซิร์ฟเวอร์.th
├── docs/                  # Documentation
└── README.md
```

---

*Thailang, ภาษาโปรแกรมมิงไทยตัวแรกที่ compile จริง 🚀*
*thailang.dev (coming soon)*
