"use client";

import { site } from "@/shared/config/site";
import { copy } from "@/shared/i18n/copy";
import { useLang } from "@/shared/i18n/LangProvider";

export function Topbar() {
  const { lang, setLang } = useLang();
  const t = copy[lang].topbar;

  return (
    <header className="topbar">
      <div className="wrap">
        <div className="brand">
          <span className="brand-mark">ไทยแลง</span>
          <span className="brand-sub">
            {site.name} · v{site.version} preview
          </span>
        </div>
        <nav className="nav" aria-label="Primary">
          <a href="#playground">
            {t.samples} <span className="badge">{t.samplesBadge}</span>
          </a>
          <a href="#why">
            {t.why} <span className="badge">{t.whyBadge}</span>
          </a>
          <a href="#keywords">
            {t.keywords} <span className="badge">{t.keywordsBadge}</span>
          </a>
          <span className="nav-link-disabled" aria-disabled="true">
            {t.docs} <span className="badge">{t.docsBadge}</span>
          </span>
          <a href={site.repo} target="_blank" rel="noopener noreferrer">
            {t.github}
          </a>
        </nav>
        <div className="lang-switch">
          <button
            type="button"
            className={lang === "th" ? "on" : ""}
            onClick={() => setLang("th")}
            aria-pressed={lang === "th"}
          >
            ไทย
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            className={lang === "en" ? "on" : ""}
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
