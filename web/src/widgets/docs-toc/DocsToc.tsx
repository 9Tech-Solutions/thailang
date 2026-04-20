"use client";

import { useEffect, useState } from "react";
import type { DocHeading } from "@/shared/lib/docs-source";

interface DocsTocProps {
  headings: DocHeading[];
}

export function DocsToc({ headings }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 flex max-h-[calc(100vh-5rem)] flex-col gap-1.5 overflow-y-auto text-[12px]"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
        On this page
      </div>
      <ul className="flex flex-col">
        {headings.map((h) => {
          const active = activeId === h.id;
          const indent = h.depth === 2 ? 0 : h.depth === 3 ? 12 : 24;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                style={{ paddingLeft: indent }}
                className={`block border-l py-1 pr-2 transition-colors ${
                  active
                    ? "border-[var(--gold)] text-[var(--fg)]"
                    : "border-transparent text-[var(--fg-muted)] hover:border-[var(--hairline-soft)] hover:text-[var(--fg)]"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
