"use client";

import { useState } from "react";
import { HeroPlayground } from "@/widgets/hero-playground/HeroPlayground";

interface Sample {
  file: string;
  meta: string;
  source: string;
}

// Source of truth for the sample suite — mirrors examples/*.th after the
// post-rename keyword updates (สูตร, ส่งกลับ, ระบบ.แสดง, ระหว่างที่, ...).
const SAMPLES: readonly Sample[] = [
  {
    file: "สวัสดี.th",
    meta: "hello world",
    source: `// สวัสดี.th — the classic
ระบบ.แสดง("สวัสดีชาวโลก!");`,
  },
  {
    file: "บวก.th",
    meta: "typed function",
    source: `// บวก.th — typed arithmetic
สูตร บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    ส่งกลับ ก + ข;
}

ระบบ.แสดง(บวก(10, 20));
ระบบ.แสดง(บวก(100, 200));`,
  },
  {
    file: "ผลไม้.th",
    meta: "arrays & for-each",
    source: `// ผลไม้.th — fruit market
ให้ ผลไม้ = ["มะม่วง", "ทุเรียน", "มังคุด"];

แต่ละ (ผล ใน ผลไม้) {
    ระบบ.แสดง(ผล);
}`,
  },
  {
    file: "fizzbuzz.th",
    meta: "control flow",
    source: `// fizzbuzz.th — classic control flow
วน (ให้ i = 1; i <= 15; i += 1) {
    ถ้า (i % 15 == 0) {
        ระบบ.แสดง("FizzBuzz");
    } ไม่ก็ (i % 3 == 0) {
        ระบบ.แสดง("Fizz");
    } ไม่ก็ (i % 5 == 0) {
        ระบบ.แสดง("Buzz");
    } ไม่งั้น {
        ระบบ.แสดง(i);
    }
}`,
  },
] as const;

export function PlaygroundSection() {
  const [active, setActive] = useState(0);
  const sample = SAMPLES[active];

  return (
    <section className="playground-section" id="playground">
      <span className="marker" aria-hidden="true" />
      <div className="wrap play-wrap">
        <div className="play-head">
          <div>
            <p className="kicker">ลองเขียนดู · try a sample</p>
            <h2 className="title">
              โค้ดที่อ่าน<em>ออกทันที</em>
            </h2>
          </div>
          <p>
            ทุกคำสงวนเป็นภาษาไทย โครงสร้างไวยากรณ์คล้าย TypeScript เลือกแท็บด้านบนเพื่อดูว่า
            Thailang คอมไพล์ออกมาเป็นอะไร — กด Run เพื่อรันจริงใน browser ผ่าน
            WebAssembly
          </p>
        </div>

        <div className="sample-tabs-top" role="tablist" aria-label="Samples">
          {SAMPLES.map((s, i) => (
            <button
              type="button"
              key={s.file}
              role="tab"
              aria-selected={i === active}
              className={`sample-tab ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="tab-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.file}
            </button>
          ))}
        </div>

        <HeroPlayground
          // Remount on tab switch so internal state resets cleanly.
          key={sample.file}
          initialSource={sample.source}
          filename={sample.file}
          fileMeta={sample.meta}
        />
      </div>
    </section>
  );
}
