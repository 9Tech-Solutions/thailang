use crate::expr::{Expr, Param};
use crate::span::Span;
use crate::stmt::Stmt;
use crate::types::TypeAnn;

#[derive(Debug, Clone, PartialEq, Default)]
pub struct Program {
    pub items: Vec<Item>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Item {
    pub kind: ItemKind,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ItemKind {
    Fn(FnDecl),
    Let {
        name: String,
        type_ann: Option<TypeAnn>,
        value: Expr,
        mutable: bool,
    },
    Stmt(Stmt),
}

#[derive(Debug, Clone, PartialEq)]
pub struct FnDecl {
    pub name: String,
    pub params: Vec<Param>,
    pub return_type: Option<TypeAnn>,
    pub body: Vec<Stmt>,
    pub is_async: bool,
}
