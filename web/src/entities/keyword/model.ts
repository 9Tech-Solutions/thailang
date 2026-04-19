export type KeywordCategory =
  | "core"
  | "control"
  | "type"
  | "logic"
  | "async"
  | "error"
  | "module";

export interface ThaiKeyword {
  thai: string;
  roman: string;
  english: string;
  category: KeywordCategory;
}

// Mirrors compiler/crates/lexer/src/token.rs after the 2026-04 rename sweep.
// Stdlib module names (ระบบ, คณิต) are NOT hard keywords and intentionally
// excluded from this list, they're soft-reserved in emit-js::stdlib instead.
export const keywords: readonly ThaiKeyword[] = [
  // core: declarations (4)
  { thai: "ให้", roman: "hai", english: "let", category: "core" },
  { thai: "คงที่", roman: "khongthi", english: "const", category: "core" },
  { thai: "สูตร", roman: "sut", english: "function", category: "core" },
  { thai: "ส่งกลับ", roman: "songklap", english: "return", category: "core" },
  // control (12)
  { thai: "ถ้า", roman: "tha", english: "if", category: "control" },
  { thai: "ไม่ก็", roman: "maikor", english: "else if", category: "control" },
  { thai: "ไม่งั้น", roman: "mainga", english: "else", category: "control" },
  {
    thai: "ระหว่างที่",
    roman: "rawangthi",
    english: "while",
    category: "control",
  },
  { thai: "วน", roman: "won", english: "for", category: "control" },
  { thai: "แต่ละ", roman: "taela", english: "for-each", category: "control" },
  { thai: "ใน", roman: "nai", english: "in", category: "control" },
  { thai: "หยุด", roman: "yut", english: "break", category: "control" },
  { thai: "ข้าม", roman: "kham", english: "continue", category: "control" },
  { thai: "เลือก", roman: "lueak", english: "switch", category: "control" },
  { thai: "กรณี", roman: "korani", english: "case", category: "control" },
  {
    thai: "เริ่มต้น",
    roman: "roemton",
    english: "default",
    category: "control",
  },
  // type (10)
  { thai: "ตัวเลข", roman: "tualek", english: "number", category: "type" },
  {
    thai: "จำนวนเต็ม",
    roman: "chamnuanthem",
    english: "int",
    category: "type",
  },
  { thai: "ข้อความ", roman: "khokhwam", english: "string", category: "type" },
  { thai: "ถูกผิด", roman: "thukphit", english: "boolean", category: "type" },
  { thai: "ทั่วไป", roman: "thuapai", english: "any", category: "type" },
  {
    thai: "ไม่ส่งกลับ",
    roman: "maisongklap",
    english: "void",
    category: "type",
  },
  { thai: "ชุด", roman: "chut", english: "array", category: "type" },
  { thai: "คู่", roman: "khu", english: "map", category: "type" },
  { thai: "โครง", roman: "khrong", english: "struct", category: "type" },
  { thai: "เป็น", roman: "pen", english: "is", category: "type" },
  // logic (6)
  { thai: "ถูก", roman: "thuk", english: "true", category: "logic" },
  { thai: "ผิด", roman: "phit", english: "false", category: "logic" },
  { thai: "ว่าง", roman: "wang", english: "null", category: "logic" },
  { thai: "และ", roman: "lae", english: "&&", category: "logic" },
  { thai: "หรือ", roman: "rue", english: "||", category: "logic" },
  { thai: "ไม่ใช่", roman: "maichai", english: "!", category: "logic" },
  // async (2)
  { thai: "รอ", roman: "ror", english: "await", category: "async" },
  { thai: "ขนาน", roman: "khanan", english: "async", category: "async" },
  // error (4)
  { thai: "ลอง", roman: "long", english: "try", category: "error" },
  { thai: "จับ", roman: "jap", english: "catch", category: "error" },
  { thai: "สุดท้าย", roman: "sutthai", english: "finally", category: "error" },
  { thai: "ฟ้อง", roman: "fong", english: "throw", category: "error" },
  // module (3)
  { thai: "นำเข้า", roman: "namkhao", english: "import", category: "module" },
  { thai: "ส่งออก", roman: "songok", english: "export", category: "module" },
  { thai: "จาก", roman: "chak", english: "from", category: "module" },
] as const;

export const KEYWORD_CATEGORIES: readonly KeywordCategory[] = [
  "core",
  "control",
  "type",
  "logic",
  "error",
  "async",
  "module",
] as const;
