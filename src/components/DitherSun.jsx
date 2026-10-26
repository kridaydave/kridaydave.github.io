import { useEffect, useRef } from "react";

/* ══ DitherSun ═════════════════════════════════════════════
   A dithered sun, cropped by the left edge of the viewport. Warm
   duotone (deep umber → amber → honey), shading radiating from the
   core — a sun glows from inside, the opposite of the planets. Baked
   once per resize; static. */

const BAYER = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
].map((r) => r.map((v) => v / 16 - 0.469));

export default function DitherSun({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    }

    let size = resize();

    function bake() {
      const cx = size.w * 0.16, cy = size.h * 0.5; /* core pushed off-left */
      const R = Math.min(size.h * 0.72, size.w * 0.85);
      const cell = 3;
      for (let y = 0; y < size.h; y += cell) {
        for (let x = 0; x < size.w; x += cell) {
          const dx = (x + cell / 2 - cx) / R, dy = (y + cell / 2 - cy) / R;
          const r2 = dx * dx + dy * dy;
          if (r2 > 1) continue;
          const d = Math.sqrt(r2);
          /* a sun glows from the core: brightest center, falling off —
             capped below 0.9 so the Bayer grain never collapses */
          let v = 0.88 - d * 0.78;
          v = Math.min(0.86, v);
          const th = BAYER[(y / cell) & 3][(x / cell) & 3];
          if (v <= th) continue;
          const ink =
            v > 0.62 ? [255, 213, 128] : v > 0.36 ? [214, 138, 42] : [92, 44, 12];
          ctx.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},0.92)`;
          ctx.fillRect(x, y, 2.3, 2.3);
        }
      }
    }

    function paintAll() {
      size = resize();
      ctx.clearRect(0, 0, size.w, size.h);
      bake();
    }
    paintAll();
    window.addEventListener("resize", paintAll);
    return () => window.removeEventListener("resize", paintAll);
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
