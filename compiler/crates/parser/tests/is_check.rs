use thailang_ast::{ExprKind, ItemKind, StmtKind, TypeAnn};
use thailang_parser::parse;

fn single_stmt(src: &str) -> StmtKind {
    let p = parse(src).expect("parse");
    assert_eq!(p.items.len(), 1);
    match p.items.into_iter().next().unwrap().kind {
        ItemKind::Stmt(s) => s.kind,
        other => panic!("expected Stmt item, got {other:?}"),
    }
}

#[test]
fn is_check_parses_with_type_rhs_string() {
    let src = "ถ้า (ค่า เป็น ข้อความ) { ระบบ.แสดง(ค่า); }";
    let stmt = single_stmt(src);
    let cond = match stmt {
        StmtKind::If { cond, .. } => cond,
        other => panic!("expected If, got {other:?}"),
    };
    match cond.kind {
        ExprKind::IsCheck { value, ty, .. } => {
            assert!(matches!(value.kind, ExprKind::Ident(ref n) if n == "ค่า"));
            assert_eq!(ty, TypeAnn::String);
        }
        other => panic!("expected IsCheck, got {other:?}"),
    }
}

#[test]
fn is_check_parses_with_type_rhs_int() {
    let src = "ถ้า (n เป็น จำนวนเต็ม) { ระบบ.แสดง(n); }";
    let stmt = single_stmt(src);
    let cond = match stmt {
        StmtKind::If { cond, .. } => cond,
        other => panic!("expected If, got {other:?}"),
    };
    if let ExprKind::IsCheck { ty, .. } = cond.kind {
        assert_eq!(ty, TypeAnn::Int);
    } else {
        panic!("expected IsCheck");
    }
}

#[test]
fn is_check_parses_with_null_type() {
    // `ว่าง` in expression position is null literal, but after `เป็น` it is a type.
    let src = "ถ้า (x เป็น ว่าง) { ระบบ.แสดง(\"none\"); }";
    let stmt = single_stmt(src);
    let cond = match stmt {
        StmtKind::If { cond, .. } => cond,
        other => panic!("expected If, got {other:?}"),
    };
    if let ExprKind::IsCheck { ty, .. } = cond.kind {
        assert_eq!(ty, TypeAnn::Null);
    } else {
        panic!("expected IsCheck");
    }
}

#[test]
fn null_type_annotation_in_let() {
    // Union with ว่าง must be usable as a declared type annotation.
    let p = parse("ให้ x: ตัวเลข | ว่าง = ว่าง;").expect("parse");
    let ItemKind::Let { type_ann, .. } = &p.items[0].kind else {
        panic!("expected Let")
    };
    let ann = type_ann.as_ref().expect("annotation");
    match ann {
        TypeAnn::Union(variants) => {
            assert!(variants.contains(&TypeAnn::Number));
            assert!(variants.contains(&TypeAnn::Null));
        }
        other => panic!("expected Union, got {other:?}"),
    }
}
