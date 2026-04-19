use thailang_ast::{ExprKind, ItemKind, StmtKind, TypeAnn};
use thailang_parser::parse;

#[test]
fn let_decl_with_int() {
    let p = parse("ให้ x = 42;").unwrap();
    assert_eq!(p.items.len(), 1);
    match &p.items[0].kind {
        ItemKind::Let {
            name,
            value,
            mutable,
            ..
        } => {
            assert_eq!(name, "x");
            assert!(*mutable);
            assert_eq!(value.kind, ExprKind::Int(42));
        }
        _ => panic!("expected let"),
    }
}

#[test]
fn const_decl_is_immutable() {
    let p = parse("คงที่ PI = 3.14;").unwrap();
    match &p.items[0].kind {
        ItemKind::Let { name, mutable, .. } => {
            assert_eq!(name, "PI");
            assert!(!*mutable);
        }
        _ => panic!("expected const-as-let"),
    }
}

#[test]
fn let_with_thai_name_and_string_type() {
    let p = parse("ให้ ชื่อ: ข้อความ = \"สมชาย\";").unwrap();
    match &p.items[0].kind {
        ItemKind::Let { name, type_ann, .. } => {
            assert_eq!(name, "ชื่อ");
            assert_eq!(type_ann.as_ref(), Some(&TypeAnn::String));
        }
        _ => panic!("expected let"),
    }
}

#[test]
fn expression_statement() {
    let p = parse("ระบบ.แสดง(\"สวัสดี\");").unwrap();
    assert_eq!(p.items.len(), 1);
    match &p.items[0].kind {
        ItemKind::Stmt(s) => assert!(matches!(s.kind, StmtKind::Expr(_))),
        _ => panic!("expected stmt item"),
    }
}
