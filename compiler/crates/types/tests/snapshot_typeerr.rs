//! Type-error fixture snapshots.
//!
//! Each `.th` file under `tests/typeerr/` must produce at least one type
//! error; the formatted diagnostic list is captured as an `insta` snapshot.
//! Plan verify criterion: "Type-error fixtures in `compiler/tests/typeerr/`
//! match insta snapshots."
//!
//! Run `cargo insta review` to approve new or changed snapshots.

use std::fs;
use std::path::Path;

use thailang_ast::Span;
use thailang_parser::parse;
use thailang_types::{check, TypeError};

/// Format a diagnostic the way a user would read it, "line:col message"
/// with a short snippet underlined. Deterministic, column-in-chars for
/// Thai correctness.
fn format_diagnostic(source: &str, error: &TypeError) -> String {
    let loc = locate(source, error.span);
    format!(
        "{line}:{col}  {msg}\n  | {snippet}\n  | {pad}{carets}",
        line = loc.line,
        col = loc.col,
        msg = error.message,
        snippet = loc.line_text,
        pad = " ".repeat(loc.col.saturating_sub(1)),
        carets = "^".repeat(loc.width.max(1)),
    )
}

struct Loc<'a> {
    line: usize,
    col: usize,
    line_text: &'a str,
    width: usize,
}

fn locate(source: &str, span: Span) -> Loc<'_> {
    let start = span.start.min(source.len());
    let end = span.end.min(source.len()).max(start);
    let line_start = source[..start].rfind('\n').map(|i| i + 1).unwrap_or(0);
    let line_end = source[start..]
        .find('\n')
        .map(|i| start + i)
        .unwrap_or(source.len());
    Loc {
        line: source[..line_start].bytes().filter(|b| *b == b'\n').count() + 1,
        col: source[line_start..start].chars().count() + 1,
        line_text: &source[line_start..line_end],
        width: source[start..end.min(line_end)].chars().count(),
    }
}

fn fixture_report(path: &Path) -> String {
    let src = fs::read_to_string(path).expect("read fixture");
    let program = parse(&src).expect("parse fixture (should be valid syntax)");
    let errors = check(&program);
    assert!(
        !errors.is_empty(),
        "fixture {} produced no type errors, expected at least one",
        path.display()
    );
    errors
        .iter()
        .map(|e| format_diagnostic(&src, e))
        .collect::<Vec<_>>()
        .join("\n\n")
}

/// One `#[test]` per fixture. Listed explicitly (instead of glob-driven) so
/// failing cases fail by name under `cargo test`, and so adding a fixture
/// forces an explicit test entry, preventing silent skips.
macro_rules! snapshot_fixture {
    ($name:ident) => {
        #[test]
        fn $name() {
            let path = Path::new(env!("CARGO_MANIFEST_DIR"))
                .join("tests/typeerr")
                .join(concat!(stringify!($name), ".th"));
            insta::assert_snapshot!(stringify!($name), fixture_report(&path));
        }
    };
}

snapshot_fixture!(let_annotation_mismatch);
snapshot_fixture!(reassign_wrong_type);
snapshot_fixture!(return_wrong_type);
snapshot_fixture!(union_miss);
snapshot_fixture!(narrowing_escape);
snapshot_fixture!(fn_param_flows);
snapshot_fixture!(stdlib_return_mismatch);
