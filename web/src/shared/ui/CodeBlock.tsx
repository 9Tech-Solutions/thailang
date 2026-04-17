import { highlightToHtml } from "@/shared/lib/shiki";

interface CodeBlockProps {
  source: string;
  filename?: string;
  className?: string;
}

export async function CodeBlock({
  source,
  filename,
  className,
}: CodeBlockProps) {
  const html = await highlightToHtml(source);

  return (
    <figure className={`group relative ${className ?? ""}`}>
      {filename && (
        <figcaption className="flex items-center gap-2 px-4 pt-3 pb-0 text-xs tracking-wide text-[var(--color-fg-muted)]">
          <span className="inline-block size-2 rounded-full bg-[var(--color-accent)]/40" />
          <code className="font-mono">{filename}</code>
        </figcaption>
      )}
      <div
        className="thailang-code overflow-x-auto px-4 pb-4 pt-2 text-[0.875rem] leading-[1.45] font-mono"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is produced server-side by our highlighter over trusted static source strings.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
