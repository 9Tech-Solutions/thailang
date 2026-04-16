use thailang_ast::{ItemKind, StmtKind};
use thailang_parser::parse;

#[test]
fn foreach_over_array_literal() {
    let p = parse(
        "แต่ละ (ผล ใน [\"มะม่วง\", \"ทุเรียน\"]) { พิมพ์(ผล); }",
    )
    .unwrap();
    match &p.items[0].kind {
        ItemKind::Stmt(s) => match &s.kind {
            StmtKind::ForEach { var, body, .. } => {
                assert_eq!(var, "ผล");
                assert_eq!(body.len(), 1);
            }
            other => panic!("expected for-each, got {other:?}"),
        },
        _ => panic!("expected stmt item"),
    }
}

#[test]
fn foreach_over_named_iterable() {
    let p = parse("แต่ละ (x ใน xs) { พิมพ์(x); }").unwrap();
    match &p.items[0].kind {
        ItemKind::Stmt(s) => match &s.kind {
            StmtKind::ForEach { var, .. } => assert_eq!(var, "x"),
            _ => panic!("expected for-each"),
        },
        _ => panic!("expected stmt item"),
    }
}
