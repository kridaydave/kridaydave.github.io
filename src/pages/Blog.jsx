import { useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import { POSTS } from "../content/pages.js";
import { linesFromHtml, plainFromHtml, escapeRegex } from "../lib/text.js";

const POST_LIST = [
  {
    num: "006",
    slug: "em-dashes-suck",
    href: "posts/em-dashes-suck.html",
    tagLabel: "DEV · ESSAY",
    tags: "dev",
    title: "Asur, Shaitaan, Lucifer and the em-dash",
    excerpt:
      "Why em-dashes suck, how Claude and ChatGPT poisoned modern prose, and how AI slop writing broke our collective attention.",
  },
  {
    num: "005",
    slug: "t4-cuda-update-01",
    href: "posts/t4-cuda-update-01.html",
    tagLabel: "CUDA · RESEARCH",
    tags: "cuda",
    title: "The t4, the tea and a bumble-bee",
    excerpt:
      "Five weeks of CUDA kernel research on free Colab T4s: measured wins, a falsified hypothesis, and a 0.5B model that learned to say I don't know.",
  },
  {
    num: "004",
    slug: "v5-0-0-is-live",
    href: "posts/v5-0-0-is-live.html",
    tagLabel: "DEV · RELEASE",
    tags: "dev release",
    title: "v5.0.0 is live",
    excerpt:
      "How an accidental flood of stealth Ox-Alpha tokens turned into a fat-to-fit rewrite of File-Organizer-MCP, deleting thousands of lines into v5.0.0.",
  },
  {
    num: "003",
    slug: "simplicity-is-the-new-sophistication",
    href: "posts/simplicity-is-the-new-sophistication.html",
    tagLabel: "DEV · ARCHITECTURE",
    tags: "dev architecture",
    title: "Simplicity is the new sophistication",
    excerpt:
      "How an 8GB downloads folder turned into a bloated 27-service server, and how the v5 rewrite stripped it back to raw primitives.",
  },
  {
    num: "002",
    slug: "multi-agent-git-chaos",
    href: "posts/multi-agent-git-chaos.html",
    tagLabel: "OOT · GOVERNANCE",
    tags: "oot governance",
    title: "Multi-agent coding loops will wreck your git history",
    excerpt:
      "Standard git merges are line-based and blind. When multiple agents edit one repo, you need intent locks and AST verification, not just rebase loops.",
  },
  {
    num: "001",
    slug: "blueline-v0-2-0",
    href: "posts/blueline-v0-2-0.html",
    tagLabel: "BLUELINE",
    tags: "blueline",
    title: "Your agent installs code nobody reads",
    excerpt:
      "Blueline v0.2.0 is out: sandboxed installs, delta reviews against your last approved version, and a fail-closed supply chain scanner built for the agent era.",
  },
];

const TAGS = [
  { value: "all", label: "All" },
  { value: "dev", label: "Dev" },
  { value: "release", label: "Release" },
  { value: "architecture", label: "Architecture" },
  { value: "cuda", label: "CUDA" },
  { value: "governance", label: "Governance" },
  { value: "blueline", label: "Blueline" },
];

/* Full-text search index built from the stored post bodies
   (the legacy page fetched each post document at runtime for this). */
const INDEX = Object.fromEntries(
  POST_LIST.map((item) => {
    const body = POSTS[item.slug]?.body || "";
    return [item.slug, { plain: plainFromHtml(body), lines: linesFromHtml(body) }];
  })
);

function highlight(text, tokens) {
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegex).join("|")})`, "gi");
  const parts = [];
  let last = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <mark key={m.index} className="search-highlight">
        {m[0]}
      </mark>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Port of script.js getMatchSnippet. */
function getMatchSnippet(lines, fallbackText, tokens) {
  if (!tokens.length) return fallbackText;

  let matchedLine = "";
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (tokens.some((t) => lower.includes(t))) {
      matchedLine = line;
      break;
    }
  }

  const target = matchedLine || fallbackText || "";
  if (!target) return "";

  const lower = target.toLowerCase();
  let firstIdx = -1;
  let matchLen = 0;
  for (const t of tokens) {
    const idx = lower.indexOf(t);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
      matchLen = t.length;
    }
  }

  const start = Math.max(0, firstIdx - 50);
  const end = Math.min(target.length, firstIdx + matchLen + 75);
  let snippet = target.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < target.length) snippet += "...";
  return snippet;
}

export default function Blog() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tokens = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query]
  );

  const visible = POST_LIST.map((item) => {
    const indexed = INDEX[item.slug];
    const matchesTag = tag === "all" || item.tags.includes(tag);
    const haystack = `${item.tags} ${item.title} ${item.excerpt} ${indexed.plain}`.toLowerCase();
    const matchesSearch = tokens.every((t) => haystack.includes(t));
    return { item, indexed, visible: matchesTag && matchesSearch };
  });

  const visibleCount = visible.filter((v) => v.visible).length;

  return (
    <Layout active="blog">
      <section className="section blog-section">
        <h2 className="section-title">Blog</h2>
        <p className="blog-desc">
          Long-form writing on agentic engineering, AI research, and the developer memory layer.{" "}
          <a href="/rss.xml" className="about-link" style={{ whiteSpace: "nowrap" }}>
            RSS &nearr;
          </a>
        </p>

        {/* Search & Filters */}
        <div className="content-filter-bar" id="blog-filter-bar">
          <div className="search-input-wrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              id="blog-search"
              placeholder="Search posts..."
              aria-label="Search posts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-tags-row">
            {TAGS.map((t) => (
              <button
                key={t.value}
                className={`filter-pill${tag === t.value ? " active" : ""}`}
                type="button"
                onClick={() => setTag(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="writing-list blog-list">
          {visible.map(({ item, indexed, visible: shown }) => (
            <a
              key={item.slug}
              href={item.href}
              className="writing-item"
              data-tags={item.tags}
              data-title={item.title}
              data-excerpt={item.excerpt}
              style={shown ? undefined : { display: "none" }}
            >
              <div className="writing-meta">
                <span className="writing-num">{item.num}</span>
                <span className="writing-tag">{item.tagLabel}</span>
              </div>
              <div>
                <h3 className="writing-title">{highlight(item.title, tokens)}</h3>
                <p className="writing-excerpt">
                  {highlight(getMatchSnippet(indexed.lines, item.excerpt, tokens), tokens)}
                </p>
              </div>
              <svg
                className="writing-arrow"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          ))}
        </div>

        <div
          className="empty-filter-state"
          id="blog-empty-state"
          style={{ display: visibleCount === 0 ? "block" : "none" }}
        >
          No matching posts found.
        </div>
      </section>
    </Layout>
  );
}