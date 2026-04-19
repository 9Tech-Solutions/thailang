; Thailang tree-sitter highlight queries.
;
; Uses the standard tree-sitter-highlights capture names so downstream
; consumers (Neovim, Helix, GitHub Linguist, Zed, etc.) pick up colors from
; their existing theme files without custom mapping.

; ── Keywords ─────────────────────────────────────────────────────────────

[
  "ให้"
  "คงที่"
  "สูตร"
] @keyword

[
  "ส่งกลับ"
  "ถ้า"
  "ไม่ก็"
  "ไม่งั้น"
  "ระหว่างที่"
  "วน"
  "แต่ละ"
  "ใน"
  "หยุด"
  "ข้าม"
  "เลือก"
  "กรณี"
  "เริ่มต้น"
] @keyword.control

[
  "ลอง"
  "จับ"
  "สุดท้าย"
  "ฟ้อง"
] @keyword.control.exception

[
  "รอ"
  "ขนาน"
] @keyword.control.async

[
  "นำเข้า"
  "ส่งออก"
  "จาก"
] @keyword.import

"เป็น" @keyword.operator

; ── Types ────────────────────────────────────────────────────────────────

(primitive_type) @type.builtin

(struct_type "โครง" @keyword)

"ชุด" @type.builtin
(map_type) @type.builtin

; User-defined type references inside type annotations get @type, not @variable.
(parameter type: (identifier) @type)
(let_declaration type: (identifier) @type)
(const_declaration type: (identifier) @type)
(function_declaration return_type: (identifier) @type)
(struct_field type: (identifier) @type)

; ── Literals ─────────────────────────────────────────────────────────────

(string) @string
(escape_sequence) @string.escape
(integer) @number
(float) @number.float
(bool) @boolean
(null) @constant.builtin

; ── Functions ────────────────────────────────────────────────────────────

(function_declaration name: (identifier) @function)
(call_expression function: (identifier) @function.call)
(call_expression function: (member_expression property: (identifier) @function.method.call))

(parameter name: (identifier) @variable.parameter)

; ── Members + identifiers ────────────────────────────────────────────────

(member_expression property: (identifier) @property)
(object_property key: (identifier) @property)

; Stdlib module names get a distinct accent (same scope tree-sitter-javascript
; uses for `console`, `Math`, etc.).
((identifier) @type.builtin
  (#match? @type.builtin "^(ระบบ|คณิต)$"))

(identifier) @variable

; ── Operators + punctuation ──────────────────────────────────────────────

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "+="
  "-="
  "*="
  "/="
  "%="
  "->"
  "=>"
  "&&"
  "||"
  "!"
  "และ"
  "หรือ"
  "ไม่ใช่"
] @operator

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  ","
  ";"
  ":"
  "."
  "|"
] @punctuation.delimiter

; ── Comments ─────────────────────────────────────────────────────────────

(line_comment) @comment
(block_comment) @comment
