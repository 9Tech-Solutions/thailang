use thailang_emit_js::emit;
use thailang_parser::parse;

fn compile(src: &str) -> String {
    let p = parse(src).expect("parse");
    emit(&p).trim().to_string()
}

#[test]
fn let_int() {
    assert_eq!(compile("ให้ x = 42;"), "let x = 42;");
}

#[test]
fn const_thai_name() {
    assert_eq!(compile("คงที่ ชื่อ = \"สมชาย\";"), "const ชื่อ = \"สมชาย\";");
}

#[test]
fn hello_world_uses_console_log() {
    assert_eq!(compile("พิมพ์(\"สวัสดี\");"), "console.log(\"สวัสดี\");");
}

#[test]
fn binary_addition_emits_with_parens() {
    assert_eq!(compile("ให้ x = 1 + 2;"), "let x = (1 + 2);");
}

#[test]
fn precedence_preserved_via_parens() {
    assert_eq!(compile("ให้ x = 1 + 2 * 3;"), "let x = (1 + (2 * 3));");
}

#[test]
fn comparison_uses_strict_equality() {
    assert_eq!(compile("ให้ x = a == b;"), "let x = (a === b);");
}

#[test]
fn logical_and_keyword_emits_double_amp() {
    assert_eq!(compile("ให้ x = จริง และ เท็จ;"), "let x = (true && false);");
}

#[test]
fn null_keyword_emits_null() {
    assert_eq!(compile("ให้ x = ว่าง;"), "let x = null;");
}

#[test]
fn unary_negation() {
    assert_eq!(compile("ให้ x = -5;"), "let x = -(5);");
}

#[test]
fn string_with_escapes() {
    assert_eq!(compile(r#"ให้ x = "a\nb";"#), "let x = \"a\\nb\";");
}
