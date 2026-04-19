/**
 * Client-side Thai-aware tokenizer for live editing in the hero playground.
 * Produces tokens the overlay <pre> can style with CSS variables, matching
 * the Shiki palette used by the static code blocks elsewhere on the page.
 *
 * Kept intentionally small: mirrors the Rust lexer's keyword sets (see
 * compiler/crates/lexer/src/token.rs) without pulling Shiki to the client.
 */

const KEYWORD_DECLARATION = new Set(["ให้", "คงที่", "สูตร", "โครง", "ชุด", "คู่"]);

const KEYWORD_CONTROL = new Set([
  "ถ้า",
  "ไม่ก็",
  "ไม่งั้น",
  "ระหว่างที่",
  "วน",
  "แต่ละ",
  "ส่งกลับ",
  "หยุด",
  "ข้าม",
  "เลือก",
  "กรณี",
  "เริ่มต้น",
  "ลอง",
  "จับ",
  "สุดท้าย",
  "ฟ้อง",
]);

const KEYWORD_OTHER = new Set([
  "ใน",
  "เป็น",
  "จาก",
  "รอ",
  "ขนาน",
  "นำเข้า",
  "ส่งออก",
]);

const KEYWORD_LOGICAL = new Set(["และ", "หรือ", "ไม่ใช่"]);
const BUILTIN = new Set(["ระบบ", "คณิต"]);
const TYPE_KEYWORDS = new Set([
  "ตัวเลข",
  "จำนวนเต็ม",
  "ข้อความ",
  "ถูกผิด",
  "ทั่วไป",
  "ไม่ส่งกลับ",
]);
const BOOLEAN_LITERALS = new Set(["ถูก", "ผิด"]);
const NULL_LITERALS = new Set(["ว่าง"]);

export type TokenKind =
  | "keyword"
  | "type"
  | "literal"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "op"
  | "text";

export interface Token {
  kind: TokenKind;
  text: string;
}

const IDENT_RE = /^[\u0E00-\u0E7Fa-zA-Z_][\u0E00-\u0E7Fa-zA-Z0-9_]*/;
const NUMBER_RE = /^[0-9]+(?:\.[0-9]+)?/;
const OP_RE =
  /^(?:==|!=|<=|>=|\+=|-=|\*=|\/=|%=|->|=>|&&|\|\||[=+\-*/%<>!(){}[\];:,.])/;
const WHITESPACE_RE = /^\s+/;

export function tokenize(source: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const rest = source.slice(i);

    const ws = WHITESPACE_RE.exec(rest);
    if (ws) {
      out.push({ kind: "text", text: ws[0] });
      i += ws[0].length;
      continue;
    }

    if (rest.startsWith("//")) {
      const nl = rest.indexOf("\n");
      const text = nl === -1 ? rest : rest.slice(0, nl);
      out.push({ kind: "comment", text });
      i += text.length;
      continue;
    }

    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/");
      const text = end === -1 ? rest : rest.slice(0, end + 2);
      out.push({ kind: "comment", text });
      i += text.length;
      continue;
    }

    if (rest.startsWith('"')) {
      let j = 1;
      while (j < rest.length && rest[j] !== '"') {
        if (rest[j] === "\\") j += 2;
        else j += 1;
      }
      const text = rest.slice(0, Math.min(j + 1, rest.length));
      out.push({ kind: "string", text });
      i += text.length;
      continue;
    }

    const num = NUMBER_RE.exec(rest);
    if (num) {
      out.push({ kind: "number", text: num[0] });
      i += num[0].length;
      continue;
    }

    const id = IDENT_RE.exec(rest);
    if (id) {
      const text = id[0];
      let kind: TokenKind = "text";
      if (BUILTIN.has(text)) kind = "builtin";
      else if (TYPE_KEYWORDS.has(text)) kind = "type";
      else if (BOOLEAN_LITERALS.has(text) || NULL_LITERALS.has(text))
        kind = "literal";
      else if (
        KEYWORD_DECLARATION.has(text) ||
        KEYWORD_CONTROL.has(text) ||
        KEYWORD_OTHER.has(text) ||
        KEYWORD_LOGICAL.has(text)
      )
        kind = "keyword";
      out.push({ kind, text });
      i += text.length;
      continue;
    }

    const op = OP_RE.exec(rest);
    if (op) {
      out.push({ kind: "op", text: op[0] });
      i += op[0].length;
      continue;
    }

    out.push({ kind: "text", text: rest[0] });
    i += 1;
  }

  return out;
}

/**
 * Lacquer palette — matches Shiki theme and .code-pane tokens in globals.css.
 * - keyword (control, e.g. ถ้า ไม่ก็): gold
 * - builtin / declaration (สูตร ให้ ระบบ): mulberry
 * - type (ตัวเลข ข้อความ): teal
 * - string: jade green
 * - number / literal: warm amber
 */
export const TOKEN_COLOR: Record<TokenKind, string> = {
  keyword: "#eec98c",
  type: "#8fc4cc",
  literal: "#c99adf",
  builtin: "#c99adf",
  string: "#9dd6a3",
  number: "#f0b974",
  comment: "#857796",
  op: "#c5b7a7",
  text: "inherit",
};
