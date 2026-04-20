export const site = {
  name: "Thailang",
  tagline: "ภาษาโปรแกรมมิงไทยตัวแรกที่ compile จริง",
  taglineEn: "The first Thai programming language that actually compiles",
  description:
    "Thai-first. Type-safe. Compiled to JavaScript, WebAssembly, and native via LLVM. Syntax you already know; keywords you actually read.",
  domain: "thailang.dev",
  repo: "https://github.com/9Tech-Solutions/thailang",
  version: "0.1.0",
  vscodeMarketplace:
    "https://marketplace.visualstudio.com/items?itemName=9Tech.thailang",
  openVsx: "https://open-vsx.org/extension/9Tech/thailang",
} as const;

export const navLinks = [
  { href: "/docs", label: "Docs", labelTh: "เอกสาร", status: "live" as const },
  {
    href: "/playground",
    label: "Playground",
    labelTh: "ลองเล่น",
    status: "live" as const,
  },
  {
    href: site.repo,
    label: "GitHub",
    labelTh: "กิตฮับ",
    status: "live" as const,
    external: true,
  },
] as const;
