import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Layout from "../components/Layout.jsx";
import FilterBar, { EmptyFilterState } from "../components/FilterBar.jsx";
import { POSTS } from "../content/pages.js";
import { linesFromHtml, plainFromHtml } from "../lib/text.js";
import { highlight } from "../lib/highlight.jsx";
import { SECTION, SECTION_TITLE } from "../lib/styles.js";

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

/* Rows are a dashed box; each row owns its bottom rule so the last one can
   drop it. Below 480px the meta column moves inline above the title. */
const ITEM =
  "group grid grid-cols-[120px_1fr_auto] items-center gap-4 border-b border-dashed border-hair p-4 transition-colors last:border-b-0 hover:bg-surface-1 max-[480px]:grid-cols-[1fr_auto] max-[480px]:gap-2.5";

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
      <section className={SECTION}>
        <h2 className={SECTION_TITLE}>Blog</h2>
        <p className="mb-[22px] text-[16px] text-ink-2">
          Long-form writing on agentic engineering, AI research, and the developer memory layer.{" "}
          <a
            href="/rss.xml"
            className="whitespace-nowrap text-ink-2 underline decoration-dashed underline-offset-[3px] transition-colors hover:text-ink"
          >
            RSS ↗
          </a>
        </p>

        <FilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search posts..."
          label="Search posts"
          tags={TAGS}
          tag={tag}
          onTagChange={setTag}
        />

        <div className="border border-dashed border-hair" data-reveal>
          {visible.map(({ item, indexed, visible: shown }) => (
            <a
              key={item.slug}
              href={item.href}
              className={ITEM}
              data-tags={item.tags}
              data-title={item.title}
              data-excerpt={item.excerpt}
              style={shown ? undefined : { display: "none" }}
            >
              <div className="flex flex-col gap-1.5 max-[480px]:flex-row max-[480px]:items-center max-[480px]:justify-between">
                <span className="font-mono text-[12px] tracking-[0.1em] text-ink-3">{item.num}</span>
                <span className="max-w-full self-start overflow-hidden rounded-[3px] border border-dotted border-hair bg-surface-1 px-[9px] py-[3px] font-mono text-[11px] text-ellipsis whitespace-nowrap text-ink-3">
                  {item.tagLabel}
                </span>
              </div>
              <div>
                <h3 className="mb-[5px] text-[18px] font-semibold text-ink transition-colors group-hover:text-ink-2">
                  {highlight(item.title, tokens)}
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-2 max-[480px]:text-[13px]">
                  {highlight(getMatchSnippet(indexed.lines, item.excerpt, tokens), tokens)}
                </p>
              </div>
              <ArrowUpRight
                className="shrink-0 text-ink-3 transition-[transform,color] duration-200 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-ink max-[480px]:col-start-2 max-[480px]:[grid-row:1/span_2]"
                size={18}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>

        {visibleCount === 0 && <EmptyFilterState>No matching posts found.</EmptyFilterState>}
      </section>
    </Layout>
  );
}
