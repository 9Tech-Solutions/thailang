"use client";

import { useEffect, useState } from "react";
import type { Node as SyntaxNode } from "web-tree-sitter";
import { getParser } from "@/shared/lib/tree-sitter-loader";
import { useDebouncedValue } from "@/shared/lib/use-debounced";

interface AstNode {
  type: string;
  text: string;
  isError: boolean;
  isNamed: boolean;
  startRow: number;
  startCol: number;
  children: AstNode[];
}

const MAX_TEXT_LEN = 48;

function extractTree(node: SyntaxNode, includeAnonymous: boolean): AstNode {
  const rawText = node.text ?? "";
  const firstLine = rawText.split("\n")[0];
  const text =
    firstLine.length > MAX_TEXT_LEN
      ? `${firstLine.slice(0, MAX_TEXT_LEN)}…`
      : firstLine;

  const source = includeAnonymous ? node.children : node.namedChildren;
  const children: AstNode[] = [];
  for (const child of source) {
    if (child) children.push(extractTree(child, includeAnonymous));
  }

  return {
    type: node.type,
    text,
    isError: node.isError,
    isNamed: node.isNamed,
    startRow: node.startPosition.row,
    startCol: node.startPosition.column,
    children,
  };
}

interface Props {
  source: string;
}

type AstState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; root: AstNode }
  | { status: "error"; message: string };

export function AstPanel({ source }: Props) {
  const debounced = useDebouncedValue(source, 200);
  const [showAnonymous, setShowAnonymous] = useState(false);
  const [state, setState] = useState<AstState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState((prev) =>
      prev.status === "ready" ? prev : { status: "loading" },
    );

    (async () => {
      try {
        const parser = await getParser();
        if (cancelled) return;
        const tree = parser.parse(debounced);
        if (cancelled) {
          tree?.delete();
          return;
        }
        if (!tree) {
          setState({ status: "error", message: "parser returned no tree" });
          return;
        }
        const root = extractTree(tree.rootNode, showAnonymous);
        tree.delete();
        setState({ status: "ready", root });
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
  }, [debounced, showAnonymous]);

  return (
    <div className="flex h-full flex-col font-mono text-[12px] leading-[1.55]">
      <div className="flex items-center justify-between border-b border-[var(--hairline-soft)] px-3 py-2">
        <span className="text-[var(--fg-subtle)]">tree-sitter</span>
        <label className="flex items-center gap-1.5 text-[11px] text-[var(--fg-subtle)]">
          <input
            type="checkbox"
            checked={showAnonymous}
            onChange={(e) => setShowAnonymous(e.target.checked)}
            className="accent-[var(--gold)]"
          />
          show tokens
        </label>
      </div>
      <div className="flex-1 overflow-auto px-3 py-2">
        {state.status === "loading" || state.status === "idle" ? (
          <div className="text-[var(--fg-subtle)]">กำลังแยกวิเคราะห์…</div>
        ) : state.status === "error" ? (
          <div className="text-[var(--chili)]">ast error: {state.message}</div>
        ) : (
          <TreeNode node={state.root} depth={0} />
        )}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: AstNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 3);
  const hasChildren = node.children.length > 0;

  const typeColor = node.isError
    ? "text-[var(--chili)]"
    : node.isNamed
      ? "text-[var(--gold)]"
      : "text-[var(--fg-subtle)]";

  return (
    <div style={{ paddingLeft: depth === 0 ? 0 : 12 }}>
      <button
        type="button"
        className="flex w-full items-baseline gap-2 text-left hover:bg-[var(--bg-panel)]"
        onClick={() => hasChildren && setOpen(!open)}
      >
        <span className="w-3 text-[var(--fg-subtle)]">
          {hasChildren ? (open ? "▾" : "▸") : " "}
        </span>
        <span className={typeColor}>{node.type}</span>
        <span className="text-[var(--fg-subtle)]">
          [{node.startRow}:{node.startCol}]
        </span>
        {node.text && !hasChildren && (
          <span className="truncate text-[var(--fg-muted)]">“{node.text}”</span>
        )}
      </button>
      {open &&
        hasChildren &&
        node.children.map((child, i) => (
          <TreeNode key={`${child.type}-${i}`} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}
