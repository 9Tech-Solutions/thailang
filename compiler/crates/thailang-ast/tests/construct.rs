use thailang_ast::*;

#[test]
fn span_constructs_and_merges() {
    let a = Span::new(0, 5);
    let b = Span::new(3, 10);
    let merged = a.merge(b);
    assert_eq!(merged, Span::new(0, 10));
}

#[test]
fn int_literal_expr_is_constructible() {
    let e = Expr {
        kind: ExprKind::Int(42),
        span: Span::new(0, 2),
    };
    assert_eq!(e.kind, ExprKind::Int(42));
    assert_eq!(e.span.start, 0);
}

#[test]
fn binary_addition_expression() {
    let left = Expr { kind: ExprKind::Int(1), span: Span::new(0, 1) };
    let right = Expr { kind: ExprKind::Int(2), span: Span::new(2, 3) };
    let e = Expr {
        kind: ExprKind::Binary {
            op: BinaryOp::Add,
            left: Box::new(left),
            right: Box::new(right),
        },
        span: Span::new(0, 3),
    };
    match e.kind {
        ExprKind::Binary { op, .. } => assert_eq!(op, BinaryOp::Add),
        _ => panic!("expected binary expression"),
    }
}

#[test]
fn fn_decl_with_thai_param_names() {
    let fn_decl = FnDecl {
        name: "บวก".to_string(),
        params: vec![
            Param { name: "ก".to_string(), type_ann: Some(TypeAnn::Number), span: Span::new(0, 1) },
            Param { name: "ข".to_string(), type_ann: Some(TypeAnn::Number), span: Span::new(2, 3) },
        ],
        return_type: Some(TypeAnn::Number),
        body: vec![],
        is_async: false,
    };
    assert_eq!(fn_decl.name, "บวก");
    assert_eq!(fn_decl.params.len(), 2);
    assert_eq!(fn_decl.params[0].name, "ก");
}

#[test]
fn union_type_collects_variants() {
    let t = TypeAnn::Union(vec![TypeAnn::Number, TypeAnn::String]);
    match t {
        TypeAnn::Union(variants) => assert_eq!(variants.len(), 2),
        _ => panic!("expected union"),
    }
}

#[test]
fn array_type_carries_inner() {
    let t = TypeAnn::Array(Box::new(TypeAnn::Int));
    match t {
        TypeAnn::Array(inner) => assert_eq!(*inner, TypeAnn::Int),
        _ => panic!("expected array"),
    }
}

#[test]
fn empty_program_has_no_items() {
    let p = Program::default();
    assert!(p.items.is_empty());
}

#[test]
fn if_stmt_with_else_if_chain() {
    let cond = Expr { kind: ExprKind::Bool(true), span: Span::new(0, 4) };
    let stmt = Stmt {
        kind: StmtKind::If {
            cond,
            then_branch: vec![],
            else_ifs: vec![(
                Expr { kind: ExprKind::Bool(false), span: Span::new(0, 5) },
                vec![],
            )],
            else_branch: Some(vec![]),
        },
        span: Span::new(0, 20),
    };
    match stmt.kind {
        StmtKind::If { else_ifs, else_branch, .. } => {
            assert_eq!(else_ifs.len(), 1);
            assert!(else_branch.is_some());
        }
        _ => panic!("expected if"),
    }
}
