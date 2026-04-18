# Thailang: Project Conventions

## Architecture

- Monorepo: pnpm workspaces (root) + Cargo workspace under `compiler/`.
- DDD bounded contexts: `language-core`, `playground`, `documentation`, `marketing`.
- FSD layers in `web/src/` (Phase 5+): `app/ → pages/ → widgets/ → features/ → entities/ → shared/`.
- Cross-context calls only through `shared/api`.

## Naming

- **Thai** for: language keywords, stdlib module/method names, example program identifiers.
- **English** for: Rust crate/struct/fn names, CI scripts, repo tooling.
- `.th` programs may use English identifiers freely, Thailang only enforces Thai keywords.
- Test fixture filenames: descriptive English (`fizzbuzz.th`, `error_unbalanced_brace.th`), even though contents are Thai source.

## Testing (TDD required)

- Rust: write parser/typechecker tests BEFORE implementation.
- Use `insta` for AST + emitted JS snapshots.
- Use `proptest` for lexer fuzzing over Thai Unicode ranges.
- ≥80% line coverage via `cargo-llvm-cov`.
- Web (Phase 5+): Vitest for unit, Playwright for E2E.

## Spec

- Source of truth: [`docs/SPEC.md`](../docs/SPEC.md).
- Spec changes require updates to: lexer keywords, parser grammar, snapshot tests, examples.

## Active Plan

See `~/.claude/plans/linear-cooking-shannon.md` for current phase + verification commands.
