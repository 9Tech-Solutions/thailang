use thailang_emit_js::emit;
use thailang_parser::parse;

fn compile(src: &str) -> String {
    let p = parse(src).expect("parse");
    emit(&p).trim().to_string()
}

#[test]
fn empty_function() {
    let js = compile("สูตร hello() {}");
    assert_eq!(js, "function hello() {}");
}

#[test]
fn function_preserves_thai_name_and_params() {
    let js = compile("สูตร บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข { ส่งกลับ ก + ข; }");
    assert!(js.starts_with("function บวก(ก, ข) {"));
    assert!(js.contains("return (ก + ข);"));
}

#[test]
fn fn_body_indent_uses_two_spaces() {
    let js = compile("สูตร f() { ระบบ.แสดง(1); }");
    assert!(js.contains("  console.log(1);"));
}

#[test]
fn return_no_value() {
    let js = compile("สูตร f() { ส่งกลับ; }");
    assert!(js.contains("return;"));
}
