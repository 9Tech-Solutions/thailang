//! Stdlib dispatch for JS emit.
//!
//! Thailang's standard library uses Thai names (ความยาว, เรียง, คณิต, …) that
//! map onto host JS names (length, sort, Math, …). This module centralizes
//! that mapping so the emitter can rename members / modules without knowing
//! the receiver type, JS dispatches at runtime, we just pick the right name.

/// Rewrite for a member access. Returns the JS name to emit in place of `.<thai>`,
/// OR `None` to leave the Thai name untouched. Applies to both bare property
/// reads (`s.ความยาว`) and method calls (`s.ตัด(...)`), the caller separately
/// appends `(args)` when it's a call.
pub fn method_name(thai: &str) -> Option<&'static str> {
    Some(match thai {
        // shared on strings + arrays
        "ความยาว" => "length",
        // strings
        "ตัด" => "slice",
        "เป็นตัวใหญ่" => "toUpperCase",
        "เป็นตัวเล็ก" => "toLowerCase",
        "แยก" => "split",
        // arrays
        "กรอง" => "filter",
        "แปลง" => "map",
        "ลด" => "reduce",
        "มี" => "includes",
        _ => return None,
    })
}

/// Non-renaming methods that take a JS method chain, emitted by the caller
/// directly. Returns the raw JS snippet that replaces the `.<thai>` member
/// access; the caller appends the call arguments. Only applies when the
/// access is a method call, not a bare property read.
pub fn method_chain(thai: &str) -> Option<&'static str> {
    Some(match thai {
        // `.เรียง()` → `.slice().sort()` so original array is not mutated,
        // matching the spec example `[3,1,2].เรียง() // [1,2,3]` where the
        // source array is not expected to reorder.
        "เรียง" => "slice().sort",
        _ => return None,
    })
}

/// Module-level identifier rewrite. Returns the host JS name to emit in place
/// of the Thai identifier, OR `None` to leave it alone.
pub fn module_ident(thai: &str) -> Option<&'static str> {
    Some(match thai {
        "คณิต" => "Math",
        _ => return None,
    })
}

/// Member-on-module rewrite. When `object` is a known stdlib module
/// (e.g., `คณิต`), the Thai member needs to be translated to the host
/// module's member name.
pub fn module_member(module: &str, member: &str) -> Option<&'static str> {
    match module {
        "คณิต" => Some(match member {
            "สูงสุด" => "max",
            "ต่ำสุด" => "min",
            "สุ่ม" => "random",
            "ปัดขึ้น" => "ceil",
            "ปัดลง" => "floor",
            _ => return None,
        }),
        _ => None,
    }
}
