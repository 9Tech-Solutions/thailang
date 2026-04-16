use thailang_lexer::{tokenize, TokenKind};

#[test]
fn thai_only_identifier_becomes_one_token() {
    let tokens = tokenize("ชื่อ");
    assert_eq!(tokens.len(), 1);
    assert_eq!(tokens[0].kind, TokenKind::Ident("ชื่อ".to_string()));
}

#[test]
fn ascii_only_identifier_lexes() {
    let tokens = tokenize("name");
    assert_eq!(tokens[0].kind, TokenKind::Ident("name".to_string()));
}

#[test]
fn ascii_identifier_can_contain_digits() {
    let tokens = tokenize("x1");
    assert_eq!(tokens[0].kind, TokenKind::Ident("x1".to_string()));
}

#[test]
fn underscore_starts_identifier() {
    let tokens = tokenize("_foo");
    assert_eq!(tokens[0].kind, TokenKind::Ident("_foo".to_string()));
}

#[test]
fn identifier_cannot_start_with_digit() {
    let tokens = tokenize("1abc");
    assert_eq!(tokens.len(), 2);
    assert_eq!(tokens[0].kind, TokenKind::Int(1));
    assert_eq!(tokens[1].kind, TokenKind::Ident("abc".to_string()));
}

#[test]
fn thai_identifier_with_combining_marks_is_single_token() {
    let tokens = tokenize("ก่า");
    assert_eq!(tokens.len(), 1);
    assert_eq!(tokens[0].kind, TokenKind::Ident("ก่า".to_string()));
}
