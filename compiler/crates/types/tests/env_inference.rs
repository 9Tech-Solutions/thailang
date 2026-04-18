use thailang_parser::parse;
use thailang_types::check;

fn errors_for(src: &str) -> Vec<String> {
    let p = parse(src).expect("parse");
    check(&p).into_iter().map(|e| e.message).collect()
}

// ── Reassignment respects declared type ────────────────────────────────

#[test]
fn reassign_wrong_type_errors() {
    let errs = errors_for(
        "ให้ x: ข้อความ = \"hi\";\n\
         x = 42;",
    );
    assert_eq!(
        errs.len(),
        1,
        "expected one reassignment error, got {errs:?}"
    );
    assert!(errs[0].contains("ข้อความ"));
}

#[test]
fn reassign_same_type_ok() {
    assert!(errors_for("ให้ x: ข้อความ = \"hi\"; x = \"world\";").is_empty());
}

#[test]
fn reassign_int_to_number_annotation_ok() {
    assert!(errors_for("ให้ x: ตัวเลข = 1.0; x = 2;").is_empty());
}

// ── Identifier uses propagate inferred types ───────────────────────────

#[test]
fn assigning_ident_of_wrong_type_errors() {
    let errs = errors_for(
        "ให้ name: ข้อความ = \"a\";\n\
         ให้ n: จำนวนเต็ม = name;",
    );
    assert_eq!(errs.len(), 1, "{errs:?}");
    assert!(errs[0].contains("จำนวนเต็ม"));
    assert!(errs[0].contains("ข้อความ"));
}

// ── Binary arithmetic inference ────────────────────────────────────────

#[test]
fn int_plus_int_stays_int() {
    assert!(errors_for("ให้ n: จำนวนเต็ม = 1 + 2;").is_empty());
}

#[test]
fn int_plus_float_becomes_number() {
    assert!(errors_for("ให้ n: ตัวเลข = 1 + 2.0;").is_empty());
    let errs = errors_for("ให้ n: จำนวนเต็ม = 1 + 2.0;");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

// ── Function return-type checking ──────────────────────────────────────

#[test]
fn return_wrong_type_errors() {
    let errs = errors_for("ฟังก์ชัน f() -> จำนวนเต็ม { คืน \"oops\"; }");
    assert_eq!(errs.len(), 1, "{errs:?}");
    assert!(errs[0].contains("จำนวนเต็ม"));
}

#[test]
fn return_matching_type_ok() {
    assert!(errors_for("ฟังก์ชัน f() -> จำนวนเต็ม { คืน 42; }").is_empty());
}

// ── Parameter types bind into function body ────────────────────────────

#[test]
fn function_param_is_visible_in_body() {
    // Assigning a string param into an int-annotated local should error.
    let errs = errors_for("ฟังก์ชัน f(s: ข้อความ) { ให้ n: จำนวนเต็ม = s; }");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

// ── Union assignment ───────────────────────────────────────────────────

#[test]
fn union_variant_literal_ok() {
    assert!(errors_for("ให้ x: ตัวเลข | ข้อความ = 42;").is_empty());
    assert!(errors_for("ให้ x: ตัวเลข | ข้อความ = \"hi\";").is_empty());
}

#[test]
fn null_in_union_accepts_null_literal() {
    assert!(errors_for("ให้ x: ตัวเลข | ว่าง = ว่าง;").is_empty());
    assert!(errors_for("ให้ x: ตัวเลข | ว่าง = 1;").is_empty());
}
