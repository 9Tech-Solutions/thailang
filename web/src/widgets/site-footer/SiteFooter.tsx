"use client";

import { site } from "@/shared/config/site";
import { copy } from "@/shared/i18n/copy";
import { useLang } from "@/shared/i18n/LangProvider";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { lang } = useLang();
  const t = copy[lang].footer;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="name">ไทยแลง</div>
            <p>{t.tagline}</p>
          </div>

          <div className="footer-col">
            <h5>{t.resourcesHeading}</h5>
            <ul>
              <li>
                <span className="footer-link-disabled" aria-disabled="true">
                  {t.docs}
                  <span className="soon">SOON</span>
                </span>
              </li>
              <li>
                <a href="#playground">{t.samples}</a>
              </li>
              <li>
                <a href="#playground">
                  {t.playground}
                  <span className="soon">{t.playgroundBadge}</span>
                </a>
              </li>
              <li>
                <a href="#keywords">{t.keywords}</a>
              </li>
              <li>
                <a
                  href={site.vscodeMarketplace}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.vscodeExt}
                  <span className="soon">{t.vscodeExtBadge}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t.projectHeading}</h5>
            <ul>
              <li>
                <a href={site.repo} target="_blank" rel="noopener noreferrer">
                  {t.github}
                </a>
              </li>
              <li>
                <span className="footer-link-disabled" aria-disabled="true">
                  {t.discord}
                  <span className="soon">SOON</span>
                </span>
              </li>
              <li>
                <span className="footer-link-disabled" aria-disabled="true">
                  {t.roadmap}
                  <span className="soon">SOON</span>
                </span>
              </li>
              <li>
                <a
                  href={`${site.repo}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.license}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bot">
          <span>
            {t.buildLine} &nbsp; <span className="thai-stamp">{t.madeIn}</span>
          </span>
          <span>
            © {year} {site.name} · {t.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}
