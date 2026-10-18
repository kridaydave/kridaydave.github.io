import { useEffect, useState } from "react";

const DATA_KEY = "gh_contributions_kridaydave";
const TS_KEY = "gh_contributions_ts";
const DAY = 24 * 60 * 60 * 1000;

/** GitHub contribution data (24h local cache, 3.5s timeout — initActivityGraph). */
export function useActivityData() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      const ts = Number(localStorage.getItem(TS_KEY) || 0);
      if (raw && Date.now() - ts < DAY) {
        const cached = JSON.parse(raw);
        if (cached?.contributions) return cached;
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    let alive = true;
    let timedOut = null;
    (async () => {
      if (data) return; // fresh cache hit (still refetches after 24h)
      try {
        const controller = new AbortController();
        timedOut = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(
          "https://github-contributions-api.jogruber.de/v4/kridaydave?y=last",
          { signal: controller.signal }
        );
        clearTimeout(timedOut);
        if (!res.ok) return;
        const json = await res.json();
        if (!json?.contributions) return;
        try {
          localStorage.setItem(DATA_KEY, JSON.stringify(json));
          localStorage.setItem(TS_KEY, String(Date.now()));
        } catch (e) {}
        if (alive) setData(json);
      } catch (err) {}
    })();
    return () => {
      alive = false;
      if (timedOut) clearTimeout(timedOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}