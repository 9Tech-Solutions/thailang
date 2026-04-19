//! Property-based tests for the lexer.
//!
//! Purpose: catch panics and invariant breaks on pathological input, especially
//! around Thai Unicode combining marks, escape sequences, and numeric edge
//! cases. Each proptest runs 256 cases by default (tune via
//! `PROPTEST_CASES=n` env var).

use proptest::prelude::*;
use thailang_lexer::{TokenKind, tokenize};

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

    /// tokenize() never panics on arbitrary Unicode, including the full Thai
    /// block with combining vowel/tone marks in every legal and illegal order.
    /// This is the main "don't crash the WASM playground" guarantee.
    #[test]
    fn tokenize_never_panics_on_arbitrary_unicode(
        input in r"[\x00-\x7F\u{0E00}-\u{0E7F}\u{FE00}-\u{FE0F}\u{200B}-\u{200D}]{0,200}"
    ) {
        // Just call it; proptest fails the case on any panic.
        let _ = tokenize(&input);
    }

    /// tokenize() never panics on random ASCII (tests operator / punctuation
    /// interactions, stray quotes, unterminated comments, etc.).
    #[test]
    fn tokenize_never_panics_on_arbitrary_ascii(
        input in r"[\x20-\x7E\n\t]{0,300}"
    ) {
        let _ = tokenize(&input);
    }

    /// Decimal integer literals always produce an Int token with the exact
    /// parsed value.
    #[test]
    fn integer_literals_round_trip(n in 0_i64..1_000_000_000_000) {
        let src = n.to_string();
        let tokens = tokenize(&src);

        prop_assert_eq!(tokens.len(), 1);
        match tokens[0].kind {
            TokenKind::Int(v) => prop_assert_eq!(v, n),
            ref other => prop_assert!(false, "expected Int({n}), got {:?}", other),
        }
    }

    /// Float literals (N.M form) always produce a Float token.
    #[test]
    fn float_literals_tokenize_as_float(
        int in 0_u32..1_000_000,
        frac in 0_u32..1_000_000,
    ) {
        let src = format!("{int}.{frac}");
        let tokens = tokenize(&src);

        prop_assert_eq!(tokens.len(), 1);
        prop_assert!(matches!(tokens[0].kind, TokenKind::Float(_)));
    }

    /// String literals with no escapes round-trip: the contained text
    /// (between the double quotes) matches the Str payload exactly.
    #[test]
    fn plain_string_literal_roundtrips(
        body in r#"[\u0E00-\u0E7Fa-zA-Z0-9 ,.!?]{0,80}"#
    ) {
        let src = format!("\"{body}\"");
        let tokens = tokenize(&src);

        prop_assert_eq!(tokens.len(), 1);
        match &tokens[0].kind {
            TokenKind::Str(s) => prop_assert_eq!(s, &body),
            other => prop_assert!(false, "expected Str, got {:?}", other),
        }
    }

    /// String literal with mixed safe escapes (\\n \\t \\\\ \\") tokenizes
    /// to a single Str.
    #[test]
    fn string_literal_with_escapes_does_not_panic(
        chunks in prop::collection::vec(
            prop_oneof![
                Just(r"\n".to_string()),
                Just(r"\t".to_string()),
                Just(r"\r".to_string()),
                Just(r"\\".to_string()),
                Just(r#"\""#.to_string()),
                r"[\u0E00-\u0E7Fa-zA-Z0-9 ,.!?]{0,5}".prop_map(String::from),
            ],
            0..20
        )
    ) {
        let src = format!("\"{}\"", chunks.join(""));
        let tokens = tokenize(&src);

        prop_assert_eq!(tokens.len(), 1);
        prop_assert!(matches!(tokens[0].kind, TokenKind::Str(_)));
    }

    /// Whitespace and line comments between identifiers never change the
    /// non-trivia token sequence.
    #[test]
    fn whitespace_and_line_comments_between_idents_preserve_count(
        ws in prop::collection::vec(
            prop_oneof![
                Just(" ".to_string()),
                Just("\t".to_string()),
                Just("\n".to_string()),
                r"// [a-zA-Z0-9 ]{0,40}\n".prop_map(String::from),
            ],
            1..8
        ),
        n_idents in 1_usize..6,
    ) {
        let joiner = ws.join("");
        let src = (0..n_idents)
            .map(|i| format!("_x{i}"))
            .collect::<Vec<_>>()
            .join(&joiner);
        let tokens = tokenize(&src);

        prop_assert_eq!(tokens.len(), n_idents);
        for t in &tokens {
            prop_assert!(matches!(t.kind, TokenKind::Ident(_)));
        }
    }

    /// All token spans always point to valid UTF-8 boundaries in the source.
    /// Diagnostic renderers downstream assume span endpoints are char-boundaries.
    #[test]
    fn all_spans_land_on_char_boundaries(
        input in r"[\x20-\x7E\u{0E00}-\u{0E7F}\n\t]{0,200}"
    ) {
        let tokens = tokenize(&input);
        for t in &tokens {
            prop_assert!(
                input.is_char_boundary(t.span.start),
                "span start {} not on char boundary in {:?}", t.span.start, input
            );
            prop_assert!(
                input.is_char_boundary(t.span.end),
                "span end {} not on char boundary in {:?}", t.span.end, input
            );
        }
    }
}
