use thailang_ast::*;

use crate::error::TypeError;

pub fn check(program: &Program) -> Vec<TypeError> {
    let mut errors = Vec::new();
    for item in &program.items {
        check_item(item, &mut errors);
    }
    errors
}

fn check_item(item: &Item, errors: &mut Vec<TypeError>) {
    match &item.kind {
        ItemKind::Let { type_ann: Some(declared), value, .. } => {
            check_assignment(declared, value, item.span, errors);
        }
        ItemKind::Fn(f) => check_fn(f, errors),
        ItemKind::Stmt(s) => check_stmt(s, errors),
        ItemKind::Let { type_ann: None, .. } => {}
    }
}

fn check_fn(f: &FnDecl, errors: &mut Vec<TypeError>) {
    for stmt in &f.body {
        check_stmt(stmt, errors);
    }
}

fn check_stmt(stmt: &Stmt, errors: &mut Vec<TypeError>) {
    match &stmt.kind {
        StmtKind::Let { type_ann: Some(declared), value, .. } => {
            check_assignment(declared, value, stmt.span, errors);
        }
        StmtKind::Block(stmts)
        | StmtKind::While { body: stmts, .. } => {
            for s in stmts {
                check_stmt(s, errors);
            }
        }
        StmtKind::If { then_branch, else_ifs, else_branch, .. } => {
            for s in then_branch {
                check_stmt(s, errors);
            }
            for (_, body) in else_ifs {
                for s in body {
                    check_stmt(s, errors);
                }
            }
            if let Some(body) = else_branch {
                for s in body {
                    check_stmt(s, errors);
                }
            }
        }
        StmtKind::For { init, body, .. } => {
            check_stmt(init, errors);
            for s in body {
                check_stmt(s, errors);
            }
        }
        StmtKind::ForEach { body, .. } => {
            for s in body {
                check_stmt(s, errors);
            }
        }
        _ => {}
    }
}

fn check_assignment(declared: &TypeAnn, value: &Expr, span: Span, errors: &mut Vec<TypeError>) {
    let inferred = infer_literal_type(value);
    let Some(actual) = inferred else { return };
    if !is_assignable(&actual, declared) {
        errors.push(TypeError::new(
            format!(
                "type mismatch: expected {}, found {}",
                describe(declared),
                describe(&actual),
            ),
            span,
        ));
    }
}

/// Infer the type of an expression for literal forms only.
/// Returns None for expressions whose type cannot be inferred without
/// a richer type system (calls, identifiers, binary ops, etc.).
fn infer_literal_type(expr: &Expr) -> Option<TypeAnn> {
    match &expr.kind {
        ExprKind::Int(_) => Some(TypeAnn::Int),
        ExprKind::Float(_) => Some(TypeAnn::Number),
        ExprKind::Str(_) => Some(TypeAnn::String),
        ExprKind::Bool(_) => Some(TypeAnn::Bool),
        ExprKind::Null => Some(TypeAnn::Null),
        ExprKind::Array(items) => {
            let inner = items
                .iter()
                .filter_map(infer_literal_type)
                .next()
                .unwrap_or(TypeAnn::Any);
            Some(TypeAnn::Array(Box::new(inner)))
        }
        _ => None,
    }
}

/// Whether `actual` can be assigned to a target declared as `declared`.
/// Rules:
///   - Any accepts everything (and is assignable to anything).
///   - Int is assignable to Number (numeric widening).
///   - Otherwise types must match exactly.
fn is_assignable(actual: &TypeAnn, declared: &TypeAnn) -> bool {
    if matches!(declared, TypeAnn::Any) || matches!(actual, TypeAnn::Any) {
        return true;
    }
    if matches!(declared, TypeAnn::Number) && matches!(actual, TypeAnn::Int) {
        return true;
    }
    if let (TypeAnn::Array(d), TypeAnn::Array(a)) = (declared, actual) {
        return is_assignable(a, d);
    }
    if let TypeAnn::Union(variants) = declared {
        return variants.iter().any(|v| is_assignable(actual, v));
    }
    actual == declared
}

fn describe(ty: &TypeAnn) -> String {
    match ty {
        TypeAnn::Number => "ตัวเลข".to_string(),
        TypeAnn::Int => "จำนวนเต็ม".to_string(),
        TypeAnn::String => "ข้อความ".to_string(),
        TypeAnn::Bool => "จริงเท็จ".to_string(),
        TypeAnn::Null => "ว่าง".to_string(),
        TypeAnn::Any => "อะไรก็ได้".to_string(),
        TypeAnn::Void => "ไม่คืน".to_string(),
        TypeAnn::Array(inner) => format!("รายการ<{}>", describe(inner)),
        TypeAnn::Map => "แผนที่".to_string(),
        TypeAnn::Union(variants) => variants
            .iter()
            .map(describe)
            .collect::<Vec<_>>()
            .join(" | "),
        TypeAnn::Named { name, .. } => name.clone(),
    }
}
