"use strict";

// ANSI colors, match the Rust CLI's rendering so both entrypoints feel the same.
const RED = "\x1b[31;1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const LF = 0x0a;

/**
 * Map a UTF-8 byte-offset span (what the Rust compiler emits) into a
 * line / column / line-text / width tuple suitable for terminal output.
 *
 * JS strings are UTF-16; Thai characters are 3 bytes in UTF-8 and 1 code
 * unit in UTF-16, so naively slicing the JS string by the WASM byte
 * offsets produces wrong positions on any Thai source. This walks the
 * UTF-8 bytes directly via Buffer and only decodes short substrings back
 * to UTF-8 when counting display-width columns.
 */
function locate(source, start, end) {
  const buf = Buffer.from(source, "utf8");
  const clampedStart = Math.max(0, Math.min(start, buf.length));
  const clampedEnd = Math.max(clampedStart, Math.min(end, buf.length));

  let lineStartByte = 0;
  let lineNumber = 1;
  for (let i = 0; i < clampedStart; i++) {
    if (buf[i] === LF) {
      lineStartByte = i + 1;
      lineNumber += 1;
    }
  }
  let lineEndByte = buf.length;
  for (let i = clampedStart; i < buf.length; i++) {
    if (buf[i] === LF) {
      lineEndByte = i;
      break;
    }
  }

  const lineText = buf.slice(lineStartByte, lineEndByte).toString("utf8");
  const beforeText = buf.slice(lineStartByte, clampedStart).toString("utf8");
  const rangeText = buf
    .slice(clampedStart, Math.min(clampedEnd, lineEndByte))
    .toString("utf8");

  const column = Array.from(beforeText).length + 1;
  const width = Array.from(rangeText).length;

  return { lineNumber, column, lineText, width };
}

function formatDiagnostic(file, source, diag) {
  const loc = locate(source, diag.start, diag.end);
  const pad = " ".repeat(Math.max(loc.column - 1, 0));
  const carets = "^".repeat(Math.max(loc.width, 1));
  return [
    `${RED}error${RESET}: ${diag.message}`,
    `  ${DIM}-->${RESET} ${file}:${loc.lineNumber}:${loc.column}`,
    `   ${DIM}|${RESET}`,
    ` ${String(loc.lineNumber).padStart(2)} ${DIM}|${RESET} ${loc.lineText}`,
    `   ${DIM}|${RESET} ${pad}${RED}${carets}${RESET}`,
  ].join("\n");
}

module.exports = { formatDiagnostic };
