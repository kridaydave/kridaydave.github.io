import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import TiltCard from "../components/TiltCard.jsx";
import HoverCard from "../components/HoverCard.jsx";
import EarthGlobe from "../components/EarthGlobe.jsx";
import MoonGlobe from "../components/MoonGlobe.jsx";
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

/* ---------- projects: grouped rows, first thing after the hero ---------- */

const PROJECT_GROUPS = [
  {
    label: "Epoch AI Labs",
    rows: [
      {
        name: "Blueline",
        type: "Supply Chain Security",
        year: "2026",
        desc: "Approve the change, not the download. Sandboxed installs and release deltas for npm.",
        href: "projects/blueline.html",
      },
      {
        name: "Oot",
        type: "Code Governance",
        year: "2026",
        desc: "A court for code: resolves intent disputes and merge conflicts between agents.",
        href: "projects/oot.html",
      },
      {
        name: "T4 CUDA Kernels",
        type: "GPU Research",
        year: "2026",
        desc: "Inference and training kernels for a 2018 Tesla T4 — quantized decode, fused AdamW, speculative decoding. All numbers tagged MEASURED.",
        href: "https://github.com/Epoch-AI-Lab/t4-cuda",
        external: true,
      },
    ],
  },
  {
    label: "Personal",
    rows: [
      {
        name: "File Organizer MCP",
        type: "Developer Tool",
        year: "2025",
        desc: "Local-first file management server for LLM agents, with dry-run safety gates.",
        href: "projects/file-organizer-mcp.html",
        badge: "Most popular",
      },
    ],
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

      {/* projects: the hero's melt lands on the work */}
      <section className="scene-dark bg-black" aria-label="Projects">
        <div className="projects-rows">
          <p className="writing-tag">Projects</p>
          <p className="p-lede">
            I'm the founder of{" "}
            <a href="https://theepoch.in" target="_blank" rel="noreferrer">Epoch AI Labs</a>, an
            independent lab testing how model agents coordinate, break, and get
            broken.
          </p>
          {PROJECT_GROUPS.map((group) => (
            <div className="p-group" key={group.label}>
              <p className="p-group-label">{group.label}</p>
              <div className="p-rows">
                {group.rows.map((row) => (
                  <a
                    key={row.name}
                    href={row.href}
                    target={row.external ? "_blank" : undefined}
                    rel={row.external ? "noreferrer" : undefined}
                  >
                    <span className="t">
                      {row.name}
                      {row.badge && <span className="badge">{row.badge}</span>}
                    </span>
                    <span className="type">{row.type}</span>
                    <span className="year">{row.year}</span>
                    <span className="desc">{row.desc}</span>
                  </a>
                ))}
              </div>
            </div>
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
