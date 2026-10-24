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

  return (
    <div
      ref={barRef}
      className="pointer-events-none fixed top-0 left-0 z-[100] h-0.5 w-0 bg-ink transition-[width] duration-[50ms] ease-linear"
      aria-hidden="true"
    />
  );
}
