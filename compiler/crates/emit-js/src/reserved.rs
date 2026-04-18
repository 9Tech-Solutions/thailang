//! JS reserved-word escape.
//!
//! Thailang identifiers emit verbatim to JS, but `.th` files may contain
//! ASCII identifiers that collide with JS reserved words (`class`, `new`,
//! `return`, etc.). Left alone they produce `let class = 1;` which is a
//! SyntaxError. We rename any collision by appending `$`, which is a
//! valid JS ident char and is itself never a reserved word.
//!
//! Mangling is deterministic, the same input always produces the same
//! output, so declaration sites and use sites agree without any shared
//! state between emit passes.

/// All words that cannot appear as a plain identifier in strict-mode
/// JavaScript (which includes ES modules, our emit target).
///
/// Sources: ECMA-262 §12.7.1 (ReservedWord) + §12.7.2 (strict-mode
/// additions). Kept alphabetical for auditability.
const RESERVED: &[&str] = &[
    "arguments",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "eval",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
];

/// True when `name` is a JS reserved word (strict-mode inclusive).
pub fn is_reserved(name: &str) -> bool {
    RESERVED.binary_search(&name).is_ok()
}

/// Returns the JS-safe form of `name`. Thai identifiers and ASCII idents
/// that don't collide pass through unchanged.
pub fn safe(name: &str) -> String {
    if is_reserved(name) {
        format!("{name}$")
    } else {
        name.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reserved_list_is_sorted_for_binary_search() {
        let mut sorted = RESERVED.to_vec();
        sorted.sort_unstable();
        assert_eq!(sorted, RESERVED, "RESERVED must be alphabetical");
    }

    #[test]
    fn reserved_detects_class_and_new() {
        assert!(is_reserved("class"));
        assert!(is_reserved("new"));
        assert!(is_reserved("await"));
    }

    #[test]
    fn thai_names_not_reserved() {
        assert!(!is_reserved("ชื่อ"));
        assert!(!is_reserved("ตัวเลข"));
    }

    #[test]
    fn safe_appends_dollar_for_reserved() {
        assert_eq!(safe("class"), "class$");
        assert_eq!(safe("return"), "return$");
    }

    #[test]
    fn safe_is_identity_for_non_reserved() {
        assert_eq!(safe("myVar"), "myVar");
        assert_eq!(safe("class$"), "class$");
        assert_eq!(safe("ชื่อ"), "ชื่อ");
    }
}
