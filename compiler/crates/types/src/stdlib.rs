//! Stdlib type signatures — enables the checker to infer return types for
//! `.ความยาว`, `.ตัด()`, `คณิต.สูงสุด()`, etc. Kept in sync with
//! `thailang-emit-js::stdlib` by convention (same names, same semantics).

use thailang_ast::TypeAnn;

/// Return type of a bare property read on an arbitrary receiver.
/// e.g., `"hi".ความยาว` or `[1,2,3].ความยาว`.
pub fn property_type(member: &str) -> Option<TypeAnn> {
    Some(match member {
        "ความยาว" => TypeAnn::Int,
        _ => return None,
    })
}

/// Return type of an instance method call.
/// e.g., `"hi".เป็นตัวใหญ่()` → ข้อความ; `[1,2,3].มี(2)` → จริงเท็จ.
pub fn method_return_type(member: &str) -> Option<TypeAnn> {
    Some(match member {
        // string methods
        "ตัด" => TypeAnn::String,
        "เป็นตัวใหญ่" | "เป็นตัวเล็ก" => {
            TypeAnn::String
        }
        "แยก" => TypeAnn::Array(Box::new(TypeAnn::String)),
        // array methods
        "มี" => TypeAnn::Bool,
        // `.เรียง/.กรอง/.แปลง/.ลด` return types are receiver-dependent (e.g.,
        // `.แปลง` returns an Array of whatever the callback produces). Phase 3B
        // leaves these as Any — accurate inference requires tracking the
        // receiver's element type through the call, which is Phase 3C work.
        _ => return None,
    })
}

/// Return type of a module-level function call, e.g., `คณิต.สุ่ม()`.
pub fn module_call_return_type(module: &str, member: &str) -> Option<TypeAnn> {
    match module {
        "คณิต" => Some(match member {
            "สูงสุด" | "ต่ำสุด" => TypeAnn::Number,
            "สุ่ม" => TypeAnn::Number,
            "ปัดขึ้น" | "ปัดลง" => TypeAnn::Int,
            _ => return None,
        }),
        _ => None,
    }
}

/// Marks an identifier as a known stdlib module so the checker treats
/// references like `คณิต` as legitimate (not "unknown name") and so module
/// member access inference can fire.
pub fn is_module_name(name: &str) -> bool {
    matches!(name, "คณิต")
}
