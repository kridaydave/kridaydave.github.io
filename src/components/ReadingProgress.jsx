import { useEffect, useRef } from "react";

/** Reading progress bar (port of script.js initReadingProgress). */
export default function ReadingProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    function update() {
      const bar = barRef.current;
      if (!bar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        bar.style.width = "0%";
        return;
      }
      const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
      bar.style.width = `${pct}%`;
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div ref={barRef} className="reading-progress-bar" aria-hidden="true"></div>;
}