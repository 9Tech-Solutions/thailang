import { keywords } from '@/entities/keyword/model';

type TokenKind =
  | 'keyword'
  | 'type'
  | 'string'
  | 'number'
  | 'comment'
  | 'punct'
  | 'ident'
  | 'whitespace';

export interface Token {
  kind: TokenKind;
  text: string;
}

const THAI_KEYWORDS = new Set(keywords.map(k => k.thai));
const TYPE_KEYWORDS = new Set(['ตัวเลข', 'จำนวนเต็ม', 'ข้อความ', 'จริงเท็จ', 'ว่าง', 'อะไรก็ได้']);
const PUNCT = /^[(){}\[\];:,.=+\-*/%<>!|&]/;
const NUMBER = /^[0-9]+(\.[0-9]+)?/;
const IDENT = /^[\u0E00-\u0E7Fa-zA-Z_][\u0E00-\u0E7Fa-zA-Z0-9_]*/;

export function highlight(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const rest = source.slice(i);

    // Whitespace
    const ws = rest.match(/^\s+/);
    if (ws) {
      tokens.push({ kind: 'whitespace', text: ws[0] });
      i += ws[0].length;
      continue;
    }

    // Line comment
    if (rest.startsWith('//')) {
      const end = rest.indexOf('\n');
      const text = end === -1 ? rest : rest.slice(0, end);
      tokens.push({ kind: 'comment', text });
      i += text.length;
      continue;
    }

    // String
    if (rest.startsWith('"')) {
      let j = 1;
      while (j < rest.length && rest[j] !== '"') {
        if (rest[j] === '\\') j += 2;
        else j++;
      }
      const text = rest.slice(0, Math.min(j + 1, rest.length));
      tokens.push({ kind: 'string', text });
      i += text.length;
      continue;
    }

    // Number
    const num = rest.match(NUMBER);
    if (num) {
      tokens.push({ kind: 'number', text: num[0] });
      i += num[0].length;
      continue;
    }

    // Identifier or keyword (including Thai)
    const id = rest.match(IDENT);
    if (id) {
      const text = id[0];
      if (TYPE_KEYWORDS.has(text)) {
        tokens.push({ kind: 'type', text });
      } else if (THAI_KEYWORDS.has(text)) {
        tokens.push({ kind: 'keyword', text });
      } else {
        tokens.push({ kind: 'ident', text });
      }
      i += text.length;
      continue;
    }

    // Punctuation
    if (PUNCT.test(rest)) {
      const punct = rest[0];
      tokens.push({ kind: 'punct', text: punct });
      i += 1;
      continue;
    }

    // Unknown — consume one char
    tokens.push({ kind: 'ident', text: rest[0] });
    i += 1;
  }

  return tokens;
}
