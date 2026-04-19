import type { ComponentType, ReactNode } from "react";
import type { Lang } from "./LangProvider";

export interface SectionCopy {
  topbar: {
    samples: string;
    samplesBadge: string;
    why: string;
    whyBadge: string;
    keywords: string;
    keywordsBadge: string;
    docs: string;
    docsBadge: string;
    github: string;
  };
  hero: {
    volume: string;
    released: string;
    releasedValue: string;
    releasedSuffix: string;
    version: string;
    targets: string;
    targetSoon: string;
    line1: string;
    line2: string;
    enKicker: string;
    lede: (
      Inline: ComponentType<{ children: ReactNode }>,
      Strong: ComponentType<{ children: ReactNode }>,
    ) => ReactNode;
    ctaPrimary1: string;
    ctaPrimary2: string;
    ctaSecondary: string;
    ctaSecondarySub: string;
    ctaDocs: string;
    ctaDocsSoon: string;
    statKeywords: string;
    statCompiler: string;
    statBackends: string;
    statLicense: string;
  };
  playground: {
    kicker: string;
    titlePart1: string;
    titleEm: string;
    body: string;
  };
  features: {
    kicker: string;
    h2Part1: string;
    h2Script: string;
    h2Part2: string;
    h2Gold: string;
    intro: string;
    items: Array<{
      num: string;
      kbd: string;
      titleMain: string;
      titleSub: string;
      body: string;
    }>;
  };
  keywords: {
    kicker: string;
    h2Lead: string;
    h2Trail: string;
    intro: string;
    filterAll: string;
  };
  closer: {
    quotePart1Gold: string;
    quotePart1: string;
    quotePart2: string;
    quotePart2Gold: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  footer: {
    tagline: string;
    resourcesHeading: string;
    projectHeading: string;
    docs: string;
    samples: string;
    playground: string;
    playgroundBadge: string;
    keywords: string;
    vscodeExt: string;
    vscodeExtBadge: string;
    github: string;
    discord: string;
    roadmap: string;
    license: string;
    buildLine: string;
    madeIn: string;
    rights: string;
  };
}

const th: SectionCopy = {
  topbar: {
    samples: "ตัวอย่าง",
    samplesBadge: "samples",
    why: "ทำไม",
    whyBadge: "why",
    keywords: "คำสงวน",
    keywordsBadge: "keywords",
    docs: "เอกสาร",
    docsBadge: "soon",
    github: "GitHub ↗",
  },
  hero: {
    volume: "เล่มที่ 01 · Volume 01",
    released: "เผยแพร่เมื่อ · released",
    releasedValue: "เมษายน 2569",
    releasedSuffix: "preview build",
    version: "เวอร์ชัน · version",
    targets: "ปลายทาง · targets",
    targetSoon: "SOON",
    line1: "เขียนเป็นไทย",
    line2: "รันได้ทุกที่",
    enKicker: "WRITE IN THAI / COMPILE TO JS, WASM, NATIVE",
    lede: (Inline, Strong) => (
      <>
        <Strong>Thailang</Strong> คือภาษาโปรแกรมมิงที่ใช้{" "}
        <Inline>คำสงวนภาษาไทย</Inline> มีระบบชนิดข้อมูลแบบ TypeScript
        คอมไพเลอร์เขียนด้วย Rust คอมไพล์เป็น JavaScript และ WebAssembly ได้แล้ววันนี้
        ใช้เครื่องมือเดิมที่คุ้นเคย กับภาษาที่อ่านออกตั้งแต่บรรทัดแรก
      </>
    ),
    ctaPrimary1: "ลองเล่น",
    ctaPrimary2: "Try it",
    ctaSecondary: "อ่านซอร์สโค้ด",
    ctaSecondarySub: "→ github",
    ctaDocs: "เอกสาร",
    ctaDocsSoon: "SOON",
    statKeywords: "Thai keywords",
    statCompiler: "compiler core",
    statBackends: "backends live",
    statLicense: "licensed",
  },
  playground: {
    kicker: "ลองเขียนดู · try a sample",
    titlePart1: "โค้ดที่อ่าน",
    titleEm: "ออกทันที",
    body: "ทุกคำสงวนเป็นภาษาไทย โครงสร้างไวยากรณ์คล้าย TypeScript เลือกแท็บด้านบนเพื่อดูว่า Thailang คอมไพล์ออกมาเป็นอะไร แล้วกด Run เพื่อรันจริงใน browser ผ่าน WebAssembly",
  },
  features: {
    kicker: "ทำไม Thailang · why",
    h2Part1: "ภาษาไทย",
    h2Script: "กับ",
    h2Part2: "toolchain",
    h2Gold: "ที่คุ้นเคย",
    intro:
      "Thailang คือคอมไพเลอร์เต็มรูปแบบที่เขียนด้วย Rust มีระบบชนิดข้อมูลแบบยืดหยุ่น คอมไพล์เป็น JavaScript และ WebAssembly ได้แล้ววันนี้ และกำลังเตรียมรองรับ native ผ่าน LLVM ทั้งหมดนี้เพื่อให้นักพัฒนาคนไทยเขียนโค้ดด้วยภาษาของตัวเองได้ โดยยังใช้เครื่องมือเดิมที่คุ้นเคย",
    items: [
      {
        num: "01",
        kbd: "rustc · compiled",
        titleMain: "คอมไพเลอร์เต็มรูปแบบ",
        titleSub: "actually compiled",
        body: "เขียนด้วย Rust คอมไพล์เป็น JavaScript และ WebAssembly ได้แล้ววันนี้ กำลังเตรียมออก native binary ผ่าน LLVM ทุกขั้นตอนของการแปลงเกิดขึ้นก่อนรันจริง",
      },
      {
        num: "02",
        kbd: "let x: int",
        titleMain: "Type-safe แบบเลือกได้",
        titleSub: "gradually typed",
        body: "ประกาศชนิดเมื่อจำเป็น ให้ compiler ช่วย infer ตอนที่ไม่ต้องการ รองรับ union types และ type narrowing เต็มรูปแบบ",
      },
      {
        num: "03",
        kbd: "ให้ ชื่อ",
        titleMain: "อ่านเป็นไทย",
        titleSub: "reads in Thai",
        body: "คำสงวน stdlib และข้อความ error เป็นภาษาไทยทั้งหมด ตั้งชื่อตัวแปรเป็นไทยได้ เพราะ JavaScript รองรับ Unicode อยู่แล้ว",
      },
      {
        num: "04",
        kbd: "node | wasm",
        titleMain: "รันได้ทุกที่",
        titleSub: "runs anywhere",
        body: "ทำงานได้บน Node, browser และ edge runtime ที่ไหนรัน JavaScript หรือ WebAssembly ได้ ที่นั่นรัน Thailang ได้ ซอร์สเดียว หลายเป้าหมาย",
      },
    ],
  },
  keywords: {
    kicker: "ดรรชนีคำสงวน · keyword index",
    h2Lead: "คำ ที่เปลี่ยน",
    h2Trail: "วิธีคุณเขียนโปรแกรม",
    intro:
      "ทุกคำที่สงวนไว้สำหรับไวยากรณ์ Thailang กดที่หมวดด้านล่างเพื่อกรอง หรือเลื่อนดูแบบละเอียด",
    filterAll: "ทั้งหมด · all",
  },
  closer: {
    quotePart1Gold: "โค้ด",
    quotePart1: "ควรอ่านออก",
    quotePart2: "ตั้งแต่",
    quotePart2Gold: "บรรทัดแรก",
    sub: "Code should read the way you think. In your own language, from line one.",
    ctaPrimary: "ดูซอร์สบน GitHub",
    ctaSecondary: "ลองเขียนดู",
  },
  footer: {
    tagline:
      "ภาษาโปรแกรมมิงไทยตัวแรกที่ compile จริง · The first Thai programming language that actually compiles.",
    resourcesHeading: "แหล่งข้อมูล · resources",
    projectHeading: "โครงการ · project",
    docs: "เอกสาร · Docs",
    samples: "ตัวอย่าง · Samples",
    playground: "Playground",
    playgroundBadge: "BETA",
    keywords: "คำสงวน · Keywords",
    vscodeExt: "VS Code Extension",
    vscodeExtBadge: "LIVE",
    github: "GitHub ↗",
    discord: "Discord",
    roadmap: "Roadmap",
    license: "License · MIT",
    buildLine: "MIT · Compiler in Rust · Landing in Next.js",
    madeIn: "ทำในประเทศไทย",
    rights: "9Tech Solutions",
  },
};

const en: SectionCopy = {
  topbar: {
    samples: "Samples",
    samplesBadge: "ตัวอย่าง",
    why: "Why",
    whyBadge: "ทำไม",
    keywords: "Keywords",
    keywordsBadge: "คำสงวน",
    docs: "Docs",
    docsBadge: "soon",
    github: "GitHub ↗",
  },
  hero: {
    volume: "Volume 01 · เล่มที่ 01",
    released: "released · เผยแพร่",
    releasedValue: "April 2026",
    releasedSuffix: "preview build",
    version: "version · เวอร์ชัน",
    targets: "targets · ปลายทาง",
    targetSoon: "SOON",
    line1: "Write in Thai",
    line2: "Run anywhere",
    enKicker: "เขียนเป็นไทย / คอมไพล์เป็น JS, WASM, NATIVE",
    lede: (Inline, Strong) => (
      <>
        <Strong>Thailang</Strong> is a programming language with{" "}
        <Inline>Thai keywords</Inline>, a TypeScript-style type system, and a
        Rust-based compiler that emits JavaScript and WebAssembly today. The
        tools you already know, paired with a language you can read from line
        one.
      </>
    ),
    ctaPrimary1: "Try it",
    ctaPrimary2: "ลองเล่น",
    ctaSecondary: "Read the source",
    ctaSecondarySub: "→ github",
    ctaDocs: "Docs",
    ctaDocsSoon: "SOON",
    statKeywords: "Thai keywords",
    statCompiler: "compiler core",
    statBackends: "backends live",
    statLicense: "licensed",
  },
  playground: {
    kicker: "Try a sample · ลองเขียนดู",
    titlePart1: "Code that reads",
    titleEm: "at a glance",
    body: "Every keyword is in Thai; the syntax is TypeScript-like. Pick a tab above to see what Thailang compiles to, then hit Run to execute it in the browser via WebAssembly.",
  },
  features: {
    kicker: "Why Thailang · ทำไม",
    h2Part1: "Thai language",
    h2Script: "with",
    h2Part2: "the",
    h2Gold: "toolchain you know",
    intro:
      "Thailang is a full compiler written in Rust with a flexible type system, emitting JavaScript and WebAssembly today, with native output via LLVM on the way. All so Thai developers can code in their own language without giving up the tools they already use.",
    items: [
      {
        num: "01",
        kbd: "rustc · compiled",
        titleMain: "Compiled",
        titleSub: "actually compiled",
        body: "A real compiler written in Rust, emitting JavaScript and WebAssembly today, with native binary output via LLVM coming next. Every stage of translation happens before the program runs.",
      },
      {
        num: "02",
        kbd: "let x: int",
        titleMain: "Gradually typed",
        titleSub: "type-safe when you want it",
        body: "Declare types when you need them; let inference fill in the rest. Full support for union types and flow-sensitive narrowing.",
      },
      {
        num: "03",
        kbd: "ให้ ชื่อ",
        titleMain: "Reads in Thai",
        titleSub: "Thai-first throughout",
        body: "Keywords, stdlib, and error messages are all in Thai. Variable names can be Thai too, since JavaScript already supports Unicode identifiers.",
      },
      {
        num: "04",
        kbd: "node | wasm",
        titleMain: "Runs anywhere",
        titleSub: "one source, many targets",
        body: "Works on Node, browser, and edge runtimes. Wherever JavaScript or WebAssembly runs, Thailang runs. One source, many targets.",
      },
    ],
  },
  keywords: {
    kicker: "Keyword index · ดรรชนีคำสงวน",
    h2Lead: "words that change",
    h2Trail: "how you write code",
    intro:
      "Every word reserved for Thailang syntax. Click a category to filter, or scroll for the full list.",
    filterAll: "All · ทั้งหมด",
  },
  closer: {
    quotePart1Gold: "Code",
    quotePart1: "should read",
    quotePart2: "from",
    quotePart2Gold: "line one",
    sub: "โค้ดควรอ่านออกตั้งแต่บรรทัดแรก. In your own language.",
    ctaPrimary: "View source on GitHub",
    ctaSecondary: "Try it",
  },
  footer: {
    tagline:
      "The first Thai programming language that actually compiles · ภาษาโปรแกรมมิงไทยตัวแรกที่ compile จริง",
    resourcesHeading: "Resources · แหล่งข้อมูล",
    projectHeading: "Project · โครงการ",
    docs: "Docs · เอกสาร",
    samples: "Samples · ตัวอย่าง",
    playground: "Playground",
    playgroundBadge: "BETA",
    keywords: "Keywords · คำสงวน",
    vscodeExt: "VS Code Extension",
    vscodeExtBadge: "LIVE",
    github: "GitHub ↗",
    discord: "Discord",
    roadmap: "Roadmap",
    license: "License · MIT",
    buildLine: "MIT · Compiler in Rust · Landing in Next.js",
    madeIn: "Made in Thailand",
    rights: "9Tech Solutions",
  },
};

export const copy: Record<Lang, SectionCopy> = { th, en };
