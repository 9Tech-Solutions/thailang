interface Feature {
  titleTh: string;
  title: string;
  body: string;
  kbd: string;
}

const features: readonly Feature[] = [
  {
    titleTh: "คอมไพล์จริง",
    title: "Actually compiled",
    body: "Not an interpreter. A real Rust compiler emits JavaScript and WebAssembly today; native LLVM binaries on the roadmap.",
    kbd: "rustc",
  },
  {
    titleTh: "Type-safe แต่ไม่บังคับ",
    title: "Gradually typed",
    body: "Declare types where they help; skip them where they don't. Inference fills in the rest. Union types and narrowing included.",
    kbd: "let x: int",
  },
  {
    titleTh: "อ่านเป็นไทย",
    title: "Reads in Thai",
    body: "Keywords, stdlib, errors, everything in Thai. Your variable names can be Thai too. JavaScript supports the characters natively.",
    kbd: "ให้ ชื่อ",
  },
  {
    titleTh: "รันได้ทุกที่",
    title: "Runs anywhere",
    body: "Node, browser, edge, wherever JavaScript or WebAssembly runs, Thailang runs. One source, many targets.",
    kbd: "node | wasm",
  },
];

export function FeatureStrip() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
            ทำไม Thailang · why
          </p>
          <h2 className="mt-5 text-[length:var(--text-display)] thai-display font-semibold leading-[1.02]">
            ภาษาไทย{" "}
            <em className="italic font-light not-italic text-[var(--color-accent)]">
              กับ
            </em>{" "}
            toolchain
            <br />
            ที่คุณคุ้นเคย
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="col-span-12 border-t border-[var(--color-border)] pt-6 md:col-span-6 lg:col-span-3"
            >
              <p className="font-mono text-xs tracking-wide text-[var(--color-accent-deep)]">
                <span className="text-[var(--color-fg-subtle)] mr-2 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.kbd}
              </p>
              <h3 className="thai-display mt-4 text-2xl font-semibold leading-tight">
                {f.titleTh}
              </h3>
              <p className="mt-1 text-sm uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {f.title}
              </p>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
