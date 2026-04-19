use thailang_lexer::{tokenize, TokenKind};

#[test]
fn integer_literal() {
    let tokens = tokenize("42");
    assert_eq!(tokens[0].kind, TokenKind::Int(42));
}

#[test]
fn float_literal() {
    let tokens = tokenize("4.25");
    assert_eq!(tokens[0].kind, TokenKind::Float(4.25));
}

#[test]
fn negative_integer_lexes_as_minus_then_int() {
    let kinds: Vec<TokenKind> = tokenize("-5").into_iter().map(|t| t.kind).collect();
    assert_eq!(kinds, vec![TokenKind::Minus, TokenKind::Int(5)]);
}

#[test]
fn ascii_string_literal() {
    let tokens = tokenize(r#""hello""#);
    assert_eq!(tokens[0].kind, TokenKind::Str("hello".to_string()));
}

#[test]
fn thai_string_literal() {
    let tokens = tokenize(r#""สวัสดี""#);
    assert_eq!(tokens[0].kind, TokenKind::Str("สวัสดี".to_string()));
}

#[test]
fn string_with_newline_escape() {
    let tokens = tokenize(r#""a\nb""#);
    assert_eq!(tokens[0].kind, TokenKind::Str("a\nb".to_string()));
}

#[test]
fn string_with_quote_escape() {
    let tokens = tokenize(r#""\"""#);
    assert_eq!(tokens[0].kind, TokenKind::Str("\"".to_string()));
}

#[test]
fn boolean_true_keyword_thuk() {
    assert_eq!(tokenize("ถูก")[0].kind, TokenKind::True);
}

#[test]
fn boolean_false_keyword_phit() {
    assert_eq!(tokenize("ผิด")[0].kind, TokenKind::False);
}

#[test]
fn null_keyword_wang() {
    assert_eq!(tokenize("ว่าง")[0].kind, TokenKind::Null);
}
