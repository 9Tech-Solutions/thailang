import { highlight, type Token } from '@/shared/lib/syntax';

const tokenClass: Record<Token['kind'], string> = {
  keyword: 'text-[var(--color-accent)] font-medium',
  type: 'text-[var(--color-type)]',
  string: 'text-[var(--color-string)]',
  number: 'text-[var(--color-number)]',
  comment: 'text-[var(--color-comment)] italic',
  punct: 'text-[var(--color-punct)]',
  ident: 'text-[var(--color-ident)]',
  whitespace: '',
};

interface CodeBlockProps {
  source: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ source, filename, className }: CodeBlockProps) {
  const tokens = highlight(source);

  return (
    <figure className={`group relative ${className ?? ''}`}>
      {filename && (
        <figcaption className="flex items-center gap-2 px-5 pt-4 pb-0 text-xs tracking-wide text-[var(--color-fg-muted)]">
          <span className="inline-block size-2 rounded-full bg-[var(--color-accent)]/40" />
          <code className="font-mono">{filename}</code>
        </figcaption>
      )}
      <pre className="overflow-x-auto px-5 pb-5 pt-3 text-[0.95rem] leading-[1.75] font-mono">
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={tokenClass[t.kind]}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
