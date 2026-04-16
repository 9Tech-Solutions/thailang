use crate::token::{Span, Token, TokenKind};
use logos::Logos;

pub fn tokenize(source: &str) -> Vec<Token> {
    let mut lexer = TokenKind::lexer(source);
    let mut tokens = Vec::new();
    while let Some(result) = lexer.next() {
        if let Ok(kind) = result {
            tokens.push(build_token(kind, lexer.span(), lexer.slice()));
        }
    }
    tokens
}

fn build_token(kind: TokenKind, range: std::ops::Range<usize>, lexeme: &str) -> Token {
    Token {
        kind,
        span: Span { start: range.start, end: range.end },
        lexeme: lexeme.to_string(),
    }
}
