import Layout from "../components/Layout.jsx";
import InfoBlock from "../components/InfoBlock.jsx";
import { SECTION, SECTION_TITLE, UPDATED_LABEL_CLASS } from "../lib/styles.js";

const UPDATED_LABEL = "Last updated: September 2026";

/* The marks are dark-on-light logos, so each sits on a white chip. */
const CHIP =
  "inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px] border border-[rgba(128,128,128,0.35)] bg-white font-mono text-[7px] font-bold tracking-[0.02em] text-[#111] [&_img]:block [&_img]:size-4 [&_img]:object-contain";

const PAIR = "inline-flex items-center gap-[5px] whitespace-nowrap align-middle";

function Chip({ src, alt, letter }) {
  return (
    <span className={CHIP}>
      {src ? <img src={`assets/uses/${src}`} alt={alt} loading="lazy" /> : letter}
    </span>
  );
}

function Pair({ src, alt, letter, children }) {
  return (
    <span className={PAIR}>
      <Chip src={src} alt={alt} letter={letter} />
      {children}
    </span>
  );
}

const BLOCKS = [
  {
    title: "Editor & Terminal",
    items: (
      <>
        <li>
          <Pair src="zed.png" alt="Zed">
            Zed
          </Pair>
          ,{" "}
          <Pair src="git.png" alt="Git">
            Git
          </Pair>{" "}
          via Zed's source control,{" "}
          <Pair src="github.png" alt="GitHub">
            GitHub
          </Pair>{" "}
          for everything.
        </li>
        <li>
          <Pair src="jetbrains.png" alt="JetBrains Mono">
            JetBrains Mono
          </Pair>{" "}
          everywhere, editor and this site.
        </li>
      </>
    ),
  },
  {
    title: "Agent Stack",
    items: (
      <>
        <li>
          Building on the{" "}
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer">
            MCP
          </a>{" "}
          and A2A protocol specs.
        </li>
        <li>
          <Pair src="opencode.png" alt="Opencode">
            Opencode
          </Pair>
          ,{" "}
          <Pair src="antigravity.png" alt="Google Antigravity">
            Antigravity
          </Pair>
          , <Pair letter="O">OMP</Pair>, and{" "}
          <Pair src="cline.png" alt="Cline">
            Cline
          </Pair>{" "}
          for agentic work.
        </li>
      </>
    ),
  },
  {
    title: "This Site",
    items: (
      <>
        <li>React + Tailwind, compiled by Vite, served as static assets from a Cloudflare Worker.</li>
        <li>
          Type: Instrument Serif for headings, Inter / Geist for body, JetBrains Mono for labels
          and code.
        </li>
        <li>
          Dark / light toggle persisted in <code>localStorage</code>, RSS at{" "}
          <a href="/rss.xml">/rss.xml</a>, agent-readable index at <a href="/llms.txt">/llms.txt</a>
          .
        </li>
      </>
    ),
  },
  {
    title: "Stay Current",
    items: (
      <li>
        <Pair src="x.png" alt="X">
          X
        </Pair>{" "}
        and{" "}
        <Pair src="reddit.png" alt="Reddit">
          Reddit
        </Pair>
        .
      </li>
    ),
  },
];

export default function Uses() {
  return (
    <Layout active={null} showUses>
      <section className={SECTION}>
        <h1 className={SECTION_TITLE}>Uses</h1>
        <p className="mb-[22px] text-[16px] text-ink-2">
          The tools and stack I build with. Inspired by{" "}
          <a
            href="https://uses.tech"
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap text-ink-2 underline decoration-dashed underline-offset-[3px] transition-colors hover:text-ink"
          >
            uses.tech ↗
          </a>
        </p>
      </section>

      <section className={SECTION}>
        {BLOCKS.map((block, i) => (
          <InfoBlock
            key={block.title}
            title={block.title}
            items={block.items}
            last={i === BLOCKS.length - 1}
          />
        ))}
        <p className={UPDATED_LABEL_CLASS}>{UPDATED_LABEL}</p>
      </section>
    </Layout>
  );
}
