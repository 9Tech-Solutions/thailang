import { CodeBlock } from "@/shared/ui/CodeBlock";

const samples = [
  {
    filename: "fizzbuzz.th",
    source: `วน (ให้ i = 1; i <= 15; i += 1) {
    ถ้า (i % 15 == 0) {
        พิมพ์("FizzBuzz");
    } ไม่ก็ (i % 3 == 0) {
        พิมพ์("Fizz");
    } ไม่ก็ (i % 5 == 0) {
        พิมพ์("Buzz");
    } ไม่งั้น {
        พิมพ์(i);
    }
}`,
  },
  {
    filename: "บวก.th",
    source: `ฟังก์ชัน บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    คืน ก + ข;
}

พิมพ์(บวก(10, 20));   // → 30`,
  },
  {
    filename: "ผลไม้.th",
    source: `ให้ ผลไม้ = ["มะม่วง", "ทุเรียน", "มังคุด"];

แต่ละ (ผล ใน ผลไม้) {
    พิมพ์(ผล);
}`,
  },
] as const;

export function CodeShowcase() {
  return (
    <section className="border-b border-[var(--color-border)] py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <header className="mb-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
              ตัวอย่าง · samples
            </p>
            <h2 className="mt-5 text-[length:var(--text-display)] thai-display font-semibold leading-[1.02]">
              โค้ดที่อ่าน
              <br />
              <span className="text-[var(--color-accent)]">ออกได้ทันที</span>
            </h2>
          </div>
          <p className="col-span-12 max-w-xl text-lg text-[var(--color-fg-muted)] lg:col-span-6 lg:col-start-7 lg:self-end">
            Every keyword is Thai; every bit of syntax is recognizable. Paste
            the source into the Thailang compiler and it emits clean, readable
            JavaScript you can run anywhere Node runs — or compile to
            WebAssembly for the browser.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {samples.map((sample, i) => (
            <article
              key={sample.filename}
              className={`col-span-12 ${
                i === 0
                  ? "lg:col-span-7"
                  : i === 1
                    ? "lg:col-span-5"
                    : "lg:col-span-12"
              }`}
            >
              <div className="flex items-baseline justify-between border-b border-[var(--color-border)] pb-3 mb-3">
                <h3 className="flex items-baseline gap-3 font-mono text-sm tracking-wide text-[var(--color-fg-muted)]">
                  <span className="tabular-nums text-[var(--color-fg-subtle)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--color-fg)]">
                    {sample.filename}
                  </span>
                </h3>
              </div>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                <CodeBlock source={sample.source} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
