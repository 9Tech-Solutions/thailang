use thailang_lexer::{tokenize, TokenKind};

fn first_kind(source: &str) -> TokenKind {
    tokenize(source).into_iter().next().expect("at least one token").kind
}

#[test]
fn tokenizes_let_keyword_hai() {
    assert_eq!(first_kind("ให้"), TokenKind::Let);
}

#[test]
fn tokenizes_const_keyword_kongthi() {
    assert_eq!(first_kind("คงที่"), TokenKind::Const);
}

#[test]
fn tokenizes_function_keyword_fangchan() {
    assert_eq!(first_kind("ฟังก์ชัน"), TokenKind::Function);
}

#[test]
fn tokenizes_return_keyword_khuen() {
    assert_eq!(first_kind("คืน"), TokenKind::Return);
}

#[test]
fn tokenizes_print_keyword_phim() {
    assert_eq!(first_kind("พิมพ์"), TokenKind::Print);
}

#[test]
fn tokenizes_if_keyword_tha() {
    assert_eq!(first_kind("ถ้า"), TokenKind::If);
}

#[test]
fn tokenizes_while_keyword_trap() {
    assert_eq!(first_kind("ตราบ"), TokenKind::While);
}

#[test]
fn tokenizes_for_keyword_won() {
    assert_eq!(first_kind("วน"), TokenKind::For);
}

#[test]
fn tokenizes_foreach_keyword_taela() {
    assert_eq!(first_kind("แต่ละ"), TokenKind::ForEach);
}

#[test]
fn tokenizes_in_keyword_nai() {
    assert_eq!(first_kind("ใน"), TokenKind::In);
}

#[test]
fn tokenizes_break_continue() {
    assert_eq!(first_kind("หยุด"), TokenKind::Break);
    assert_eq!(first_kind("ข้าม"), TokenKind::Continue);
}

#[test]
fn tokenizes_switch_case_default() {
    assert_eq!(first_kind("เลือก"), TokenKind::Switch);
    assert_eq!(first_kind("กรณี"), TokenKind::Case);
    assert_eq!(first_kind("เริ่มต้น"), TokenKind::Default);
}

#[test]
fn tokenizes_type_keywords() {
    assert_eq!(first_kind("ตัวเลข"), TokenKind::NumberType);
    assert_eq!(first_kind("จำนวนเต็ม"), TokenKind::IntType);
    assert_eq!(first_kind("ข้อความ"), TokenKind::StringType);
    assert_eq!(first_kind("จริงเท็จ"), TokenKind::BoolType);
    assert_eq!(first_kind("อะไรก็ได้"), TokenKind::AnyType);
}

#[test]
fn tokenizes_data_structure_keywords() {
    assert_eq!(first_kind("รายการ"), TokenKind::ArrayKw);
    assert_eq!(first_kind("แผนที่"), TokenKind::MapKw);
    assert_eq!(first_kind("โครงสร้าง"), TokenKind::StructKw);
}

#[test]
fn tokenizes_async_await() {
    assert_eq!(first_kind("รอ"), TokenKind::Await);
}

#[test]
fn tokenizes_error_handling() {
    assert_eq!(first_kind("ลอง"), TokenKind::Try);
    assert_eq!(first_kind("จับ"), TokenKind::Catch);
    assert_eq!(first_kind("สุดท้าย"), TokenKind::Finally);
    assert_eq!(first_kind("โยน"), TokenKind::Throw);
}

#[test]
fn tokenizes_module_keywords() {
    assert_eq!(first_kind("นำเข้า"), TokenKind::Import);
    assert_eq!(first_kind("ส่งออก"), TokenKind::Export);
    assert_eq!(first_kind("จาก"), TokenKind::From);
}

#[test]
fn tokenizes_is_keyword_pen() {
    assert_eq!(first_kind("เป็น"), TokenKind::Is);
}

// ── Longest-match priority for `ไม่...` family ─────────────────────────────

#[test]
fn longest_match_else_if_beats_not() {
    assert_eq!(first_kind("ไม่ก็"), TokenKind::ElseIf);
}

#[test]
fn longest_match_else_beats_not() {
    assert_eq!(first_kind("ไม่งั้น"), TokenKind::Else);
}

#[test]
fn longest_match_async_beats_not() {
    assert_eq!(first_kind("ไม่พร้อม"), TokenKind::Async);
}

#[test]
fn longest_match_void_beats_not() {
    assert_eq!(first_kind("ไม่คืน"), TokenKind::VoidType);
}

#[test]
fn lone_not_keyword_still_lexes() {
    assert_eq!(first_kind("ไม่"), TokenKind::Bang);
}

#[test]
fn span_covers_thai_keyword_bytes() {
    let tokens = tokenize("ให้");
    assert_eq!(tokens[0].span.start, 0);
    assert_eq!(tokens[0].span.end, "ให้".len());
}

#[test]
fn ignores_surrounding_whitespace() {
    let tokens = tokenize("   ให้   ");
    assert_eq!(tokens.len(), 1);
}

#[test]
fn lexes_sequence_of_keywords() {
    let kinds: Vec<TokenKind> = tokenize("ให้ คงที่ ฟังก์ชัน")
        .into_iter()
        .map(|t| t.kind)
        .collect();
    assert_eq!(kinds, vec![TokenKind::Let, TokenKind::Const, TokenKind::Function]);
}
