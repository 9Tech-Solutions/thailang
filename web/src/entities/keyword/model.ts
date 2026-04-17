export interface ThaiKeyword {
  thai: string;
  roman: string;
  english: string;
  category: 'core' | 'control' | 'type' | 'logic' | 'async' | 'error' | 'module';
}

export const keywords: readonly ThaiKeyword[] = [
  { thai: 'ให้', roman: 'hai', english: 'let', category: 'core' },
  { thai: 'คงที่', roman: 'khongthi', english: 'const', category: 'core' },
  { thai: 'ฟังก์ชัน', roman: 'fangchan', english: 'function', category: 'core' },
  { thai: 'คืน', roman: 'khuen', english: 'return', category: 'core' },
  { thai: 'พิมพ์', roman: 'phim', english: 'print', category: 'core' },
  { thai: 'ถ้า', roman: 'tha', english: 'if', category: 'control' },
  { thai: 'ไม่ก็', roman: 'maikor', english: 'else if', category: 'control' },
  { thai: 'ไม่งั้น', roman: 'mainga', english: 'else', category: 'control' },
  { thai: 'ตราบ', roman: 'trap', english: 'while', category: 'control' },
  { thai: 'วน', roman: 'won', english: 'for', category: 'control' },
  { thai: 'แต่ละ', roman: 'taela', english: 'for-each', category: 'control' },
  { thai: 'ตัวเลข', roman: 'tualek', english: 'number', category: 'type' },
  { thai: 'ข้อความ', roman: 'khokhwam', english: 'string', category: 'type' },
  { thai: 'จริงเท็จ', roman: 'jingthet', english: 'boolean', category: 'type' },
  { thai: 'จริง', roman: 'jing', english: 'true', category: 'logic' },
  { thai: 'เท็จ', roman: 'thet', english: 'false', category: 'logic' },
  { thai: 'และ', roman: 'lae', english: '&&', category: 'logic' },
  { thai: 'หรือ', roman: 'rue', english: '||', category: 'logic' },
  { thai: 'รอ', roman: 'ror', english: 'await', category: 'async' },
  { thai: 'ลอง', roman: 'long', english: 'try', category: 'error' },
  { thai: 'จับ', roman: 'jap', english: 'catch', category: 'error' },
  { thai: 'โยน', roman: 'yon', english: 'throw', category: 'error' },
  { thai: 'นำเข้า', roman: 'namkhao', english: 'import', category: 'module' },
  { thai: 'ส่งออก', roman: 'songok', english: 'export', category: 'module' },
] as const;
