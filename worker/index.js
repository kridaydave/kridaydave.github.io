const OG_POSTS = {
  "em-dashes-suck": {
    tag: "DEV · ESSAY",
    title: "Asur, Shaitaan, Lucifer and the em-dash",
    desc: "Why em-dashes suck, how models fell in love with them, and how AI slop broke online writing.",
  },
  "t4-cuda-update-01": {
    tag: "CUDA · RESEARCH",
    title: "The t4, the tea and a bumble-bee",
    desc: "Measured kernels, a dead hypothesis, and a 0.5B model that learned to say I don't know. All on free Colab T4s.",
  },
  "v5-0-0-is-live": {
    tag: "DEV · RELEASE",
    title: "v5.0.0 is live",
    desc: "How a flood of stealth Ox-Alpha tokens turned into a fat-to-fit rewrite of File-Organizer-MCP.",
  },
  "simplicity-is-the-new-sophistication": {
    tag: "DEV · ARCHITECTURE",
    title: "Simplicity is the new sophistication",
    desc: "How an 8GB downloads folder became a 35k-line MCP server and how v5 stripped it back to primitives.",
  },
  "multi-agent-git-chaos": {
    tag: "OOT · GOVERNANCE",
    title: "Multi-agent coding loops will wreck your git history",
    desc: "Line-based merges are blind. You need intent locks and AST verification when agents share a repo.",
  },
  "blueline-v0-2-0": {
    tag: "BLUELINE · V0.2.0",
    title: "Your agent installs code nobody reads",
    desc: "Sandboxed installs, delta reviews, and a fail-closed scanner built for the agent era.",
  },
};

const OG_PAGES = {
  "home": { tag: "PORTFOLIO", title: "Kriday Dave", desc: "Building AI systems, developer tools, and Epoch AI Labs." },
  "blog": { tag: "WRITING", title: "Blog · Kriday Dave", desc: "Long-form writing on agentic engineering and AI research." },
  "work": { tag: "LAB NOTES", title: "Work & Lab Notes", desc: "Engineering notes and architecture decisions from the repos." },
  "rants": { tag: "RANTS", title: "Rants · Kriday Dave", desc: "Unfiltered dev takes and engineering gripes." },
  "favorites": { tag: "FAVORITES", title: "Favorites · Kriday Dave", desc: "Video games I keep coming back to." },
  "uses": { tag: "USES", title: "Uses · Kriday Dave", desc: "Tools, stack, and setup I use to build." },
};

const OG_PROJECTS = {
  "projects/blueline": {
    tag: "CASE STUDY · BLUELINE",
    title: "Approve the change, not the download",
    desc: "Sandboxed installs, delta reviews against verified baselines, and a fail-closed supply chain scanner in Rust.",
  },
  "projects/oot": {
    tag: "CASE STUDY · OOT",
    title: "A court for code",
    desc: "Intent locks, visibility policies, and semantic merge verdicts for multi-agent repos.",
  },
  "projects/file-organizer-mcp": {
    tag: "CASE STUDY · MCP",
    title: "One call instead of twenty",
    desc: "Atomic organize_files() with dry-run gates, rollback, and 8-layer path validation for LLM agents.",
  },
};

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + " " + w : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function ogSvg({ tag, title, desc }) {
  const titleLines = wrapText(title, 28);
  const descLines = wrapText(desc, 52);
  const titleTspans = titleLines.map((l, i) => `<tspan x="64" dy="${i === 0 ? 0 : 54}">${esc(l)}</tspan>`).join("");
  const descTspans = descLines.map((l, i) => `<tspan x="64" dy="${i === 0 ? 0 : 22}">${esc(l)}</tspan>`).join("");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" role="img">
  <rect width="1200" height="630" fill="#000000"/>
  <!-- dashed blueprint grid -->
  <g stroke="#2a2a2a" stroke-width="1" stroke-dasharray="10 10" opacity="0.7">
    <line x1="0" y1="96" x2="1200" y2="96"/><line x1="0" y1="220" x2="1200" y2="220"/><line x1="0" y1="440" x2="1200" y2="440"/>
    <line x1="80" y1="0" x2="80" y2="630"/><line x1="1120" y1="0" x2="1120" y2="630"/>
  </g>
  <g stroke="#333" stroke-width="1" stroke-dasharray="6 8" opacity="0.4">
    <rect x="80" y="48" width="1040" height="534" fill="none"/>
  </g>
  <!-- top bar -->
  <text x="64" y="42" font-family="monospace" font-size="12" letter-spacing="3" fill="#888">KRIDAYDAVE.COM — EST 2025</text>
  <!-- tag pill -->
  <g>
    <rect x="64" y="112" width="${tag.length * 7 + 24}" height="26" rx="4" fill="none" stroke="#3a3a3a" stroke-dasharray="4 4"/>
    <text x="76" y="130" font-family="monospace" font-size="11" letter-spacing="2" fill="#aaa">${esc(tag)}</text>
  </g>
  <!-- title -->
  <text x="64" y="230" font-family="Georgia, serif" font-size="52" font-weight="400" fill="#ffffff" letter-spacing="-1">${titleTspans}</text>
  <!-- desc -->
  <text x="64" y="410" font-family="monospace" font-size="16" fill="#9a9a9a" letter-spacing="0.2">${descTspans}</text>
  <!-- bottom -->
  <text x="64" y="570" font-family="monospace" font-size="11" letter-spacing="2" fill="#666">Kriday Dave — Student · Founder · Builder</text>
  <text x="980" y="570" font-family="monospace" font-size="11" letter-spacing="2" fill="#444">kridaydave.com</text>
</svg>`;
}

function handleOg(url) {
  const slug = url.pathname.replace(/^\/og\//, "").replace(/\.(svg|png|jpg)$/, "");
  let data = OG_POSTS[slug] || OG_PAGES[slug] || OG_PROJECTS[slug];
  if (!data && slug === "og-card") data = OG_PAGES["home"];
  if (!data) return null;
  const svg = ogSvg(data);
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

const TRACKED_REPOS = [
  "Epoch-AI-Lab/blueline",
  "Epoch-AI-Lab/oot",
  "kridaydave/File-Organizer-MCP",
];

async function handleGithubStats(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const results = {};
  await Promise.all(
    TRACKED_REPOS.map(async (repo) => {
      try {
        const repoRes = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: {
            "User-Agent": "KridayDave-Portfolio",
            "Accept": "application/vnd.github.v3+json",
          },
          cf: { cacheTtl: 3600, cacheEverything: true },
        });

        let stars = null;
        let forks = null;
        if (repoRes.ok) {
          const data = await repoRes.json();
          stars = data.stargazers_count;
          forks = data.forks_count;
        }

        let release = null;
        let releaseUrl = null;
        try {
          const relRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
            headers: {
              "User-Agent": "KridayDave-Portfolio",
              "Accept": "application/vnd.github.v3+json",
            },
            cf: { cacheTtl: 3600, cacheEverything: true },
          });
          if (relRes.ok) {
            const relData = await relRes.json();
            release = relData.tag_name || null;
            releaseUrl = relData.html_url || null;
          }
        } catch (_) {}

        results[repo] = { stars, forks, release, releaseUrl };
      } catch (_) {
        results[repo] = { stars: null, release: null, error: true };
      }
    })
  );

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Dynamic OG handler
    if (url.pathname.startsWith("/og/")) {
      const res = handleOg(url);
      if (res) return res;
    }

    // GitHub stats proxy with edge caching
    if (url.pathname === "/api/github-stats") {
      return handleGithubStats(request);
    }

    // Serve RSS with correct content-type
    if (url.pathname === "/rss.xml") {
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set("Content-Type", "application/rss+xml; charset=utf-8");
      headers.set("Cache-Control", "public, max-age=3600");
      return new Response(res.body, { status: res.status, headers });
    }

    const response = await env.ASSETS.fetch(request);
    
    if (response.status === 404) {
      const notFoundUrl = new URL("/404.html", request.url);
      const notFoundRes = await env.ASSETS.fetch(notFoundUrl);
      return new Response(notFoundRes.body, {
        status: 404,
        headers: notFoundRes.headers,
      });
    }

    const newHeaders = new Headers(response.headers);
    const pathname = url.pathname;

    // Cache static assets (CSS, JS, images, fonts, icons) with stale-while-revalidate
    if (pathname.match(/\.(css|js|svg|png|jpg|jpeg|webp|woff2?|ico|xml|txt)$/i)) {
      newHeaders.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    } else {
      // HTML pages: fast must-revalidate so updates reflect immediately while edge delivers fast
      newHeaders.set("Cache-Control", "public, max-age=0, must-revalidate");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};

