use clap::{Parser, Subcommand};
use std::fs;
use std::process::{Command, ExitCode};
use thailang_ast::Span;

const RED: &str = "\x1b[31;1m";
const DIM: &str = "\x1b[2m";
const RESET: &str = "\x1b[0m";

#[derive(Parser)]
#[command(name = "thai", version, about = "Thailang compiler — ภาษาโปรแกรมมิงไทย")]
struct Cli {
    #[command(subcommand)]
    cmd: Cmd,
}

#[derive(Subcommand)]
enum Cmd {
    /// Print tokens for a .th source file
    Tokens { file: String },
    /// Parse and print the AST (debug format)
    Parse { file: String },
    /// Type-check the program (no codegen)
    Check { file: String },
    /// Emit JavaScript to stdout
    EmitJs { file: String },
    /// Compile to JS and execute via Node.js
    Run { file: String },
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    match cli.cmd {
        Cmd::Tokens { file } => run_tokens(&file),
        Cmd::Parse { file } => run_parse(&file),
        Cmd::Check { file } => run_check(&file),
        Cmd::EmitJs { file } => run_emit_js(&file),
        Cmd::Run { file } => run_program(&file),
    }
}

fn run_tokens(path: &str) -> ExitCode {
    let source = match read_source(path) {
        Ok(s) => s,
        Err(e) => return die(&e),
    };
    for token in thailang_lexer::tokenize(&source) {
        println!(
            "{:?} @{}-{}: {:?}",
            token.kind, token.span.start, token.span.end, token.lexeme
        );
    }
    ExitCode::SUCCESS
}

fn run_parse(path: &str) -> ExitCode {
    match read_and_parse(path) {
        Outcome::Ok(_, program) => {
            println!("{program:#?}");
            ExitCode::SUCCESS
        }
        Outcome::ParseFailed(s, errors) => report_parse_errors(path, &s, &errors),
        Outcome::ReadFailed(e) => die(&e),
    }
}

fn run_check(path: &str) -> ExitCode {
    let (source, program) = match read_and_parse(path) {
        Outcome::Ok(s, p) => (s, p),
        Outcome::ParseFailed(s, errors) => return report_parse_errors(path, &s, &errors),
        Outcome::ReadFailed(e) => return die(&e),
    };
    let type_errors = thailang_types::check(&program);
    if type_errors.is_empty() {
        println!("ok ({} items checked)", program.items.len());
        return ExitCode::SUCCESS;
    }
    for error in &type_errors {
        emit_diagnostic(path, &source, error.span, &error.message, DiagKind::Type);
    }
    ExitCode::FAILURE
}

fn run_emit_js(path: &str) -> ExitCode {
    match read_and_parse(path) {
        Outcome::Ok(_, program) => {
            print!("{}", thailang_emit_js::emit(&program));
            ExitCode::SUCCESS
        }
        Outcome::ParseFailed(s, errors) => report_parse_errors(path, &s, &errors),
        Outcome::ReadFailed(e) => die(&e),
    }
}

fn run_program(path: &str) -> ExitCode {
    let program = match read_and_parse(path) {
        Outcome::Ok(_, p) => p,
        Outcome::ParseFailed(s, errors) => return report_parse_errors(path, &s, &errors),
        Outcome::ReadFailed(e) => return die(&e),
    };
    let js = thailang_emit_js::emit(&program);
    match Command::new("node").arg("-e").arg(&js).status() {
        Ok(status) if status.success() => ExitCode::SUCCESS,
        Ok(_) => ExitCode::FAILURE,
        Err(e) => die(&format!("could not spawn node: {e}")),
    }
}

// ── Pipeline helpers ────────────────────────────────────────────────────

enum Outcome {
    Ok(String, thailang_ast::Program),
    ParseFailed(String, Vec<thailang_parser::ParseError>),
    ReadFailed(String),
}

fn read_and_parse(path: &str) -> Outcome {
    match read_source(path) {
        Ok(source) => match thailang_parser::parse(&source) {
            Ok(program) => Outcome::Ok(source, program),
            Err(errors) => Outcome::ParseFailed(source, errors),
        },
        Err(e) => Outcome::ReadFailed(e),
    }
}

fn read_source(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| format!("could not read {path}: {e}"))
}

// ── Diagnostic rendering (UTF-8 aware, no external deps) ────────────────

#[derive(Clone, Copy)]
enum DiagKind {
    Parse,
    Type,
}

impl DiagKind {
    fn label(self) -> &'static str {
        match self {
            DiagKind::Parse => "parse error",
            DiagKind::Type => "type error",
        }
    }
}

fn report_parse_errors(
    path: &str,
    source: &str,
    errors: &[thailang_parser::ParseError],
) -> ExitCode {
    for error in errors {
        let span = error
            .span()
            .unwrap_or_else(|| Span::new(source.len().saturating_sub(1), source.len()));
        emit_diagnostic(path, source, span, &error.message(), DiagKind::Parse);
    }
    ExitCode::FAILURE
}

fn emit_diagnostic(path: &str, source: &str, span: Span, message: &str, kind: DiagKind) {
    let location = locate(source, span);
    let kind_label = kind.label();
    let line_number = location.line_number;
    let column = location.column;
    let line_content = location.line_content;
    eprintln!("{RED}error[{kind_label}]{RESET}: {message}");
    eprintln!("  {DIM}-->{RESET} {path}:{line_number}:{column}");
    eprintln!("   {DIM}|{RESET}");
    eprintln!(" {line_number:>2} {DIM}|{RESET} {line_content}");
    let caret_pad = " ".repeat(column.saturating_sub(1));
    let caret_len = location.caret_width.max(1);
    let carets = "^".repeat(caret_len);
    eprintln!("   {DIM}|{RESET} {caret_pad}{RED}{carets}{RESET}");
}

struct Location<'a> {
    line_number: usize,
    column: usize,
    line_content: &'a str,
    caret_width: usize,
}

/// Convert a byte-offset span into a (line, column, line-content, caret-width)
/// where column and caret-width are measured in Unicode scalar values (chars),
/// not bytes — so Thai multi-byte chars align correctly in the terminal.
fn locate<'a>(source: &'a str, span: Span) -> Location<'a> {
    let clamped_start = span.start.min(source.len());
    let clamped_end = span.end.min(source.len()).max(clamped_start);
    let line_start = source[..clamped_start]
        .rfind('\n')
        .map(|i| i + 1)
        .unwrap_or(0);
    let line_end = source[clamped_start..]
        .find('\n')
        .map(|i| clamped_start + i)
        .unwrap_or(source.len());
    let line_content = &source[line_start..line_end];
    let line_number = source[..line_start].bytes().filter(|b| *b == b'\n').count() + 1;
    let column = source[line_start..clamped_start].chars().count() + 1;
    let caret_width = source[clamped_start..clamped_end.min(line_end)]
        .chars()
        .count();
    Location {
        line_number,
        column,
        line_content,
        caret_width,
    }
}

fn die(msg: &str) -> ExitCode {
    eprintln!("thai: {msg}");
    ExitCode::FAILURE
}
