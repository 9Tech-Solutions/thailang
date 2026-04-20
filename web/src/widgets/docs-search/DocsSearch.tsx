"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PagefindSubResult {
  url: string;
  title?: string;
  excerpt: string;
}

interface PagefindResultData {
  url: string;
  meta?: { title?: string };
  excerpt: string;
  sub_results?: PagefindSubResult[];
}

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
  results: PagefindResult[];
}

interface PagefindApi {
  search: (query: string) => Promise<PagefindSearchResponse>;
}

interface DisplayResult {
  url: string;
  title: string;
  excerpt: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

let pagefindPromise: Promise<PagefindApi> | null = null;

function loadPagefind(): Promise<PagefindApi> {
  if (!pagefindPromise) {
    // Hide the specifier from the bundler's static analyzer: pagefind is
    // served from /pagefind/pagefind.js at runtime, not resolvable as a module.
    const path = "/pagefind/pagefind.js";
    pagefindPromise = (
      import(
        /* @vite-ignore */ /* webpackIgnore: true */ path
      ) as Promise<PagefindApi>
    ).catch((err) => {
      pagefindPromise = null;
      throw err;
    });
  }
  return pagefindPromise;
}

export function DocsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DisplayResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const pf = await loadPagefind();
        if (cancelled) return;
        const search = await pf.search(query);
        const top = await Promise.all(
          search.results.slice(0, 8).map((r) => r.data()),
        );
        if (cancelled) return;
        setResults(
          top.map((d) => ({
            url: d.url,
            title: d.meta?.title ?? d.url,
            excerpt: stripHtml(d.excerpt),
          })),
        );
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <label className="relative block">
        <span className="sr-only">Search docs</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเอกสาร · Search"
          className="w-full rounded-[var(--radius)] border border-[var(--hairline-soft)] bg-[var(--bg-panel)] px-3 py-1.5 font-mono text-[12px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:border-[var(--gold)] focus:outline-none"
        />
      </label>
      {error && (
        <div className="text-[11px] text-[var(--chili)]">search: {error}</div>
      )}
      {loading && (
        <div className="text-[11px] text-[var(--fg-subtle)]">กำลังค้นหา…</div>
      )}
      {results.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-[var(--radius)] border border-[var(--hairline-soft)] bg-[var(--bg-panel)] p-2 text-[12px]">
          {results.map((r) => (
            <li key={r.url}>
              <Link
                href={r.url}
                onClick={() => setQuery("")}
                className="block rounded-[var(--radius)] px-2 py-1 hover:bg-[var(--bg)]"
              >
                <div className="text-[var(--fg)]">{r.title}</div>
                <div className="line-clamp-2 text-[11px] text-[var(--fg-subtle)]">
                  {r.excerpt}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
