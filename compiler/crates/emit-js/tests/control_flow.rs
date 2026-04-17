use thailang_emit_js::emit;
use thailang_parser::parse;

fn compile(src: &str) -> String {
    let p = parse(src).expect("parse");
    emit(&p).trim().to_string()
}

#[test]
fn if_only() {
    let js = compile("ถ้า (จริง) { พิมพ์(1); }");
    assert!(js.starts_with("if (true) {"));
    assert!(js.contains("console.log(1);"));
}

#[test]
fn if_elseif_else_chain() {
    let js = compile("ถ้า (x == 1) { พิมพ์(1); } ไม่ก็ (x == 2) { พิมพ์(2); } ไม่งั้น { พิมพ์(0); }");
    assert!(js.contains("if ((x === 1))"));
    assert!(js.contains("else if ((x === 2))"));
    assert!(js.contains("else {"));
}

#[test]
fn while_loop_with_compound_assign() {
    let js = compile("ตราบ (i < 10) { i += 1; }");
    assert!(js.starts_with("while ((i < 10)) {"));
    assert!(js.contains("i += 1;"));
}

#[test]
fn c_style_for_loop() {
    let js = compile("วน (ให้ i = 0; i < 10; i += 1) { พิมพ์(i); }");
    assert!(js.contains("for (let i = 0; (i < 10); i += 1)"));
    assert!(js.contains("console.log(i);"));
}

#[test]
fn break_and_continue() {
    let js = compile("ตราบ (จริง) { ถ้า (x) { หยุด; } ข้าม; }");
    assert!(js.contains("break;"));
    assert!(js.contains("continue;"));
}
