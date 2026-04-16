use clap::{Parser, Subcommand};
use std::fs;
use std::process::{Command, ExitCode};

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
    let source = match read_source(path) {
        Ok(s) => s,
        Err(e) => return die(&e),
    };
    match thailang_parser::parse(&source) {
        Ok(program) => {
            println!("{program:#?}");
            ExitCode::SUCCESS
        }
        Err(errors) => report_parse_errors(&errors),
    }
}

fn run_emit_js(path: &str) -> ExitCode {
    let source = match read_source(path) {
        Ok(s) => s,
        Err(e) => return die(&e),
    };
    match thailang_parser::parse(&source) {
        Ok(program) => {
            print!("{}", thailang_emit_js::emit(&program));
            ExitCode::SUCCESS
        }
        Err(errors) => report_parse_errors(&errors),
    }
}

fn run_program(path: &str) -> ExitCode {
    let source = match read_source(path) {
        Ok(s) => s,
        Err(e) => return die(&e),
    };
    let program = match thailang_parser::parse(&source) {
        Ok(p) => p,
        Err(errors) => return report_parse_errors(&errors),
    };
    let js = thailang_emit_js::emit(&program);
    match Command::new("node").arg("-e").arg(&js).status() {
        Ok(status) if status.success() => ExitCode::SUCCESS,
        Ok(_) => ExitCode::FAILURE,
        Err(e) => die(&format!("could not spawn node: {e}")),
    }
}

fn read_source(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| format!("could not read {path}: {e}"))
}

fn report_parse_errors(errors: &[thailang_parser::ParseError]) -> ExitCode {
    for error in errors {
        match error.span() {
            Some(s) => eprintln!("error @{}-{}: {}", s.start, s.end, error.message()),
            None => eprintln!("error: {}", error.message()),
        }
    }
    ExitCode::FAILURE
}

fn die(msg: &str) -> ExitCode {
    eprintln!("thai: {msg}");
    ExitCode::FAILURE
}
