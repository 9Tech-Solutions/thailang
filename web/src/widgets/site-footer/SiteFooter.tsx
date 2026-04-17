import { navLinks, site } from "@/shared/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-fg)] text-[var(--color-bg)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 py-16 lg:px-12 lg:py-24">
        <div className="col-span-12 lg:col-span-5">
          <p className="thai-display text-[length:var(--text-display)] font-light leading-[0.95]">
            {site.name}
            <span className="text-[var(--color-accent)]">.</span>
          </p>
          <p className="mt-3 text-sm text-[var(--color-bg)]/60">
            {site.tagline}
          </p>
        </div>

        <nav
          className="col-span-6 lg:col-span-3 lg:col-start-8"
          aria-label="Footer navigation"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-bg)]/40">
            Resources
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-2 text-[var(--color-bg)]/80 transition hover:text-[var(--color-accent)]"
                >
                  {link.label}
                  {link.status === "soon" && (
                    <span className="rounded-full border border-[var(--color-bg)]/20 px-1.5 py-0.5 text-[0.625rem] uppercase tracking-wider text-[var(--color-bg)]/40">
                      soon
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-bg)]/40">
            เวอร์ชัน
          </p>
          <p className="mt-4 font-mono text-sm text-[var(--color-bg)]/80">
            v{site.version}
          </p>
          <p className="mt-1 text-xs text-[var(--color-bg)]/40">
            preview · not stable
          </p>
        </div>

        <div className="col-span-12 mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--color-bg)]/10 pt-6">
          <p className="text-xs text-[var(--color-bg)]/40">
            MIT License · Built in Thailand · Compiler in Rust, landing in
            Next.js
          </p>
          <p className="thai-display text-xs text-[var(--color-bg)]/40">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
