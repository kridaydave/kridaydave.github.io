import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils.js";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LABEL_ROW = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

/* Github's contribution palette, light and dark, keyed by the level the API
   reports. Level 0 is the empty cell. */
const CELL =
  "size-3 cursor-pointer rounded-[2px] bg-[#161b22] transition-[scale,outline] duration-100 hover:z-10 hover:scale-130 hover:outline hover:outline-1 hover:outline-white not-dark:bg-[#ebedf0]";
const LEVELS = {
  1: "data-[level=1]:bg-[#0e4429] not-dark:data-[level=1]:bg-[#9be9a8]",
  2: "data-[level=2]:bg-[#006d32] not-dark:data-[level=2]:bg-[#40c463]",
  3: "data-[level=3]:bg-[#26a641] not-dark:data-[level=3]:bg-[#30a14e]",
  4: "data-[level=4]:bg-[#39d353] not-dark:data-[level=4]:bg-[#216e39]",
};
const LEVEL_CLASS = Object.values(LEVELS).join(" ");
const LEGEND_LEVELS = [1, 2, 3, 4];

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
      if (!e.target.closest || !e.target.closest("[data-cell]")) setTip(null);
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
    <div className="overflow-hidden rounded-[6px] border border-dotted border-hair bg-surface-1">
      <div className="relative overflow-x-auto px-5 pt-4 pb-2.5" ref={wrapRef} data-reveal>
        <div
          className={cn(
            "pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[120%] rounded border border-hair-strong bg-[#1f242c] px-2 py-1 font-mono text-[11px] whitespace-nowrap text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-opacity duration-150",
            tip ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
          style={tip ? { left: `${tip.left}px`, top: `${tip.top}px` } : undefined}
        >
          {tip?.text}
        </div>
        <div className="flex min-w-[680px] flex-col gap-2">
          <div className="grid grid-cols-12 pl-7 font-mono text-[10.5px] text-ink-3">
            {LABEL_ROW.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex w-5 flex-col justify-between pt-0.5 font-mono text-[10px] leading-[12px] text-ink-3">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="grid flex-1 auto-cols-[12px] grid-flow-col grid-rows-[repeat(7,12px)] gap-[3px]">
              {contributions.map((item) => (
                <div
                  key={item.date}
                  className={cn(CELL, LEVEL_CLASS)}
                  data-cell
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
      <div className="flex items-center justify-between border-t border-dotted border-hair bg-surface-1 px-5 py-2.5 font-mono text-[11px] text-ink-3">
        <div className="flex items-center gap-1">
          <span>Less</span>
          <span className={cn(CELL, "cursor-default")} />
          {LEGEND_LEVELS.map((level) => (
            <span
              key={level}
              className={cn(CELL, LEVEL_CLASS, "cursor-default")}
              data-level={String(level)}
            />
          ))}
          <span>More</span>
        </div>
        <a
          href="https://github.com/kridaydave"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-ink-2 underline decoration-dashed underline-offset-[3px] transition-colors hover:text-ink"
        >
          @kridaydave on GitHub ↗
        </a>
      </div>
    </div>
  );
}
