import { site } from "@/shared/config/site";

export function Closer() {
  return (
    <section className="closer">
      <div className="wrap">
        <div className="closer-ornament" aria-hidden="true">
          <span className="diamond" />
        </div>
        <p className="closer-quote">
          <span className="gold">โค้ด</span>ควรอ่านออก
          <br />
          ตั้งแต่ <span className="gold">บรรทัดแรก</span>
        </p>
        <p className="closer-sub">
          Code should read the way you think — in your own language, from line
          one.
        </p>
        <div className="closer-ctas">
          <a
            className="btn btn-gold"
            href={site.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>ดูซอร์สบน GitHub</span>
            <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href="#playground">
            <span>ลองเขียนดู</span>
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </section>
  );
}
