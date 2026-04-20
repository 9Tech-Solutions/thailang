"use client";

import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TOKEN_COLOR, tokenize } from "@/widgets/hero-playground/highlight";

interface PlaygroundEditorProps {
  source: string;
  onChange: (next: string) => void;
  filename: string;
  fileMeta?: string;
  shareState: ShareState;
  onShare: () => void;
}

export type ShareState =
  | { status: "idle" }
  | { status: "sharing" }
  | { status: "shared"; note: string }
  | { status: "too-long" }
  | { status: "error"; message: string };

type RunResult = { lines: string[] } | { error: string };

const INDENT = "    ";
const TIMEOUT_MS = 3000;

function spawnWorker(): Worker {
  return new Worker(
    new URL("@/shared/workers/run.worker.ts", import.meta.url),
    { type: "module" },
  );
}

export function PlaygroundEditor({
  source,
  onChange,
  filename,
  fileMeta,
  shareState,
  onShare,
}: PlaygroundEditorProps) {
  const [output, setOutput] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runTimeMs, setRunTimeMs] = useState<number | null>(null);
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
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = start + INDENT.length;
        el.selectionEnd = start + INDENT.length;
      });
    }
  }

  const tokens = useMemo(() => tokenize(source), [source]);
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

  const shareLabel =
    shareState.status === "sharing"
      ? "Sharing…"
      : shareState.status === "shared"
        ? "Link copied"
        : shareState.status === "too-long"
          ? "Source copied"
          : "Share";

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
            onClick={onShare}
            disabled={shareState.status === "sharing"}
            aria-label="Share snippet"
          >
            ↗ {shareLabel}
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
          onChange={(e) => onChange(e.target.value)}
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
            {shareState.status === "shared" && (
              <>
                {" "}
                &nbsp;·&nbsp; <span className="k">share</span> {shareState.note}
              </>
            )}
            {shareState.status === "too-long" && (
              <>
                {" "}
                &nbsp;·&nbsp; <span className="k">share</span> source too long,
                raw copied
              </>
            )}
            {shareState.status === "error" && (
              <>
                {" "}
                &nbsp;·&nbsp; <span className="k">share</span>{" "}
                {shareState.message}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
