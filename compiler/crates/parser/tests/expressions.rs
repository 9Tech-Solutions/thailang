use thailang_ast::{BinaryOp, Expr, ExprKind, UnaryOp};
use thailang_parser::parse_expression;

fn parse_expr(src: &str) -> Expr {
    parse_expression(src).expect("parse expression")
}

#[test]
fn integer_literal() {
    assert_eq!(parse_expr("42").kind, ExprKind::Int(42));
}

#[test]
fn float_literal() {
    assert_eq!(parse_expr("4.25").kind, ExprKind::Float(4.25));
}

#[test]
fn ascii_string_literal() {
    assert_eq!(parse_expr(r#""hi""#).kind, ExprKind::Str("hi".to_string()));
}

#[test]
fn thai_string_literal() {
    assert_eq!(
        parse_expr(r#""สวัสดี""#).kind,
        ExprKind::Str("สวัสดี".to_string())
    );
}

#[test]
fn bool_true_keyword() {
    assert_eq!(parse_expr("จริง").kind, ExprKind::Bool(true));
}

#[test]
fn bool_false_keyword() {
    assert_eq!(parse_expr("เท็จ").kind, ExprKind::Bool(false));
}

#[test]
fn null_literal() {
    assert_eq!(parse_expr("ว่าง").kind, ExprKind::Null);
}

#[test]
fn thai_identifier() {
    assert_eq!(parse_expr("ชื่อ").kind, ExprKind::Ident("ชื่อ".to_string()));
}

#[test]
fn binary_addition() {
    let e = parse_expr("1 + 2");
    match e.kind {
        ExprKind::Binary { op, left, right } => {
            assert_eq!(op, BinaryOp::Add);
            assert_eq!(left.kind, ExprKind::Int(1));
            assert_eq!(right.kind, ExprKind::Int(2));
        }
        _ => panic!("expected binary"),
    }
}

#[test]
fn multiplication_higher_precedence_than_addition() {
    let e = parse_expr("1 + 2 * 3");
    match e.kind {
        ExprKind::Binary {
            op: BinaryOp::Add,
            right,
            ..
        } => match right.kind {
            ExprKind::Binary {
                op: BinaryOp::Mul, ..
            } => (),
            _ => panic!("expected mul on right"),
        },
        _ => panic!("expected add at top"),
    }
}

#[test]
fn left_associative_subtraction() {
    let e = parse_expr("10 - 3 - 2");
    match e.kind {
        ExprKind::Binary {
            op: BinaryOp::Sub,
            left,
            right,
        } => {
            assert_eq!(right.kind, ExprKind::Int(2));
            assert!(matches!(
                left.kind,
                ExprKind::Binary {
                    op: BinaryOp::Sub,
                    ..
                }
            ));
        }
        _ => panic!("expected subtraction"),
    }
}

#[test]
fn parenthesized_expression_overrides_precedence() {
    let e = parse_expr("(1 + 2) * 3");
    match e.kind {
        ExprKind::Binary {
            op: BinaryOp::Mul,
            left,
            ..
        } => assert!(matches!(
            left.kind,
            ExprKind::Binary {
                op: BinaryOp::Add,
                ..
            }
        )),
        _ => panic!("expected multiplication"),
    }
}

#[test]
fn unary_negation() {
    let e = parse_expr("-5");
    match e.kind {
        ExprKind::Unary {
            op: UnaryOp::Neg,
            operand,
        } => {
            assert_eq!(operand.kind, ExprKind::Int(5));
        }
        _ => panic!("expected unary neg"),
    }
}

#[test]
fn unary_not_with_thai_keyword() {
    let e = parse_expr("ไม่ จริง");
    match e.kind {
        ExprKind::Unary {
            op: UnaryOp::Not,
            operand,
        } => {
            assert_eq!(operand.kind, ExprKind::Bool(true));
        }
        _ => panic!("expected unary not"),
    }
}

#[test]
fn function_call_no_args() {
    let e = parse_expr("ทักทาย()");
    match e.kind {
        ExprKind::Call { callee, args } => {
            assert_eq!(callee.kind, ExprKind::Ident("ทักทาย".to_string()));
            assert!(args.is_empty());
        }
        _ => panic!("expected call"),
    }
}

#[test]
fn function_call_with_two_args() {
    let e = parse_expr("บวก(1, 2)");
    match e.kind {
        ExprKind::Call { callee, args } => {
            assert_eq!(callee.kind, ExprKind::Ident("บวก".to_string()));
            assert_eq!(args.len(), 2);
        }
        _ => panic!("expected call"),
    }
}

#[test]
fn print_keyword_lexes_as_callable_identifier() {
    let e = parse_expr("พิมพ์(\"สวัสดี\")");
    match e.kind {
        ExprKind::Call { callee, args } => {
            assert_eq!(callee.kind, ExprKind::Ident("พิมพ์".to_string()));
            assert_eq!(args.len(), 1);
        }
        _ => panic!("expected call"),
    }
}

#[test]
fn comparison_eq() {
    let e = parse_expr("a == b");
    assert!(matches!(
        e.kind,
        ExprKind::Binary {
            op: BinaryOp::Eq,
            ..
        }
    ));
}

#[test]
fn modulo_operator() {
    let e = parse_expr("i % 3");
    assert!(matches!(
        e.kind,
        ExprKind::Binary {
            op: BinaryOp::Mod,
            ..
        }
    ));
}

#[test]
fn logical_and_thai_keyword() {
    let e = parse_expr("จริง และ เท็จ");
    assert!(matches!(
        e.kind,
        ExprKind::Binary {
            op: BinaryOp::And,
            ..
        }
    ));
}
