use thailang_ast::{ItemKind, StmtKind};
use thailang_parser::parse;

fn first_stmt_kind(src: &str) -> StmtKind {
    let p = parse(src).unwrap();
    match &p.items[0].kind {
        ItemKind::Stmt(s) => s.kind.clone(),
        other => panic!("expected stmt item, got {other:?}"),
    }
}

#[test]
fn simple_if_with_then_only() {
    let kind = first_stmt_kind("ถ้า (จริง) { พิมพ์(1); }");
    match kind {
        StmtKind::If {
            then_branch,
            else_ifs,
            else_branch,
            ..
        } => {
            assert_eq!(then_branch.len(), 1);
            assert!(else_ifs.is_empty());
            assert!(else_branch.is_none());
        }
        _ => panic!("expected if"),
    }
}

#[test]
fn if_with_else_if_chain_and_else() {
    let kind = first_stmt_kind("ถ้า (x == 1) { พิมพ์(1); } ไม่ก็ (x == 2) { พิมพ์(2); } ไม่งั้น { พิมพ์(0); }");
    match kind {
        StmtKind::If {
            else_ifs,
            else_branch,
            ..
        } => {
            assert_eq!(else_ifs.len(), 1);
            assert!(else_branch.is_some());
        }
        _ => panic!("expected if"),
    }
}

#[test]
fn while_loop() {
    let kind = first_stmt_kind("ตราบ (i < 10) { i += 1; }");
    match kind {
        StmtKind::While { body, .. } => assert_eq!(body.len(), 1),
        _ => panic!("expected while"),
    }
}

#[test]
fn c_style_for_loop() {
    let kind = first_stmt_kind("วน (ให้ i = 0; i < 10; i += 1) { พิมพ์(i); }");
    match kind {
        StmtKind::For { body, .. } => assert_eq!(body.len(), 1),
        _ => panic!("expected for"),
    }
}

#[test]
fn break_in_loop() {
    let kind = first_stmt_kind("ตราบ (จริง) { หยุด; }");
    match kind {
        StmtKind::While { body, .. } => match &body[0].kind {
            StmtKind::Break => (),
            other => panic!("expected break, got {other:?}"),
        },
        _ => panic!("expected while"),
    }
}

#[test]
fn continue_in_loop() {
    let kind = first_stmt_kind("ตราบ (จริง) { ข้าม; }");
    match kind {
        StmtKind::While { body, .. } => assert!(matches!(body[0].kind, StmtKind::Continue)),
        _ => panic!("expected while"),
    }
}

#[test]
fn nested_if_inside_for() {
    let src = "วน (ให้ i = 1; i <= 100; i += 1) {
        ถ้า (i % 15 == 0) { พิมพ์(\"FizzBuzz\"); }
        ไม่ก็ (i % 3 == 0) { พิมพ์(\"Fizz\"); }
        ไม่ก็ (i % 5 == 0) { พิมพ์(\"Buzz\"); }
        ไม่งั้น { พิมพ์(i); }
    }";
    let p = parse(src).expect("fizzbuzz parses");
    assert_eq!(p.items.len(), 1);
}
