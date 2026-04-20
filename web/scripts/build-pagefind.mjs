import { readdir, readFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as pagefind from "pagefind";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, "..");
const repoRoot = resolve(webRoot, "..");
const docsRoot = join(repoRoot, "docs");
const outputPath = join(webRoot, "public", "pagefind");

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s*/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractTitle(md) {
  for (const line of md.split("\n")) {
    const m = /^#\s+(.+)$/.exec(line.trim());
    if (m)
      return m[1]
        .replace(/^[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}]+\s*/u, "")
        .trim();
  }
  return "Thailang";
}

async function collectPages() {
  const pages = [];
  pages.push({
    url: "/docs",
    source: await readFile(join(docsRoot, "SPEC.md"), "utf8"),
  });
  pages.push({
    url: "/docs/keywords",
    source: await readFile(join(docsRoot, "keywords", "README.md"), "utf8"),
  });
  const kwDir = join(docsRoot, "keywords");
  const entries = await readdir(kwDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name === "README.md") continue;
    const name = entry.name.replace(/\.md$/, "");
    pages.push({
      url: `/docs/keywords/${name}`,
      source: await readFile(join(kwDir, entry.name), "utf8"),
    });
  }
  return pages;
}

async function main() {
  await rm(outputPath, { recursive: true, force: true });
  const { errors, index } = await pagefind.createIndex({
    forceLanguage: "th",
  });
  if (errors?.length) {
    for (const e of errors) console.error("pagefind createIndex error:", e);
    process.exit(1);
  }
  if (!index) {
    console.error("pagefind: createIndex returned no index");
    process.exit(1);
  }

  const pages = await collectPages();
  for (const page of pages) {
    const title = extractTitle(page.source);
    const content = stripMarkdown(page.source);
    if (content.length === 0) continue;
    const result = await index.addCustomRecord({
      url: page.url,
      content,
      language: "th",
      meta: { title },
    });
    if (result.errors?.length) {
      for (const e of result.errors)
        console.error("pagefind addCustomRecord error:", e);
      process.exit(1);
    }
  }

  const { errors: writeErrors } = await index.writeFiles({ outputPath });
  if (writeErrors?.length) {
    for (const e of writeErrors) console.error("pagefind writeFiles error:", e);
    process.exit(1);
  }
  console.log(`pagefind: indexed ${pages.length} pages -> ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
