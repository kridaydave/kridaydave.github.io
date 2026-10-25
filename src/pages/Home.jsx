import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import TiltCard from "../components/TiltCard.jsx";
import HoverCard from "../components/HoverCard.jsx";
import EarthGlobe from "../components/EarthGlobe.jsx";
import MoonGlobe from "../components/MoonGlobe.jsx";
import { useLatestEssay } from "../hooks/useLatestEssay.js";
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

/* ---------- projects: editorial rows under the essay wall ---------- */

const PROJECT_ROWS = [
  {
    name: "Epoch AI Labs",
    type: "Research Lab",
    year: "2026",
    desc: "Independent lab testing how model agents coordinate, break, and get broken.",
    href: "https://theepoch.in",
    external: true,
  },
  {
    name: "Blueline",
    type: "Supply Chain Security",
    year: "2026",
    desc: "Approve the change, not the download. Sandboxed installs and release deltas for npm.",
    href: "projects/blueline.html",
  },
  {
    name: "File Organizer MCP",
    type: "Developer Tool",
    year: "2025",
    desc: "Local-first file management server for LLM agents, with dry-run safety gates.",
    href: "projects/file-organizer-mcp.html",
  },
  {
    name: "Oot",
    type: "Code Governance",
    year: "2026",
    desc: "A court for code: resolves intent disputes and merge conflicts between agents.",
    href: "projects/oot.html",
  },
];

export default function Home() {
  const essay = useLatestEssay();

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

      {/* writing scene: the band slides under the hero's melt */}
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

      {/* projects: editorial rows on the same black */}
      <section className="scene-dark bg-black" aria-label="Projects">
        <div className="projects-rows">
          <p className="writing-tag">Projects</p>
          <div className="p-rows">
            {PROJECT_ROWS.map((row) => (
              <a
                key={row.name}
                href={row.href}
                target={row.external ? "_blank" : undefined}
                rel={row.external ? "noreferrer" : undefined}
              >
                <span className="t">{row.name}</span>
                <span className="type">{row.type}</span>
                <span className="year">{row.year}</span>
                <span className="desc">{row.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
