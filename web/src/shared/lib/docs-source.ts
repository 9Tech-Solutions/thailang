import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = resolve(here, "../../../../docs");

export interface DocPage {
  slug: string[];
  href: string;
  filePath: string;
  title: string;
  subtitle: string | null;
  source: string;
}

export interface DocHeading {
  id: string;
  text: string;
  depth: number;
}

function slugToFilePath(slug: string[] | undefined): string | null {
  const parts = slug ?? [];
  if (parts.length === 0) return join(DOCS_ROOT, "SPEC.md");
  if (parts.length === 1) {
    const [first] = parts;
    if (first === "spec") return join(DOCS_ROOT, "SPEC.md");
    if (first === "keywords") return join(DOCS_ROOT, "keywords", "README.md");
    return null;
  }
  if (parts.length === 2 && parts[0] === "keywords") {
    return join(DOCS_ROOT, "keywords", `${parts[1]}.md`);
  }
  return null;
}

function extractTitle(source: string): {
  title: string;
  subtitle: string | null;
} {
  const lines = source.split("\n");
  let title = "Thailang";
  let subtitle: string | null = null;
  for (const line of lines) {
    const m = /^#\s+(.+)$/.exec(line.trim());
    if (m) {
      title = m[1]
        .replace(/^[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}]+\s*/u, "")
        .trim();
      break;
    }
  }
  for (const line of lines) {
    const m = /^>\s*\*\*(.+?)\*\*/.exec(line.trim());
    if (m) {
      subtitle = m[1];
      break;
    }
  }
  return { title, subtitle };
}

export async function getDocPage(
  slug: string[] | undefined,
): Promise<DocPage | null> {
  const filePath = slugToFilePath(slug);
  if (!filePath) return null;
  let source: string;
  try {
    source = await readFile(filePath, "utf8");
  } catch {
    return null;
  }
  const { title, subtitle } = extractTitle(source);
  const href = slug?.length ? `/docs/${slug.join("/")}` : "/docs";
  return { slug: slug ?? [], href, filePath, title, subtitle, source };
}

const slugifyCache = new Map<string, string>();

export function slugify(text: string): string {
  const cached = slugifyCache.get(text);
  if (cached) return cached;
  const slug = text
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  slugifyCache.set(text, slug);
  return slug;
}

export function extractHeadings(source: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const lines = source.split("\n");
  let inCodeFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;
    const m = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2].replace(/\s*\{#[^}]+\}\s*$/, "").trim();
    headings.push({ id: slugify(text), text, depth });
  }
  return headings;
}

export async function listAllDocPaths(): Promise<Array<{ slug: string[] }>> {
  const paths: Array<{ slug: string[] }> = [
    { slug: [] },
    { slug: ["keywords"] },
  ];
  const keywordsDir = join(DOCS_ROOT, "keywords");
  const entries = await readdir(keywordsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".md")) continue;
    if (entry.name === "README.md") continue;
    const name = entry.name.replace(/\.md$/, "");
    paths.push({ slug: ["keywords", name] });
  }
  return paths;
}

export { DOCS_ROOT };
