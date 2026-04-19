interface Feature {
  num: string;
  kbd: string;
  titleTh: string;
  titleEn: string;
  body: string;
}

const FEATURES: readonly Feature[] = [
  {
    num: "01",
    kbd: "rustc · compiled",
    titleTh: "คอมไพล์จริง",
    titleEn: "actually compiled",
    body: "ไม่ใช่ล่าม — เป็นคอมไพเลอร์ที่เขียนด้วย Rust จริง ๆ แปลงเป็น JavaScript และ WebAssembly ได้แล้ววันนี้ เตรียมออก native binary ผ่าน LLVM",
  },
  {
    num: "02",
    kbd: "let x: int",
    titleTh: "Type-safe แบบเลือกได้",
    titleEn: "gradually typed",
    body: "ประกาศชนิดเมื่อจำเป็น ปล่อยให้ inference ช่วยตอนที่ไม่ต้องการ รองรับ union types และ type narrowing เต็มรูปแบบ",
  },
  {
    num: "03",
    kbd: "ให้ ชื่อ",
    titleTh: "อ่านเป็นไทย",
    titleEn: "reads in Thai",
    body: "คำสงวน, stdlib, และข้อความ error เป็นภาษาไทยทั้งหมด ตั้งชื่อตัวแปรเป็นไทยได้ เพราะ JavaScript รองรับ Unicode อยู่แล้ว",
  },
  {
    num: "04",
    kbd: "node | wasm",
    titleTh: "รันได้ทุกที่",
    titleEn: "runs anywhere",
    body: "Node, browser, edge runtime — ที่ไหนรัน JavaScript หรือ WebAssembly ได้ ที่นั่นรัน Thailang ได้ ซอร์สเดียว หลายเป้าหมาย",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="features" id="why">
      <div className="wrap">
        <div className="features-head">
          <div className="left">
            <p className="kicker">ทำไม Thailang · why</p>
            <h2>
              ภาษาไทย <span className="script">กับ</span>
              <br />
              toolchain <span className="gold">ที่คุ้นเคย</span>
            </h2>
          </div>
          <div className="right">
            <p>
              Thailang ไม่ใช่ภาษาของเล่น — คอมไพเลอร์ของจริงที่เขียนด้วย Rust,
              ระบบชนิดข้อมูลแบบ gradual, แปลงเป็น JS / WASM ได้วันนี้ วางเป้าไปที่ native
              ผ่าน LLVM — ทั้งหมดเพื่อให้คนไทยเขียนโค้ดด้วยภาษาของตัวเองได้
              โดยไม่ต้องทิ้งเครื่องมือที่ใช้อยู่
            </p>
          </div>
        </div>

        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article className="feat" key={f.num}>
              <div className="seq">
                <span className="num">{f.num}</span>
                {f.kbd}
              </div>
              <h3>
                {f.titleTh}
                <span className="en">{f.titleEn}</span>
              </h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
