import { useEffect, useRef } from "react";

/* ══ EarthGlobe ════════════════════════════════════════════
   A dot-matrix Earth: landmasses sampled from NASA's specular map
   (oceans bright, land dark — inverted gives a clean land mask) and
   rendered as ~2,500 dots on an orthographic sphere. Pure canvas 2D —
   no WebGL, no three.js — because the site's dot language (the dither
   hero, the stardust portrait) already speaks in points, and a particle
   globe is the same sentence in 3D.

   Interaction: drag to spin, with inertia. Idle: slow auto-rotation.
   Reduced motion: one static frame, still draggable pose. */

const MAP_URL = "assets/hero/earth-specular.jpg";
const LAND_THRESHOLD = 0.28; /* map luminance below this = land */
const STEP = 3; /* sample grid step in map px at 360x180 working size */
const DOT_INK = [214, 234, 255]; /* near-white blue, so land pops on the body */

/* 4x4 Bayer threshold matrix — the same one the hero's dither speaks */
const BAYER = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
].map((r) => r.map((v) => v / 16 - 0.469));

export default function EarthGlobe({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;

    /* rotation state: spin around the Y axis (+ drag), fixed axial tilt */
    let rotY = 0.6;
    const IDLE = 0.00004; /* idle auto-rotation, rad per ms */
    let decayTarget = IDLE; /* set at release: idle drift in the flung direction */
    let velY = IDLE;
    let dragging = false;
    let lastX = 0;
    let lastMoveT = 0;
    const TILT = -0.35;

    let points = []; /* unit vectors of land dots */

    function buildPoints(img) {
      /* sample the map into a lat/lon grid; keep land pixels.
         Longitude step grows with cos(lat) so density stays uniform —
         otherwise the poles ring into concentric artifacts. */
      const w = 360, h = 180;
      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true });
      octx.drawImage(img, 0, 0, w, h);
      const d = octx.getImageData(0, 0, w, h).data;
      const pts = [];
      for (let y = 0; y < h; y += STEP) {
        const lat = ((y + 0.5) / h - 0.5) * -Math.PI; /* +π/2 top → -π/2 bottom */
        if (Math.abs(lat) > 1.28) continue; /* drop the polar caps: ring noise */
        const cl = Math.cos(lat), sl = Math.sin(lat);
        const lonStep = Math.max(1, Math.round(STEP / cl));
        for (let x = 0; x < w; x += lonStep) {
          const i = (y * w + x) * 4;
          const lum = (d[i] + d[i + 1] + d[i + 2]) / 765;
          if (lum > LAND_THRESHOLD) continue; /* bright = ocean, skip */
          const lon = ((x + 0.5) / w) * Math.PI * 2;
          pts.push([cl * Math.cos(lon), sl, cl * Math.sin(lon)]);
        }
      }
      points = pts;
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    }

    /* body canvas must exist before the first bake runs */
    const bodyC = document.createElement("canvas");

    let size = resize();
    bakeBody();

    /* ── the dithered body, baked once per resize ──────────────
       The sphere's shading doesn't rotate (only the land does), so the
       dither-kit treatment — a Bayer 4x4 gradient where dot density
       follows a light — is rendered once to an offscreen canvas and
       blitted every frame. Two blue tones: deep for shade, sky for
       where the light lands. */
    function bakeBody() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      bodyC.width = Math.round(size.w * dpr);
      bodyC.height = Math.round(size.h * dpr);
      const b = bodyC.getContext("2d");
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = size.w / 2, cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.46;
      const cell = 3;
      /* light GRACES the upper-left limb (strong lateral component) —
         pointing it at the viewer pools a bright halo mid-disc instead */
      const lx = -0.72, ly = -0.6, lz = 0.34;
      for (let y = 0; y < size.h; y += cell) {
        for (let x = 0; x < size.w; x += cell) {
          const dx = (x + cell / 2 - cx) / R, dy = (y + cell / 2 - cy) / R;
          const r2 = dx * dx + dy * dy;
          if (r2 > 1) continue;
          const nz = Math.sqrt(1 - r2);
          let L = dx * lx + dy * ly + nz * lz;
          L = Math.max(0, L);
          let v = 0.16 + 0.48 * L;
          /* soften the limb so the edge dissolves instead of cutting.
             Capped well below 1 — once every cell passes the threshold
             the dither collapses into a flat bright halo. */
          v = Math.min(0.72, v) * (1 - Math.pow(Math.sqrt(r2), 6) * 0.45);
          const th = BAYER[(y / cell) & 3][(x / cell) & 3];
          if (v <= th) continue;
          b.fillStyle =
            v > 0.5 ? "rgba(140, 195, 255, 0.7)" : "rgba(70, 120, 220, 0.85)";
          b.fillRect(x, y, 2.2, 2.2);
        }
      }
    }

    function draw(t) {
      if (!alive) return;
      ctx.clearRect(0, 0, size.w, size.h);
      if (!points.length) return;

      const cx = size.w / 2, cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.46;

      if (!dragging) {
        const dtMs = Math.min(32, t - (draw.t || t));
        rotY += velY * dtMs;
        /* friction: a fling decays back to the idle drift in the direction
           it was flung — never through zero, or the spin stalls mid-decay */
        velY = decayTarget + (velY - decayTarget) * Math.pow(0.9985, dtMs);
      }
      draw.t = t;

      /* the night body FIRST: a mostly-solid dark sphere so the planet
         clearly reads against bright clouds — the dither goes on top */
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      body.addColorStop(0, "rgba(6, 10, 24, 0.88)");
      body.addColorStop(1, "rgba(2, 4, 12, 0.78)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      /* dithered body… */
      ctx.drawImage(bodyC, 0, 0, size.w, size.h);

      const cy_ = Math.cos(rotY), sy_ = Math.sin(rotY);
      const ct = Math.cos(TILT), st = Math.sin(TILT);

      /* back hemisphere first, fainter — gives the sphere its volume */
      for (let pass = 0; pass < 2; pass++) {
        const front = pass === 1;
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          /* rotate around Y, then apply the axial tilt (around X) */
          const x = p[0] * cy_ + p[2] * sy_;
          const z0 = -p[0] * sy_ + p[2] * cy_;
          const y = p[1] * ct - z0 * st;
          const z = p[1] * st + z0 * ct;
          if (front !== z > 0) continue;
          const a = front ? 0.75 + 0.25 * z : 0.06 + 0.12 * z;
          ctx.fillStyle = `rgba(${DOT_INK[0]},${DOT_INK[1]},${DOT_INK[2]},${a.toFixed(3)})`;
          const r = front ? 1.3 + 0.9 * z : 0.7;
          ctx.fillRect(cx + x * R - r / 2, cy - y * R - r / 2, r, r);
        }
      }

      /* no limb ring — a bright hairline at the edge is a halo in waiting */

      if (!reduced) raf = requestAnimationFrame(draw);
    }

    function wake() {
      if (!raf && !reduced) raf = requestAnimationFrame(draw);
    }

    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      buildPoints(img);
      wake();
    };
    img.src = MAP_URL;

    /* ---------- drag to spin, with inertia ---------- */
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

    const onResize = () => { size = resize(); bakeBody(); if (reduced) draw(performance.now()); };
    window.addEventListener("resize", onResize);

    /* parked loop still needs one paint for the static/reduced case */
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

  return <canvas ref={canvasRef} className={className} aria-label="Rotating dot-matrix Earth" />;
}
