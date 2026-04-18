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
    Named {
        name: String,
        generics: Vec<TypeAnn>,
    },
}

impl TypeAnn {
    /// Flatten nested unions into a single `Union` whose variants are all non-union.
    pub fn normalized(self) -> Self {
        match self {
            TypeAnn::Union(variants) => {
                let mut flat: Vec<TypeAnn> = Vec::with_capacity(variants.len());
                for v in variants {
                    match v.normalized() {
                        TypeAnn::Union(inner) => flat.extend(inner),
                        other => flat.push(other),
                    }
                }
                flat.dedup();
                if flat.len() == 1 {
                    flat.into_iter().next().unwrap()
                } else {
                    TypeAnn::Union(flat)
                }
            }
            other => other,
        }
    }
}
