import { useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import FilterBar, { EmptyFilterState } from "../components/FilterBar.jsx";
import { highlight } from "../lib/highlight.jsx";
import { stripTags } from "../lib/text.js";
import { SECTION, SECTION_TITLE } from "../lib/styles.js";

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
      'Why do models do it? Cowardice. An em-dash lets an LLM bolt a hedge clause onto the end of an assertion without committing to a sentence structure or having an actual opinion. Add in negative parallelisms, artificial triads, and jargon words like \'substrate\' and \'tapestry\', and human writing has plunged through Dante\'s seven gates of hell straight into Satan\'s private holding pen. End the sentence with a period. Read the <a href="posts/em-dashes-suck.html" class="text-ink underline decoration-dotted underline-offset-[3px] transition-colors hover:text-ink-2">full essay</a>.',
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

const CARD =
  "flex flex-col gap-3 rounded-[6px] border border-dotted border-hair bg-surface-1 p-6 transition-[background,border-color] duration-200 hover:border-hair-strong hover:bg-surface-2";

/* Paragraphs in a rant arrive as HTML strings, so their spacing is applied
   from the container. */
const BODY = "text-[14.5px] leading-[1.65] text-ink-2 [&_p]:mb-2.5 [&_p:last-child]:mb-0";

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
      <section className={SECTION}>
        <h1 className={SECTION_TITLE}>Rants</h1>
        <p className="mb-6 text-[16px] text-ink-2">
          Quick, unfiltered thoughts on developer tooling, frameworks, and things that bother me in
          tech.
        </p>

        <FilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search rants..."
          label="Search rants"
          tags={TAGS}
          tag={tag}
          onTagChange={setTag}
        />

        <div className="flex flex-col gap-4" data-reveal>
          {visible.map(({ rant, plainParas, visible: shown }) => (
            <article
              key={rant.key}
              className={CARD}
              style={shown ? undefined : { display: "none" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-[3px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] px-2 py-[3px] font-mono text-[11px] tracking-[0.08em] text-[#ef4444] uppercase">
                  {rant.tag}
                </span>
                <span className="font-mono text-[11.5px] text-ink-3">{rant.date}</span>
              </div>
              <h2 className="font-serif text-2xl leading-[1.2] font-normal text-ink">
                {highlight(rant.title, tokens)}
              </h2>
              <div className={BODY}>
                {rant.paras.map((para, i) => (
                  <p key={i}>
                    {searching ? (
                      highlight(plainParas[i], tokens)
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: para }} />
                    )}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        {visibleCount === 0 && <EmptyFilterState>No matching rants found.</EmptyFilterState>}
      </section>
    </Layout>
  );
}
