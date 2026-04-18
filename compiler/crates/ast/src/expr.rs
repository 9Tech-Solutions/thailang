use crate::span::Span;
use crate::stmt::Stmt;
use crate::types::TypeAnn;

#[derive(Debug, Clone, PartialEq)]
pub struct Expr {
    pub kind: ExprKind,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ExprKind {
    Int(i64),
    Float(f64),
    Str(String),
    Bool(bool),
    Null,
    Ident(String),

    Binary {
        op: BinaryOp,
        left: Box<Expr>,
        right: Box<Expr>,
    },
    Unary {
        op: UnaryOp,
        operand: Box<Expr>,
    },
    Call {
        callee: Box<Expr>,
        args: Vec<Expr>,
    },
    Member {
        object: Box<Expr>,
        member: String,
    },
    Index {
        object: Box<Expr>,
        index: Box<Expr>,
    },

    Array(Vec<Expr>),
    Object(Vec<(String, Expr)>),
    Template(Vec<TemplatePart>),

    /// Runtime type guard: `value เป็น ty`. The RHS is a type, not an expression.
    /// Emits as a JS type predicate and enables flow-sensitive narrowing in the
    /// type checker.
    IsCheck {
        value: Box<Expr>,
        ty: TypeAnn,
        ty_span: Span,
    },

    ArrowFn {
        params: Vec<Param>,
        return_type: Option<TypeAnn>,
        body: Box<ArrowBody>,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub enum ArrowBody {
    Expr(Expr),
    Block(Vec<Stmt>),
}

#[derive(Debug, Clone, PartialEq)]
pub enum TemplatePart {
    Text(String),
    Expr(Expr),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BinaryOp {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    Eq,
    NotEq,
    Lt,
    LtEq,
    Gt,
    GtEq,
    And,
    Or,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnaryOp {
    Neg,
    Not,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Param {
    pub name: String,
    pub type_ann: Option<TypeAnn>,
    pub span: Span,
}
