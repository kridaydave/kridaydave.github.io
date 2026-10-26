import { useEffect, useRef } from "react";

/* ══ DitherSun ═════════════════════════════════════════════
   The sun, finally in the same dimension as its planets: a rotating
   sphere of ~1,500 granulation dots on a Fibonacci lattice, brightness
   varied by procedural surface noise (solar granulation), a few
   sunspots drifting with the surface, and physical limb darkening —
   a real ball of fire, not a flat poster.

   Warm duotone (honey → amber → umber), drag to spin with inertia,
   idle drift toward the flung direction, ~30fps cap. Reduced motion:
   one static frame. */

const BAYER = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
].map((r) => r.map((v) => v / 16 - 0.469));

/* sunspots: unit-disc specs at the rest pose → darker 3D clusters */
const SPOTS = [
  { x: 0.42, y: -0.24, r: 0.16 },
  { x: -0.05, y: 0.38, r: 0.13 },
  { x: 0.2, y: 0.05, r: 0.09 },
];

export default function DitherSun({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;

    let rotY = 0.9;
    const IDLE = 0.00006;
    let decayTarget = IDLE;
    let velY = IDLE;
    let dragging = false;
    let lastX = 0;
    let lastMoveT = 0;
    const TILT = -0.18;

    /* fibonacci lattice: even dot coverage of the sphere */
    const pts = [];
    {
      const N = 3400;
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - y * y));
        const th = golden * i;
        const x = Math.cos(th) * rr;
        const z = Math.sin(th) * rr;
        /* granulation: smooth brightness patches from trig noise */
        let n =
          Math.sin(x * 6.1 + 1.3) +
          Math.sin(y * 5.3 + 4.2) +
          Math.sin(z * 7.7 + 2.1) +
          0.6 * Math.sin(x * 12.9) * Math.sin(z * 11.3);
        pts.push([x, y, z, n / 3.6]);
      }
    }

    /* sunspot clusters as 3D dots, same trick as the moon's craters */
    const spotDots = [];
    for (const c of SPOTS) {
      for (let k = 0; k < 40; k++) {
        const d = Math.sqrt(Math.random()) * c.r;
        const a = Math.random() * Math.PI * 2;
        const ox = c.x + Math.cos(a) * d;
        const oy = c.y + Math.sin(a) * d;
        const oz = Math.sqrt(Math.max(0, 1 - ox * ox - oy * oy));
        if (oz <= 0) continue;
        const len = Math.hypot(ox, oy, oz);
        spotDots.push([ox / len, oy / len, oz / len]);
      }
    }

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
      /* ~30fps cap — the idle fire doesn't need 120hz, and every repaint
         invalidates the nav's backdrop-filter */
      if (t - (draw.last || 0) < 28) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dtMs = Math.min(32, t - (draw.last || t));
      draw.last = t;

      if (!dragging) {
        rotY += velY * dtMs;
        velY = decayTarget + (velY - decayTarget) * Math.pow(0.9985, dtMs);
      }

      ctx.clearRect(0, 0, size.w, size.h);
      const cx = size.w / 2, cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.44;

      /* warm ambient: the sky around the disc picks up a little heat */
      const glow = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.25);
      glow.addColorStop(0, "rgba(214, 138, 42, 0.3)");
      glow.addColorStop(1, "rgba(214, 138, 42, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size.w, size.h);

      const cy_ = Math.cos(rotY), sy_ = Math.sin(rotY);
      const ct = Math.cos(TILT), st = Math.sin(TILT);

      /* back hemisphere: faint embers */
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p[0] * cy_ + p[2] * sy_;
        const z0 = -p[0] * sy_ + p[2] * cy_;
        const y = p[1] * ct - z0 * st;
        const z = p[1] * st + z0 * ct;
        if (z > 0) continue;
        ctx.fillStyle = `rgba(140, 72, 22, ${(0.08 + 0.09 * -z).toFixed(3)})`;
        ctx.fillRect(cx + x * R - 1.1, cy - y * R - 1.1, 2.2, 2.2);
      }

      /* front hemisphere: granulated fire, limb darkening, sunspots */
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p[0] * cy_ + p[2] * sy_;
        const z0 = -p[0] * sy_ + p[2] * cy_;
        const y = p[1] * ct - z0 * st;
        const z = p[1] * st + z0 * ct;
        if (z <= 0) continue;
        const edge = Math.sqrt(x * x + y * y);
        /* limb darkening: real suns dim toward the edge */
        let lum = (0.62 + 0.38 * z) * (0.78 + 0.34 * p[3]);
        lum = Math.max(0, Math.min(1, lum));
        const limbFade = edge > 0.9 ? 1 - (edge - 0.9) / 0.1 : 1;
        const ink =
          lum > 0.72 ? [255, 213, 128] :
          lum > 0.5 ? [240, 160, 60] :
          lum > 0.3 ? [180, 105, 32] : [110, 58, 16];
        ctx.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${(0.95 * limbFade).toFixed(3)})`;
        const r = 2.3 + 1.3 * z;
        ctx.fillRect(cx + x * R - r / 2, cy - y * R - r / 2, r, r);
      }

      /* sunspots ride the surface */
      for (let i = 0; i < spotDots.length; i++) {
        const p = spotDots[i];
        const x = p[0] * cy_ + p[2] * sy_;
        const z0 = -p[0] * sy_ + p[2] * cy_;
        const y = p[1] * ct - z0 * st;
        const z = p[1] * st + z0 * ct;
        if (z <= 0) continue;
        const edge = Math.sqrt(x * x + y * y);
        const limbFade = edge > 0.88 ? 1 - (edge - 0.88) / 0.12 : 1;
        const a = (0.6 + 0.35 * z) * limbFade;
        if (a <= 0.01) continue;
        ctx.fillStyle = `rgba(70, 30, 8, ${a.toFixed(3)})`;
        const r = 1.8 + 0.7 * z;
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
      rotY += dx * 0.006;
      velY = Math.max(-0.006, Math.min(0.006, (dx * 0.006) / Math.max(16, now - lastMoveT)));
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

    const onResize = () => { size = resize(); if (reduced) draw(performance.now()); };
    window.addEventListener("resize", onResize);

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

  return <canvas ref={canvasRef} className={className} aria-label="Rotating dithered Sun" />;
}
