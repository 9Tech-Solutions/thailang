import { site } from "@/shared/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="name">ไทยแลง</div>
            <p>
              ภาษาโปรแกรมมิงไทยตัวแรกที่ compile จริง · The first Thai programming
              language that actually compiles.
            </p>
          </div>

          <div className="footer-col">
            <h5>แหล่งข้อมูล · resources</h5>
            <ul>
              <li>
                <span className="footer-link-disabled" aria-disabled="true">
                  เอกสาร · Docs<span className="soon">SOON</span>
                </span>
              </li>
              <li>
                <a href="#playground">ตัวอย่าง · Samples</a>
              </li>
              <li>
                <a href="#playground">
                  Playground<span className="soon">BETA</span>
                </a>
              </li>
              <li>
                <a href="#keywords">คำสงวน · Keywords</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>โครงการ · project</h5>
            <ul>
              <li>
                <a href={site.repo} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              </li>
              <li>
                <span className="footer-link-disabled" aria-disabled="true">
                  Discord<span className="soon">SOON</span>
                </span>
              </li>
              <li>
                <span className="footer-link-disabled" aria-disabled="true">
                  Roadmap<span className="soon">SOON</span>
                </span>
              </li>
              <li>
                <a
                  href={`${site.repo}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License · MIT
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bot">
          <span>
            MIT · Compiler in Rust · Landing in Next.js &nbsp;{" "}
            <span className="thai-stamp">ทำในประเทศไทย</span>
          </span>
          <span>
            © {year} {site.name} · 9Tech Solutions
          </span>
        </div>
      </div>
    </footer>
  );
}
