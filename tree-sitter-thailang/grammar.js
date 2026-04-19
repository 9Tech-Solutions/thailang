/**
 * Thailang tree-sitter grammar.
 *
 * Mirrors the tokens and grammar of compiler/crates/lexer + parser in the
 * Thailang monorepo. Source of truth for keywords:
 *   compiler/crates/lexer/src/token.rs
 *
 * Scope here is pragmatic: cover every keyword, literal, and expression form
 * the compiler accepts, so that editor highlighting and GitHub Linguist light
 * up correctly. We're not re-implementing type inference.
 *
 * The identifier pattern matches Thai (U+0E00 to U+0E7F) + ASCII alphanumerics
 * and underscore, matching the logos regex in the Rust lexer exactly.
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  or: 2,
  and: 3,
  equality: 4,
  comparison: 5,
  term: 6, // + -
  factor: 7, // * / %
  unary: 8, // ! - (prefix)
  call: 9,
  member: 10,
};

const ID_PATTERN = /[\u0E00-\u0E7Fa-zA-Z_][\u0E00-\u0E7Fa-zA-Z0-9_]*/;

module.exports = grammar({
  name: "thailang",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  word: ($) => $.identifier,

  conflicts: ($) => [
    // (x) can be either a parenthesized_expression or an arrow_function's
    // parameter_list; tree-sitter's GLR parser decides when it sees `=>`.
    [$.parameter, $._expression],
    // { ... } can be a block statement or an object literal expression.
    [$.block, $.object_literal],
    // `x เป็น T` right-hand `T` can be a union or a single type; let the
    // GLR parser pick based on whether a `|` follows.
    [$._type, $._type_non_union],
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    // ── Statements ─────────────────────────────────────────────────────

    _statement: ($) =>
      choice(
        $.let_declaration,
        $.const_declaration,
        $.function_declaration,
        $.return_statement,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.foreach_statement,
        $.break_statement,
        $.continue_statement,
        $.switch_statement,
        $.try_statement,
        $.throw_statement,
        $.import_statement,
        $.export_statement,
        $.expression_statement,
        $.block,
      ),

    let_declaration: ($) =>
      seq(
        "ให้",
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        optional(seq("=", field("value", $._expression))),
        optional(";"),
      ),

    const_declaration: ($) =>
      seq(
        "คงที่",
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        "=",
        field("value", $._expression),
        optional(";"),
      ),

    function_declaration: ($) =>
      seq(
        optional("ขนาน"),
        "สูตร",
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        optional(seq("->", field("return_type", $._type))),
        field("body", $.block),
      ),

    parameter_list: ($) =>
      seq("(", optional(commaSep1($.parameter)), ")"),

    parameter: ($) =>
      seq(
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
      ),

    return_statement: ($) =>
      prec.right(
        seq("ส่งกลับ", optional($._expression), optional(";")),
      ),

    if_statement: ($) =>
      seq(
        "ถ้า",
        "(",
        field("condition", $._expression),
        ")",
        field("consequence", $.block),
        repeat(
          seq(
            "ไม่ก็",
            "(",
            field("elif_condition", $._expression),
            ")",
            field("elif_body", $.block),
          ),
        ),
        optional(seq("ไม่งั้น", field("alternative", $.block))),
      ),

    while_statement: ($) =>
      seq(
        "ระหว่างที่",
        "(",
        field("condition", $._expression),
        ")",
        field("body", $.block),
      ),

    for_statement: ($) =>
      seq(
        "วน",
        "(",
        field("init", optional(choice($.for_let_init, $._expression))),
        ";",
        field("condition", optional($._expression)),
        ";",
        field("update", optional($._expression)),
        ")",
        field("body", $.block),
      ),

    // for-loop let-binding init slot, no trailing `;` (the for_statement
    // itself provides the separators).
    for_let_init: ($) =>
      seq(
        "ให้",
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        optional(seq("=", field("value", $._expression))),
      ),

    foreach_statement: ($) =>
      seq(
        "แต่ละ",
        "(",
        field("variable", $.identifier),
        "ใน",
        field("iterable", $._expression),
        ")",
        field("body", $.block),
      ),

    break_statement: ($) => seq("หยุด", optional(";")),
    continue_statement: ($) => seq("ข้าม", optional(";")),

    switch_statement: ($) =>
      seq(
        "เลือก",
        "(",
        field("subject", $._expression),
        ")",
        "{",
        repeat($.case_clause),
        optional($.default_clause),
        "}",
      ),

    case_clause: ($) =>
      seq("กรณี", field("value", $._expression), ":", repeat($._statement)),

    default_clause: ($) => seq("เริ่มต้น", ":", repeat($._statement)),

    try_statement: ($) =>
      seq(
        "ลอง",
        field("body", $.block),
        optional(
          seq(
            "จับ",
            optional(seq("(", field("error", $.identifier), ")")),
            field("handler", $.block),
          ),
        ),
        optional(seq("สุดท้าย", field("finalizer", $.block))),
      ),

    throw_statement: ($) =>
      seq("ฟ้อง", field("value", $._expression), optional(";")),

    import_statement: ($) =>
      seq(
        "นำเข้า",
        field("what", choice($.identifier, $.import_list)),
        "จาก",
        field("from", $.string),
        optional(";"),
      ),

    import_list: ($) => seq("{", commaSep1($.identifier), "}"),

    export_statement: ($) =>
      seq("ส่งออก", field("declaration", $._statement)),

    expression_statement: ($) => seq($._expression, optional(";")),

    block: ($) => seq("{", repeat($._statement), "}"),

    // ── Types ──────────────────────────────────────────────────────────

    _type: ($) =>
      choice(
        $.primitive_type,
        $.array_type,
        $.map_type,
        $.struct_type,
        $.union_type,
        $.identifier, // user-named type
      ),

    primitive_type: ($) =>
      choice(
        "ตัวเลข",
        "จำนวนเต็ม",
        "ข้อความ",
        "ถูกผิด",
        "ทั่วไป",
        "ไม่ส่งกลับ",
        "ว่าง",
      ),

    array_type: ($) =>
      choice(
        seq("ชุด", "<", $._type, ">"),
        prec.right(seq($._type_non_union, "[", "]")),
      ),

    // Same as _type but excludes unions to avoid left-recursion in array_type.
    _type_non_union: ($) =>
      choice(
        $.primitive_type,
        $.map_type,
        $.struct_type,
        $.identifier,
      ),

    map_type: ($) => "คู่",

    struct_type: ($) =>
      seq(
        "โครง",
        "{",
        commaSep($.struct_field),
        "}",
      ),

    struct_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    union_type: ($) => prec.left(seq($._type, "|", $._type)),

    // ── Expressions ────────────────────────────────────────────────────

    _expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.is_check_expression,
        $.call_expression,
        $.member_expression,
        $.index_expression,
        $.assignment_expression,
        $.arrow_function,
        $.parenthesized_expression,
        $.array_literal,
        $.object_literal,
        $._literal,
        $.identifier,
      ),

    assignment_expression: ($) =>
      prec.right(
        1,
        seq(
          field("left", choice($.identifier, $.member_expression, $.index_expression)),
          field("operator", choice("=", "+=", "-=", "*=", "/=", "%=")),
          field("right", $._expression),
        ),
      ),

    binary_expression: ($) => {
      const operators = [
        ["||", PREC.or],
        ["หรือ", PREC.or],
        ["&&", PREC.and],
        ["และ", PREC.and],
        ["==", PREC.equality],
        ["!=", PREC.equality],
        ["<", PREC.comparison],
        ["<=", PREC.comparison],
        [">", PREC.comparison],
        [">=", PREC.comparison],
        ["+", PREC.term],
        ["-", PREC.term],
        ["*", PREC.factor],
        ["/", PREC.factor],
        ["%", PREC.factor],
      ];

      return choice(
        ...operators.map(([op, precedence]) =>
          prec.left(
            precedence,
            seq(
              field("left", $._expression),
              field("operator", op),
              field("right", $._expression),
            ),
          ),
        ),
      );
    },

    unary_expression: ($) =>
      prec(
        PREC.unary,
        seq(
          field("operator", choice("!", "ไม่ใช่", "-")),
          field("operand", $._expression),
        ),
      ),

    /// `x เป็น ข้อความ` — type guard.
    is_check_expression: ($) =>
      prec.left(
        PREC.equality,
        seq(field("value", $._expression), "เป็น", field("type", $._type)),
      ),

    call_expression: ($) =>
      prec(
        PREC.call,
        seq(field("function", $._expression), field("arguments", $.argument_list)),
      ),

    argument_list: ($) => seq("(", optional(commaSep1($._expression)), ")"),

    member_expression: ($) =>
      prec(
        PREC.member,
        seq(
          field("object", $._expression),
          ".",
          field("property", $.identifier),
        ),
      ),

    index_expression: ($) =>
      prec(
        PREC.member,
        seq(
          field("object", $._expression),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    arrow_function: ($) =>
      prec.right(
        seq(
          field("parameters", $.parameter_list),
          "=>",
          field("body", choice($._expression, $.block)),
        ),
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    array_literal: ($) => seq("[", commaSep($._expression), "]"),

    object_literal: ($) => seq("{", commaSep($.object_property), "}"),

    object_property: ($) =>
      seq(
        field("key", choice($.identifier, $.string)),
        ":",
        field("value", $._expression),
      ),

    // ── Literals ───────────────────────────────────────────────────────

    _literal: ($) =>
      choice($.string, $.float, $.integer, $.bool, $.null, "รอ"),

    string: ($) =>
      seq('"', repeat(choice($._string_char, $.escape_sequence)), '"'),

    _string_char: (_) => token.immediate(prec(1, /[^\\"]/)),

    escape_sequence: (_) =>
      token.immediate(seq("\\", choice("n", "t", "r", "\\", '"'))),

    float: (_) => /[0-9]+\.[0-9]+/,
    integer: (_) => /[0-9]+/,
    bool: (_) => choice("ถูก", "ผิด"),
    null: (_) => "ว่าง",

    // ── Identifiers + comments ─────────────────────────────────────────

    identifier: (_) => ID_PATTERN,

    line_comment: (_) => token(seq("//", /[^\n]*/)),
    block_comment: (_) =>
      token(
        seq(
          "/*",
          /[^*]*\*+([^/*][^*]*\*+)*/,
          "/",
        ),
      ),
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
