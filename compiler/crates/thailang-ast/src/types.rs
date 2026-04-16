#[derive(Debug, Clone, PartialEq)]
pub enum TypeAnn {
    Number,
    Int,
    String,
    Bool,
    Null,
    Any,
    Void,
    Array(Box<TypeAnn>),
    Map,
    Union(Vec<TypeAnn>),
    Named { name: String, generics: Vec<TypeAnn> },
}
