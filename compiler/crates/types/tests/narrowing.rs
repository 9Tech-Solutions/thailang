use thailang_parser::parse;
use thailang_types::check;

fn errors_for(src: &str) -> Vec<String> {
    let p = parse(src).expect("parse");
    check(&p).into_iter().map(|e| e.message).collect()
}

#[test]
fn narrowing_on_is_check_inside_if_body() {
    // Inside `ถ้า (x เป็น ข้อความ)`, x should be narrowed to ข้อความ, so
    // assigning it into a ข้อความ slot must type-check.
    let src = "ให้ x: ตัวเลข | ข้อความ = \"hi\";\n\
               ถ้า (x เป็น ข้อความ) {\n\
                 ให้ s: ข้อความ = x;\n\
               }";
    assert!(errors_for(src).is_empty());
}

#[test]
fn outside_the_guard_type_stays_union() {
    // After the `if`, x reverts to the broader union. Assigning into
    // ข้อความ should error.
    let src = "ให้ x: ตัวเลข | ข้อความ = \"hi\";\n\
               ถ้า (x เป็น ข้อความ) { ระบบ.แสดง(x); }\n\
               ให้ s: ข้อความ = x;";
    let errs = errors_for(src);
    assert_eq!(errs.len(), 1, "{errs:?}");
}

#[test]
fn narrowing_to_int_inside_if() {
    let src = "ให้ v: จำนวนเต็ม | ข้อความ = 1;\n\
               ถ้า (v เป็น จำนวนเต็ม) {\n\
                 ให้ n: จำนวนเต็ม = v;\n\
               }";
    assert!(errors_for(src).is_empty());
}
