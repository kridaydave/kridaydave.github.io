import { escapeRegex } from "./text.js";

/**
 * A search hit inside a result. Values are written as raw rgba because the
 * mark sits on both the black page and the surface-1 card, and the color-mix
 * form Tailwind produces for `bg-white/22` drifts enough to notice beside the
 * 1.5px underline.
 */
const HIGHLIGHT =
  "rounded-[3px] px-1 font-semibold text-white [border-bottom:1.5px_solid_rgba(255,255,255,0.85)] [background-color:rgba(255,255,255,0.22)] not-dark:text-black not-dark:[border-bottom:1.5px_solid_rgba(0,0,0,0.85)] not-dark:[background-color:rgba(0,0,0,0.12)]";

/** Wrap every occurrence of the search tokens in a highlight mark. */
export function highlight(text, tokens) {
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegex).join("|")})`, "gi");
  const parts = [];
  let last = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <mark key={m.index} className={HIGHLIGHT}>
        {m[0]}
      </mark>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
