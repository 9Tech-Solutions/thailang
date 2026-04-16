use thailang_ast::*;

pub fn emit(program: &Program) -> String {
    let mut emitter = Emitter::new();
    emitter.emit_program(program);
    emitter.into_string()
}

struct Emitter {
    out: String,
    indent: usize,
}

impl Emitter {
    fn new() -> Self {
        Self { out: String::new(), indent: 0 }
    }

    fn into_string(self) -> String {
        self.out
    }

    fn write(&mut self, s: &str) {
        self.out.push_str(s);
    }

    fn newline(&mut self) {
        self.out.push('\n');
        for _ in 0..self.indent {
            self.out.push_str("  ");
        }
    }

    fn indent_in(&mut self) {
        self.indent += 1;
    }

    fn indent_out(&mut self) {
        self.indent = self.indent.saturating_sub(1);
    }

    // ── Program / Items ────────────────────────────────────────────────

    fn emit_program(&mut self, p: &Program) {
        for (i, item) in p.items.iter().enumerate() {
            if i > 0 {
                self.newline();
            }
            self.emit_item(item);
        }
        if !p.items.is_empty() {
            self.out.push('\n');
        }
    }

    fn emit_item(&mut self, item: &Item) {
        match &item.kind {
            ItemKind::Fn(f) => self.emit_fn(f),
            ItemKind::Let { name, value, mutable, .. } => {
                self.write(if *mutable { "let " } else { "const " });
                self.write(name);
                self.write(" = ");
                self.emit_expr(value);
                self.write(";");
            }
            ItemKind::Stmt(s) => self.emit_stmt(s),
        }
    }

    fn emit_fn(&mut self, f: &FnDecl) {
        self.write("function ");
        self.write(&f.name);
        self.write("(");
        for (i, p) in f.params.iter().enumerate() {
            if i > 0 {
                self.write(", ");
            }
            self.write(&p.name);
        }
        self.write(") ");
        self.emit_block(&f.body);
    }

    // ── Statements ─────────────────────────────────────────────────────

    fn emit_stmt(&mut self, s: &Stmt) {
        match &s.kind {
            StmtKind::Expr(e) => {
                self.emit_expr(e);
                self.write(";");
            }
            StmtKind::Let { name, value, mutable, .. } => {
                self.write(if *mutable { "let " } else { "const " });
                self.write(name);
                self.write(" = ");
                self.emit_expr(value);
                self.write(";");
            }
            StmtKind::Return(v) => {
                self.write("return");
                if let Some(e) = v {
                    self.write(" ");
                    self.emit_expr(e);
                }
                self.write(";");
            }
            StmtKind::If { cond, then_branch, else_ifs, else_branch } => {
                self.write("if (");
                self.emit_expr(cond);
                self.write(") ");
                self.emit_block(then_branch);
                for (c, body) in else_ifs {
                    self.write(" else if (");
                    self.emit_expr(c);
                    self.write(") ");
                    self.emit_block(body);
                }
                if let Some(body) = else_branch {
                    self.write(" else ");
                    self.emit_block(body);
                }
            }
            StmtKind::While { cond, body } => {
                self.write("while (");
                self.emit_expr(cond);
                self.write(") ");
                self.emit_block(body);
            }
            StmtKind::For { init, cond, update, body } => {
                self.write("for (");
                self.emit_stmt(init);
                self.write(" ");
                self.emit_expr(cond);
                self.write("; ");
                self.emit_for_update(update);
                self.write(") ");
                self.emit_block(body);
            }
            StmtKind::Break => self.write("break;"),
            StmtKind::Continue => self.write("continue;"),
            StmtKind::Block(stmts) => self.emit_block(stmts),
            StmtKind::Assign { target, op, value } => {
                self.emit_expr(target);
                self.write(" ");
                self.write(assign_op_str(*op));
                self.write(" ");
                self.emit_expr(value);
                self.write(";");
            }
        }
    }

    fn emit_for_update(&mut self, update: &Stmt) {
        match &update.kind {
            StmtKind::Assign { target, op, value } => {
                self.emit_expr(target);
                self.write(" ");
                self.write(assign_op_str(*op));
                self.write(" ");
                self.emit_expr(value);
            }
            StmtKind::Expr(e) => self.emit_expr(e),
            _ => self.emit_stmt(update),
        }
    }

    fn emit_block(&mut self, stmts: &[Stmt]) {
        if stmts.is_empty() {
            self.write("{}");
            return;
        }
        self.write("{");
        self.indent_in();
        for s in stmts {
            self.newline();
            self.emit_stmt(s);
        }
        self.indent_out();
        self.newline();
        self.write("}");
    }

    // ── Expressions ────────────────────────────────────────────────────

    fn emit_expr(&mut self, e: &Expr) {
        match &e.kind {
            ExprKind::Int(n) => self.write(&n.to_string()),
            ExprKind::Float(f) => self.write(&format_float(*f)),
            ExprKind::Str(s) => self.emit_string_literal(s),
            ExprKind::Bool(b) => self.write(if *b { "true" } else { "false" }),
            ExprKind::Null => self.write("null"),
            ExprKind::Ident(name) => self.write(name),
            ExprKind::Binary { op, left, right } => {
                self.write("(");
                self.emit_expr(left);
                self.write(" ");
                self.write(binary_op_str(*op));
                self.write(" ");
                self.emit_expr(right);
                self.write(")");
            }
            ExprKind::Unary { op, operand } => {
                self.write(unary_op_str(*op));
                self.write("(");
                self.emit_expr(operand);
                self.write(")");
            }
            ExprKind::Call { callee, args } => self.emit_call(callee, args),
            ExprKind::Member { object, member } => {
                self.emit_expr(object);
                self.write(".");
                self.write(member);
            }
            ExprKind::Index { object, index } => {
                self.emit_expr(object);
                self.write("[");
                self.emit_expr(index);
                self.write("]");
            }
            ExprKind::Array(items) => self.emit_array(items),
            ExprKind::Object(pairs) => self.emit_object(pairs),
            ExprKind::Template(parts) => self.emit_template(parts),
            ExprKind::ArrowFn { params, body, .. } => self.emit_arrow_fn(params, body),
        }
    }

    fn emit_call(&mut self, callee: &Expr, args: &[Expr]) {
        if let ExprKind::Ident(name) = &callee.kind {
            if name == "พิมพ์" {
                self.write("console.log");
            } else {
                self.write(name);
            }
        } else {
            self.emit_expr(callee);
        }
        self.write("(");
        for (i, a) in args.iter().enumerate() {
            if i > 0 {
                self.write(", ");
            }
            self.emit_expr(a);
        }
        self.write(")");
    }

    fn emit_string_literal(&mut self, s: &str) {
        self.write("\"");
        self.write(&escape_js_string(s));
        self.write("\"");
    }

    fn emit_array(&mut self, items: &[Expr]) {
        self.write("[");
        for (i, e) in items.iter().enumerate() {
            if i > 0 {
                self.write(", ");
            }
            self.emit_expr(e);
        }
        self.write("]");
    }

    fn emit_object(&mut self, pairs: &[(String, Expr)]) {
        self.write("{");
        for (i, (k, v)) in pairs.iter().enumerate() {
            if i > 0 {
                self.write(", ");
            }
            self.write(k);
            self.write(": ");
            self.emit_expr(v);
        }
        self.write("}");
    }

    fn emit_template(&mut self, parts: &[TemplatePart]) {
        self.write("`");
        for p in parts {
            match p {
                TemplatePart::Text(t) => self.write(t),
                TemplatePart::Expr(e) => {
                    self.write("${");
                    self.emit_expr(e);
                    self.write("}");
                }
            }
        }
        self.write("`");
    }

    fn emit_arrow_fn(&mut self, params: &[Param], body: &ArrowBody) {
        self.write("(");
        for (i, p) in params.iter().enumerate() {
            if i > 0 {
                self.write(", ");
            }
            self.write(&p.name);
        }
        self.write(") => ");
        match body {
            ArrowBody::Expr(e) => self.emit_expr(e),
            ArrowBody::Block(stmts) => self.emit_block(stmts),
        }
    }
}

fn binary_op_str(op: BinaryOp) -> &'static str {
    match op {
        BinaryOp::Add => "+",
        BinaryOp::Sub => "-",
        BinaryOp::Mul => "*",
        BinaryOp::Div => "/",
        BinaryOp::Mod => "%",
        BinaryOp::Eq => "===",
        BinaryOp::NotEq => "!==",
        BinaryOp::Lt => "<",
        BinaryOp::LtEq => "<=",
        BinaryOp::Gt => ">",
        BinaryOp::GtEq => ">=",
        BinaryOp::And => "&&",
        BinaryOp::Or => "||",
        BinaryOp::Is => "instanceof",
    }
}

fn unary_op_str(op: UnaryOp) -> &'static str {
    match op {
        UnaryOp::Neg => "-",
        UnaryOp::Not => "!",
    }
}

fn assign_op_str(op: AssignOp) -> &'static str {
    match op {
        AssignOp::Eq => "=",
        AssignOp::AddEq => "+=",
        AssignOp::SubEq => "-=",
        AssignOp::MulEq => "*=",
        AssignOp::DivEq => "/=",
        AssignOp::ModEq => "%=",
    }
}

fn escape_js_string(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '\\' => out.push_str("\\\\"),
            '"' => out.push_str("\\\""),
            '\n' => out.push_str("\\n"),
            '\t' => out.push_str("\\t"),
            '\r' => out.push_str("\\r"),
            c => out.push(c),
        }
    }
    out
}

fn format_float(f: f64) -> String {
    if f.fract() == 0.0 && f.is_finite() {
        format!("{f:.1}")
    } else {
        format!("{f}")
    }
}
