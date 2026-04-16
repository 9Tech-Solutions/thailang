use thailang_emit_js::emit;
use thailang_lexer::tokenize;
use thailang_parser::parse;
use wasm_bindgen::prelude::*;

/// Compile Thailang source to JavaScript.
/// Returns the JS string on success, or a JsError with the parser diagnostics.
#[wasm_bindgen(js_name = compileToJs)]
pub fn compile_to_js(source: &str) -> Result<String, JsError> {
    let program = parse(source).map_err(|errors| {
        let messages: Vec<String> = errors.iter().map(|e| e.message()).collect();
        JsError::new(&messages.join("\n"))
    })?;
    Ok(emit(&program))
}

/// Tokenize source — returns a JSON array string suitable for JS consumption
/// (intended for syntax highlighting in the future Monaco-based playground).
#[wasm_bindgen(js_name = tokenizeToJson)]
pub fn tokenize_to_json(source: &str) -> String {
    let view: Vec<TokenView> = tokenize(source).iter().map(TokenView::from).collect();
    serde_json::to_string(&view).unwrap_or_else(|_| "[]".to_string())
}

#[derive(serde::Serialize)]
struct TokenView {
    kind: String,
    start: usize,
    end: usize,
    lexeme: String,
}

impl From<&thailang_lexer::Token> for TokenView {
    fn from(t: &thailang_lexer::Token) -> Self {
        Self {
            kind: format!("{:?}", t.kind),
            start: t.span.start,
            end: t.span.end,
            lexeme: t.lexeme.clone(),
        }
    }
}
