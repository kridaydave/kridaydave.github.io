import { BLOCK_LIST } from "../lib/styles.js";
import { cn } from "../lib/utils.js";

/**
 * One ruled band of list content, as used by the Now and Uses pages.
 * `last` draws the closing rule; every band carries its own top rule.
 */
export default function InfoBlock({ title, items, last = false }) {
  return (
    <div className={cn("border-t border-dashed border-hair py-7", last && "border-b")}>
      <p className="mb-3 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">{title}</p>
      <ul className={BLOCK_LIST}>{items}</ul>
    </div>
  );
}
