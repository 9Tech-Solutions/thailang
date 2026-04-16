use logos::Logos;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Span {
    pub start: usize,
    pub end: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Token {
    pub kind: TokenKind,
    pub span: Span,
    pub lexeme: String,
}

#[derive(Logos, Debug, Clone, PartialEq)]
#[logos(skip r"[ \t\n\r]+")]
#[logos(skip r"//[^\n]*")]
#[logos(skip r"/\*[^*]*\*+([^/*][^*]*\*+)*/")]
pub enum TokenKind {
    // ── Core declarations ──────────────────────────────────────────────
    #[token("ให้")]
    Let,
    #[token("คงที่")]
    Const,
    #[token("ฟังก์ชัน")]
    Function,
    #[token("คืน")]
    Return,
    #[token("พิมพ์")]
    Print,

    // ── Control flow ───────────────────────────────────────────────────
    #[token("ถ้า")]
    If,
    #[token("ไม่ก็")]
    ElseIf,
    #[token("ไม่งั้น")]
    Else,
    #[token("ตราบ")]
    While,
    #[token("วน")]
    For,
    #[token("แต่ละ")]
    ForEach,
    #[token("หยุด")]
    Break,
    #[token("ข้าม")]
    Continue,
    #[token("เลือก")]
    Switch,
    #[token("กรณี")]
    Case,
    #[token("เริ่มต้น")]
    Default,

    // ── Type annotations ───────────────────────────────────────────────
    #[token("ตัวเลข")]
    NumberType,
    #[token("จำนวนเต็ม")]
    IntType,
    #[token("ข้อความ")]
    StringType,
    #[token("จริงเท็จ")]
    BoolType,
    #[token("อะไรก็ได้")]
    AnyType,
    #[token("ไม่คืน")]
    VoidType,

    // ── Boolean / null literals (keywords) ─────────────────────────────
    #[token("จริง")]
    True,
    #[token("เท็จ")]
    False,
    #[token("ว่าง")]
    Null,

    // ── Logical (Thai keyword OR ASCII operator alias) ─────────────────
    #[token("และ")]
    #[token("&&")]
    AndAnd,
    #[token("หรือ")]
    #[token("||")]
    OrOr,
    #[token("ไม่")]
    #[token("!")]
    Bang,

    // ── Data structure keywords ────────────────────────────────────────
    #[token("รายการ")]
    ArrayKw,
    #[token("แผนที่")]
    MapKw,
    #[token("โครงสร้าง")]
    StructKw,

    // ── Async ──────────────────────────────────────────────────────────
    #[token("รอ")]
    Await,
    #[token("ไม่พร้อม")]
    Async,

    // ── Error handling ─────────────────────────────────────────────────
    #[token("ลอง")]
    Try,
    #[token("จับ")]
    Catch,
    #[token("สุดท้าย")]
    Finally,
    #[token("โยน")]
    Throw,

    // ── Modules ────────────────────────────────────────────────────────
    #[token("นำเข้า")]
    Import,
    #[token("ส่งออก")]
    Export,
    #[token("จาก")]
    From,

    // ── Misc Thai keywords ─────────────────────────────────────────────
    #[token("ใน")]
    In,
    #[token("เป็น")]
    Is,

    // ── Compound operators (longest-match wins via logos) ──────────────
    #[token("==")]
    EqEq,
    #[token("!=")]
    BangEq,
    #[token("<=")]
    LtEq,
    #[token(">=")]
    GtEq,
    #[token("+=")]
    PlusEq,
    #[token("-=")]
    MinusEq,
    #[token("*=")]
    StarEq,
    #[token("/=")]
    SlashEq,
    #[token("%=")]
    PercentEq,
    #[token("->")]
    Arrow,
    #[token("=>")]
    FatArrow,

    // ── Single-char operators ──────────────────────────────────────────
    #[token("=")]
    Eq,
    #[token("<")]
    Lt,
    #[token(">")]
    Gt,
    #[token("+")]
    Plus,
    #[token("-")]
    Minus,
    #[token("*")]
    Star,
    #[token("/")]
    Slash,
    #[token("%")]
    Percent,
    #[token("|")]
    Pipe,

    // ── Punctuation ────────────────────────────────────────────────────
    #[token("(")]
    LParen,
    #[token(")")]
    RParen,
    #[token("{")]
    LBrace,
    #[token("}")]
    RBrace,
    #[token("[")]
    LBracket,
    #[token("]")]
    RBracket,
    #[token(":")]
    Colon,
    #[token(";")]
    Semi,
    #[token(",")]
    Comma,
    #[token(".")]
    Dot,

    // ── Literals (with payloads) ───────────────────────────────────────
    #[regex(r"[0-9]+\.[0-9]+", |lex| lex.slice().parse().ok())]
    Float(f64),

    #[regex(r"[0-9]+", |lex| lex.slice().parse().ok(), priority = 3)]
    Int(i64),

    #[regex(r#""([^"\\]|\\.)*""#, |lex| unescape_string_literal(lex.slice()))]
    Str(String),

    // ── Identifiers (Thai + ASCII; lowest priority — keywords win) ─────
    #[regex(
        r"[\u0E00-\u0E7Fa-zA-Z_][\u0E00-\u0E7Fa-zA-Z0-9_]*",
        |lex| lex.slice().to_string()
    )]
    Ident(String),
}

fn unescape_string_literal(raw: &str) -> String {
    let inner = &raw[1..raw.len() - 1];
    let mut out = String::with_capacity(inner.len());
    let mut chars = inner.chars();
    while let Some(c) = chars.next() {
        if c != '\\' {
            out.push(c);
            continue;
        }
        match chars.next() {
            Some('n') => out.push('\n'),
            Some('t') => out.push('\t'),
            Some('r') => out.push('\r'),
            Some('\\') => out.push('\\'),
            Some('"') => out.push('"'),
            Some(other) => {
                out.push('\\');
                out.push(other);
            }
            None => out.push('\\'),
        }
    }
    out
}
