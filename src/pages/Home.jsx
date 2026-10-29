import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout.jsx";
import TiltCard from "../components/TiltCard.jsx";
import HoverCard from "../components/HoverCard.jsx";
import EarthGlobe from "../components/EarthGlobe.jsx";
import MoonGlobe from "../components/MoonGlobe.jsx";
import DitherSun from "../components/DitherSun.jsx";
import MiniPlanet from "../components/MiniPlanet.jsx";
import GitHubActivity from "../components/ui/github-activity.jsx";
import { Mail } from "lucide-react";
import { useLatestEssay } from "../hooks/useLatestEssay.js";
import { POSTS } from "../content/pages.js";

/* ---------- hero ---------- */

/* Brand marks for the contact row — lucide dropped brand icons, so these are
   the official simple-icons paths, filled with currentColor. */
const Mark = ({ d, size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
);
const GithubMark = ({ size }) => (
  <Mark d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
);
const LinkedinMark = ({ size }) => (
  <Mark size={size} d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
);
const XMark = ({ size }) => (
  <Mark size={size} d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
);


const NAME = "Kriday Dave";

/* The name types itself in, holds, deletes, and again. Reduced-motion
   visitors get the name, whole, with a still caret. */
function TypeName() {
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLen(NAME.length);
      return;
    }
    let i = 0;
    let dir = 1;
    let timer;
    const tick = () => {
      i += dir;
      setLen(Math.max(0, i));
      let delay = dir > 0 ? 95 : 50; /* typing is slower than erasing */
      if (i >= NAME.length) {
        dir = -1;
        delay = 2800; /* hold the full name */
      } else if (i <= 0) {
        dir = 1;
        delay = 1100; /* hold the blank */
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <span>{NAME.slice(0, len)}</span>
      <span className="caret" aria-hidden="true" />
    </>
  );
}

/* ---------- projects: four theses, first thing after the hero ----------
   Each entry leads with the sentence Kriday wrote about the project,
   quoted from its own case study. The T4 numbers are MEASURED register
   numbers, not decoration. */

const PROJECT_THESES = [
  {
    name: "Blueline",
    role: "Supply chain security, 2026",
    org: "Epoch AI Labs",
    hue: "#8fb0e0",
    thesis: "Approve the change, not the download.",
    say: "Sandboxed installs and release deltas for npm. Blueline reduces a package to what it actually alters, so review happens before bytes run.",
    href: "projects/blueline.html",
    cta: "Case study",
  },
  {
    name: "Oot",
    role: "Code governance, 2026",
    org: "Epoch AI Labs",
    hue: "#d09a9a",
    thesis: "Version control as a court for code.",
    say: "Agents rename interfaces, pass their own tests, and break the build in ways line merges cannot see. Oot rules on intent disputes and guards the merge boundary.",
    href: "projects/oot.html",
    cta: "Case study",
  },
  {
    name: "T4 CUDA Kernels",
    role: "GPU research, 2026",
    org: "Epoch AI Labs",
    hue: "#8fbf8f",
    thesis: "The register is public, the numbers are tagged.",
    say: "Training and inference kernels for a 2018 Tesla T4. 1.94x against eager PyTorch, then 2.02x re-measured on a second physical card.",
    href: "https://github.com/Epoch-AI-Lab/t4-cuda",
    external: true,
    cta: "The register",
  },
  {
    name: "File Organizer MCP",
    role: "Developer tool, 2025",
    org: "Personal, most used",
    hue: "#c8b273",
    thesis: "One atomic call instead of twenty.",
    say: "Local-first file management for LLM agents. organize_files() scans, plans and moves as one operation, previewed in dry-run before anything moves.",
    href: "projects/file-organizer-mcp.html",
    cta: "Case study",
  },
];

export default function Home() {
  const essay = useLatestEssay();

  /* The GitHub planet's ring: hover runs vibrate -> rainbow -> fast spin;
     un-hover decelerates from the ring's exact live angle back onto the base
     orbit's phase, so it never snaps. Reduced-motion users get none of it. */
  const ringRef = useRef(null);
  const ringAnim = useRef(null);
  const RING_BASE = "rgba(74, 222, 128, 0.5)";

  const ringEnter = () => {
    const ring = ringRef.current;
    if (!ring?.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ringAnim.current?.cancel();
    const vibrate = ring.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg)", borderColor: "rgba(74, 222, 128, 0.85)" },
        { transform: "translate(calc(-50% + 1.5px), calc(-50% - 1.5px)) rotate(3deg)" },
        { transform: "translate(calc(-50% - 1.5px), calc(-50% + 1.5px)) rotate(7deg)", borderColor: "rgba(255, 90, 90, 0.85)" },
        { transform: "translate(calc(-50% + 1.5px), -50%) rotate(11deg)", borderColor: "rgba(255, 184, 77, 0.85)" },
        { transform: "translate(-50%, calc(-50% + 1.5px)) rotate(15deg)", borderColor: "rgba(255, 225, 77, 0.85)" },
        { transform: "translate(calc(-50% - 1.5px), -50%) rotate(22deg)", borderColor: "rgba(124, 255, 107, 0.85)" },
        { transform: "translate(calc(-50% + 1.5px), calc(-50% + 1.5px)) rotate(52deg)", borderColor: "rgba(77, 195, 255, 0.85)" },
        { transform: "translate(calc(-50% - 1.5px), calc(-50% - 1.5px)) rotate(130deg)", borderColor: "rgba(176, 124, 255, 0.85)" },
        { transform: "translate(-50%, -50%) rotate(240deg)", borderColor: "rgba(255, 107, 213, 0.85)" },
      ],
      { duration: 1700, easing: "cubic-bezier(0.45, 0, 0.55, 1)" }
    );
    ringAnim.current = vibrate;
    vibrate.onfinish = () => {
      const fast = ring.animate(
        [
          { transform: "translate(-50%, -50%) rotate(240deg)", borderColor: "rgba(255, 107, 213, 0.85)" },
          { transform: "translate(-50%, -50%) rotate(330deg)", borderColor: "rgba(255, 90, 90, 0.85)" },
          { transform: "translate(-50%, -50%) rotate(420deg)", borderColor: "rgba(255, 225, 77, 0.85)" },
          { transform: "translate(-50%, -50%) rotate(510deg)", borderColor: "rgba(77, 195, 255, 0.85)" },
          { transform: "translate(-50%, -50%) rotate(600deg)", borderColor: "rgba(255, 107, 213, 0.85)" },
        ],
        { duration: 500, iterations: Infinity }
      );
      ringAnim.current = fast;
    };
  };

  const ringLeave = () => {
    const ring = ringRef.current;
    const anim = ringAnim.current;
    if (!ring?.animate || !anim) return;
    ringAnim.current = null;
    // snapshot the ring's live angle and colour straight off its computed style
    const cs = getComputedStyle(ring);
    let angle = 0;
    try {
      const m = new DOMMatrixReadOnly(cs.transform === "none" ? "" : cs.transform);
      angle = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    } catch (e) {}
    let color = cs.borderTopColor;
    anim.cancel();
    // land on the base orbit's phase at the moment the slowdown will end
    let endAngle = -16;
    try {
      const cssAnim = document
        .getAnimations()
        .find((a) => a.animationName === "ring-spin" && a.effect?.target === ring);
      if (cssAnim?.currentTime != null) {
        const phase = ((cssAnim.currentTime + 1400) % 22000) / 22000;
        endAngle = -16 + 360 * phase;
      }
    } catch (e) {}
    // take the shortest forward path to the landing angle
    endAngle += 360 * Math.round((angle - endAngle) / 360);
    ring.animate(
      [
        { transform: `translate(-50%, -50%) rotate(${angle}deg)`, borderColor: color },
        { transform: `translate(-50%, -50%) rotate(${endAngle}deg)`, borderColor: RING_BASE },
      ],
      { duration: 1400, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  };

  /* the three essays newest after the featured one, newest first */
  const wallEssays = useMemo(
    () =>
      Object.values(POSTS)
        .filter(
          (p) =>
            p.slug && p.date.includes(",") && p.slug !== "em-dashes-suck"
        )
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, 3)
        .map((p) => ({
          title: p.title,
          label:
            "Essay · " +
            new Date(p.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          summary: p.desc,
          href: `posts/${p.slug}.html`,
        })),
    []
  );

  return (
    <Layout active="home" homeMode showUses>
      {/* hero scene: daylight clouds, portrait, the name */}
      <section className="hero scene-dark" aria-label="Introduction">
        <img className="hero-img" src="assets/hero/clouds.webp" alt="" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <MoonGlobe className="moon-globe" />
        <EarthGlobe className="earth-globe" />
        <div className="pblur" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="hero-fade" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-side">
            <div className="hero-portrait-frame">
              <TiltCard fill corner={14} />
            </div>
          </div>
          <div className="hero-copy">
            <h1 aria-label={NAME}>
              <TypeName />
            </h1>
            <p>
              I build research tooling and open source security plumbing, write
              about what breaks, and ship small things that actually run.
            </p>
            <div className="hero-links">
              <a href="https://theepoch.in" target="_blank" rel="noreferrer">theepoch.in</a>
              <a href="https://github.com/kridaydave" target="_blank" rel="noreferrer">github.com/kridaydave</a>
              <a href="mailto:davekriday@gmail.com">say hi</a>
            </div>
          </div>
        </div>
      </section>

      {/* projects: four theses under a translucent dithered sun that
          rides the scroll */}
      <section className="scene-dark theses-scene" aria-label="Projects">
        <div className="theses-sun-track" aria-hidden="true">
          <DitherSun className="theses-sun" />
        </div>
        <div className="theses-wrap">
          <h2>Projects</h2>
          <p className="t-lede">
            Three works from Epoch AI Labs and one of my own. Each thesis is
            quoted from its case study — hover one to watch it underline
            itself.
          </p>
          {PROJECT_THESES.map((p) => (
            <article className="t-thesis" key={p.name} style={{ "--hue": p.hue }}>
              <span className="t-planet-slot">
                <span className="t-planet-spin">
                  <MiniPlanet hue={p.hue} className="t-planet" />
                </span>
              </span>
              {/* the planet anchors the row at the left edge; the text
                  is always on and hover only spins the planet */}
              <div className="t-text">
                <div className="t-body">
                  <div className="t-body-in">
                    <p className="t-id">
                      <b>{p.name}</b>
                      {p.role}
                      <br />
                      {p.org}
                      <br />
                      <a
                        href={p.href}
                        target={p.external ? "_blank" : undefined}
                        rel={p.external ? "noreferrer" : undefined}
                      >
                        {p.cta}
                      </a>
                    </p>
                    <a
                      className="t-claim"
                      href={p.href}
                      target={p.external ? "_blank" : undefined}
                      rel={p.external ? "noreferrer" : undefined}
                    >
                      {p.thesis.slice(0, p.thesis.lastIndexOf(" ")) + " "}
                      {/* the last word carries the curl, so the line lands
                          under the words that end the sentence */}
                      <span className="t-tail">
                        {p.thesis.slice(p.thesis.lastIndexOf(" ") + 1)}
                      <svg
                        className="t-curl"
                        viewBox="0 0 220 22"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                          <path
                            d="M3 15 C30 8 52 19 84 12 C108 7 128 15 152 11 C172 8 186 11 196 10 C205 9 210 6 205 4 C199 2 193 5 197 9 C202 14 212 15 217 12"
                            pathLength="1"
                          />
                        </svg>
                      </span>
                    </a>
                    <p className="t-say">{p.say}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* writing scene: a dusk coast between two blacks */}
      <section className="writing scene-dark" aria-label="Writing">
        <div className="clouds-band">
          <img src="assets/hero/coast.webp" alt="" aria-hidden="true" />
          <div className="clouds-shade" aria-hidden="true" />
          <div className="pblur-top" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="pblur" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="hero-fade" aria-hidden="true" />

          <div className="writing-featured">
            <p className="writing-tag">Writing</p>
            <a className="essay-card" href={essay.href}>
              <span className="date">{essay.dateLabel}</span>
              <h3>{essay.title}</h3>
              <p>{essay.desc}</p>
              <span className="read">Read the essay</span>
            </a>
          </div>
        </div>

        <div className="essay-wall">
          <HoverCard essays={wallEssays} />
          <a className="writing-cta" href="/blog.html">
            Read more <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* now: signs of life */}
      <section className="scene-dark now-section" aria-label="Now">
        <div className="now-inner">
          <p className="writing-tag">Now</p>
          <div className="now-graph">
            <GitHubActivity username="kridaydave" />
          </div>
        </div>
      </section>

      {/* contact: the send-off */}
      <section className="scene-dark contact-outro" aria-label="Contact">
        <h2>Say hi.</h2>
        <p className="contact-lede">
          Research ideas, open-source collaboration, or thoughtful conversations
          about AI — my inbox is open.
        </p>
        <div className="contact-row">
          <a className="contact-planet" href="mailto:davekriday@gmail.com" style={{ "--planet-size": "68px", "--planet-rgb": "255 176 64" }}>
            <span className="planet-disc">
              <Mail size={19} strokeWidth={1.5} />
            </span>
            <span className="planet-name">Email</span>
          </a>
          <a
            className="contact-planet ringed"
            href="https://github.com/kridaydave"
            target="_blank"
            rel="noreferrer"
            style={{ "--planet-size": "84px", "--planet-rgb": "74 222 128" }}
            onPointerEnter={ringEnter}
            onPointerLeave={ringLeave}
          >
            <span className="planet-disc">
              <span className="planet-ring" aria-hidden="true" ref={ringRef} />
              <GithubMark size={22} />
            </span>
            <span className="planet-name">GitHub</span>
          </a>
          <a className="contact-planet" href="https://linkedin.com/in/kriday-dave-0169a83b5" target="_blank" rel="noreferrer" style={{ "--planet-size": "66px", "--planet-rgb": "96 165 250" }}>
            <span className="planet-disc">
              <LinkedinMark size={18} />
            </span>
            <span className="planet-name">LinkedIn</span>
          </a>
          <a className="contact-planet" href="https://twitter.com/KridayTop" target="_blank" rel="noreferrer" style={{ "--planet-size": "58px", "--planet-rgb": "235 235 245" }}>
            <span className="planet-disc">
              <XMark size={16} />
            </span>
            <span className="planet-name">X / Twitter</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}
