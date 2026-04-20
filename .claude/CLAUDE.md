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

## Code-review-graph (MCP)

A knowledge graph of the codebase is available via MCP. For non-trivial tasks that need to locate callers, dependents, or affected tests, call the graph tools before grepping:

- `mcp__code-review-graph__get_minimal_context_tool` — call first (~100 tokens), scopes the task
- `mcp__code-review-graph__get_impact_radius_tool` — blast radius of changed files
- `mcp__code-review-graph__query_graph_tool` — callers / callees / tests / imports / inheritance
- `mcp__code-review-graph__semantic_search_nodes_tool` — find entities by name or meaning
- `mcp__code-review-graph__detect_changes_tool` — risk-scored diff analysis
- `mcp__code-review-graph__build_or_update_graph_tool` — refresh if the graph feels stale

Graph stored in `.code-review-graph/` (gitignored). `.th` files aren't indexed (extension not in upstream's parser map). Manual refresh: `uvx code-review-graph update`.
