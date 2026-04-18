//! JS reserved words must not emit as raw identifiers, or the resulting
//! code fails to parse under Node. Each collision is mangled with a `$`
//! suffix (class → class$, new → new$, yield → yield$, …).

use std::process::Command;
use thailang_emit_js::emit;
use thailang_parser::parse;

fn compile(src: &str) -> String {
    let p = parse(src).expect("parse");
    emit(&p).trim().to_string()
}

/// Compiles and runs through node to prove the emit is syntactically valid.
fn run(src: &str) -> String {
    let js = compile(src);
    let out = Command::new("node")
        .arg("-e")
        .arg(&js)
        .output()
        .expect("spawn node");
    assert!(
        out.status.success(),
        "node failed for js: {}\nstderr: {}",
        js,
        String::from_utf8_lossy(&out.stderr)
    );
    String::from_utf8_lossy(&out.stdout).trim().to_string()
}

#[test]
fn let_name_class_is_mangled() {
    let out = compile("ให้ class = 5;");
    assert!(out.contains("let class$ = 5"), "got: {out}");
}

#[test]
fn let_name_new_is_mangled() {
    let out = compile("ให้ new = 1;");
    assert!(out.contains("let new$ = 1"), "got: {out}");
}

#[test]
fn function_name_return_is_mangled() {
    let out = compile("ฟังก์ชัน return() { คืน 1; }");
    assert!(out.contains("function return$("), "got: {out}");
}

#[test]
fn param_name_this_is_mangled() {
    let out = compile("ฟังก์ชัน f(this) { คืน this; }");
    assert!(out.contains("function f(this$)"), "got: {out}");
    assert!(out.contains("return this$"), "got: {out}");
}

#[test]
fn reference_of_mangled_name_matches_declaration() {
    // Declaration and use must rename consistently — otherwise the JS
    // references an undefined `class$` or shadows the global `class`.
    let out = compile("ให้ class = 5; พิมพ์(class);");
    assert!(out.contains("let class$ = 5"), "got: {out}");
    assert!(out.contains("console.log(class$)"), "got: {out}");
}

#[test]
fn thai_names_never_mangled() {
    let out = compile("ให้ ชื่อ = \"สม\"; พิมพ์(ชื่อ);");
    assert!(out.contains("let ชื่อ = "), "got: {out}");
    assert!(!out.contains("$"), "got: {out}");
}

#[test]
fn user_written_dollar_suffix_not_double_mangled() {
    // `class$` (already user-picked) is not a reserved word, so it should
    // emit as-is and NOT become `class$$`.
    let out = compile("ให้ class$ = 1;");
    assert!(out.contains("let class$ = 1"), "got: {out}");
    assert!(!out.contains("class$$"), "got: {out}");
}

#[test]
fn strict_mode_reserved_also_mangled() {
    // `let`, `static`, `implements`, `interface`, `package`, `private`,
    // `protected`, `public`, `await` — strict-mode reserved; JS modules
    // are strict so these need mangling too.
    let out = compile("ให้ let = 1; ให้ static = 2; ให้ await = 3;");
    assert!(out.contains("let let$ = 1"), "got: {out}");
    assert!(out.contains("let static$ = 2"), "got: {out}");
    assert!(out.contains("let await$ = 3"), "got: {out}");
}

#[test]
fn runs_under_node() {
    // End-to-end: emit + execute. If mangling is missing or inconsistent,
    // node will SyntaxError and this assertion fires.
    let stdout = run("ให้ class = 5; พิมพ์(class);");
    assert_eq!(stdout, "5");
}

#[test]
fn member_access_names_not_mangled() {
    // `x.class` is valid JS (contextual keyword in member position).
    // Mangling it would break real-world JS interop.
    let out = compile("ให้ y = x.class;");
    assert!(out.contains("x.class"), "got: {out}");
    assert!(!out.contains("x.class$"), "got: {out}");
}

#[test]
fn foreach_var_is_mangled() {
    // `แต่ละ` syntax requires parens: `แต่ละ (var ใน expr) { ... }`.
    let out = compile("แต่ละ (new ใน [1, 2]) { พิมพ์(new); }");
    assert!(out.contains("for (const new$ of"), "got: {out}");
    assert!(out.contains("console.log(new$)"), "got: {out}");
}
