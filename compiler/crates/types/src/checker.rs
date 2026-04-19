use std::collections::HashMap;

use thailang_ast::*;

use crate::error::TypeError;
use crate::stdlib;

pub fn check(program: &Program) -> Vec<TypeError> {
    let mut cx = Ctx::default();
    for item in &program.items {
        cx.check_item(item);
    }
    cx.errors
}

#[derive(Default)]
struct Ctx {
    errors: Vec<TypeError>,
    /// Scope stack, each frame holds local bindings. `check_fn` pushes its
    /// params onto a fresh frame so they go out of scope when the fn ends.
    scopes: Vec<Scope>,
    /// Globals (top-level `ให้` + `ฟังก์ชัน`).
    globals: Scope,
    /// Return type of the function currently being checked, if any.
    current_return: Option<TypeAnn>,
}

#[derive(Default)]
struct Scope {
    vars: HashMap<String, VarInfo>,
}

#[derive(Clone)]
struct VarInfo {
    /// Declared type (static). Reassignments must satisfy this.
    declared: TypeAnn,
    /// Flow-narrowed type for the current path. Defaults to `declared`.
    narrowed: TypeAnn,
}

impl Ctx {
    // ── Scope helpers ──────────────────────────────────────────────────

    fn push_scope(&mut self) {
        self.scopes.push(Scope::default());
    }

    fn pop_scope(&mut self) {
        self.scopes.pop();
    }

    fn declare(&mut self, name: &str, ty: TypeAnn) {
        let info = VarInfo {
            declared: ty.clone(),
            narrowed: ty,
        };
        if let Some(scope) = self.scopes.last_mut() {
            scope.vars.insert(name.to_string(), info);
        } else {
            self.globals.vars.insert(name.to_string(), info);
        }
    }

    fn lookup(&self, name: &str) -> Option<&VarInfo> {
        for scope in self.scopes.iter().rev() {
            if let Some(info) = scope.vars.get(name) {
                return Some(info);
            }
        }
        self.globals.vars.get(name)
    }

    fn set_narrowed(&mut self, name: &str, ty: TypeAnn) -> Option<TypeAnn> {
        for scope in self.scopes.iter_mut().rev() {
            if let Some(info) = scope.vars.get_mut(name) {
                let prev = std::mem::replace(&mut info.narrowed, ty);
                return Some(prev);
            }
        }
        if let Some(info) = self.globals.vars.get_mut(name) {
            let prev = std::mem::replace(&mut info.narrowed, ty);
            return Some(prev);
        }
        None
    }

    // ── Item / Stmt dispatch ───────────────────────────────────────────

    fn check_item(&mut self, item: &Item) {
        match &item.kind {
            ItemKind::Let {
                name,
                type_ann,
                value,
                ..
            } => self.check_let(name, type_ann.as_ref(), value),
            ItemKind::Fn(f) => self.check_fn(f),
            ItemKind::Stmt(s) => self.check_stmt(s),
        }
    }

    fn check_fn(&mut self, f: &FnDecl) {
        // Register the function at its enclosing scope so sibling/inner code
        // can reference it by name. (Signatures as first-class types are not
        // tracked in Phase 3A, callers fall back to `Any`.)
        self.declare(&f.name, TypeAnn::Any);

        let prev_return = self
            .current_return
            .replace(f.return_type.clone().unwrap_or(TypeAnn::Any));

        self.push_scope();
        for param in &f.params {
            let ty = param.type_ann.clone().unwrap_or(TypeAnn::Any);
            self.declare(&param.name, ty);
        }
        for stmt in &f.body {
            self.check_stmt(stmt);
        }
        self.pop_scope();

        self.current_return = prev_return;
    }

    fn check_stmt(&mut self, stmt: &Stmt) {
        match &stmt.kind {
            StmtKind::Expr(e) => {
                self.infer_expr(e);
            }
            StmtKind::Let {
                name,
                type_ann,
                value,
                ..
            } => self.check_let(name, type_ann.as_ref(), value),
            StmtKind::Return(v) => self.check_return(v.as_ref(), stmt.span),
            StmtKind::If {
                cond,
                then_branch,
                else_ifs,
                else_branch,
            } => self.check_if(cond, then_branch, else_ifs, else_branch.as_deref()),
            StmtKind::While { cond, body } => {
                self.infer_expr(cond);
                self.push_scope();
                for s in body {
                    self.check_stmt(s);
                }
                self.pop_scope();
            }
            StmtKind::For {
                init,
                cond,
                update,
                body,
            } => {
                self.push_scope();
                self.check_stmt(init);
                self.infer_expr(cond);
                self.check_stmt(update);
                for s in body {
                    self.check_stmt(s);
                }
                self.pop_scope();
            }
            StmtKind::ForEach {
                var,
                iterable,
                body,
            } => {
                self.infer_expr(iterable);
                self.push_scope();
                self.declare(var, TypeAnn::Any);
                for s in body {
                    self.check_stmt(s);
                }
                self.pop_scope();
            }
            StmtKind::Block(stmts) => {
                self.push_scope();
                for s in stmts {
                    self.check_stmt(s);
                }
                self.pop_scope();
            }
            StmtKind::Assign {
                target,
                op: _,
                value,
            } => self.check_assign_stmt(target, value),
            StmtKind::Break | StmtKind::Continue => {}
        }
    }

    // ── Specific check helpers ─────────────────────────────────────────

    fn check_let(&mut self, name: &str, type_ann: Option<&TypeAnn>, value: &Expr) {
        let inferred = self.infer_expr(value);
        match (type_ann, inferred) {
            (Some(declared), Some(actual)) => {
                if !is_assignable(&actual, declared) {
                    self.errors.push(TypeError::new(
                        format!(
                            "type mismatch: expected {}, found {}",
                            describe(declared),
                            describe(&actual),
                        ),
                        value.span,
                    ));
                }
                self.declare(name, declared.clone());
            }
            (Some(declared), None) => {
                self.declare(name, declared.clone());
            }
            (None, Some(actual)) => {
                self.declare(name, actual);
            }
            (None, None) => {
                self.declare(name, TypeAnn::Any);
            }
        }
    }

    fn check_assign_stmt(&mut self, target: &Expr, value: &Expr) {
        let value_ty = self.infer_expr(value);
        if let ExprKind::Ident(name) = &target.kind {
            if let Some(info) = self.lookup(name).cloned() {
                if let Some(actual) = value_ty {
                    if !is_assignable(&actual, &info.declared) {
                        self.errors.push(TypeError::new(
                            format!(
                                "type mismatch: expected {}, found {}",
                                describe(&info.declared),
                                describe(&actual),
                            ),
                            value.span,
                        ));
                    }
                }
            }
        }
    }

    fn check_return(&mut self, value: Option<&Expr>, span: Span) {
        let declared = self.current_return.clone();
        match (value, declared) {
            (Some(e), Some(declared)) => {
                let Some(actual) = self.infer_expr(e) else {
                    return;
                };
                if !is_assignable(&actual, &declared) {
                    self.errors.push(TypeError::new(
                        format!(
                            "return type mismatch: expected {}, found {}",
                            describe(&declared),
                            describe(&actual),
                        ),
                        e.span,
                    ));
                }
            }
            (Some(e), None) => {
                self.infer_expr(e);
            }
            (None, _) => {
                let _ = span;
            }
        }
    }

    fn check_if(
        &mut self,
        cond: &Expr,
        then_branch: &[Stmt],
        else_ifs: &[(Expr, Vec<Stmt>)],
        else_branch: Option<&[Stmt]>,
    ) {
        // Type-check the condition expression itself (surfaces errors inside it).
        self.infer_expr(cond);

        // Narrow bindings referenced by `IsCheck`, then-branch sees the
        // narrowed view; on exit, restore the outer bindings.
        let narrowing = collect_narrowings(cond);
        let saved = self.apply_narrowings(&narrowing);
        self.push_scope();
        for s in then_branch {
            self.check_stmt(s);
        }
        self.pop_scope();
        self.restore_narrowings(saved);

        for (c, body) in else_ifs {
            self.infer_expr(c);
            let narrowing = collect_narrowings(c);
            let saved = self.apply_narrowings(&narrowing);
            self.push_scope();
            for s in body {
                self.check_stmt(s);
            }
            self.pop_scope();
            self.restore_narrowings(saved);
        }

        if let Some(body) = else_branch {
            self.push_scope();
            for s in body {
                self.check_stmt(s);
            }
            self.pop_scope();
        }
    }

    fn apply_narrowings(&mut self, narrowings: &[(String, TypeAnn)]) -> Vec<(String, TypeAnn)> {
        let mut saved = Vec::new();
        for (name, ty) in narrowings {
            if let Some(prev) = self.set_narrowed(name, ty.clone()) {
                saved.push((name.clone(), prev));
            }
        }
        saved
    }

    fn restore_narrowings(&mut self, saved: Vec<(String, TypeAnn)>) {
        for (name, ty) in saved {
            self.set_narrowed(&name, ty);
        }
    }

    // ── Expression inference ───────────────────────────────────────────

    fn infer_expr(&mut self, expr: &Expr) -> Option<TypeAnn> {
        match &expr.kind {
            ExprKind::Int(_) => Some(TypeAnn::Int),
            ExprKind::Float(_) => Some(TypeAnn::Number),
            ExprKind::Str(_) => Some(TypeAnn::String),
            ExprKind::Bool(_) => Some(TypeAnn::Bool),
            ExprKind::Null => Some(TypeAnn::Null),
            ExprKind::Ident(name) => self
                .lookup(name)
                .map(|info| info.narrowed.clone())
                .or(Some(TypeAnn::Any)),
            ExprKind::Binary { op, left, right } => {
                let l = self.infer_expr(left);
                let r = self.infer_expr(right);
                Some(infer_binary(*op, l.as_ref(), r.as_ref()))
            }
            ExprKind::Unary { op, operand } => {
                let inner = self.infer_expr(operand);
                Some(match op {
                    UnaryOp::Neg => inner.unwrap_or(TypeAnn::Number),
                    UnaryOp::Not => TypeAnn::Bool,
                })
            }
            ExprKind::IsCheck { value, .. } => {
                self.infer_expr(value);
                Some(TypeAnn::Bool)
            }
            ExprKind::Call { callee, args } => {
                let return_ty = match &callee.kind {
                    // Module call: `คณิต.สุ่ม()`, look up the (module, member)
                    // pair in the stdlib registry before falling back to Any.
                    ExprKind::Member { object, member } => {
                        if let ExprKind::Ident(obj_name) = &object.kind {
                            stdlib::module_call_return_type(obj_name, member).or_else(|| {
                                self.infer_expr(object);
                                stdlib::method_return_type(member)
                            })
                        } else {
                            self.infer_expr(callee);
                            stdlib::method_return_type(member)
                        }
                    }
                    _ => {
                        self.infer_expr(callee);
                        None
                    }
                };
                for a in args {
                    self.infer_expr(a);
                }
                Some(return_ty.unwrap_or(TypeAnn::Any))
            }
            ExprKind::Member { object, member } => {
                // Bare property read (no call): `.ความยาว` returns จำนวนเต็ม.
                // Skip inferring the object when it's a known stdlib module
                // name, since those aren't declared as regular bindings.
                let is_module = matches!(
                    &object.kind,
                    ExprKind::Ident(name) if stdlib::is_module_name(name)
                );
                if !is_module {
                    self.infer_expr(object);
                }
                Some(stdlib::property_type(member).unwrap_or(TypeAnn::Any))
            }
            ExprKind::Index { object, index } => {
                let obj_ty = self.infer_expr(object);
                self.infer_expr(index);
                match obj_ty {
                    Some(TypeAnn::Array(inner)) => Some(*inner),
                    _ => Some(TypeAnn::Any),
                }
            }
            ExprKind::Array(items) => {
                let mut element = TypeAnn::Any;
                for item in items {
                    if let Some(ty) = self.infer_expr(item) {
                        element = ty;
                        break;
                    }
                }
                Some(TypeAnn::Array(Box::new(element)))
            }
            ExprKind::Object(pairs) => {
                for (_, v) in pairs {
                    self.infer_expr(v);
                }
                Some(TypeAnn::Map)
            }
            ExprKind::Template(parts) => {
                for part in parts {
                    if let TemplatePart::Expr(e) = part {
                        self.infer_expr(e);
                    }
                }
                Some(TypeAnn::String)
            }
            ExprKind::ArrowFn { body, .. } => {
                match body.as_ref() {
                    ArrowBody::Expr(e) => {
                        self.infer_expr(e);
                    }
                    ArrowBody::Block(stmts) => {
                        self.push_scope();
                        for s in stmts {
                            self.check_stmt(s);
                        }
                        self.pop_scope();
                    }
                }
                Some(TypeAnn::Any)
            }
        }
    }
}

/// Collect type-guards that should narrow a binding inside the truthy branch
/// of `cond`. Only top-level `&&`-conjoined IsChecks on plain identifiers are
/// extracted; anything else is ignored, producing no false positives.
fn collect_narrowings(cond: &Expr) -> Vec<(String, TypeAnn)> {
    let mut out = Vec::new();
    walk_narrowings(cond, &mut out);
    out
}

fn walk_narrowings(expr: &Expr, out: &mut Vec<(String, TypeAnn)>) {
    match &expr.kind {
        ExprKind::IsCheck { value, ty, .. } => {
            if let ExprKind::Ident(name) = &value.kind {
                out.push((name.clone(), ty.clone()));
            }
        }
        ExprKind::Binary {
            op: BinaryOp::And,
            left,
            right,
        } => {
            walk_narrowings(left, out);
            walk_narrowings(right, out);
        }
        _ => {}
    }
}

// ── Binary inference ───────────────────────────────────────────────────

fn infer_binary(op: BinaryOp, l: Option<&TypeAnn>, r: Option<&TypeAnn>) -> TypeAnn {
    match op {
        BinaryOp::Add => {
            if matches!(l, Some(TypeAnn::String)) || matches!(r, Some(TypeAnn::String)) {
                TypeAnn::String
            } else {
                numeric_combine(l, r)
            }
        }
        BinaryOp::Sub | BinaryOp::Mul | BinaryOp::Div | BinaryOp::Mod => numeric_combine(l, r),
        BinaryOp::Eq
        | BinaryOp::NotEq
        | BinaryOp::Lt
        | BinaryOp::LtEq
        | BinaryOp::Gt
        | BinaryOp::GtEq
        | BinaryOp::And
        | BinaryOp::Or => TypeAnn::Bool,
    }
}

fn numeric_combine(l: Option<&TypeAnn>, r: Option<&TypeAnn>) -> TypeAnn {
    match (l, r) {
        (Some(TypeAnn::Int), Some(TypeAnn::Int)) => TypeAnn::Int,
        (
            Some(TypeAnn::Int) | Some(TypeAnn::Number),
            Some(TypeAnn::Int) | Some(TypeAnn::Number),
        ) => TypeAnn::Number,
        _ => TypeAnn::Number,
    }
}

// ── Assignability ──────────────────────────────────────────────────────

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
    if let TypeAnn::Union(variants) = actual {
        return variants.iter().all(|v| is_assignable(v, declared));
    }
    actual == declared
}

// ── Error formatting ───────────────────────────────────────────────────

fn describe(ty: &TypeAnn) -> String {
    match ty {
        TypeAnn::Number => "ตัวเลข".to_string(),
        TypeAnn::Int => "จำนวนเต็ม".to_string(),
        TypeAnn::String => "ข้อความ".to_string(),
        TypeAnn::Bool => "ถูกผิด".to_string(),
        TypeAnn::Null => "ว่าง".to_string(),
        TypeAnn::Any => "ทั่วไป".to_string(),
        TypeAnn::Void => "ไม่ส่งกลับ".to_string(),
        TypeAnn::Array(inner) => format!("ชุด<{}>", describe(inner)),
        TypeAnn::Map => "คู่".to_string(),
        TypeAnn::Union(variants) => variants
            .iter()
            .map(describe)
            .collect::<Vec<_>>()
            .join(" | "),
        TypeAnn::Named { name, .. } => name.clone(),
    }
}
