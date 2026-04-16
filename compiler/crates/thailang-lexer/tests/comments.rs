use thailang_lexer::{tokenize, TokenKind};

#[test]
fn line_comment_is_skipped() {
    let tokens = tokenize("// ทักทาย\nให้");
    assert_eq!(tokens.len(), 1);
    assert_eq!(tokens[0].kind, TokenKind::Let);
}

#[test]
fn block_comment_is_skipped() {
    let tokens = tokenize("/* ทักทาย */ ให้");
    assert_eq!(tokens.len(), 1);
    assert_eq!(tokens[0].kind, TokenKind::Let);
}

#[test]
fn multiline_block_comment_is_skipped() {
    let tokens = tokenize("/* บรรทัด 1\nบรรทัด 2 */ ให้");
    assert_eq!(tokens.len(), 1);
    assert_eq!(tokens[0].kind, TokenKind::Let);
}

#[test]
fn code_with_trailing_line_comment() {
    let kinds: Vec<TokenKind> = tokenize("ให้ // คอมเมนต์")
        .into_iter()
        .map(|t| t.kind)
        .collect();
    assert_eq!(kinds, vec![TokenKind::Let]);
}
