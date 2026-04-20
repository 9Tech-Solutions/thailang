import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import {
  type DocHeading,
  type DocPage,
  extractHeadings,
} from "@/shared/lib/docs-source";
import {
  getHighlighter,
  THAILANG_LANG,
  THAILANG_THEME,
} from "@/shared/lib/shiki";
import { DocsSidebar } from "@/widgets/docs-sidebar/DocsSidebar";
import { DocsToc } from "@/widgets/docs-toc/DocsToc";
import styles from "./DocsView.module.css";

interface DocsViewProps {
  page: DocPage;
}

export async function DocsView({ page }: DocsViewProps) {
  const highlighter = await getHighlighter();
  const headings: DocHeading[] = extractHeadings(page.source);

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--fg)]">
      <header className="sticky top-0 z-10 border-b border-[var(--hairline-soft)] bg-[var(--bg-deep)]/80 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[var(--max-w)] items-center justify-between">
          <Link
            href="/"
            className="font-display text-[18px] tracking-wide text-[var(--gold)] hover:text-[var(--gold-soft)]"
          >
            Thailang
          </Link>
          <div className="flex items-center gap-4 text-[12px] text-[var(--fg-subtle)]">
            <Link href="/playground" className="hover:text-[var(--fg)]">
              playground
            </Link>
            <span>docs · เอกสาร</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside className="hidden lg:block">
          <DocsSidebar />
        </aside>

        <main className="min-w-0">
          <article>
            <header className="mb-8 border-b border-[var(--hairline-soft)] pb-6">
              <h1 className="font-display text-[36px] leading-[1.1] text-[var(--fg)]">
                {page.title}
              </h1>
              {page.subtitle && (
                <p className="mt-2 text-[14px] text-[var(--fg-muted)]">
                  {page.subtitle}
                </p>
              )}
            </header>

            <div className={styles.content}>
              <MDXRemote
                source={page.source}
                options={{
                  mdxOptions: {
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "wrap",
                          properties: {
                            className: ["heading-anchor"],
                          },
                        },
                      ],
                      [
                        rehypeShikiFromHighlighter,
                        highlighter,
                        {
                          theme: THAILANG_THEME,
                          defaultLanguage: THAILANG_LANG,
                          fallbackLanguage: THAILANG_LANG,
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>
          </article>
        </main>

        <aside className="hidden lg:block">
          <DocsToc headings={headings} />
        </aside>
      </div>
    </div>
  );
}
