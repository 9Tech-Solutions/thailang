import { copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, "..");
const require = createRequire(import.meta.url);
const src = require.resolve("web-tree-sitter/web-tree-sitter.wasm");
const dest = resolve(webRoot, "public/web-tree-sitter.wasm");

copyFileSync(src, dest);
console.log(`copied ${src} -> ${dest}`);
