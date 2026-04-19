import { site } from "@/shared/config/site";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-grid">
          <aside className="hero-meta">
            <h6>เล่มที่ 01 · Volume 01</h6>
            <dl>
              <dt>เผยแพร่เมื่อ · released</dt>
              <dd>
                <span className="th">เมษายน 2569</span>
                {"  ·  "}preview build
              </dd>
              <dt>เวอร์ชัน · version</dt>
              <dd
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--gold)",
                }}
              >
                v{site.version}
              </dd>
              <dt>ปลายทาง · targets</dt>
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
                  SOON
                </em>
              </li>
            </ul>
          </aside>

          <div className="hero-head">
            <h1 className="hero-title" style={{ margin: "24px 0 0" }}>
              <span className="line-1">เขียนเป็นไทย</span>
              <span className="line-2">
                <span className="amp">·</span> รันได้ทุกที่
              </span>
            </h1>
            <p className="hero-en">
              WRITE&nbsp;IN&nbsp;THAI &nbsp;<em>/</em>
              &nbsp; COMPILE&nbsp;TO&nbsp;<em>JS</em>,&nbsp;<em>WASM</em>
              ,&nbsp;NATIVE
            </p>

            <p className="hero-lede">
              <strong>Thailang</strong> เป็นภาษาโปรแกรมมิง{" "}
              <span className="th-inline">คำสงวนเป็นไทย</span> — มีระบบชนิดข้อมูลแบบ
              TypeScript คอมไพเลอร์เขียนด้วย Rust แปลงเป็น JavaScript และ
              WebAssembly ได้ในวันนี้ เครื่องมือที่คุณคุ้นเคยอยู่แล้ว
              กับภาษาที่คุณอ่านออกตั้งแต่บรรทัดแรก
            </p>

            <div className="hero-ctas">
              <a className="btn btn-gold" href="#playground">
                <span>ลองเล่น</span>
                <span style={{ opacity: 0.6 }}>/</span>
                <span>Try it</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="btn btn-ghost"
                href={site.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>อ่านซอร์สโค้ด</span>
                <span aria-hidden="true">→ github</span>
              </a>
              <span
                className="btn btn-ghost"
                style={{ cursor: "not-allowed", opacity: 0.7 }}
                aria-disabled="true"
              >
                <span>เอกสาร</span>
                <span className="soon">SOON</span>
              </span>
            </div>

            <div className="hero-stats">
              <div>
                <div className="val">24</div>
                <div className="lbl">Thai keywords</div>
              </div>
              <div>
                <div className="val">Rust</div>
                <div className="lbl">compiler core</div>
              </div>
              <div>
                <div className="val">2</div>
                <div className="lbl">backends live</div>
              </div>
              <div>
                <div className="val">MIT</div>
                <div className="lbl">licensed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
