import { Search } from "lucide-react";
import { cn } from "../lib/utils.js";

const PILL =
  "rounded-full border px-3 py-[5px] font-mono text-[11px] tracking-[0.05em] uppercase transition-all duration-200";
const PILL_OFF = "border-hair bg-transparent text-ink-3 hover:border-ink-2 hover:text-ink";
const PILL_ON = "border-ink bg-ink font-semibold text-[var(--bg)]";

/**
 * Search box plus tag pills, shared by the Blog and Rants indexes.
 * Filtering happens in the parent; this only renders the controls.
 */
export default function FilterBar({
  query,
  onQueryChange,
  placeholder,
  label,
  tags,
  tag,
  onTagChange,
}) {
  return (
    <div className="mb-7 flex flex-col gap-3.5 border-b border-dashed border-hair pb-5">
      <div className="relative w-full">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3"
          aria-hidden="true"
        />
        <input
          type="text"
          className="w-full rounded border border-dotted border-hair bg-surface-1 py-2.5 pr-3.5 pl-10 font-mono text-[13px] leading-[17px] text-ink transition-[border-color,background] duration-200 placeholder:text-ink-3 focus:border-ink-2 focus:bg-surface-2 focus:outline-none"
          placeholder={placeholder}
          aria-label={label}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((entry) => (
          <button
            key={entry.value}
            type="button"
            className={cn(PILL, tag === entry.value ? PILL_ON : PILL_OFF)}
            onClick={() => onTagChange(entry.value)}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** The "nothing matched" line both indexes show under the list. */
export function EmptyFilterState({ children }) {
  return <div className="py-8 text-center font-mono text-[13px] text-ink-3">{children}</div>;
}
