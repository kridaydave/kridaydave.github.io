import { useEffect, useRef } from "react";

/* ══ MiniPlanet ════════════════════════════════════════════
   A small sibling for DitherSun: a dot-planet in the project's own
   hue, on the same Fibonacci-lattice shading routine the sun and the
   globes use. Lit by the SCENE's sun — the light direction is fixed
   in viewer space pointing at the sun off the right edge, so the
   terminator faces it however the planet is spun. Idles with a slow
   rotation at ~30fps, pauses itself when scrolled off-screen, and
   holds one static frame for reduced-motion visitors. */

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function MiniPlanet({ hue = "#f4f2ec", className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;
    let onScreen = false;
    let rotY = 0.9;
    let last = 0;

    /* the light lives with the sun: hard from the right, a hair above
       the horizon, barely toward the viewer (viewer-space unit
       vector — rotation happens on the planet, never on this) */
    const LX = 0.92, LY = -0.1, LZ = 0.38;

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    }

    let size = resize();

    function draw(t) {
      if (!alive) return;
      /* ~30fps cap, same rhythm as the sun */
      if (t - (draw.last || 0) < 28) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dtMs = Math.min(32, t - (draw.last || t));
      draw.last = t;

      /* one idle turn every ~35 minutes of wall clock */
      rotY += 0.00005 * dtMs;

      ctx.clearRect(0, 0, size.w, size.h);
      const cx = size.w / 2, cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.46;
      const [hr, hg, hb] = hexToRgb(hue);

      /* fibonacci lattice, same construction as the sun */
      const N = 900;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const TILT = -0.3;
      const cyr = Math.cos(rotY), syr = Math.sin(rotY);
      const ct = Math.cos(TILT), st = Math.sin(TILT);

      for (let i = 0; i < N; i++) {
        const y0 = 1 - (i / (N - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - y0 * y0));
        const th = golden * i;
        const x0 = Math.cos(th) * rr;
        const z0 = Math.sin(th) * rr;

        const x = x0 * cyr + z0 * syr;
        const zb = -x0 * syr + z0 * cyr;
        const y = y0 * ct - zb * st;
        const z = y0 * st + zb * ct;
        if (z <= 0) continue;

        /* granulation noise, tighter than the sun for a small face */
        const n =
          Math.sin(x * 7.3 + 0.4) +
          Math.sin(y * 6.7 + 3.1) +
          0.5 * Math.sin(x * 14.1) * Math.sin(z * 12.7);
        /* the sun does the lighting: a warm amber rim on the side that
           faces it, but the night side keeps the planet's own hue —
           no black terminator, the disc must stay readable */
        const L = x * LX + y * LY + z * LZ;
        let lum = (0.45 + 0.35 * Math.max(0, L) + 0.2 * z) * (0.85 + 0.24 * (n / 1.5));
        lum = Math.max(0, Math.min(1, lum));
        const edge = Math.sqrt(x * x + y * y);
        const limbFade = edge > 0.9 ? 1 - (edge - 0.9) / 0.1 : 1;

        const ink =
          lum > 0.72 ? [hr + (255 - hr) * 0.55, hg + (205 - hg) * 0.55, hb + (105 - hb) * 0.55] :
          lum > 0.44 ? [hr, hg, hb] :
          [hr * 0.68, hg * 0.72, hb * 0.85];
        ctx.fillStyle = `rgba(${ink[0] | 0},${ink[1] | 0},${ink[2] | 0},${(0.95 * limbFade).toFixed(3)})`;
        const s = 1.5 + 0.9 * z;
        ctx.fillRect(cx + x * R - s / 2, cy - y * R - s / 2, s, s);
      }

      if (!reduced && onScreen) raf = requestAnimationFrame(draw);
      else raf = 0;
    }

    function wake() {
      if (!raf && !reduced && onScreen) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    }

    /* don't burn frames on planets nobody can see */
    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? false;
      if (onScreen) wake();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    const onResize = () => {
      size = resize();
      if (reduced) { alive && draw(performance.now()); return; }
      wake();
    };
    window.addEventListener("resize", onResize);

    size = resize();
    if (reduced) draw(performance.now());
    /* wake starts on intersection; draw a first frame so there is
       nothing blank before it */
    else draw(0);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [hue]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
