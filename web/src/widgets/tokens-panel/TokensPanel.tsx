"use client";

import initPlayground, { tokenizeToJson } from "playground-wasm/web";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/shared/lib/use-debounced";

interface CompilerToken {
  kind: string;
  start: number;
  end: number;
  lexeme: string;
}

let initPromise: Promise<void> | null = null;
function ensurePlaygroundWasm(): Promise<void> {
  if (!initPromise) {
    initPromise = initPlayground().then(() => undefined);
  }
  return initPromise;
}

interface Props {
  source: string;
}

type TokensState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; tokens: CompilerToken[] }
  | { status: "error"; message: string };

export function TokensPanel({ source }: Props) {
  const debounced = useDebouncedValue(source, 200);
  const [state, setState] = useState<TokensState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState((prev) =>
      prev.status === "ready" ? prev : { status: "loading" },
    );

    (async () => {
      try {
        await ensurePlaygroundWasm();
        if (cancelled) return;
        const json = tokenizeToJson(debounced);
        const tokens = JSON.parse(json) as CompilerToken[];
        if (cancelled) return;
        setState({ status: "ready", tokens });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <div className="flex h-full flex-col font-mono text-[12px] leading-[1.55]">
      <div className="flex items-center justify-between border-b border-[var(--hairline-soft)] px-3 py-2">
        <span className="text-[var(--fg-subtle)]">thailang-lexer</span>
        {state.status === "ready" && (
          <span className="text-[11px] text-[var(--fg-subtle)]">
            {state.tokens.length} tokens
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto px-3 py-2">
        {state.status === "loading" || state.status === "idle" ? (
          <div className="text-[var(--fg-subtle)]">กำลังแยกคำ…</div>
        ) : state.status === "error" ? (
          <div className="text-[var(--chili)]">
            tokens error: {state.message}
          </div>
        ) : state.tokens.length === 0 ? (
          <div className="text-[var(--fg-subtle)]">(empty source)</div>
        ) : (
          <table className="w-full border-separate border-spacing-y-0.5">
            <tbody>
              {state.tokens.map((t, i) => (
                <tr
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional
                  key={i}
                  className="hover:bg-[var(--bg-panel)]"
                >
                  <td className="pr-3 text-[var(--gold)]">{t.kind}</td>
                  <td className="pr-3 text-[var(--fg-muted)]">
                    {t.lexeme === "" ? "" : `“${t.lexeme}”`}
                  </td>
                  <td className="text-right text-[var(--fg-subtle)]">
                    {t.start}:{t.end}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
