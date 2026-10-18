import { useState } from "react";
import { copyText } from "../lib/clipboard.js";

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
      className={`project-cmd${copied ? " copied" : ""}`}
      data-copy={command}
      title="Click to copy"
      onClick={onClick}
    >
      <code>{display || command}</code>
      <button className="copy-btn" type="button" aria-label="Copy command">
        <svg
          className="icon-copy"
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
          className="icon-check"
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