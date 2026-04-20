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
    assert!(errors_for("ให้ xs: ชุด<ข้อความ> = \"a,b\".แยก(\",\");").is_empty());
}

// ── Array method return types ──────────────────────────────────────────

#[test]
fn array_length_returns_int() {
    assert!(errors_for("ให้ n: จำนวนเต็ม = [1, 2, 3].ความยาว;").is_empty());
}

#[test]
fn array_includes_returns_bool() {
    assert!(errors_for("ให้ b: ถูกผิด = [1, 2, 3].มี(2);").is_empty());
    let errs = errors_for("ให้ n: จำนวนเต็ม = [1, 2, 3].มี(2);");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

// ── Receiver-aware array method return types (Phase 3C) ───────────────

#[test]
fn array_sort_preserves_element_type() {
    assert!(errors_for("ให้ xs: ชุด<จำนวนเต็ม> = [1, 2, 3].เรียง();").is_empty());
    assert!(errors_for("ให้ xs: ชุด<ข้อความ> = [\"b\", \"a\"].เรียง();").is_empty());
    let errs = errors_for("ให้ xs: ชุด<ข้อความ> = [1, 2, 3].เรียง();");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

#[test]
fn array_filter_preserves_element_type() {
    assert!(errors_for("ให้ xs: ชุด<จำนวนเต็ม> = [1, 2, 3].กรอง((x) => x > 1);").is_empty());
    let errs = errors_for("ให้ xs: ชุด<ข้อความ> = [1, 2, 3].กรอง((x) => x > 1);");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

#[test]
fn array_map_infers_callback_return() {
    // numeric -> numeric, Int * Int keeps Int per numeric_combine
    assert!(errors_for("ให้ xs: ชุด<จำนวนเต็ม> = [1, 2, 3].แปลง((x) => x * 2);").is_empty());
    // numeric -> string via constant
    assert!(errors_for("ให้ xs: ชุด<ข้อความ> = [1, 2, 3].แปลง((x) => \"yes\");").is_empty());
    // mismatch: numeric -> bool body, assigned to ชุด<ข้อความ>
    let errs = errors_for("ให้ xs: ชุด<ข้อความ> = [1, 2, 3].แปลง((x) => x > 0);");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

#[test]
fn array_reduce_returns_init_type() {
    assert!(errors_for("ให้ n: จำนวนเต็ม = [1, 2, 3].ลด((ก, ข) => ก + ข, 0);").is_empty());
    assert!(errors_for("ให้ s: ข้อความ = [1, 2, 3].ลด((ก, ข) => ก, \"seed\");").is_empty());
    let errs = errors_for("ให้ s: ข้อความ = [1, 2, 3].ลด((ก, ข) => ก + ข, 0);");
    assert_eq!(errs.len(), 1, "{errs:?}");
}

#[test]
fn array_method_chain_threads_element_type() {
    // map then sort: Int[] -> Int[] -> Int[]
    assert!(errors_for("ให้ xs: ชุด<จำนวนเต็ม> = [1, 2, 3].แปลง((x) => x * 2).เรียง();").is_empty());
    // filter then map to string
    assert!(
        errors_for("ให้ xs: ชุด<ข้อความ> = [1, 2, 3].กรอง((x) => x > 1).แปลง((x) => \"hi\");")
            .is_empty()
    );
}

#[test]
fn string_split_then_array_method_still_works() {
    // regression: String receiver path must still reach method_return_type
    assert!(errors_for("ให้ xs: ชุด<ข้อความ> = \"a,b,c\".แยก(\",\").เรียง();").is_empty());
}
