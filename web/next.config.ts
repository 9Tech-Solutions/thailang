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

const nextConfig: NextConfig = {
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
