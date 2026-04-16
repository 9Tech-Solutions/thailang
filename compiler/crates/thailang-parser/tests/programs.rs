use thailang_parser::parse;

#[test]
fn empty_program() {
    let p = parse("").unwrap();
    assert!(p.items.is_empty());
}

#[test]
fn three_statements() {
    let p = parse("ให้ x = 1; ให้ y = 2; พิมพ์(x);").unwrap();
    assert_eq!(p.items.len(), 3);
}

#[test]
fn hello_world_program() {
    let p = parse(r#"พิมพ์("สวัสดีชาวโลก!");"#).unwrap();
    assert_eq!(p.items.len(), 1);
}

#[test]
fn missing_semicolon_returns_error() {
    let result = parse("ให้ x = 42");
    assert!(result.is_err());
}
