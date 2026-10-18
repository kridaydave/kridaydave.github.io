/**
 * One-time migration: converts the legacy static site in public/ into
 *  1) Vite entry HTML files at the project root (same public URLs as before),
 *     keeping each page's <head> (title, OG tags, JSON-LD, fonts, theme
 *     bootstrap) minus the old stylesheet link, plus the Geist font that the
 *     old site.css @import used to load, and
 *  2) src/content/pages.js with post/case-study metadata + body HTML fragments.
 * Then removes the superseded legacy files from public/.
 * Run: node scripts/migrate.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (rel, content) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

const ENTRIES = {
  index: "public/index.html",
  "404": "public/404.html",
  blog: "public/blog.html",
  now: "public/now.html",
  rants: "public/rants.html",
  favorites: "public/favorites.html",
  uses: "public/uses.html",
};

const pages = Object.entries(ENTRIES).map(([out]) => `${out}.html`);
const posts = fs
  .readdirSync(path.join(root, "public/posts"))
  .filter((f) => f.endsWith(".html"))
  .map((f) => f.replace(/\.html$/, ""));
const projects = fs
  .readdirSync(path.join(root, "public/projects"))
  .filter((f) => f.endsWith(".html"))
  .map((f) => f.replace(/\.html$/, ""));

/* ---------- entry HTML generation ---------- */

function toEntry(html) {
  return (
    html
      // drop the old hand-rolled stylesheet link
      .replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)?styles\.css">/g, "")
      // site.css used to @import Geist; entries load it alongside other fonts
      .replace(
        "family=JetBrains+Mono:wght@400;500;700",
        "family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700"
      )
      // replace the whole body: React mounts here
      .replace(
        /<body[^>]*>[\s\S]*<\/body>/,
        `<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.jsx"></script>\n</body>\n`
      )
  );
}

for (const [out, src] of Object.entries(ENTRIES)) {
  write(`${out}.html`, toEntry(read(src)));
}
for (const slug of posts) write(`posts/${slug}.html`, toEntry(read(`public/posts/${slug}.html`)));
for (const slug of projects)
  write(`projects/${slug}.html`, toEntry(read(`public/projects/${slug}.html`)));

/* ---------- content extraction ---------- */

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&larr;/g, "\u2190")
    .replace(/&nearr;/g, "\u2197");
}

function grab(re, src) {
  const m = src.match(re);
  return m ? decode(m[1].trim()) : null;
}

/** Slice the inner HTML of a <div> starting at `openTag`, depth-balanced. */
function sliceDiv(html, openTag) {
  const start = html.indexOf(openTag);
  if (start < 0) return null;
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(start + openTag.length, m.index);
  }
  return null;
}

function abs(rel) {
  if (!rel) return rel;
  return rel.replace(/^\.\.\//, "/");
}

function extractPost(slug) {
  const html = read(`public/posts/${slug}.html`);
  return {
    slug,
    title: grab(/<h1 class="post-title">([\s\S]*?)<\/h1>/, html),
    tag: grab(/<span class="post-tag">([\s\S]*?)<\/span>/, html),
    date: grab(/<span class="post-date">([\s\S]*?)<\/span>/, html),
    desc: grab(/<meta name="description" content="([^"]*)">/, html),
    withProgress: html.includes("reading-progress-bar"),
    withCopyMarkdown: html.includes('data-action="copy-markdown"'),
    backHref: abs(grab(/<a href="([^"]*)" class="floating-back-btn"/, html)),
    backLabel: grab(
      /floating-back-btn[\s\S]*?<\/span>\s*<span>([^<]*)<\/span>/,
      html
    ),
    body: sliceDiv(html, '<div class="post-body">'),
  };
}

function extractProject(slug) {
  const html = read(`public/projects/${slug}.html`);
  return {
    slug,
    title: grab(/<h1 class="post-title">([\s\S]*?)<\/h1>/, html),
    tag: grab(/<span class="post-tag">([\s\S]*?)<\/span>/, html),
    date: grab(/<span class="post-date">([\s\S]*?)<\/span>/, html),
    desc: grab(/<meta name="description" content="([^"]*)">/, html),
    github: grab(/<a class="post-action-btn" href="(https:\/\/github\.com[^"]+)"/, html),
    withProgress: html.includes("reading-progress-bar"),
    withCopyMarkdown: html.includes('data-action="copy-markdown"'),
    backHref: abs(grab(/<a href="([^"]*)" class="floating-back-btn"/, html)),
    backLabel: grab(
      /floating-back-btn[\s\S]*?<\/span>\s*<span>([^<]*)<\/span>/,
      html
    ),
    body: sliceDiv(html, '<div class="post-body">'),
  };
};

const POSTS = {};
for (const slug of posts) {
  POSTS[slug] = extractPost(slug);
  if (!POSTS[slug].body) throw new Error(`no body extracted for post ${slug}`);
}
const PROJECTS = {};
for (const slug of projects) {
  PROJECTS[slug] = extractProject(slug);
  if (!PROJECTS[slug].body) throw new Error(`no body extracted for project ${slug}`);
}

write(
  "src/content/pages.js",
  `// Generated by scripts/migrate.mjs from the legacy static site.\n` +
    `export const POSTS = ${JSON.stringify(POSTS, null, 2)};\n\n` +
    `export const PROJECTS = ${JSON.stringify(PROJECTS, null, 2)};\n`
);

console.log(
  `entries: ${pages.length + posts.length + projects.length}, posts: ${posts.length}, projects: ${projects.length}`
);

/* ---------- remove superseded legacy files ---------- */

const remove = [
  ...pages.map((f) => path.join(root, "public", f)),
  ...posts.map((f) => path.join(root, "public", "posts", `${f}.html`)),
  ...projects.map((f) => path.join(root, "public", "projects", `${f}.html`)),
  path.join(root, "public", "script.js"),
];
for (const f of remove) if (fs.existsSync(f)) fs.rmSync(f);
console.log(`removed ${remove.length} legacy files from public/`);