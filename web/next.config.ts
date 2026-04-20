import type { NextConfig } from "next";

// Dev adds 'unsafe-eval' for React's dev-only callstack reconstruction and
// Turbopack's source maps. Prod stays strict: wasm-unsafe-eval + unsafe-inline
// only (the latter needed for Next's runtime bootstrap until we wire nonces).
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'wasm-unsafe-eval'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
].join(" ");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), camera=(), microphone=()",
  },
];

// web-tree-sitter's ESM bundle contains runtime-guarded `await import("fs/promises")`
// / `await import("module")` calls for the Node code path. Turbopack still resolves
// those string literals at bundle time, so we stub the Node built-ins for browser
// builds. The stub throws if ever reached at runtime (it won't be: the Node
// branch is gated on `globalThis.process?.versions.node`).
const nodeBuiltinStub = "./src/shared/lib/node-builtin-stub.ts";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "fs/promises": { browser: nodeBuiltinStub },
      fs: { browser: nodeBuiltinStub },
      module: { browser: nodeBuiltinStub },
      path: { browser: nodeBuiltinStub },
      url: { browser: nodeBuiltinStub },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
