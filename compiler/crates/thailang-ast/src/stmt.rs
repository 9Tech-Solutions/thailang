use crate::expr::Expr;
use crate::span::Span;
use crate::types::TypeAnn;

#[derive(Debug, Clone, PartialEq)]
pub struct Stmt {
    pub kind: StmtKind,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq)]
pub enum StmtKind {
    Expr(Expr),
    Let {
        name: String,
        type_ann: Option<TypeAnn>,
        value: Expr,
        mutable: bool,
    },
    Return(Option<Expr>),
    If {
        cond: Expr,
        then_branch: Vec<Stmt>,
        else_ifs: Vec<(Expr, Vec<Stmt>)>,
        else_branch: Option<Vec<Stmt>>,
    },
    While {
        cond: Expr,
        body: Vec<Stmt>,
    },
    For {
        init: Box<Stmt>,
        cond: Expr,
        update: Box<Stmt>,
        body: Vec<Stmt>,
    },
    Break,
    Continue,
    Block(Vec<Stmt>),
    Assign {
        target: Expr,
        op: AssignOp,
        value: Expr,
    },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AssignOp {
    Eq,
    AddEq,
    SubEq,
    MulEq,
    DivEq,
    ModEq,
}
