import { site } from "@/shared/config/site";
import { HeroPlayground } from "@/widgets/hero-playground/HeroPlayground";

const heroSample = `// สวัสดี.th
ฟังก์ชัน ทักทาย(ชื่อ: ข้อความ) {
    คืน "สวัสดี " + ชื่อ + "!";
}

พิมพ์(ทักทาย("ชาวโลก"));`;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      {/* Asymmetric grid, title bleeds right, meta sits top-left */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 pt-8 pb-12 lg:px-12 lg:pt-12 lg:pb-20">
        {/* Meta rail */}
        <aside className="col-span-12 lg:col-span-3 reveal">
          <div className="flex flex-col gap-6 border-l border-[var(--color-border)] pl-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                Volume 01
              </p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Thai-first programming, v{site.version}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                เวอร์ชัน
              </p>
              <p className="mt-1 font-mono text-sm text-[var(--color-fg)]">
                {site.version} · preview
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                Backends
              </p>
              <ul className="mt-1 space-y-0.5 text-sm text-[var(--color-fg-muted)]">
                <li>↳ JavaScript (today)</li>
                <li>↳ WebAssembly (today)</li>
                <li className="text-[var(--color-fg-subtle)]">
                  ↳ LLVM native (soon)
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Headline, Thai display, massive */}
        <div className="col-span-12 lg:col-span-9 reveal reveal-d1">
          <h1 className="thai-display leading-[1.05] text-balance">
            <span className="block text-[length:var(--text-hero-th)] font-semibold tracking-tight">
              เขียนเป็นไทย
            </span>
            <span className="block text-[length:var(--text-hero-th)] font-light italic tracking-tight text-[var(--color-accent)]">
              รันเหมือน Rust
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
            Thailang is a{" "}
            <em className="not-italic text-[var(--color-fg)]">compiled</em>{" "}
            programming language with{" "}
            <span className="text-[var(--color-fg)]">Thai keywords</span>,
            TypeScript-flavored syntax, and a Rust compiler that emits
            JavaScript, WebAssembly, and (soon) native binaries. Built for
            Thai developers who want their code to read in their own language
            without giving up the tooling they already know.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 reveal reveal-d2">
            <a
              href={site.repo}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-accent)] hover:translate-y-[-1px]"
            >
              <span>View on GitHub</span>
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <span
              aria-disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm text-[var(--color-fg-subtle)]"
              title="Coming in a later session"
            >
              <span>Try the playground</span>
              <span className="text-xs uppercase tracking-wider text-[var(--color-accent)]">
                soon
              </span>
            </span>
          </div>
        </div>

        {/* Oversized code sample, breaks grid, floats into negative margin */}
        <div className="col-span-12 lg:col-span-9 lg:col-start-3 reveal reveal-d3">
          <div className="relative mt-8 lg:mt-10">
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[2rem] bg-[var(--color-accent-soft)] opacity-60 blur-2xl"
            />
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_1px_0_0_var(--color-border),0_30px_60px_-20px_oklch(0%_0_0_/_0.08)]">
              <HeroPlayground initialSource={heroSample} filename="สวัสดี.th" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
