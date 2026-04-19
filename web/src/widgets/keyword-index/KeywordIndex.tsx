"use client";

import { useMemo, useState } from "react";
import {
  KEYWORD_CATEGORIES,
  type KeywordCategory,
  keywords,
} from "@/entities/keyword/model";

const CATEGORY_LABEL: Record<KeywordCategory, string> = {
  core: "CORE",
  control: "CONTROL",
  type: "TYPE",
  logic: "LOGIC",
  error: "ERROR",
  async: "ASYNC",
  module: "MODULE",
};

type Filter = "all" | KeywordCategory;

function countFor(filter: Filter): number {
  if (filter === "all") return keywords.length;
  return keywords.filter((k) => k.category === filter).length;
}

export function KeywordIndex() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () =>
      filter === "all"
        ? keywords
        : keywords.filter((k) => k.category === filter),
    [filter],
  );

  return (
    <section className="keywords" id="keywords">
      <div className="wrap">
        <div className="keywords-head">
          <p className="kicker">ดรรชนีคำสงวน · keyword index</p>
          <h2>
            {keywords.length} คำ ที่เปลี่ยน
            <br />
            วิธีคุณเขียนโปรแกรม
          </h2>
          <p>
            ทุกคำที่สงวนไว้สำหรับไวยากรณ์ Thailang — กดที่หมวดด้านล่างเพื่อกรอง
            หรือเลื่อนดูแบบละเอียด
          </p>
        </div>

        <div className="kw-filters" role="tablist" aria-label="Categories">
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            className={`kw-filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            ทั้งหมด · all · {countFor("all")}
          </button>
          {KEYWORD_CATEGORIES.map((cat) => (
            <button
              type="button"
              role="tab"
              key={cat}
              aria-selected={filter === cat}
              className={`kw-filter ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat} · {countFor(cat)}
            </button>
          ))}
        </div>

        <div className="kw-table">
          {rows.map((k, i) => (
            <div
              className="kw-row"
              data-cat={k.category}
              key={`${k.category}-${k.thai}`}
            >
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="thai">{k.thai}</span>
              <span className="roman">{k.roman}</span>
              <span className="english">{k.english}</span>
              <span className="cat">
                <span className="pill">{CATEGORY_LABEL[k.category]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
