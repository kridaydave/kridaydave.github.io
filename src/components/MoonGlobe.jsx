import { useEffect, useRef } from "react";

/* ══ MoonGlobe ═════════════════════════════════════════════
   The Earth's companion, top-left: a small dithered grey sphere with
   craters. The grey body and its shading are baked once (the light is
   fixed relative to the viewer), but the CRATERS are 3D points that
   rotate with the surface — drag to spin, with inertia, same
   mechanics as EarthGlobe. Idles at a barely-there drift. */

const INK = [205, 214, 232]; /* light grey dots where the light lands */
const SHADE_INK = [96, 106, 126]; /* darker grey dots for shade */
const CRATER_INK = [10, 13, 22]; /* crater floors, darker than the body */

/* craters, in unit-disc coords at the rest pose — converted to 3D
   points so they ride the surface when the moon spins */
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;

    let rotY = 0;
    /* clearly visible idle pace — anything slower reads as "stopped" */
    const IDLE = 0.00006;
    let decayTarget = IDLE; /* set at release: idle drift in the flung direction */
    let velY = IDLE;
    let dragging = false;
    let lastX = 0;
    let lastMoveT = 0;
    const TILT = -0.2;

    let craterDots = [];

    function buildCraters() {
      /* each crater scatters dots across its footprint; the footprint
         sits on the sphere at the rest pose, then rotates like land */
      const dots = [];
      for (const c of CRATERS) {
        const nz = Math.sqrt(Math.max(0, 1 - c.x * c.x - c.y * c.y));
        for (let k = 0; k < 70; k++) {
          /* denser toward the crater floor */
          const d = Math.sqrt(Math.random()) * c.r;
          const a = Math.random() * Math.PI * 2;
          const ox = c.x + Math.cos(a) * d;
          const oy = c.y + Math.sin(a) * d;
          const oz = Math.sqrt(Math.max(0, 1 - ox * ox - oy * oy));
          if (oz <= 0) continue;
          const len = Math.hypot(ox, oy, oz);
          dots.push([ox / len, oy / len, oz / len]);
        }
      }
      craterDots = dots;
    }
    buildCraters();

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
          const th = BAYER[(y / cell) & 3][(x / cell) & 3];
          if (v <= th) continue;
          const edge = Math.sqrt(r2);
          const limbFade = edge > 0.88 ? 1 - (edge - 0.88) / 0.12 : 1;
          const ink = v > 0.42 ? INK : SHADE_INK;
          b.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${(0.85 * limbFade).toFixed(2)})`;
          b.fillRect(x, y, 2.2, 2.2);
        }
      }
    }

    function draw(t) {
      if (!alive) return;
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.drawImage(bodyC, 0, 0, size.w, size.h);

      const cx = size.w / 2, cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.47;

      if (!dragging) {
        const dtMs = Math.min(32, t - (draw.t || t));
        rotY += velY * dtMs;
        /* same friction as Earth: a fling settles to the idle drift in
           the direction it was flung — never through zero, or the moon
           stalls motionless mid-decay */
        velY = decayTarget + (velY - decayTarget) * Math.pow(0.9985, dtMs);
      }
      draw.t = t;

      const cy_ = Math.cos(rotY), sy_ = Math.sin(rotY);
      const ct = Math.cos(TILT), st = Math.sin(TILT);

      for (let i = 0; i < craterDots.length; i++) {
        const p = craterDots[i];
        const x = p[0] * cy_ + p[2] * sy_;
        const z0 = -p[0] * sy_ + p[2] * cy_;
        const y = p[1] * ct - z0 * st;
        const z = p[1] * st + z0 * ct;
        const front = z > 0;
        const edge = Math.sqrt(x * x + y * y);
        const limbFade = edge > 0.88 ? 1 - (edge - 0.88) / 0.12 : 1;
        const a = (front ? 0.75 + 0.25 * z : 0.08 + 0.08 * z) * limbFade;
        if (a <= 0.01) continue;
        ctx.fillStyle = `rgba(${CRATER_INK[0]},${CRATER_INK[1]},${CRATER_INK[2]},${a.toFixed(3)})`;
        const r = front ? 1.9 + 0.8 * z : 0.8;
        ctx.fillRect(cx + x * R - r / 2, cy - y * R - r / 2, r, r);
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    }

    function wake() {
      if (!raf && !reduced) raf = requestAnimationFrame(draw);
    }

    function onDown(e) {
      dragging = true;
      lastX = e.clientX;
      lastMoveT = performance.now();
      canvas.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      rotY += dx * 0.009;
      velY = Math.max(-0.008, Math.min(0.008, (dx * 0.009) / Math.max(16, now - lastMoveT)));
      lastX = e.clientX;
      lastMoveT = now;
      wake();
    }
    function onUp() {
      dragging = false;
      decayTarget = (velY === 0 ? 1 : Math.sign(velY)) * IDLE;
      wake();
    }
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const onResize = () => { size = resize(); bake(); if (reduced) draw(performance.now()); };
    window.addEventListener("resize", onResize);

    size = resize();
    bake();
    draw(performance.now());

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-label="Cratered dot-matrix Moon" />;
}
