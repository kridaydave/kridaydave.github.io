import { useEffect, useRef, useState } from "react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LABEL_ROW = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

/** GitHub contribution graph (data comes from useActivityData). */
export default function ActivityGraph({ data }) {
  const [tip, setTip] = useState(null); // { text, left, top }
  const wrapRef = useRef(null);

  // Read-after-load: pin the graph to the most recent week, as before.
  useEffect(() => {
    if (!data) return;
    const raf = requestAnimationFrame(() => {
      const wrap = wrapRef.current;
      if (wrap) wrap.scrollLeft = wrap.scrollWidth;
    });
    return () => cancelAnimationFrame(raf);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const onDocClick = (e) => {
      if (!e.target.closest || !e.target.closest(".activity-cell")) setTip(null);
    };
    const wrap = wrapRef.current;
    const onScroll = () => setTip(null);
    document.addEventListener("click", onDocClick);
    wrap?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onDocClick);
      wrap?.removeEventListener("scroll", onScroll);
    };
  }, [data]);

  const contributions = data?.contributions || [];

  const showTip = (item, cell) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const d = new Date(item.date + "T00:00:00");
    const formattedDate = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const c = item.count;
    const cellRect = cell.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setTip({
      text: `${c === 0 ? "No" : c} contribution${c === 1 ? "" : "s"} on ${formattedDate}`,
      left: cellRect.left - wrapRect.left + wrap.scrollLeft + cellRect.width / 2,
      top: cellRect.top - wrapRect.top - 8,
    });
  };

  return (
    <div className="activity-card-container">
      <div className="activity-graph-wrap" ref={wrapRef}>
        <div
          className={`activity-tooltip${tip ? " visible" : ""}`}
          aria-hidden="true"
          style={tip ? { left: `${tip.left}px`, top: `${tip.top}px` } : undefined}
        >
          {tip?.text}
        </div>
        <div className="activity-graph-inner">
          <div className="activity-months">
            {LABEL_ROW.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
          <div className="activity-body">
            <div className="activity-days">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="activity-grid">
              {contributions.map((item) => (
                <div
                  key={item.date}
                  className="activity-cell"
                  data-level={item.level > 0 ? String(item.level) : undefined}
                  onMouseEnter={(e) => showTip(item, e.currentTarget)}
                  onMouseLeave={() => setTip(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    showTip(item, e.currentTarget);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="activity-footer">
        <div className="activity-legend">
          <span>Less</span>
          <span className="activity-cell" style={{ cursor: "default" }}></span>
          <span className="activity-cell" data-level="1" style={{ cursor: "default" }}></span>
          <span className="activity-cell" data-level="2" style={{ cursor: "default" }}></span>
          <span className="activity-cell" data-level="3" style={{ cursor: "default" }}></span>
          <span className="activity-cell" data-level="4" style={{ cursor: "default" }}></span>
          <span>More</span>
        </div>
        <a
          href="https://github.com/kridaydave"
          target="_blank"
          rel="noreferrer"
          className="about-link activity-footer-link"
        >
          @kridaydave on GitHub ↗
        </a>
      </div>
    </div>
  );
}