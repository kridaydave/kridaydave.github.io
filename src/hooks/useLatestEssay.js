import { useEffect, useState } from "react";

const FALLBACK = {
  title: "Asur, Shaitaan, Lucifer and the em-dash",
  href: "posts/em-dashes-suck.html",
  desc: "Why em-dashes suck, how Claude and ChatGPT poisoned modern prose, and how AI slop writing broke our collective attention.",
  dateLabel: "Sep 2026",
};

/** Keeps the "Latest Essay" card in sync with /rss.xml (legacy initLatestEssay). */
export function useLatestEssay() {
  const [essay, setEssay] = useState(FALLBACK);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/rss.xml");
        if (!res.ok) return;
        const text = await res.text();
        const xml = new DOMParser().parseFromString(text, "text/xml");
        const item = xml.querySelector("channel > item");
        if (!item) return;
        const title = item.querySelector("title")?.textContent?.trim();
        const link = item.querySelector("link")?.textContent?.trim();
        const desc = item.querySelector("description")?.textContent?.trim();
        const pubDateStr = item.querySelector("pubDate")?.textContent?.trim();
        if (!title || !link) return;

        let href = link;
        try {
          const url = new URL(link, window.location.origin);
          href = url.pathname.replace(/^\//, "");
        } catch (_) {}

        let dateLabel;
        if (pubDateStr) {
          const d = new Date(pubDateStr);
          if (!isNaN(d.getTime())) {
            dateLabel = d.toLocaleString("en-US", { month: "short", year: "numeric" });
          }
        }

        if (alive) {
          setEssay({ title, href, desc: desc || FALLBACK.desc, dateLabel: dateLabel || FALLBACK.dateLabel });
        }
      } catch (_) {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  return essay;
}