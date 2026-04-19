"use client";

import { site } from "@/shared/config/site";
import { copy } from "@/shared/i18n/copy";
import { useLang } from "@/shared/i18n/LangProvider";

export function Closer() {
  const { lang } = useLang();
  const t = copy[lang].closer;

  return (
    <section className="closer">
      <div className="wrap">
        <div className="closer-ornament" aria-hidden="true">
          <span className="diamond" />
        </div>
        <p className="closer-quote">
          <span className="gold">{t.quotePart1Gold}</span>
          {t.quotePart1}
          <br />
          {t.quotePart2} <span className="gold">{t.quotePart2Gold}</span>
        </p>
        <p className="closer-sub">{t.sub}</p>
        <div className="closer-ctas">
          <a
            className="btn btn-gold"
            href={site.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t.ctaPrimary}</span>
            <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href="#playground">
            <span>{t.ctaSecondary}</span>
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </section>
  );
}
