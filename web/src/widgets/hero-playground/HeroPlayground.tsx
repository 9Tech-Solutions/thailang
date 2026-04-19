"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { TOKEN_COLOR, tokenize } from "./highlight";

interface HeroPlaygroundProps {
  initialSource: string;
  filename: string;
}

type RunResult = { lines: string[] } | { error: string };

const INDENT = "    ";
const TIMEOUT_MS = 3000;

function spawnWorker(): Worker {
  return new Worker(new URL("./run.worker.ts", import.meta.url), {
    type: "module",
  });
}

export function HeroPlayground({
  initialSource,
  filename,
}: HeroPlaygroundProps) {
  const [source, setSource] = useState(initialSource);
  const [output, setOutput] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = spawnWorker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  async function run() {
    if (running) return;
    // Respawn if a previous run's timeout terminated the worker.
    if (!workerRef.current) {
      workerRef.current = spawnWorker();
    }
    const worker = workerRef.current;
    setRunning(true);
    setError(null);

    const result = await new Promise<RunResult>((resolve) => {
      const timeout = setTimeout(() => {
        worker.terminate();
        workerRef.current = null;
        resolve({
          error: `Execution timed out (${TIMEOUT_MS / 1000}s limit). Check for an infinite loop.`,
        });
      }, TIMEOUT_MS);

      const onMessage = (e: MessageEvent<RunResult>) => {
        clearTimeout(timeout);
        worker.removeEventListener("message", onMessage);
        resolve(e.data);
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage(source);
    });

    if ("error" in result) {
      setError(result.error);
      setOutput(null);
    } else {
      setOutput(result.lines);
      setError(null);
    }
    setRunning(false);
  }

  function reset() {
    setSource(initialSource);
    setOutput(null);
    setError(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      run();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = source.slice(0, start) + INDENT + source.slice(end);
      setSource(next);
      requestAnimationFrame(() => {
        el.selectionStart = start + INDENT.length;
        el.selectionEnd = start + INDENT.length;
      });
    }
  }

  const tokens = tokenize(source);
  // Trailing newline keeps the overlay height in sync with a final blank line
  // the user just typed, <pre> needs something after the trailing \n to include it.
  const overlayTrailer = source.endsWith("\n") ? "\u200B" : "";

  return (
    <figure className="group relative">
      <figcaption className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 text-xs tracking-wide text-[var(--color-fg-muted)]">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-[var(--color-accent)]/40" />
          <code className="font-mono">{filename}</code>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-[var(--color-fg-subtle)] transition hover:text-[var(--color-fg)]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-[var(--color-bg)] transition hover:bg-[var(--color-accent-deep)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0"
          >
            <span aria-hidden>▶</span>
            <span>{running ? "Running…" : "Run"}</span>
          </button>
        </div>
      </figcaption>

      <div className="relative font-mono text-[0.875rem] leading-[1.45]">
        <pre
          aria-hidden
          className="pointer-events-none m-0 whitespace-pre px-4 pt-1 pb-4 text-[var(--color-fg)]"
        >
          <code>
            {tokens.map((t, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: tokens are re-derived every render, index is stable for this frame.
                key={i}
                style={{
                  color: TOKEN_COLOR[t.kind],
                  fontStyle: t.kind === "comment" ? "italic" : undefined,
                }}
              >
                {t.text}
              </span>
            ))}
            {overlayTrailer}
          </code>
        </pre>
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          wrap="off"
          aria-label="Thailang source"
          className="absolute inset-0 block w-full resize-none overflow-hidden whitespace-pre bg-transparent px-4 pt-1 pb-4 font-mono text-[0.875rem] leading-[1.45] text-transparent caret-[var(--color-accent)] focus:outline-none"
        />
      </div>

      {(output !== null || error !== null) && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-3">
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
            output
          </p>
          {error !== null ? (
            <pre className="whitespace-pre-wrap font-mono text-[0.875rem] leading-[1.45] text-[var(--color-accent)]">
              {error}
            </pre>
          ) : output && output.length > 0 ? (
            <pre className="whitespace-pre-wrap font-mono text-[0.875rem] leading-[1.45] text-[var(--color-fg)]">
              {output.join("\n")}
            </pre>
          ) : (
            <p className="font-mono text-[0.875rem] text-[var(--color-fg-subtle)]">
              (no output)
            </p>
          )}
        </div>
      )}
    </figure>
  );
}
