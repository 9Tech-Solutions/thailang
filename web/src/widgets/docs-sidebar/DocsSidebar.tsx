"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/shared/lib/docs-nav";
import { DocsSearch } from "@/widgets/docs-search/DocsSearch";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Docs navigation"
      className="sticky top-16 flex max-h-[calc(100vh-5rem)] flex-col gap-6 overflow-y-auto pr-2 text-[13px]"
    >
      <DocsSearch />
      {docsNav.map((section) => (
        <div key={section.title} className="flex flex-col gap-1.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
            {section.title}
          </div>
          <ul className="flex flex-col">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block border-l py-1 pl-3 transition-colors ${
                      active
                        ? "border-[var(--gold)] text-[var(--fg)]"
                        : "border-transparent text-[var(--fg-muted)] hover:border-[var(--hairline-soft)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
