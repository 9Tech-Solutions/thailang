"use client";

import { useEffect, useState } from "react";
import { buildShareUrl, decodeFromHash } from "@/shared/lib/share-url";
import { AstPanel } from "@/widgets/ast-panel/AstPanel";
import {
  PlaygroundEditor,
  type ShareState,
} from "@/widgets/playground-editor/PlaygroundEditor";
import { TokensPanel } from "@/widgets/tokens-panel/TokensPanel";

const DEFAULT_SOURCE = `// playground.th ,fizzbuzz, 15 iterations
วน (ให้ i = 1; i <= 15; i += 1) {
    ถ้า (i % 15 == 0) {
        ระบบ.แสดง("FizzBuzz");
    } ไม่ก็ (i % 3 == 0) {
        ระบบ.แสดง("Fizz");
    } ไม่ก็ (i % 5 == 0) {
        ระบบ.แสดง("Buzz");
    } ไม่งั้น {
        ระบบ.แสดง(i);
    }
}`;

type Tab = "ast" | "tokens";

export function PlaygroundView() {
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>("ast");
  const [shareState, setShareState] = useState<ShareState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const decoded = await decodeFromHash(window.location.hash);
      if (cancelled) return;
      if (decoded !== null) setSource(decoded);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSourceChange(next: string) {
    setSource(next);
    setShareState({ status: "idle" });
  }

  async function handleShare() {
    setShareState({ status: "sharing" });
    try {
      const url = await buildShareUrl(source);
      if (url === null) {
        try {
          await navigator.clipboard.writeText(source);
        } catch {}
        setShareState({ status: "too-long" });
        return;
      }
      history.replaceState(null, "", url);
      try {
        await navigator.clipboard.writeText(url);
      } catch {}
      setShareState({ status: "shared", note: "link copied" });
    } catch (err) {
      setShareState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--fg)]">
      <header className="border-b border-[var(--hairline-soft)] px-6 py-4">
        <div className="mx-auto flex max-w-[var(--max-w)] items-center justify-between">
          <a
            href="/"
            className="font-display text-[20px] tracking-wide text-[var(--gold)] hover:text-[var(--gold-soft)]"
          >
            Thailang
          </a>
          <div className="text-[12px] text-[var(--fg-subtle)]">
            playground · ลานทดลอง
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[var(--max-w)] px-6 py-8">
        {!hydrated ? (
          <div className="text-[var(--fg-subtle)]">กำลังโหลด…</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <PlaygroundEditor
              source={source}
              onChange={handleSourceChange}
              filename="playground.th"
              fileMeta="try it"
              shareState={shareState}
              onShare={handleShare}
            />

            <aside
              className="flex min-h-[520px] flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--hairline-soft)] bg-[var(--bg-panel)]"
              aria-label="Parse panels"
            >
              <div
                role="tablist"
                aria-label="Panel view"
                className="flex border-b border-[var(--hairline-soft)] bg-[var(--bg)]"
              >
                <TabButton
                  active={tab === "ast"}
                  onClick={() => setTab("ast")}
                  label="AST"
                  sub="tree-sitter"
                />
                <TabButton
                  active={tab === "tokens"}
                  onClick={() => setTab("tokens")}
                  label="Tokens"
                  sub="lexer"
                />
              </div>
              <div className="min-h-0 flex-1">
                {tab === "ast" ? (
                  <AstPanel source={source} />
                ) : (
                  <TokensPanel source={source} />
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}

function TabButton({ active, onClick, label, sub }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex flex-1 flex-col items-start gap-0.5 border-r border-[var(--hairline-soft)] px-4 py-2 text-left last:border-r-0 ${
        active
          ? "bg-[var(--bg-panel)] text-[var(--fg)]"
          : "text-[var(--fg-subtle)] hover:bg-[var(--bg-panel)]/40"
      }`}
    >
      <span className="text-[13px] font-medium">{label}</span>
      <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--fg-subtle)]">
        {sub}
      </span>
    </button>
  );
}
