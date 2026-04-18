use thailang_parser::parse;
use thailang_types::check;

fn errors_for(src: &str) -> Vec<String> {
    let p = parse(src).expect("parse");
    check(&p).into_iter().map(|e| e.message).collect()
}

// ── คณิต module return types ───────────────────────────────────────────

#[test]
fn math_max_returns_number() {
    assert!(errors_for("ให้ x: ตัวเลข = คณิต.สูงสุด(1, 2, 3);").is_empty());
}

#[test]
fn math_random_returns_number() {
    assert!(errors_for("ให้ x: ตัวเลข = คณิต.สุ่ม();").is_empty());
    let errs = errors_for("ให้ x: ข้อความ = คณิต.สุ่ม();");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

// ── String method return types ─────────────────────────────────────────

#[test]
fn string_length_returns_int() {
    assert!(errors_for("ให้ n: จำนวนเต็ม = \"hi\".ความยาว;").is_empty());
}

#[test]
fn string_upper_returns_string() {
    assert!(errors_for("ให้ s: ข้อความ = \"hi\".เป็นตัวใหญ่();").is_empty());
    let errs = errors_for("ให้ n: จำนวนเต็ม = \"hi\".เป็นตัวใหญ่();");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

#[test]
fn string_split_returns_array_of_string() {
    assert!(errors_for("ให้ xs: รายการ<ข้อความ> = \"a,b\".แยก(\",\");").is_empty());
}

// ── Array method return types ──────────────────────────────────────────

#[test]
fn array_length_returns_int() {
    assert!(errors_for("ให้ n: จำนวนเต็ม = [1, 2, 3].ความยาว;").is_empty());
}

#[test]
fn array_includes_returns_bool() {
    assert!(errors_for("ให้ b: จริงเท็จ = [1, 2, 3].มี(2);").is_empty());
    let errs = errors_for("ให้ n: จำนวนเต็ม = [1, 2, 3].มี(2);");
    assert_eq!(errs.len(), 1, "{errs:?}");
}
