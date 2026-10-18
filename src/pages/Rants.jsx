import { useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import { escapeRegex, stripTags } from "../lib/text.js";

const RANTS = [
  {
    key: "em-dashes",
    tags: "dev",
    tag: "DEV",
    date: "Sep 19, 2026",
    title: "Em-dashes fucking suck and AI writing broke the internet",
    excerpt:
      "Open any tech blog today, hit Ctrl+F, and count sixty em-dashes. Claude and ChatGPT turned an obscure punctuation mark into the undisputed calling card of synthetic slop.",
    paras: [
      'Open any tech blog today, hit <code>Ctrl+F</code>, and count sixty em-dashes. Claude and ChatGPT turned a punctuation mark into the undisputed calling card of synthetic slop.',
      'Why do models do it? Cowardice. An em-dash lets an LLM bolt a hedge clause onto the end of an assertion without committing to a sentence structure or having an actual opinion. Add in negative parallelisms, artificial triads, and jargon words like \'substrate\' and \'tapestry\', and human writing has plunged through Dante\'s seven gates of hell straight into Satan\'s private holding pen. End the sentence with a period. Read the <a href="posts/em-dashes-suck.html" class="post-link">full essay</a>.',
    ],
  },
  {
    key: "mortal-kombat",
    tags: "gaming",
    tag: "GAMING",
    date: "Aug 30, 2026",
    title: "Mortal Kombat changes everyone's fucking face every single game",
    excerpt:
      "Most franchises retcon lore or rewrite backstories when writers get lazy. Mortal Kombat does that too, but what drives me nuts is how they rebuild every character's literal face from scratch every fucking game.",
    paras: [
      "Most franchises retcon lore or rewrite backstories when writers get lazy. Mortal Kombat does that too, but what drives me nuts is how they rebuild every character's literal face from scratch every fucking game.",
      "Look at Liu Kang across MK9, MKX, MK11, and MK1. None of these motherfuckers look remotely related to each other. It is not an engine upgrade thing. They straight up hire a completely new face model, swap their entire facial structure, and act like we will not notice. You boot up a new MK and have to ask yourself who the fuck you are even playing as. Why? Just keep a face consistent for more than one release.",
    ],
  },
  {
    key: "smoke-tests",
    tags: "dev",
    tag: "DEV",
    date: "Aug 30, 2026",
    title: "Stop writing self-glazing smoke tests that just stroke your CI",
    excerpt:
      "Nothing is more useless than a test suite filled with fifty hollow smoke tests written purely to keep GitHub Actions green.",
    paras: [
      "Nothing is more useless than a test suite filled with fifty hollow smoke tests written purely to keep GitHub Actions green.",
      'Mocking five internal functions so a method returns <code>true</code>, and then asserting <code>expect(result).toBe(true)</code> does not test your software. It tests whether your mock syntax works. When production breaks, these fake tests still pass because they never touched a real database or real network boundary in their life. Write tests that actually stress edge cases and break things, or delete the bloat. Endless self-glazing tests do nothing except waste CI minutes and give you fake confidence.',
    ],
  },
];

const TAGS = [
  { value: "all", label: "All" },
  { value: "gaming", label: "Gaming" },
  { value: "dev", label: "Dev" },
];

function highlightText(text, tokens) {
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

export default function Rants() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tokens = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query]
  );
  const searching = tokens.length > 0;

  const visible = RANTS.map((rant) => {
    const plainParas = rant.paras.map(stripTags);
    const haystack = `${rant.tags} ${rant.title} ${rant.excerpt} ${plainParas.join(" ")}`.toLowerCase();
    const matchesTag = tag === "all" || rant.tags.includes(tag);
    const matchesSearch = tokens.every((t) => haystack.includes(t));
    return { rant, plainParas, visible: matchesTag && matchesSearch };
  });

  const visibleCount = visible.filter((v) => v.visible).length;

  return (
    <Layout active="rants">
      <section className="section rants-section">
        <h1 className="section-title">Rants</h1>
        <p className="rants-desc">
          Quick, unfiltered thoughts on developer tooling, frameworks, and things that bother me in
          tech.
        </p>

        {/* Search & Filters */}
        <div className="content-filter-bar" id="rants-filter-bar">
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
              id="rants-search"
              placeholder="Search rants..."
              aria-label="Search rants"
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

        <div className="rants-list">
          {visible.map(({ rant, plainParas, visible: shown }) => (
            <article
              key={rant.key}
              className="rant-card"
              data-tags={rant.tags}
              data-title={rant.title}
              data-excerpt={rant.excerpt}
              style={shown ? undefined : { display: "none" }}
            >
              <div className="rant-header">
                <span className="rant-tag">{rant.tag}</span>
                <span className="rant-date">{rant.date}</span>
              </div>
              <h2 className="rant-title">{highlightText(rant.title, tokens)}</h2>
              <div className="rant-body">
                {rant.paras.map((para, i) => (
                  <p key={i}>
                    {searching ? (
                      highlightText(plainParas[i], tokens)
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: para }} />
                    )}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div
          className="empty-filter-state"
          id="rants-empty-state"
          style={{ display: visibleCount === 0 ? "block" : "none" }}
        >
          No matching rants found.
        </div>
      </section>
    </Layout>
  );
}