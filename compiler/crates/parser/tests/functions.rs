use thailang_ast::{ItemKind, StmtKind, TypeAnn};
use thailang_parser::parse;

#[test]
fn function_with_no_params_and_no_return_type() {
    let p = parse("ฟังก์ชัน hello() { พิมพ์(\"hi\"); }").unwrap();
    match &p.items[0].kind {
        ItemKind::Fn(f) => {
            assert_eq!(f.name, "hello");
            assert!(f.params.is_empty());
            assert!(f.return_type.is_none());
            assert_eq!(f.body.len(), 1);
        }
        _ => panic!("expected fn"),
    }
}

#[test]
fn function_with_typed_params_and_return_type() {
    let p = parse("ฟังก์ชัน บวก(ก: ตัวเลข, ข: ตัวเลข) -> ตัวเลข { คืน ก + ข; }").unwrap();
    match &p.items[0].kind {
        ItemKind::Fn(f) => {
            assert_eq!(f.name, "บวก");
            assert_eq!(f.params.len(), 2);
            assert_eq!(f.params[0].name, "ก");
            assert_eq!(f.params[0].type_ann.as_ref(), Some(&TypeAnn::Number));
            assert_eq!(f.return_type.as_ref(), Some(&TypeAnn::Number));
            assert_eq!(f.body.len(), 1);
            assert!(matches!(f.body[0].kind, StmtKind::Return(Some(_))));
        }
        _ => panic!("expected fn"),
    }
}

#[test]
fn return_with_no_value() {
    let p = parse("ฟังก์ชัน f() { คืน; }").unwrap();
    match &p.items[0].kind {
        ItemKind::Fn(f) => match &f.body[0].kind {
            StmtKind::Return(None) => (),
            other => panic!("expected bare return, got {other:?}"),
        },
        _ => panic!("expected fn"),
    }
}
