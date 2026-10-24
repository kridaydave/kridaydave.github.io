import { useState } from "react";
import { copyText } from "../lib/clipboard.js";
import { cn } from "../lib/utils.js";

const CMD_BOX =
  "group flex cursor-pointer select-none items-center justify-between gap-2 rounded border border-dotted border-hair bg-surface-1 py-1.5 pr-2.5 pl-2.5 font-mono text-[11.5px] text-ink-2 transition-[background,border-color,color] duration-150 hover:border-hair-strong hover:bg-surface-2 hover:text-ink";

const COPY_BTN =
  "flex size-[18px] shrink-0 items-center justify-center text-ink-3 transition-colors duration-150 group-hover:text-ink";

/** Click-to-copy project command block (port of initCopyButtons). */
export default function CopyCmd({ command, display }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (!command) return;
    await copyText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(CMD_BOX, copied && "border-[#22c55e]")}
      data-copy={command}
      title="Click to copy"
      onClick={onClick}
    >
      <code className="overflow-hidden text-ellipsis whitespace-nowrap">
        {display || command}
      </code>
      <button className={COPY_BTN} type="button" aria-label="Copy command">
        <svg
          className={cn(copied && "hidden")}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg
          className={cn("text-[#22c55e]", copied ? "block" : "hidden")}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}