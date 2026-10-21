import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout.jsx";
import CharReveal from "../components/CharReveal.jsx";
import CopyCmd from "../components/CopyCmd.jsx";
import ActivityGraph from "../components/ActivityGraph.jsx";
import { useGithubStats } from "../hooks/useGithubStats.js";
import { useActivityData } from "../hooks/useActivityData.js";
import { useISTStatus } from "../hooks/useClock.js";
import { useLatestEssay } from "../hooks/useLatestEssay.js";
import { prefersReducedMotion } from "../lib/browser";
import { SECTION, SECTION_TITLE } from "../lib/styles.js";
import { STATUS_DOT } from "../lib/routine.js";
import { cn } from "../lib/utils.js";

/* ---------- shared icons ---------- */

const IconGithubOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconArrowRight = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const IconExternal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const IconGithubFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

/* ---------- project cards ---------- */

/* The Epoch mark is a tall wordmark, so it opts out of the square logo
   treatment that the app icons get. */
const LOGO =
  "h-24 w-24 max-h-24 max-w-24 rounded-[20px] object-contain shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]";
const LOGO_WORDMARK =
  "h-[98px] w-[76px] max-h-[100px] max-w-[80px] object-contain transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105";

const PREVIEW_INNER =
  "relative flex size-full items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]";

const PROJECTS = [
  {
    id: "epoch",
    preview:
      "bg-[linear-gradient(135deg,#2a1a12_0%,#a64b2a_45%,#1a1a2e_100%)]",
    previewHref: "https://theepoch.in",
    previewAria: "Visit Epoch AI Labs",
    logo: <img src="assets/epoch-mark-reversed.svg" alt="" className={LOGO_WORDMARK} aria-hidden="true" />,
    overlayLabel: "Research Lab",
    name: "Epoch AI Labs",
    nameHref: "https://theepoch.in",
    type: "Research Lab · 2026",
    desc: "Independent research lab testing model behavior, agent coordination, and developer security tooling.",
    cmd: null,
    tags: ["AI Research"],
    caseBadge: { href: "https://theepoch.in", label: "theepoch.in ↗", external: true },
    repo: null,
    github: "https://github.com/Epoch-AI-Lab",
  },
  {
    id: "blueline",
    preview: "bg-[linear-gradient(135deg,#1a2744_0%,#2563eb_45%,#0f172a_100%)]",
    previewHref: "projects/blueline.html",
    previewAria: "Read Blueline case study",
    logo: (
      <picture>
        <source srcSet="assets/blueline-favicon.webp" type="image/webp" />
        <img src="assets/blueline-favicon.png" alt="Blueline logo" className={LOGO} />
      </picture>
    ),
    overlayLabel: "Supply Chain Security",
    name: "Blueline",
    nameHref: "projects/blueline.html",
    type: "Open Source · Security · 2026",
    desc:
      "Approve the change, not the download. Sandboxed package extraction, release delta calculations against verified baselines, and approval gates before install scripts run.",
    cmd: { copy: "npx blueline install <pkg>", display: "npx blueline install <pkg>", aria: "Copy command" },
    tags: ["Rust"],
    caseBadge: { href: "projects/blueline.html", label: "Case study ↗", external: false },
    repo: { slug: "Epoch-AI-Lab/blueline", fallbackStars: 1 },
    github: "https://github.com/Epoch-AI-Lab/blueline",
  },
  {
    id: "fileorg",
    preview: "bg-[linear-gradient(135deg,#2a2110_0%,#f59e0b_45%,#1a1a2e_100%)]",
    previewHref: "projects/file-organizer-mcp.html",
    previewAria: "Read File Organizer MCP case study",
    logo: (
      <div className="text-[rgba(255,255,255,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      </div>
    ),
    overlayLabel: "MCP Protocol",
    name: "File Organizer MCP",
    nameHref: "projects/file-organizer-mcp.html",
    type: "Open Source · Developer Tool",
    desc:
      "Local-first file management server for LLM agents. Adds safe directory operations, dry-run safety gates, and semantic file tagging.",
    cmd: { copy: "npx file-organizer-mcp", display: "npx file-organizer-mcp", aria: "Copy command" },
    tags: ["TypeScript", "MCP"],
    caseBadge: { href: "projects/file-organizer-mcp.html", label: "Case study ↗", external: false },
    repo: { slug: "kridaydave/File-Organizer-MCP", fallbackStars: 43 },
    github: "https://github.com/kridaydave/File-Organizer-MCP",
  },
  {
    id: "oot",
    preview: "bg-[linear-gradient(135deg,#0f2e2b_0%,#0d9488_45%,#064e3b_100%)]",
    previewHref: "projects/oot.html",
    previewAria: "Read Oot case study",
    logo: (
      <picture>
        <source srcSet="assets/oot-favicon.webp" type="image/webp" />
        <img src="assets/oot-favicon.png" alt="Oot logo" className={LOGO} />
      </picture>
    ),
    overlayLabel: "Code Governance",
    name: "Oot",
    nameHref: "projects/oot.html",
    type: "Open Source · Code Governance · 2026",
    desc:
      "A court for code. Resolves intent disputes, visibility policies, and semantic merge conflicts when multiple agents work in one repo.",
    cmd: {
      copy: "git clone https://github.com/Epoch-AI-Lab/oot",
      display: "git clone Epoch-AI-Lab/oot",
      aria: "Copy command",
    },
    tags: ["Rust"],
    caseBadge: { href: "projects/oot.html", label: "Case study ↗", external: false },
    repo: { slug: "Epoch-AI-Lab/oot", fallbackStars: 1 },
    github: "https://github.com/Epoch-AI-Lab/oot",
  },
];

/* Star, release and case-study chips share one shape and one hover. */
const CHIP =
  "inline-flex h-7 items-center gap-1 rounded border border-dotted border-hair bg-surface-1 font-mono text-[11px] text-ink-3 no-underline transition-[color,background,border-color] duration-150 hover:border-hair-strong hover:bg-surface-2 hover:text-ink";

function StarBadge({ repo, stats }) {
  const entry = stats?.[repo.slug];
  let stars = repo.fallbackStars;
  let hide = false;
  if (entry && typeof entry.stars === "number") {
    stars = entry.stars;
    hide = stars < 10;
  }
  if (hide) return null;
  return (
    <a
      href={`https://github.com/${repo.slug}`}
      target="_blank"
      rel="noreferrer"
      className={cn(CHIP, "px-2 [&_svg]:shrink-0 [&_svg]:text-[#eab308]")}
      aria-label="GitHub stars"
    >
      <IconStar />
      <span>{stars.toLocaleString()}</span>
    </a>
  );
}

function ReleaseBadge({ repo, stats }) {
  const entry = stats?.[repo.slug];
  if (!entry || !entry.release) return null;
  return (
    <a
      href={entry.releaseUrl || `https://github.com/${repo.slug}/releases`}
      target="_blank"
      rel="noreferrer"
      className={cn(CHIP, "px-2")}
      aria-label="Latest release"
    >
      <span className="inline-block size-[5px] rounded-full bg-[#10b981]"></span>{" "}
      <span>{entry.release}</span>
    </a>
  );
}

function ProjectCard({ project, stats }) {
  return (
    <article className="group flex flex-col bg-[var(--bg)]">
      <a
        href={project.previewHref}
        target={project.previewHref.startsWith("http") ? "_blank" : undefined}
        rel={project.previewHref.startsWith("http") ? "noreferrer" : undefined}
        className="relative block h-[220px] cursor-pointer overflow-hidden no-underline max-[480px]:h-[180px]"
        aria-label={project.previewAria}
      >
        <div className={cn(PREVIEW_INNER, project.preview)}>
          {project.logo}
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded border border-white/30 px-3.5 py-1.5 font-mono text-[12px] font-medium tracking-[0.05em] text-white uppercase">
              {project.overlayLabel}
            </span>
          </div>
        </div>
      </a>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 text-[19px] font-semibold text-ink">
              <a
                href={project.nameHref}
                target={project.nameHref.startsWith("http") ? "_blank" : undefined}
                rel={project.nameHref.startsWith("http") ? "noreferrer" : undefined}
                className="text-inherit no-underline hover:underline hover:underline-offset-[3px] hover:decoration-ink-3"
              >
                {project.name}
              </a>
            </h3>
            <p className="text-[13px] text-ink-3">{project.type}</p>
          </div>
          <span className="flex shrink-0 items-center gap-[5px] text-[13px] font-semibold text-ink-3">
            <span className="inline-block size-2 rounded-full bg-[#22c55e]"></span> Live
          </span>
        </div>
        <p className="text-[15px] leading-[1.6] text-ink-2">{project.desc}</p>
        {project.cmd && (
          <CopyCmd command={project.cmd.copy} display={project.cmd.display} />
        )}
        <div className="mt-auto flex min-h-11 items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[3px] border border-dotted border-hair bg-surface-1 px-[9px] py-[3px] font-mono text-[11px] text-ink-3"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={project.caseBadge.href}
              target={project.caseBadge.external ? "_blank" : undefined}
              rel={project.caseBadge.external ? "noreferrer" : undefined}
              className={cn(CHIP, "px-[9px] whitespace-nowrap text-ink-2")}
            >
              {project.caseBadge.label}
            </a>
            {project.repo && <StarBadge repo={project.repo} stats={stats} />}
            {project.repo && <ReleaseBadge repo={project.repo} stats={stats} />}
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex size-7 items-center justify-center rounded text-ink-3 transition-[color,background] duration-200 hover:bg-surface-2 hover:text-ink"
              aria-label="View on GitHub"
            >
              <IconGithubOutline />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- tech stack ---------- */

/* Each chip lights up in its own brand colour on hover. */
const TECH_ITEM =
  "flex cursor-pointer items-center gap-[7px] rounded-[3px] border border-dotted border-hair bg-surface-1 py-[5px] pr-3 pl-2.5 text-[13px] whitespace-nowrap text-ink-2 transition-all duration-150 hover:border-solid hover:bg-surface-2 hover:text-ink [&_svg]:shrink-0 [&_svg]:opacity-65 [&_svg]:transition-opacity hover:[&_svg]:opacity-100";

const TECH = [
  {
    tech: "python",
    label: "Python",
    tone: "hover:border-[rgba(55,118,171,0.4)] hover:text-[#ffe873] [&:hover_.py-top]:fill-[#3776ab] [&:hover_.py-bottom]:fill-[#ffd43b]",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path className="py-top transition-[fill]" d="M11.91 0C5.74 0 6.13 2.68 6.13 2.68L6.14 5.46H12.04V6.31H3.75S0 5.89 0 12.07c0 6.19 3.28 5.98 3.28 5.98h1.96v-2.75s-.1-3.28 3.23-3.28h5.83s3.13.05 3.13-3.08V3.13S17.85 0 11.91 0zm-3.09 1.83c.61 0 1.11.5 1.11 1.11s-.5 1.11-1.11 1.11-1.11-.5-1.11-1.11.5-1.11 1.11-1.11z" />
        <path className="py-bottom transition-[fill]" d="M12.09 24c6.17 0 5.78-2.68 5.78-2.68l-.01-2.78h-5.9V17.7h8.29s3.75.42 3.75-5.76c0-6.19-3.28-5.98-3.28-5.98h-1.96v2.75s.1 3.28-3.23 3.28H9.68s-3.13-.05-3.13 3.08v5.81s-.42 3.12 5.54 3.12zm3.09-1.83c-.61 0-1.11-.5-1.11-1.11s.5-1.11 1.11-1.11 1.11.5 1.11 1.11-.5 1.11-1.11 1.11z" />
      </svg>
    ),
  },
  { tech: "rust", label: "Rust", tone: "hover:border-[rgba(247,76,0,0.4)] hover:text-[#fed7aa] hover:[&_svg]:text-[#f74c00]", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3462.3462 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3462.3462 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z" /></svg>
  ) },
  { tech: "mcp", label: "MCP", tone: "hover:border-[rgba(168,85,247,0.4)] hover:text-[#e9d5ff] hover:[&_svg]:text-[#a855f7]", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13.85 0a4.16 4.16 0 0 0-2.95 1.217L1.456 10.66a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l9.442-9.442a2.49 2.49 0 0 1 3.541 0 2.49 2.49 0 0 1 0 3.541L8.59 12.97l-.1.1a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l.1-.098 7.03-7.034a2.49 2.49 0 0 1 3.542 0l.049.05a2.49 2.49 0 0 1 0 3.54l-8.54 8.54a1.96 1.96 0 0 0 0 2.755l1.753 1.753a.835.835 0 0 0 1.18 0 .835.835 0 0 0 0-1.18l-1.753-1.753a.266.266 0 0 1 0-.394l8.54-8.54a4.185 4.185 0 0 0 0-5.9l-.05-.05a4.16 4.16 0 0 0-2.95-1.218c-.2 0-.401.02-.6.048a4.17 4.17 0 0 0-1.17-3.552A4.16 4.16 0 0 0 13.85 0m0 3.333a.84.84 0 0 0-.59.245L6.275 10.56a4.186 4.186 0 0 0 0 5.902 4.186 4.186 0 0 0 5.902 0L19.16 9.48a.835.835 0 0 0 0-1.18.835.835 0 0 0-1.18 0l-6.985 6.984a2.49 2.49 0 0 1-3.54 0 2.49 2.49 0 0 1 0-3.54l6.983-6.985a.835.835 0 0 0 0-1.18.84.84 0 0 0-.59-.245" /></svg>
  ) },
  { tech: "a2a", label: "A2A", tone: "hover:border-[rgba(16,185,129,0.4)] hover:text-[#a7f3d0] hover:[&_svg]:text-[#10b981]", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5" /><path d="M8 21H3v-5" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /></svg>
  ) },
  { tech: "git", label: "Git", tone: "hover:border-[rgba(240,80,50,0.4)] hover:text-[#fecaca] hover:[&_svg]:text-[#f05032]", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z" /></svg>
  ) },
  { tech: "github", label: "GitHub", tone: "hover:border-white/40 hover:text-white hover:[&_svg]:text-white", icon: <IconGithubFilled /> },
  { tech: "cloudflare", label: "Cloudflare", tone: "hover:border-[rgba(243,128,32,0.4)] hover:text-[#fed7aa] hover:[&_svg]:text-[#f38020]", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727" /></svg>
  ) },
];

const IconGithubContact = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const CONTACT_ICON =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-hair bg-surface-1 text-ink-2 transition-[background,color,border-color] duration-200";

const CONTACT_ARROW =
  "ml-auto inline-flex size-3.5 shrink-0 origin-center items-center justify-center text-ink-3 transition-[transform,color] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-135deg] [&_svg]:block [&_svg]:size-3.5 max-[639px]:hidden";

/* Each network lights its icon, label and arrow in its own colour. */
const CONTACTS = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/kridaydave",
    icon: <IconGithubContact />,
    iconTone: "group-hover:border-white/30 group-hover:bg-white/8 group-hover:text-white",
    labelTone: "",
    arrowTone: "group-hover:text-white",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/kriday-dave-0169a83b5",
    icon: <IconLinkedin />,
    iconTone:
      "group-hover:border-[rgba(10,102,194,0.4)] group-hover:bg-[rgba(10,102,194,0.15)] group-hover:text-[#0a66c2]",
    labelTone: "group-hover:text-[#60a5fa]",
    arrowTone: "group-hover:text-[#0a66c2]",
  },
  {
    key: "twitter",
    label: "X / Twitter",
    href: "https://twitter.com/KridayTop",
    icon: <IconTwitter />,
    iconTone:
      "group-hover:border-[rgba(29,155,240,0.4)] group-hover:bg-[rgba(29,155,240,0.15)] group-hover:text-[#1d9bf0]",
    labelTone: "group-hover:text-[#38bdf8]",
    arrowTone: "group-hover:text-[#1d9bf0]",
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:davekriday@gmail.com",
    icon: <IconMail />,
    iconTone:
      "group-hover:border-[rgba(234,67,53,0.4)] group-hover:bg-[rgba(234,67,53,0.15)] group-hover:text-[#ea4335]",
    labelTone: "group-hover:text-[#f87171]",
    arrowTone: "group-hover:text-[#ea4335]",
  },
];

const CONTACT_LINK =
  "group relative flex items-center gap-2.5 border-r border-dashed border-hair px-2.5 py-3.5 transition-[background,border-color] duration-200 last:border-r-0 hover:bg-surface-1 min-[640px]:px-4 max-[768px]:[&:nth-child(-n+2)]:border-b max-[768px]:[&:nth-child(2)]:border-r-0";

/* ---------- page ---------- */

export default function Home() {
  const stats = useGithubStats();
  const activity = useActivityData();
  const ist = useISTStatus();
  const essay = useLatestEssay();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <Layout active="home" homeMode scrollSpy showUses>
      {/* Profile banner */}
      <section className="px-0 pt-0 pb-3">
        <div className="relative mb-4 h-[140px] w-full overflow-hidden rounded-[2px] min-[640px]:h-[200px]">
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.03)_40px,rgba(255,255,255,0.03)_41px),repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(255,255,255,0.03)_40px,rgba(255,255,255,0.03)_41px)]" />
            <div className="absolute inset-0 flex items-center justify-center font-serif text-[64px] tracking-[0.1em] text-white/8">
              KD
            </div>
          </div>
          <video
            ref={videoRef}
            className="absolute inset-0 z-[1] size-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Animated banner background"
          >
            <source src="assets/banner-compressed.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="flex items-center gap-6 px-3 pt-3 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-4 max-[480px]:px-2 max-[480px]:pt-2">
          <div className="relative grid size-[100px] shrink-0 place-items-center overflow-hidden rounded-xl bg-[#404040] max-[480px]:size-[90px] min-[640px]:size-[110px] not-dark:bg-[#e5e5e5]">
            <picture>
              <source srcSet="profile.webp" type="image/webp" />
              <img
                src="profile.jpg"
                alt="Kriday Dave"
                className="size-[88px] rounded-[10px] object-cover shadow-[0_2px_8px_rgba(0,0,0,0.2)] max-[480px]:size-[78px] min-[640px]:size-[96px]"
              />
            </picture>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              <h1 className="font-serif text-[38px] leading-[1.1] font-normal text-ink min-[640px]:text-[44px]">
                Kriday Dave
              </h1>
            </div>
            <p className="mb-0.5 min-h-6 text-[16px] text-ink-2">
              <CharReveal text="Student · Founder · Builder" />
            </p>
            <p className="text-[12px] font-semibold tracking-[0.02em] text-ink-3">
              Based in Ahmedabad, India · Working globally
            </p>
            <div className="mt-3.5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-dotted border-hair bg-surface-1 px-3.5 py-1.5 font-mono text-[12px] text-ink-2">
              <span
                className={cn("size-[7px] shrink-0 rounded-full", ist ? STATUS_DOT[ist.statusClass] : "bg-[#22c55e]")}
                aria-hidden="true"
              ></span>
              <span className="font-semibold tracking-[0.02em] text-ink">
                {ist ? ist.time : "--:--:-- IST"}
              </span>
              <span className="text-ink-3">·</span>
              <span>{ist ? ist.activity : "Loading..."}</span>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className={SECTION} id="about">
        <h2 className={SECTION_TITLE}>About</h2>
        <div
          className="flex flex-col gap-3 [&_p]:text-[17px] [&_p]:leading-[1.7] [&_p]:text-ink-2 [&_strong]:font-semibold [&_strong]:text-ink"
          data-reveal
        >
          <p>
            I build security tooling for autonomous coding agents: <strong>Blueline</strong>{" "}
            sandboxes package installs and <strong>Oot</strong> governs how multi-agent edits get
            merged. Both are open source, both are Rust.
          </p>
          <p>
            I run <strong>Epoch AI Labs</strong>, an indie lab testing how agents coordinate and
            break.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className={SECTION} id="projects">
        <h2 className={SECTION_TITLE}>Projects</h2>
        <div
          className="grid grid-cols-2 gap-px border border-dashed border-hair bg-hair max-[768px]:grid-cols-1 max-[480px]:gap-0"
          data-reveal
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} stats={stats} />
          ))}
        </div>
      </section>

      {/* Activity */}
      <section className={cn(SECTION, "flex flex-col gap-4")} id="activity">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className={cn(SECTION_TITLE, "mb-0")}>Activity</h2>
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="font-mono text-[12px] text-ink-3 [&_strong]:text-ink">
              <strong>
                {activity?.total?.lastYear != null
                  ? Number(activity.total.lastYear).toLocaleString()
                  : "--"}
              </strong>{" "}
              contributions in the last year
            </span>
            <a
              href="https://github.com/kridaydave"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11.5px] text-ink-2 underline decoration-dashed underline-offset-[3px] transition-colors hover:text-ink"
            >
              @kridaydave on GitHub ↗
            </a>
          </div>
        </div>
        <ActivityGraph data={activity} />
      </section>

      {/* Latest essay */}
      <section className={cn(SECTION, "pt-0 max-[480px]:pt-0")}>
        <div
          className="group relative overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.015)_100%)] px-[22px] py-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-[background,border-color,transform,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] hover:-translate-y-px hover:border-white/24 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.085)_0%,rgba(255,255,255,0.025)_100%)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_8px_30px_rgba(0,0,0,0.55)] not-dark:border-black/10 not-dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(245,245,245,0.6)_100%)] not-dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.06)] not-dark:before:bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.15)_50%,transparent_100%)] not-dark:hover:border-black/18 not-dark:hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(240,240,240,0.75)_100%)] not-dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.09)]"
          data-reveal
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-[3px] border border-dotted border-hair bg-surface-1 px-[7px] py-[2px] font-mono text-[11px] tracking-[0.05em] text-ink-3 uppercase">
              Latest Essay
            </span>
            <span className="font-mono text-[12px] text-ink-3">{essay.dateLabel}</span>
          </div>
          <a href={essay.href}>
            <h3 className="mb-1.5 font-serif text-2xl leading-[1.3] font-normal text-ink">
              {essay.title}
            </h3>
            <p className="mb-3 text-[14.5px] leading-[1.55] text-ink-2">{essay.desc}</p>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
              <span>Read essay</span>
              <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </a>
        </div>
      </section>

      {/* Tech stack */}
      <section className={SECTION}>
        <h2 className={SECTION_TITLE}>What I Work With</h2>
        <div className="flex flex-wrap gap-2" data-reveal>
          {TECH.map((item) => (
            <div key={item.tech} className={cn(TECH_ITEM, item.tone)}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className={cn(SECTION, "pb-8 max-[480px]:pb-8")} id="contact">
        <h2 className={SECTION_TITLE}>Contact</h2>
        <p className="mb-[22px] text-[16px] text-ink-2">
          Research ideas, open-source collaboration, or thoughtful conversations about AI are all
          welcome.
        </p>
        <div className="grid grid-cols-4 max-[768px]:grid-cols-2" data-reveal>
          {CONTACTS.map((contact) => (
            <a
              key={contact.key}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              className={CONTACT_LINK}
            >
              <div className={cn(CONTACT_ICON, contact.iconTone)}>{contact.icon}</div>
              <span
                className={cn(
                  "inline text-[14px] font-medium text-ink-2 transition-colors duration-200 min-[640px]:text-[15px]",
                  contact.labelTone
                )}
              >
                {contact.label}
              </span>
              <span className={cn(CONTACT_ARROW, contact.arrowTone)}>
                <IconExternal />
              </span>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
