//! Stdlib type signatures, enables the checker to infer return types for
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

/// Return type of an instance method call whose result doesn't depend on the
/// receiver's element type. `"hi".เป็นตัวใหญ่()` → ข้อความ, `.มี(2)` → ถูกผิด.
pub fn method_return_type(member: &str) -> Option<TypeAnn> {
    Some(match member {
        // string methods
        "ตัด" => TypeAnn::String,
        "เป็นตัวใหญ่" | "เป็นตัวเล็ก" => {
            TypeAnn::String
        }
        "แยก" => TypeAnn::Array(Box::new(TypeAnn::String)),
        // array methods, receiver-agnostic result
        "มี" => TypeAnn::Bool,
        _ => return None,
    })
}

/// Return type of an array-receiver method that depends on the element type
/// and, for `.แปลง` / `.ลด`, on the callback or init argument's type.
///
/// - `.เรียง()` on `T[]` → `T[]`
/// - `.กรอง(cb)` on `T[]` → `T[]`
/// - `.แปลง(cb)` on `T[]` where `cb: T => U` → `U[]`
/// - `.ลด(cb, init)` on `T[]` → type of `init`
pub fn array_method_return_type(
    elem: &TypeAnn,
    member: &str,
    callback_return: Option<&TypeAnn>,
    init_ty: Option<&TypeAnn>,
) -> Option<TypeAnn> {
    Some(match member {
        "เรียง" | "กรอง" => TypeAnn::Array(Box::new(elem.clone())),
        "แปลง" => {
            let u = callback_return.cloned().unwrap_or_else(|| elem.clone());
            TypeAnn::Array(Box::new(u))
        }
        "ลด" => match init_ty {
            Some(ty) => ty.clone(),
            None => return None,
        },
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
        "ระบบ" => Some(match member {
            "แสดง" => TypeAnn::Null,
            _ => return None,
        }),
        _ => None,
    }
}

/// Marks an identifier as a known stdlib module so the checker treats
/// references like `คณิต` as legitimate (not "unknown name") and so module
/// member access inference can fire.
pub fn is_module_name(name: &str) -> bool {
    matches!(name, "คณิต" | "ระบบ")
}
