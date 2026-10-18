import { useEffect, useState } from "react";

const CACHE_KEY = "gh_stats_v2";

/**
 * Live GitHub stars/forks/releases via the Worker's /api/github-stats proxy,
 * cached in sessionStorage like the legacy script.js did.
 */
export function useGithubStats() {
  const [stats, setStats] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    let alive = true;
    if (stats) return; // session cache hit: still refetch? legacy did not refetch per session
    (async () => {
      try {
        const res = await fetch("/api/github-stats");
        if (!res.ok) return;
        const data = await res.json();
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {}
        if (alive) setStats(data);
      } catch (e) {}
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stats;
}