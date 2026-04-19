import { site } from "@/shared/config/site";

export function Topbar() {
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
            ตัวอย่าง <span className="badge">samples</span>
          </a>
          <a href="#why">
            ทำไม <span className="badge">why</span>
          </a>
          <a href="#keywords">
            คำสงวน <span className="badge">keywords</span>
          </a>
          <span className="nav-link-disabled" aria-disabled="true">
            เอกสาร <span className="badge">soon</span>
          </span>
          <a href={site.repo} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </nav>
        <div className="lang-switch" aria-hidden="true">
          <span className="on">ไทย</span>
          <span>·</span>
          <span>EN</span>
        </div>
      </div>
    </header>
  );
}
