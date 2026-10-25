import { useEffect, useRef } from "react";

/* ══ MoonGlobe ═════════════════════════════════════════════
   The Earth's companion, top-left: a small dithered grey sphere with
   craters. Static by nature — the moon is tidally locked, so unlike
   EarthGlobe there is nothing to animate and no loop to park. One
   bake at resize, one paint.

   The body is an OPAQUE grey disc (no glow behind it — a soft radial
   fill reaches the canvas corners and the square shows against the
   sky). The dither is the shading texture on top of that grey. */

const INK = [205, 214, 232]; /* light grey dots where the light lands */
const SHADE_INK = [96, 106, 126]; /* darker grey dots for shade */

/* craters, in unit-disc coords with radii — darker, sparser dots */
const CRATERS = [
  { x: -0.32, y: -0.18, r: 0.16 },
  { x: 0.22, y: 0.3, r: 0.22 },
  { x: 0.05, y: -0.42, r: 0.1 },
  { x: -0.45, y: 0.34, r: 0.12 },
  { x: 0.45, y: -0.22, r: 0.09 },
];

/* same 4x4 Bayer matrix as everything else on this site */
const BAYER = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
].map((r) => r.map((v) => v / 16 - 0.469));

export default function MoonGlobe({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const bodyC = document.createElement("canvas");

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bodyC.width = canvas.width;
      bodyC.height = canvas.height;
      bodyC.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    }

    let size = resize();

    function bake() {
      const b = bodyC.getContext("2d");
      b.clearRect(0, 0, size.w, size.h);
      const cx = size.w / 2, cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.47;

      /* the body: an opaque, darker grey disc — solid, so it can't wash
         out against bright clouds and nothing shows through it */
      const body = b.createRadialGradient(
        cx + R * 0.3, cy - R * 0.3, R * 0.15,
        cx, cy, R
      );
      body.addColorStop(0, "#3a4150");
      body.addColorStop(1, "#22262f");
      b.fillStyle = body;
      b.beginPath();
      b.arc(cx, cy, R, 0, Math.PI * 2);
      b.fill();

      /* the dither is the shading texture: light dots where the light
         (from the right, Earth's side) lands, dark dots opposite */
      const cell = 3;
      const lx = 0.55, ly = -0.35, lz = 0.76;
      for (let y = 0; y < size.h; y += cell) {
        for (let x = 0; x < size.w; x += cell) {
          const dx = (x + cell / 2 - cx) / R, dy = (y + cell / 2 - cy) / R;
          const r2 = dx * dx + dy * dy;
          if (r2 > 1) continue;
          const nz = Math.sqrt(1 - r2);
          let L = Math.max(0, dx * lx + dy * ly + nz * lz);
          let v = 0.15 + 0.55 * L;
          v = Math.min(0.75, v) * (1 - Math.pow(Math.sqrt(r2), 6) * 0.4);
          /* craters: inside one, the surface dips — darker, sparser dots */
          let inCrater = 0;
          for (const c of CRATERS) {
            const ddx = dx - c.x, ddy = dy - c.y;
            const d = Math.sqrt(ddx * ddx + ddy * ddy);
            if (d < c.r) inCrater = Math.max(inCrater, 1 - d / c.r);
          }
          v -= inCrater * 0.4;
          const th = BAYER[(y / cell) & 3][(x / cell) & 3];
          if (v <= th) continue;
          /* fade dots out before the limb — lit dots reaching the edge
             trace a bright arc that reads as a halo against the sky */
          const edge = Math.sqrt(r2);
          const limbFade = edge > 0.88 ? 1 - (edge - 0.88) / 0.12 : 1;
          const ink = v > 0.42 ? INK : SHADE_INK;
          b.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${(0.85 * limbFade).toFixed(2)})`;
          b.fillRect(x, y, 2.2, 2.2);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.drawImage(bodyC, 0, 0, size.w, size.h);
      /* no limb ring: a bright hairline at the edge is a halo in waiting */
    }

    function paintAll() {
      size = resize();
      bake();
      draw();
    }
    paintAll();
    window.addEventListener("resize", paintAll);
    return () => window.removeEventListener("resize", paintAll);
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
