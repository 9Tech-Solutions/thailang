use thailang_emit_js::emit;
use thailang_parser::parse;

fn compile(src: &str) -> String {
    let p = parse(src).expect("parse");
    emit(&p).trim().to_string()
}

#[test]
fn is_check_string_emits_typeof() {
    let out = compile("ถ้า (x เป็น ข้อความ) { ระบบ.แสดง(x); }");
    assert!(
        out.contains("typeof x === \"string\""),
        "expected typeof string check, got: {out}"
    );
}

#[test]
fn is_check_int_emits_number_and_integer_guard() {
    let out = compile("ถ้า (n เป็น จำนวนเต็ม) { ระบบ.แสดง(n); }");
    assert!(
        out.contains("Number.isInteger(n)"),
        "expected Number.isInteger guard, got: {out}"
    );
}

#[test]
fn is_check_number_emits_typeof_number() {
    let out = compile("ถ้า (n เป็น ตัวเลข) { ระบบ.แสดง(n); }");
    assert!(
        out.contains("typeof n === \"number\""),
        "expected typeof number, got: {out}"
    );
}

#[test]
fn is_check_bool_emits_typeof_boolean() {
    let out = compile("ถ้า (b เป็น ถูกผิด) { ระบบ.แสดง(b); }");
    assert!(
        out.contains("typeof b === \"boolean\""),
        "expected typeof boolean, got: {out}"
    );
}

#[test]
fn is_check_null_emits_strict_null_equality() {
    let out = compile("ถ้า (x เป็น ว่าง) { ระบบ.แสดง(\"none\"); }");
    assert!(
        out.contains("x === null"),
        "expected `x === null`, got: {out}"
    );
}
