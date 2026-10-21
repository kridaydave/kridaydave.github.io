/**
 * Shared utility strings for primitives that appear on nearly every page.
 * Tailwind would otherwise have the same 40-character string copy-pasted in
 * twenty files, and a padding change would mean twenty edits.
 */

/** A page band: dashed rule on top, generous padding, nothing else. */
export const SECTION =
  "border-t border-dashed border-hair px-4 py-6 max-[480px]:px-3 max-[480px]:py-5";

/** The serif page/section heading. */
export const SECTION_TITLE =
  "mb-[18px] font-serif text-[36px] font-normal text-ink";

/**
 * The band an article sits in: the same top rule as SECTION, but with the
 * extra headroom that clears the fixed navbar and the deep bottom padding
 * that closes a long read. Port of the legacy `.section` + `.post-section`
 * pair.
 */
export const ARTICLE_SECTION =
  "border-t border-dashed border-hair px-4 pt-[140px] pb-20 max-[480px]:px-3";

/**
 * The dotted list used by the Now and Uses pages. The bullet is a pseudo
 * element rather than `list-disc` because the original sits 11px from the top
 * at 5px across, which no marker box reproduces.
 */
export const BLOCK_LIST =
  "text-base leading-[1.7] text-ink-2 [&_li]:relative [&_li]:mb-1.5 [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:top-[11px] [&_li]:before:left-0 [&_li]:before:size-[5px] [&_li]:before:rounded-full [&_li]:before:bg-ink-3 [&_a]:text-ink [&_a]:underline [&_a]:decoration-hair [&_a]:underline-offset-[3px] [&_a:hover]:decoration-ink";

/** Mono caption under a block list. */
export const UPDATED_LABEL_CLASS =
  "pt-6 text-center font-mono text-[11px] tracking-[0.05em] text-ink-3";
