use thailang_emit_js::emit;
use thailang_parser::parse;

const FIZZBUZZ_SRC: &str = r#"
วน (ให้ i = 1; i <= 100; i += 1) {
    ถ้า (i % 15 == 0) {
        ระบบ.แสดง("FizzBuzz");
    } ไม่ก็ (i % 3 == 0) {
        ระบบ.แสดง("Fizz");
    } ไม่ก็ (i % 5 == 0) {
        ระบบ.แสดง("Buzz");
    } ไม่งั้น {
        ระบบ.แสดง(i);
    }
}
"#;

#[test]
fn fizzbuzz_compiles_to_runnable_js() {
    let p = parse(FIZZBUZZ_SRC).expect("fizzbuzz parses");
    let js = emit(&p);
    assert!(js.contains("for (let i = 1;"));
    assert!(js.contains("(i <= 100)"));
    assert!(js.contains("i += 1"));
    assert!(js.contains("(i % 15)"));
    assert!(js.contains("=== 0"));
    assert!(js.contains("console.log(\"FizzBuzz\")"));
    assert!(js.contains("console.log(\"Fizz\")"));
    assert!(js.contains("console.log(\"Buzz\")"));
}

#[test]
fn full_program_with_fn_and_call() {
    let src = r#"
สูตร บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข {
    ส่งกลับ ก + ข;
}

ระบบ.แสดง(บวก(10, 20));
"#;
    let p = parse(src).expect("parse");
    let js = emit(&p);
    assert!(js.contains("function บวก(ก, ข) {"));
    assert!(js.contains("return (ก + ข);"));
    assert!(js.contains("console.log(บวก(10, 20));"));
}
