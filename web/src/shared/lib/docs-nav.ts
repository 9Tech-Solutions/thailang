export interface NavItem {
  title: string;
  titleTh?: string;
  href: string;
}

export interface NavSection {
  title: string;
  titleTh?: string;
  items: NavItem[];
}

export const docsNav: NavSection[] = [
  {
    title: "Language",
    titleTh: "ภาษา",
    items: [
      {
        title: "Specification",
        titleTh: "สเปก",
        href: "/docs",
      },
    ],
  },
  {
    title: "Keywords & Stdlib",
    titleTh: "คำสงวน & ไลบรารี",
    items: [
      { title: "Overview", titleTh: "ภาพรวม", href: "/docs/keywords" },
      {
        title: "Core language",
        titleTh: "ภาษาแกน",
        href: "/docs/keywords/language",
      },
      { title: "Console", titleTh: "คอนโซล", href: "/docs/keywords/console" },
      {
        title: "Error handling",
        titleTh: "จัดการข้อผิดพลาด",
        href: "/docs/keywords/error",
      },
      { title: "Math", titleTh: "คณิต", href: "/docs/keywords/math" },
      { title: "Numbers", titleTh: "ตัวเลข", href: "/docs/keywords/number" },
      {
        title: "Strings",
        titleTh: "ข้อความ",
        href: "/docs/keywords/string-methods",
      },
      {
        title: "Arrays",
        titleTh: "อาร์เรย์",
        href: "/docs/keywords/array-methods",
      },
      {
        title: "Objects",
        titleTh: "ออบเจกต์",
        href: "/docs/keywords/object-methods",
      },
      { title: "Dates", titleTh: "วันที่", href: "/docs/keywords/date" },
      { title: "JSON", titleTh: "เจสัน", href: "/docs/keywords/json" },
    ],
  },
];

export function flattenNav(sections: NavSection[]): NavItem[] {
  return sections.flatMap((s) => s.items);
}
