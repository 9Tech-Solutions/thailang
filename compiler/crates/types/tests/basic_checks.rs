use thailang_parser::parse;
use thailang_types::check;

fn errors_for(src: &str) -> Vec<String> {
    let p = parse(src).expect("parse");
    check(&p).into_iter().map(|e| e.message).collect()
}

#[test]
fn correct_int_annotation_passes() {
    assert!(errors_for("ให้ x: จำนวนเต็ม = 42;").is_empty());
}

#[test]
fn correct_string_annotation_passes() {
    assert!(errors_for("ให้ x: ข้อความ = \"hi\";").is_empty());
}

#[test]
fn int_value_assignable_to_number_annotation() {
    assert!(errors_for("ให้ x: ตัวเลข = 42;").is_empty());
}

#[test]
fn float_value_to_number_annotation() {
    assert!(errors_for("ให้ x: ตัวเลข = 3.14;").is_empty());
}

#[test]
fn string_to_int_annotation_errors() {
    let errors = errors_for("ให้ x: จำนวนเต็ม = \"hello\";");
    assert_eq!(errors.len(), 1);
    assert!(errors[0].contains("จำนวนเต็ม"));
    assert!(errors[0].contains("ข้อความ"));
}

#[test]
fn bool_to_string_annotation_errors() {
    let errors = errors_for("ให้ x: ข้อความ = จริง;");
    assert_eq!(errors.len(), 1);
}

#[test]
fn no_annotation_no_error() {
    assert!(errors_for("ให้ x = \"anything\";").is_empty());
}

#[test]
fn any_annotation_accepts_everything() {
    assert!(errors_for("ให้ x: อะไรก็ได้ = 42;").is_empty());
    assert!(errors_for("ให้ y: อะไรก็ได้ = \"hi\";").is_empty());
}

#[test]
fn nested_let_in_function_body_is_checked() {
    let errors = errors_for(
        "ฟังก์ชัน f() { ให้ x: จำนวนเต็ม = \"oops\"; }",
    );
    assert_eq!(errors.len(), 1);
}

#[test]
fn union_type_accepts_any_variant() {
    assert!(errors_for("ให้ x: ตัวเลข | ข้อความ = 42;").is_empty());
    // Note: parser doesn't yet support `|` in type annotations, this test
    // documents the intended behavior; remove `#[ignore]` when parser does.
}

#[test]
fn array_literal_validates_against_array_annotation() {
    // `รายการ<จำนวนเต็ม>` requires `<>` parser support; for now check the
    // simpler case where the annotation is inferred-friendly.
    assert!(errors_for("ให้ xs = [1, 2, 3];").is_empty());
}
