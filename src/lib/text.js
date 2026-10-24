/** Strip tags/entities from a stored HTML fragment into plain searchable text. */
export function plainFromHtml(html) {
  const text = html
    .replace(/<\/(p|h2|h3|li|pre|ul|blockquote|figcaption)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeText(text).replace(/[ \t]+/g, " ").trim();
}

/** Split a fragment into paragraph-ish lines (search snippets, copy-as-markdown). */
export function linesFromHtml(html) {
  const lines = [];
  const re =
    /<(p|h2|h3|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const line = stripTags(m[2]).trim();
    if (line) lines.push(line);
  }
  return lines;
}

export function stripTags(html) {
  return decodeText(String(html).replace(/<[^>]+>/g, ""));
}

export function decodeText(s) {
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

export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}