# thailang

> ภาษาโปรแกรมมิงไทย, Thai-first programming language.

```bash
npm i -g thailang
# or
npx thailang run hello.th
```

Also available as the scoped alias `@9tech.solutions/thailang` (same
package, same version, different registry surface for org discovery):

```bash
npm i -g @9tech.solutions/thailang
```

## What you get

- `thailang run <file.th>`: type-check, compile to JS, execute via Node
- `thailang emit-js <file.th>`: print the emitted JavaScript to stdout
- `thailang check <file.th>`: type-check only (exit 1 on errors)
- `thai` alias, `thai run hello.th` works the same

No Rust toolchain required. The compiler ships as a bundled WASM module
built from the [Thailang project](https://github.com/9Tech-Solutions/thailang).

## Quick taste

Save as `hello.th`:

```thailang
ให้ ชื่อ = "ชาวโลก";
พิมพ์("สวัสดี " + ชื่อ);
```

Run it:

```bash
$ thailang run hello.th
สวัสดี ชาวโลก
```

## Requirements

- Node.js ≥ 18
- That's it.

## Links

- Website: https://thailang.dev
- Docs: https://thailang.dev/docs
- Source: https://github.com/9Tech-Solutions/thailang
- Language spec: https://github.com/9Tech-Solutions/thailang/blob/main/docs/SPEC.md

## License

MIT © Thailang Contributors
