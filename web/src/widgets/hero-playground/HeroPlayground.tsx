"use client";

import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TOKEN_COLOR, tokenize } from "./highlight";

interface HeroPlaygroundProps {
  initialSource: string;
  filename: string;
  fileMeta?: string;
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
  fileMeta,
}: HeroPlaygroundProps) {
  const [source, setSource] = useState(initialSource);
  const [output, setOutput] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runTimeMs, setRunTimeMs] = useState<number | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Reset when the driving sample changes (initialSource / filename).
  useEffect(() => {
    setSource(initialSource);
    setOutput(null);
    setError(null);
    setRunTimeMs(null);
  }, [initialSource]);

  useEffect(() => {
    workerRef.current = spawnWorker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  async function run() {
    if (running) return;
    if (!workerRef.current) {
      workerRef.current = spawnWorker();
    }
    const worker = workerRef.current;
    setRunning(true);
    setError(null);

    const started = performance.now();
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
    const elapsed = Math.max(1, Math.round(performance.now() - started));
    setRunTimeMs(elapsed);

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
    setRunTimeMs(null);
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
  const overlayTrailer = source.endsWith("\n") ? "\u200B" : "";
  const lineCount = useMemo(
    () => Math.max(1, source.split("\n").length),
    [source],
  );

  const statusLabel = running
    ? "compiling…"
    : error !== null
      ? "error"
      : output !== null
        ? "compiled to js · done"
        : "compiled to js · ready";

  return (
    <section className="editor" aria-label="Thailang playground editor">
      <div className="editor-chrome">
        <div className="editor-file">
          <span className="dot" aria-hidden="true" />
          <span>{filename}</span>
          {fileMeta && (
            <>
              <span className="sep" aria-hidden="true">
                ·
              </span>
              <span className="meta">{fileMeta}</span>
            </>
          )}
        </div>
        <div className="editor-actions">
          <button
            type="button"
            className="chip"
            onClick={reset}
            aria-label="Reset source"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            className="chip chip-primary"
            onClick={run}
            disabled={running}
          >
            <span className="arrow" aria-hidden="true">
              ▶
            </span>
            <span>{running ? "Running…" : "Run"}</span>
            {!running && (
              <span className="kbd" aria-hidden="true">
                ⌘↵
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="code-pane">
        <pre className="code-pane-overlay" aria-hidden="true">
          {tokens.map((t, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: tokens re-derived every render.
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
        </pre>
        <textarea
          className="code-pane-textarea"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          wrap="off"
          aria-label="Thailang source"
        />
      </div>

      <div className="output-pane">
        <div className="out-head">
          <span>output · ผลลัพธ์</span>
          <span className={`status ${error !== null ? "error" : ""}`}>
            {statusLabel}
          </span>
        </div>
        <div>
          {error !== null ? (
            <div className="line-error">{error}</div>
          ) : output === null ? (
            <div className="line-empty">กด Run หรือ ⌘↵ เพื่อเรียกใช้โปรแกรม</div>
          ) : output.length === 0 ? (
            <div className="line-empty">(no output)</div>
          ) : (
            output.map((line, i) => (
              <div
                className="line-out"
                // biome-ignore lint/suspicious/noArrayIndexKey: derived output; no stable id.
                key={i}
              >
                <span className="prompt" aria-hidden="true">
                  ▸
                </span>
                {line}
              </div>
            ))
          )}
        </div>
        <div className="meta">
          <div>
            <span className="k">cmd &nbsp;</span> $ thailang run {filename}
          </div>
          <div>
            <span className="k">time</span>{" "}
            {runTimeMs !== null ? `${runTimeMs}ms` : "--"} &nbsp;·&nbsp;{" "}
            <span className="k">lines</span> {lineCount} &nbsp;·&nbsp;{" "}
            <span className="k">target</span> js
          </div>
        </div>
      </div>
    </section>
  );
}
