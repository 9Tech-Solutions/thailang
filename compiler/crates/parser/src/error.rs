use thailang_ast::Span;

#[derive(Debug, Clone, PartialEq)]
pub enum ParseError {
    Eof,
    Expected {
        expected: String,
        found: String,
        span: Span,
    },
    UnexpectedToken {
        found: String,
        span: Span,
    },
}

impl ParseError {
    pub fn span(&self) -> Option<Span> {
        match self {
            ParseError::Eof => None,
            ParseError::Expected { span, .. } | ParseError::UnexpectedToken { span, .. } => {
                Some(*span)
            }
        }
    }

    pub fn message(&self) -> String {
        match self {
            ParseError::Eof => "unexpected end of input".to_string(),
            ParseError::Expected { expected, found, .. } => {
                format!("expected {expected}, found {found}")
            }
            ParseError::UnexpectedToken { found, .. } => {
                format!("unexpected token: {found}")
            }
        }
    }
}
