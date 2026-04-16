use thailang_lexer::{tokenize, TokenKind};

fn kinds_of(source: &str) -> Vec<TokenKind> {
    tokenize(source).into_iter().map(|t| t.kind).collect()
}

#[test]
fn arithmetic_operators() {
    assert_eq!(
        kinds_of("+ - * / %"),
        vec![
            TokenKind::Plus,
            TokenKind::Minus,
            TokenKind::Star,
            TokenKind::Slash,
            TokenKind::Percent,
        ]
    );
}

#[test]
fn assign_eq_does_not_consume_eq_eq() {
    assert_eq!(kinds_of("="), vec![TokenKind::Eq]);
    assert_eq!(kinds_of("=="), vec![TokenKind::EqEq]);
}

#[test]
fn comparison_operators() {
    assert_eq!(
        kinds_of("== != < <= > >="),
        vec![
            TokenKind::EqEq,
            TokenKind::BangEq,
            TokenKind::Lt,
            TokenKind::LtEq,
            TokenKind::Gt,
            TokenKind::GtEq,
        ]
    );
}

#[test]
fn compound_assignment_operators() {
    assert_eq!(
        kinds_of("+= -= *= /= %="),
        vec![
            TokenKind::PlusEq,
            TokenKind::MinusEq,
            TokenKind::StarEq,
            TokenKind::SlashEq,
            TokenKind::PercentEq,
        ]
    );
}

#[test]
fn arrow_beats_minus_then_gt() {
    assert_eq!(kinds_of("->"), vec![TokenKind::Arrow]);
}

#[test]
fn fat_arrow_beats_eq_then_gt() {
    assert_eq!(kinds_of("=>"), vec![TokenKind::FatArrow]);
}

#[test]
fn logical_and_keyword_and_symbol_alias() {
    assert_eq!(kinds_of("และ"), vec![TokenKind::AndAnd]);
    assert_eq!(kinds_of("&&"), vec![TokenKind::AndAnd]);
}

#[test]
fn logical_or_keyword_and_symbol_alias() {
    assert_eq!(kinds_of("หรือ"), vec![TokenKind::OrOr]);
    assert_eq!(kinds_of("||"), vec![TokenKind::OrOr]);
}

#[test]
fn pipe_for_union_types() {
    assert_eq!(kinds_of("|"), vec![TokenKind::Pipe]);
}

#[test]
fn punctuation() {
    assert_eq!(
        kinds_of("( ) { } [ ] : ; , ."),
        vec![
            TokenKind::LParen,
            TokenKind::RParen,
            TokenKind::LBrace,
            TokenKind::RBrace,
            TokenKind::LBracket,
            TokenKind::RBracket,
            TokenKind::Colon,
            TokenKind::Semi,
            TokenKind::Comma,
            TokenKind::Dot,
        ]
    );
}
