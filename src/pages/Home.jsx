import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import TiltCard from "../components/TiltCard.jsx";
import HoverCard from "../components/HoverCard.jsx";
import EarthGlobe from "../components/EarthGlobe.jsx";
import MoonGlobe from "../components/MoonGlobe.jsx";
import DitherSun from "../components/DitherSun.jsx";
import MiniPlanet from "../components/MiniPlanet.jsx";
import ActivityGraph from "../components/ActivityGraph.jsx";
import { useLatestEssay } from "../hooks/useLatestEssay.js";
import { useActivityData } from "../hooks/useActivityData.js";
import { useISTStatus } from "../hooks/useClock.js";
import { POSTS } from "../content/pages.js";

/* ---------- hero ---------- */

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
  const activity = useActivityData();
  const ist = useISTStatus();

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
          <a className="writing-more" href="/blog.html">All essays</a>
        </div>
      </section>

      {/* now: signs of life */}
      <section className="scene-dark now-section" aria-label="Now">
        <div className="now-inner">
          <p className="writing-tag">Now</p>
          <div className="now-status">
            <span className="online-dot" aria-hidden="true" />
            <strong>{ist ? ist.time : "--:--:--"}</strong>
            <span className="now-sep">·</span>
            <span>{ist ? ist.activity : "Loading…"}</span>
          </div>
          <div className="now-graph">
            <ActivityGraph data={activity} />
          </div>
          <p className="now-total">
            <strong>
              {activity?.total?.lastYear != null
                ? Number(activity.total.lastYear).toLocaleString()
                : "—"}
            </strong>{" "}
            contributions in the last year ·{" "}
            <a href="https://github.com/kridaydave" target="_blank" rel="noreferrer">
              @kridaydave
            </a>
          </p>
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
          <a href="mailto:davekriday@gmail.com">davekriday@gmail.com</a>
          <a href="https://github.com/kridaydave" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/kriday-dave-0169a83b5" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://twitter.com/KridayTop" target="_blank" rel="noreferrer">X / Twitter</a>
        </div>
      </section>
    </Layout>
  );
}
