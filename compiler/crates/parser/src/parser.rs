use thailang_ast::*;
use thailang_lexer::{tokenize, Token, TokenKind};

use crate::error::ParseError;

pub fn parse(source: &str) -> Result<Program, Vec<ParseError>> {
    let tokens = tokenize(source);
    Parser::new(tokens).parse_program()
}

pub fn parse_expression(source: &str) -> Result<Expr, ParseError> {
    let tokens = tokenize(source);
    Parser::new(tokens).parse_expr()
}

struct Parser {
    tokens: Vec<Token>,
    pos: usize,
    last_end: usize,
}

impl Parser {
    fn new(tokens: Vec<Token>) -> Self {
        Self {
            tokens,
            pos: 0,
            last_end: 0,
        }
    }

    // ── Top-level ──────────────────────────────────────────────────────

    fn parse_program(&mut self) -> Result<Program, Vec<ParseError>> {
        let mut items = Vec::new();
        let mut errors = Vec::new();
        while self.peek().is_some() {
            match self.parse_item() {
                Ok(item) => items.push(item),
                Err(e) => {
                    errors.push(e);
                    self.synchronize();
                }
            }
        }
        if errors.is_empty() {
            Ok(Program { items })
        } else {
            Err(errors)
        }
    }

    fn parse_item(&mut self) -> Result<Item, ParseError> {
        match self.peek().map(|t| &t.kind) {
            Some(TokenKind::Function) => self.parse_fn_item(),
            Some(TokenKind::Let)
            | Some(TokenKind::Const)
            | Some(TokenKind::If)
            | Some(TokenKind::While)
            | Some(TokenKind::For)
            | Some(TokenKind::ForEach)
            | Some(TokenKind::Return)
            | Some(TokenKind::Break)
            | Some(TokenKind::Continue)
            | Some(TokenKind::LBrace) => {
                let stmt = self.parse_stmt()?;
                Ok(stmt_into_item(stmt))
            }
            _ => {
                let stmt = self.parse_expr_or_assign_stmt()?;
                let span = stmt.span;
                Ok(Item {
                    kind: ItemKind::Stmt(stmt),
                    span,
                })
            }
        }
    }

    // ── Function declarations ──────────────────────────────────────────

    fn parse_fn_item(&mut self) -> Result<Item, ParseError> {
        let start = self.advance().unwrap().span.start;
        let name = self.expect_identifier_name()?;
        self.expect(TokenKind::LParen)?;
        let params = self.parse_params()?;
        self.expect(TokenKind::RParen)?;
        let return_type = if self.eat(&TokenKind::Arrow).is_some() {
            Some(self.parse_type_ann()?)
        } else {
            None
        };
        let body = self.parse_block_stmts()?;
        let span = Span::new(start, self.last_end);
        Ok(Item {
            kind: ItemKind::Fn(FnDecl {
                name,
                params,
                return_type,
                body,
                is_async: false,
            }),
            span,
        })
    }

    fn parse_params(&mut self) -> Result<Vec<Param>, ParseError> {
        let mut params = Vec::new();
        if self.check(&TokenKind::RParen) {
            return Ok(params);
        }
        loop {
            let tok = self.advance().ok_or(ParseError::Eof)?;
            let start = tok.span.start;
            let name = match tok.kind {
                TokenKind::Ident(n) => n,
                other => {
                    return Err(ParseError::Expected {
                        expected: "parameter name".to_string(),
                        found: format!("{other:?}"),
                        span: Span::new(start, tok.span.end),
                    })
                }
            };
            let type_ann = if self.eat(&TokenKind::Colon).is_some() {
                Some(self.parse_type_ann()?)
            } else {
                None
            };
            params.push(Param {
                name,
                type_ann,
                span: Span::new(start, self.last_end),
            });
            if self.eat(&TokenKind::Comma).is_none() {
                break;
            }
        }
        Ok(params)
    }

    // ── Statements ─────────────────────────────────────────────────────

    fn parse_stmt(&mut self) -> Result<Stmt, ParseError> {
        match self.peek().map(|t| &t.kind) {
            Some(TokenKind::Let) => {
                self.advance();
                self.parse_let_stmt(true)
            }
            Some(TokenKind::Const) => {
                self.advance();
                self.parse_let_stmt(false)
            }
            Some(TokenKind::Return) => self.parse_return(),
            Some(TokenKind::If) => self.parse_if(),
            Some(TokenKind::While) => self.parse_while(),
            Some(TokenKind::For) => self.parse_for(),
            Some(TokenKind::ForEach) => self.parse_foreach(),
            Some(TokenKind::Break) => self.parse_break_or_continue(true),
            Some(TokenKind::Continue) => self.parse_break_or_continue(false),
            Some(TokenKind::LBrace) => self.parse_block_as_stmt(),
            _ => self.parse_expr_or_assign_stmt(),
        }
    }

    fn parse_let_stmt(&mut self, mutable: bool) -> Result<Stmt, ParseError> {
        let name_tok = self.advance().ok_or(ParseError::Eof)?;
        let start = name_tok.span.start;
        let name = match name_tok.kind {
            TokenKind::Ident(n) => n,
            other => {
                return Err(ParseError::Expected {
                    expected: "identifier".to_string(),
                    found: format!("{other:?}"),
                    span: Span::new(start, name_tok.span.end),
                })
            }
        };
        let type_ann = if self.eat(&TokenKind::Colon).is_some() {
            Some(self.parse_type_ann()?)
        } else {
            None
        };
        self.expect(TokenKind::Eq)?;
        let value = self.parse_expr()?;
        let end = self.expect(TokenKind::Semi)?.span.end;
        Ok(Stmt {
            kind: StmtKind::Let {
                name,
                type_ann,
                value,
                mutable,
            },
            span: Span::new(start, end),
        })
    }

    fn parse_return(&mut self) -> Result<Stmt, ParseError> {
        let start = self.advance().unwrap().span.start;
        let value = if self.check(&TokenKind::Semi) {
            None
        } else {
            Some(self.parse_expr()?)
        };
        let end = self.expect(TokenKind::Semi)?.span.end;
        Ok(Stmt {
            kind: StmtKind::Return(value),
            span: Span::new(start, end),
        })
    }

    fn parse_if(&mut self) -> Result<Stmt, ParseError> {
        let start = self.advance().unwrap().span.start;
        let cond = self.parse_paren_expr()?;
        let then_branch = self.parse_block_stmts()?;
        let mut else_ifs = Vec::new();
        let mut else_branch = None;
        while matches!(self.peek().map(|t| &t.kind), Some(TokenKind::ElseIf)) {
            self.advance();
            let c = self.parse_paren_expr()?;
            let body = self.parse_block_stmts()?;
            else_ifs.push((c, body));
        }
        if matches!(self.peek().map(|t| &t.kind), Some(TokenKind::Else)) {
            self.advance();
            else_branch = Some(self.parse_block_stmts()?);
        }
        Ok(Stmt {
            kind: StmtKind::If {
                cond,
                then_branch,
                else_ifs,
                else_branch,
            },
            span: Span::new(start, self.last_end),
        })
    }

    fn parse_while(&mut self) -> Result<Stmt, ParseError> {
        let start = self.advance().unwrap().span.start;
        let cond = self.parse_paren_expr()?;
        let body = self.parse_block_stmts()?;
        Ok(Stmt {
            kind: StmtKind::While { cond, body },
            span: Span::new(start, self.last_end),
        })
    }

    fn parse_foreach(&mut self) -> Result<Stmt, ParseError> {
        let start = self.advance().unwrap().span.start;
        self.expect(TokenKind::LParen)?;
        let var = self.expect_identifier_name()?;
        self.expect(TokenKind::In)?;
        let iterable = self.parse_expr()?;
        self.expect(TokenKind::RParen)?;
        let body = self.parse_block_stmts()?;
        Ok(Stmt {
            kind: StmtKind::ForEach {
                var,
                iterable,
                body,
            },
            span: Span::new(start, self.last_end),
        })
    }

    fn parse_for(&mut self) -> Result<Stmt, ParseError> {
        let start = self.advance().unwrap().span.start;
        self.expect(TokenKind::LParen)?;
        let init = self.parse_stmt()?;
        let cond = self.parse_expr()?;
        self.expect(TokenKind::Semi)?;
        let update = self.parse_assign_or_expr_no_semi()?;
        self.expect(TokenKind::RParen)?;
        let body = self.parse_block_stmts()?;
        Ok(Stmt {
            kind: StmtKind::For {
                init: Box::new(init),
                cond,
                update: Box::new(update),
                body,
            },
            span: Span::new(start, self.last_end),
        })
    }

    fn parse_break_or_continue(&mut self, is_break: bool) -> Result<Stmt, ParseError> {
        let start = self.advance().unwrap().span.start;
        let end = self.expect(TokenKind::Semi)?.span.end;
        let kind = if is_break {
            StmtKind::Break
        } else {
            StmtKind::Continue
        };
        Ok(Stmt {
            kind,
            span: Span::new(start, end),
        })
    }

    fn parse_block_as_stmt(&mut self) -> Result<Stmt, ParseError> {
        let start = self.peek().unwrap().span.start;
        let stmts = self.parse_block_stmts()?;
        Ok(Stmt {
            kind: StmtKind::Block(stmts),
            span: Span::new(start, self.last_end),
        })
    }

    fn parse_block_stmts(&mut self) -> Result<Vec<Stmt>, ParseError> {
        self.expect(TokenKind::LBrace)?;
        let mut stmts = Vec::new();
        while !self.check(&TokenKind::RBrace) && self.peek().is_some() {
            stmts.push(self.parse_stmt()?);
        }
        self.expect(TokenKind::RBrace)?;
        Ok(stmts)
    }

    fn parse_expr_or_assign_stmt(&mut self) -> Result<Stmt, ParseError> {
        let lhs = self.parse_expr()?;
        let span_start = lhs.span.start;
        if let Some(op) = self.peek().and_then(|t| token_to_assign_op(&t.kind)) {
            self.advance();
            let rhs = self.parse_expr()?;
            let end = self.expect(TokenKind::Semi)?.span.end;
            return Ok(Stmt {
                kind: StmtKind::Assign {
                    target: lhs,
                    op,
                    value: rhs,
                },
                span: Span::new(span_start, end),
            });
        }
        let end = self.expect(TokenKind::Semi)?.span.end;
        Ok(Stmt {
            kind: StmtKind::Expr(lhs),
            span: Span::new(span_start, end),
        })
    }

    fn parse_assign_or_expr_no_semi(&mut self) -> Result<Stmt, ParseError> {
        let lhs = self.parse_expr()?;
        let span_start = lhs.span.start;
        if let Some(op) = self.peek().and_then(|t| token_to_assign_op(&t.kind)) {
            self.advance();
            let rhs = self.parse_expr()?;
            let end = rhs.span.end;
            return Ok(Stmt {
                kind: StmtKind::Assign {
                    target: lhs,
                    op,
                    value: rhs,
                },
                span: Span::new(span_start, end),
            });
        }
        let span = Span::new(span_start, lhs.span.end);
        Ok(Stmt {
            kind: StmtKind::Expr(lhs),
            span,
        })
    }

    // ── Type annotations ───────────────────────────────────────────────

    fn parse_type_ann(&mut self) -> Result<TypeAnn, ParseError> {
        let mut ty = self.parse_single_type_ann()?;
        while self.eat(&TokenKind::Pipe).is_some() {
            let next = self.parse_single_type_ann()?;
            ty = match ty {
                TypeAnn::Union(mut variants) => {
                    variants.push(next);
                    TypeAnn::Union(variants)
                }
                other => TypeAnn::Union(vec![other, next]),
            };
        }
        Ok(ty)
    }

    fn parse_single_type_ann(&mut self) -> Result<TypeAnn, ParseError> {
        let tok = self.advance().ok_or(ParseError::Eof)?;
        match tok.kind {
            TokenKind::NumberType => Ok(TypeAnn::Number),
            TokenKind::IntType => Ok(TypeAnn::Int),
            TokenKind::StringType => Ok(TypeAnn::String),
            TokenKind::BoolType => Ok(TypeAnn::Bool),
            TokenKind::AnyType => Ok(TypeAnn::Any),
            TokenKind::VoidType => Ok(TypeAnn::Void),
            TokenKind::Ident(name) => Ok(TypeAnn::Named {
                name,
                generics: vec![],
            }),
            other => Err(ParseError::Expected {
                expected: "type annotation".to_string(),
                found: format!("{other:?}"),
                span: Span::new(tok.span.start, tok.span.end),
            }),
        }
    }

    // ── Expressions (Pratt) ────────────────────────────────────────────

    pub(crate) fn parse_expr(&mut self) -> Result<Expr, ParseError> {
        self.parse_expr_bp(0)
    }

    fn parse_paren_expr(&mut self) -> Result<Expr, ParseError> {
        self.expect(TokenKind::LParen)?;
        let e = self.parse_expr()?;
        self.expect(TokenKind::RParen)?;
        Ok(e)
    }

    fn parse_expr_bp(&mut self, min_bp: u8) -> Result<Expr, ParseError> {
        let mut lhs = self.parse_unary()?;
        while let Some(op) = self.peek().and_then(|t| token_to_binary_op(&t.kind)) {
            let (l_bp, r_bp) = infix_binding_power(op);
            if l_bp < min_bp {
                break;
            }
            self.advance();
            let rhs = self.parse_expr_bp(r_bp)?;
            let span = Span::new(lhs.span.start, rhs.span.end);
            lhs = Expr {
                kind: ExprKind::Binary {
                    op,
                    left: Box::new(lhs),
                    right: Box::new(rhs),
                },
                span,
            };
        }
        Ok(lhs)
    }

    fn parse_unary(&mut self) -> Result<Expr, ParseError> {
        match self.peek().map(|t| &t.kind) {
            Some(TokenKind::Minus) => self.parse_unary_op(UnaryOp::Neg),
            Some(TokenKind::Bang) => self.parse_unary_op(UnaryOp::Not),
            _ => self.parse_postfix(),
        }
    }

    fn parse_unary_op(&mut self, op: UnaryOp) -> Result<Expr, ParseError> {
        let start = self.advance().unwrap().span.start;
        let operand = self.parse_unary()?;
        let span = Span::new(start, operand.span.end);
        Ok(Expr {
            kind: ExprKind::Unary {
                op,
                operand: Box::new(operand),
            },
            span,
        })
    }

    fn parse_postfix(&mut self) -> Result<Expr, ParseError> {
        let mut e = self.parse_primary()?;
        loop {
            match self.peek().map(|t| &t.kind) {
                Some(TokenKind::LParen) => {
                    self.advance();
                    let args = self.parse_call_args()?;
                    let end = self.expect(TokenKind::RParen)?.span.end;
                    let span = Span::new(e.span.start, end);
                    e = Expr {
                        kind: ExprKind::Call {
                            callee: Box::new(e),
                            args,
                        },
                        span,
                    };
                }
                Some(TokenKind::Dot) => {
                    self.advance();
                    let member_tok = self.advance().ok_or(ParseError::Eof)?;
                    let end = member_tok.span.end;
                    let member = match member_tok.kind {
                        TokenKind::Ident(n) => n,
                        other => {
                            return Err(ParseError::Expected {
                                expected: "member name".to_string(),
                                found: format!("{other:?}"),
                                span: Span::new(member_tok.span.start, end),
                            })
                        }
                    };
                    let span = Span::new(e.span.start, end);
                    e = Expr {
                        kind: ExprKind::Member {
                            object: Box::new(e),
                            member,
                        },
                        span,
                    };
                }
                Some(TokenKind::LBracket) => {
                    self.advance();
                    let index = self.parse_expr()?;
                    let end = self.expect(TokenKind::RBracket)?.span.end;
                    let span = Span::new(e.span.start, end);
                    e = Expr {
                        kind: ExprKind::Index {
                            object: Box::new(e),
                            index: Box::new(index),
                        },
                        span,
                    };
                }
                _ => break,
            }
        }
        Ok(e)
    }

    fn parse_call_args(&mut self) -> Result<Vec<Expr>, ParseError> {
        let mut args = Vec::new();
        if matches!(self.peek().map(|t| &t.kind), Some(TokenKind::RParen)) {
            return Ok(args);
        }
        loop {
            args.push(self.parse_expr()?);
            if self.eat(&TokenKind::Comma).is_none() {
                break;
            }
        }
        Ok(args)
    }

    fn parse_primary(&mut self) -> Result<Expr, ParseError> {
        let tok = self.advance().ok_or(ParseError::Eof)?;
        let span = Span::new(tok.span.start, tok.span.end);
        let kind = match tok.kind {
            TokenKind::Int(n) => ExprKind::Int(n),
            TokenKind::Float(f) => ExprKind::Float(f),
            TokenKind::Str(s) => ExprKind::Str(s),
            TokenKind::True => ExprKind::Bool(true),
            TokenKind::False => ExprKind::Bool(false),
            TokenKind::Null => ExprKind::Null,
            TokenKind::Ident(name) => ExprKind::Ident(name),
            TokenKind::Print => ExprKind::Ident("พิมพ์".to_string()),
            TokenKind::LParen => {
                let inner = self.parse_expr()?;
                self.expect(TokenKind::RParen)?;
                return Ok(inner);
            }
            TokenKind::LBracket => {
                let elements = self.parse_array_elements()?;
                let end = self.expect(TokenKind::RBracket)?.span.end;
                return Ok(Expr {
                    kind: ExprKind::Array(elements),
                    span: Span::new(span.start, end),
                });
            }
            other => {
                return Err(ParseError::UnexpectedToken {
                    found: format!("{other:?}"),
                    span,
                })
            }
        };
        Ok(Expr { kind, span })
    }

    fn parse_array_elements(&mut self) -> Result<Vec<Expr>, ParseError> {
        let mut elements = Vec::new();
        if self.check(&TokenKind::RBracket) {
            return Ok(elements);
        }
        loop {
            elements.push(self.parse_expr()?);
            if self.eat(&TokenKind::Comma).is_none() {
                break;
            }
        }
        Ok(elements)
    }

    // ── Token helpers ──────────────────────────────────────────────────

    fn peek(&self) -> Option<&Token> {
        self.tokens.get(self.pos)
    }

    fn advance(&mut self) -> Option<Token> {
        let t = self.tokens.get(self.pos).cloned();
        if let Some(ref tok) = t {
            self.last_end = tok.span.end;
            self.pos += 1;
        }
        t
    }

    fn eat(&mut self, kind: &TokenKind) -> Option<Token> {
        if self.check(kind) {
            self.advance()
        } else {
            None
        }
    }

    fn check(&self, kind: &TokenKind) -> bool {
        match self.peek() {
            Some(t) => std::mem::discriminant(&t.kind) == std::mem::discriminant(kind),
            None => false,
        }
    }

    fn expect(&mut self, expected: TokenKind) -> Result<Token, ParseError> {
        if self.check(&expected) {
            return Ok(self.advance().unwrap());
        }
        match self.peek() {
            Some(t) => Err(ParseError::Expected {
                expected: format!("{expected:?}"),
                found: format!("{:?}", t.kind),
                span: Span::new(t.span.start, t.span.end),
            }),
            None => Err(ParseError::Eof),
        }
    }

    fn expect_identifier_name(&mut self) -> Result<String, ParseError> {
        let tok = self.advance().ok_or(ParseError::Eof)?;
        match tok.kind {
            TokenKind::Ident(n) => Ok(n),
            other => Err(ParseError::Expected {
                expected: "identifier".to_string(),
                found: format!("{other:?}"),
                span: Span::new(tok.span.start, tok.span.end),
            }),
        }
    }

    fn synchronize(&mut self) {
        while let Some(t) = self.peek() {
            let was_semi = matches!(t.kind, TokenKind::Semi);
            self.advance();
            if was_semi {
                return;
            }
        }
    }
}

fn stmt_into_item(stmt: Stmt) -> Item {
    let span = stmt.span;
    let kind = match stmt.kind {
        StmtKind::Let {
            name,
            type_ann,
            value,
            mutable,
        } => ItemKind::Let {
            name,
            type_ann,
            value,
            mutable,
        },
        other => ItemKind::Stmt(Stmt { kind: other, span }),
    };
    Item { kind, span }
}

fn token_to_binary_op(t: &TokenKind) -> Option<BinaryOp> {
    Some(match t {
        TokenKind::Plus => BinaryOp::Add,
        TokenKind::Minus => BinaryOp::Sub,
        TokenKind::Star => BinaryOp::Mul,
        TokenKind::Slash => BinaryOp::Div,
        TokenKind::Percent => BinaryOp::Mod,
        TokenKind::EqEq => BinaryOp::Eq,
        TokenKind::BangEq => BinaryOp::NotEq,
        TokenKind::Lt => BinaryOp::Lt,
        TokenKind::LtEq => BinaryOp::LtEq,
        TokenKind::Gt => BinaryOp::Gt,
        TokenKind::GtEq => BinaryOp::GtEq,
        TokenKind::AndAnd => BinaryOp::And,
        TokenKind::OrOr => BinaryOp::Or,
        TokenKind::Is => BinaryOp::Is,
        _ => return None,
    })
}

fn token_to_assign_op(t: &TokenKind) -> Option<AssignOp> {
    Some(match t {
        TokenKind::Eq => AssignOp::Eq,
        TokenKind::PlusEq => AssignOp::AddEq,
        TokenKind::MinusEq => AssignOp::SubEq,
        TokenKind::StarEq => AssignOp::MulEq,
        TokenKind::SlashEq => AssignOp::DivEq,
        TokenKind::PercentEq => AssignOp::ModEq,
        _ => return None,
    })
}

/// Infix binding powers — left and right. Higher = binds tighter.
fn infix_binding_power(op: BinaryOp) -> (u8, u8) {
    match op {
        BinaryOp::Or => (1, 2),
        BinaryOp::And => (3, 4),
        BinaryOp::Eq | BinaryOp::NotEq => (5, 6),
        BinaryOp::Lt | BinaryOp::LtEq | BinaryOp::Gt | BinaryOp::GtEq => (7, 8),
        BinaryOp::Add | BinaryOp::Sub => (9, 10),
        BinaryOp::Mul | BinaryOp::Div | BinaryOp::Mod => (11, 12),
        BinaryOp::Is => (13, 14),
    }
}
