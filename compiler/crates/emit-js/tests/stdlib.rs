use thailang_emit_js::emit;
use thailang_parser::parse;

fn compile(src: &str) -> String {
    let p = parse(src).expect("parse");
    emit(&p).trim().to_string()
}

// ── Math module (คณิต → Math) ─────────────────────────────────────────

#[test]
fn khanit_max_becomes_math_max() {
    let out = compile("ให้ x = คณิต.สูงสุด(1, 2, 3);");
    assert!(out.contains("Math.max(1, 2, 3)"), "got: {out}");
}

#[test]
fn khanit_min_becomes_math_min() {
    let out = compile("ให้ x = คณิต.ต่ำสุด(1, 2, 3);");
    assert!(out.contains("Math.min(1, 2, 3)"), "got: {out}");
}

#[test]
fn khanit_random_becomes_math_random() {
    let out = compile("ให้ x = คณิต.สุ่ม();");
    assert!(out.contains("Math.random()"), "got: {out}");
}

#[test]
fn khanit_ceil_becomes_math_ceil() {
    let out = compile("ให้ x = คณิต.ปัดขึ้น(3.2);");
    assert!(out.contains("Math.ceil(3.2)"), "got: {out}");
}

#[test]
fn khanit_floor_becomes_math_floor() {
    let out = compile("ให้ x = คณิต.ปัดลง(3.8);");
    assert!(out.contains("Math.floor(3.8)"), "got: {out}");
}

// ── String / Array shared: .ความยาว → .length ──────────────────────────

#[test]
fn length_member_becomes_length() {
    let out = compile("ให้ n = \"hello\".ความยาว;");
    assert!(out.contains(".length"), "got: {out}");
    assert!(!out.contains("ความยาว"), "should have been renamed: {out}");
}

// ── String methods ─────────────────────────────────────────────────────

#[test]
fn string_tad_becomes_slice() {
    let out = compile("ให้ s = \"hello\".ตัด(0, 3);");
    assert!(out.contains(".slice(0, 3)"), "got: {out}");
}

#[test]
fn string_upper_becomes_to_upper_case() {
    let out = compile("ให้ s = \"hello\".เป็นตัวใหญ่();");
    assert!(out.contains(".toUpperCase()"), "got: {out}");
}

#[test]
fn string_lower_becomes_to_lower_case() {
    let out = compile("ให้ s = \"HELLO\".เป็นตัวเล็ก();");
    assert!(out.contains(".toLowerCase()"), "got: {out}");
}

#[test]
fn string_split_becomes_split() {
    let out = compile("ให้ parts = \"a,b,c\".แยก(\",\");");
    assert!(out.contains(".split(\",\")"), "got: {out}");
}

// ── Array methods ──────────────────────────────────────────────────────

#[test]
fn array_sort_is_non_mutating() {
    let out = compile("ให้ xs = [3, 1, 2].เรียง();");
    // non-mutating: .slice().sort() so the original is not reordered
    assert!(out.contains(".slice().sort()"), "got: {out}");
}

#[test]
fn array_filter_becomes_filter() {
    let out = compile("ให้ xs = [1, 2, 3].กรอง((x) => x > 1);");
    assert!(out.contains(".filter("), "got: {out}");
}

#[test]
fn array_map_becomes_map() {
    let out = compile("ให้ xs = [1, 2, 3].แปลง((x) => x * 2);");
    assert!(out.contains(".map("), "got: {out}");
}

#[test]
fn array_reduce_becomes_reduce() {
    let out = compile("ให้ sum = [1, 2, 3].ลด((a, b) => a + b, 0);");
    assert!(out.contains(".reduce("), "got: {out}");
}

#[test]
fn array_includes_becomes_includes() {
    let out = compile("ให้ has = [1, 2, 3].มี(2);");
    assert!(out.contains(".includes(2)"), "got: {out}");
}
