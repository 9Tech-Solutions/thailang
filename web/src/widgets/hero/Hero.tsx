"use client";

import type { ReactNode } from "react";
import { keywords } from "@/entities/keyword/model";
import { site } from "@/shared/config/site";
import { copy } from "@/shared/i18n/copy";
import { useLang } from "@/shared/i18n/LangProvider";

function LedeInline({ children }: { children: ReactNode }) {
  return <span className="th-inline">{children}</span>;
}

function LedeStrong({ children }: { children: ReactNode }) {
  return <strong>{children}</strong>;
}

export function Hero() {
  const { lang } = useLang();
  const t = copy[lang].hero;

  return (
    <section className="hero">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-grid">
          <aside className="hero-meta">
            <h6>{t.volume}</h6>
            <dl>
              <dt>{t.released}</dt>
              <dd>
                <span className="th">{t.releasedValue}</span>
                {"  ·  "}
                {t.releasedSuffix}
              </dd>
              <dt>{t.version}</dt>
              <dd
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--gold)",
                }}
              >
                v{site.version}
              </dd>
              <dt>{t.targets}</dt>
            </dl>
            <ul className="targets">
              <li>JavaScript (Node · browser)</li>
              <li>WebAssembly</li>
              <li className="soon">
                LLVM native{" "}
                <em
                  style={{
                    color: "var(--chili)",
                    fontStyle: "normal",
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    marginLeft: "6px",
                  }}
                >
                  {t.targetSoon}
                </em>
              </li>
            </ul>
          </aside>

          <div className="hero-head">
            <h1 className="hero-title" style={{ margin: "24px 0 0" }}>
              <span className="line-1">{t.line1}</span>
              <span className="line-2">
                <span className="amp">·</span> {t.line2}
              </span>
            </h1>
            <p className="hero-en">{t.enKicker}</p>

            <p className="hero-lede">{t.lede(LedeInline, LedeStrong)}</p>

            <div className="hero-ctas">
              <a className="btn btn-gold" href="#playground">
                <span>{t.ctaPrimary1}</span>
                <span style={{ opacity: 0.6 }}>/</span>
                <span>{t.ctaPrimary2}</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="btn btn-ghost"
                href={site.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t.ctaSecondary}</span>
                <span aria-hidden="true">{t.ctaSecondarySub}</span>
              </a>
              <span
                className="btn btn-ghost"
                style={{ cursor: "not-allowed", opacity: 0.7 }}
                aria-disabled="true"
              >
                <span>{t.ctaDocs}</span>
                <span className="soon">{t.ctaDocsSoon}</span>
              </span>
            </div>

            <div className="hero-stats">
              <div>
                <div className="val">{keywords.length}</div>
                <div className="lbl">{t.statKeywords}</div>
              </div>
              <div>
                <div className="val">Rust</div>
                <div className="lbl">{t.statCompiler}</div>
              </div>
              <div>
                <div className="val">2</div>
                <div className="lbl">{t.statBackends}</div>
              </div>
              <div>
                <div className="val">MIT</div>
                <div className="lbl">{t.statLicense}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
