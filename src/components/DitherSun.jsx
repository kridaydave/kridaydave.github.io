import { useEffect, useRef } from "react";

/* ══ DitherSun ═════════════════════════════════════════════
   The sun, finally in the same dimension as its planets: a rotating
   sphere of ~1,500 granulation dots on a Fibonacci lattice, brightness
   varied by procedural surface noise (solar granulation), a few
   sunspots drifting with the surface, and physical limb darkening —
   a real ball of fire, not a flat poster.

   Warm duotone (honey → amber → umber), drag to spin with inertia,
   idle drift toward the flung direction, occasional flares jetting
   off the limb, ~30fps cap. Reduced motion: one static frame. */

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

    /* fibonacci lattice: even dot coverage of the sphere.
       ~36,000 points: denser still. */
    const pts = [];
    {
      const N = 36000;
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

    /* flares: occasional arcs of bright dots jetting off the limb.
       Anchored to a surface point so they ride the rotation; a new
       one every 8–17s, the first almost immediately. */
    const flares = [];
    let nextFlareAt = 2200;
    function spawnFlare(now) {
      const cyr = Math.cos(rotY), syr = Math.sin(rotY);
      const ct = Math.cos(TILT), st = Math.sin(TILT);
      for (let tries = 0; tries < 60; tries++) {
        const u = Math.random() * 2 - 1;
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.max(0, 1 - u * u));
        const p = [Math.cos(a) * rr, u, Math.sin(a) * rr];
        const x = p[0] * cyr + p[2] * syr;
        const zb = -p[0] * syr + p[2] * cyr;
        const y = p[1] * ct - zb * st;
        const z = p[1] * st + zb * ct;
        const edge = Math.hypot(x, y);
        /* only erupt from the visible limb */
        if (z > 0.15 && edge > 0.72 && edge < 0.93) {
          flares.push({
            p,
            born: now,
            life: 2600 + Math.random() * 1500,
            bend: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.8),
            reach: 0.26 + Math.random() * 0.2,
          });
          return;
        }
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

      if (!reduced && t >= nextFlareAt) {
        spawnFlare(t);
        nextFlareAt = t + 6000 + Math.random() * 8000;
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
        ctx.fillRect(cx + x * R - 0.8, cy - y * R - 0.8, 1.6, 1.6);
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
        const r = 1.4 + 0.7 * z;
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
        const r = 1.2 + 0.4 * z;
        ctx.fillRect(cx + x * R - r / 2, cy - y * R - r / 2, r, r);
      }

      /* flares: bright arcs streaming off the limb, rising fast,
         fading slow, bending sideways — anchored dots, never a
         continuous glow, so the edge stays grainy */
      for (let f = flares.length - 1; f >= 0; f--) {
        const fl = flares[f];
        const a = (t - fl.born) / fl.life;
        if (a >= 1) { flares.splice(f, 1); continue; }
        const p = fl.p;
        const x = p[0] * cy_ + p[2] * sy_;
        const zb = -p[0] * sy_ + p[2] * cy_;
        const y = p[1] * ct - zb * st;
        const z = p[1] * st + zb * ct;
        /* rotated to the back half: the flare goes with it */
        if (z <= 0.1) continue;
        const ax = cx + x * R, ay = cy - y * R;
        const e = Math.hypot(x, y);
        const rx = x / e, ry = -y / e; /* radial unit, canvas y-down */
        const growth = Math.min(1, a / 0.25);
        const fade = a < 0.55 ? 1 : 1 - (a - 0.55) / 0.45;
        const M = 20;
        for (let k = 0; k <= M; k++) {
          const u = k / M;
          /* starts just inside the limb, so the stream visibly comes
             OUT of the disc */
          const d = fl.reach * growth * (u - 0.1);
          const bend = fl.bend * 0.2 * u * u;
          const px = ax + (rx * d - ry * bend) * R;
          const py = ay + (ry * d + rx * bend) * R;
          const sparkle = 0.65 + 0.35 * Math.sin(t * 0.02 + k * 2.1 + fl.bend * 7);
          const alpha = 0.95 * (1 - u * 0.3) * fade * sparkle;
          if (alpha <= 0.02) continue;
          /* hot core near the base, cooling to deep orange at the tip */
          const s = 2.2 + 1.6 * (1 - u);
          ctx.fillStyle = u < 0.3
            ? `rgba(255, 196, 87, ${alpha.toFixed(3)})`
            : `rgba(255, 140, 38, ${alpha.toFixed(3)})`;
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        }
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
