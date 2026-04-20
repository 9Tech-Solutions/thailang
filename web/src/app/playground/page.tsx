import type { Metadata } from "next";
import { PlaygroundView } from "@/views/playground/PlaygroundView";

export const metadata: Metadata = {
  title: "Playground · Thailang",
  description:
    "Edit, run, and share Thailang programs in the browser. Inspect the tree-sitter AST and the compiler's token stream alongside output.",
};

export default function PlaygroundPage() {
  return <PlaygroundView />;
}
