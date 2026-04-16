use proptest::prelude::*;
use thailang_lexer::{tokenize, TokenKind};

proptest! {
    /// Any underscore-prefixed Thai/ASCII string is always one Ident token
    /// (underscore prefix guarantees no keyword collision).
    #[test]
    fn underscored_thai_identifier_roundtrips(
        suffix in r"[\u0E00-\u0E7Fa-zA-Z0-9]{1,30}"
    ) {
        let ident = format!("_{suffix}");
        let tokens = tokenize(&ident);

        prop_assert_eq!(tokens.len(), 1);
        match &tokens[0].kind {
            TokenKind::Ident(name) => prop_assert_eq!(name, &ident),
            other => prop_assert!(false, "expected Ident, got {:?}", other),
        }
    }

    /// A Thai-consonant-led identifier longer than any keyword (max 9 chars)
    /// is always tokenized as a single Ident.
    #[test]
    fn long_thai_identifier_never_collides_with_keyword(
        head in r"[\u0E01-\u0E2E]",
        tail in r"[\u0E00-\u0E7F]{10,30}"
    ) {
        let ident = format!("{head}{tail}");
        let tokens = tokenize(&ident);

        prop_assert_eq!(tokens.len(), 1);
        prop_assert!(matches!(tokens[0].kind, TokenKind::Ident(_)));
    }

    /// Span byte offsets always cover the full UTF-8 encoded identifier.
    #[test]
    fn identifier_span_matches_utf8_byte_length(
        suffix in r"[\u0E00-\u0E7F]{1,20}"
    ) {
        let ident = format!("_{suffix}");
        let tokens = tokenize(&ident);

        prop_assert_eq!(tokens[0].span.start, 0);
        prop_assert_eq!(tokens[0].span.end, ident.len());
    }
}
