// Empty stub for Node.js built-ins that web-tree-sitter references inside
// dead-code branches guarded by runtime `ENVIRONMENT_IS_NODE` checks. Turbopack's
// static analyzer still tries to resolve the string literals inside those
// `await import("fs/promises")` calls even though the branch never runs in a
// browser bundle. Aliasing them to this module satisfies the resolver.
export const readFile = () => {
  throw new Error("Node-only API called in browser");
};
export const createRequire = () => {
  throw new Error("Node-only API called in browser");
};
export default {};
