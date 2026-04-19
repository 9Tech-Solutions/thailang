"use client";

import { copy } from "@/shared/i18n/copy";
import { useLang } from "@/shared/i18n/LangProvider";

export function FeaturesSection() {
  const { lang } = useLang();
  const t = copy[lang].features;

  return (
    <section className="features" id="why">
      <div className="wrap">
        <div className="features-head">
          <div className="left">
            <p className="kicker">{t.kicker}</p>
            <h2>
              {t.h2Part1} <span className="script">{t.h2Script}</span>
              <br />
              {t.h2Part2} <span className="gold">{t.h2Gold}</span>
            </h2>
          </div>
          <div className="right">
            <p>{t.intro}</p>
          </div>
        </div>

        <div className="feature-grid">
          {t.items.map((f) => (
            <article className="feat" key={f.num}>
              <div className="seq">
                <span className="num">{f.num}</span>
                {f.kbd}
              </div>
              <h3>
                {f.titleMain}
                <span className="en">{f.titleSub}</span>
              </h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
