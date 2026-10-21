/**
 * Dot colour and glow per routine slot. The clock hook reports a slot name,
 * not a colour, so the palette lives here for the two places that draw it.
 */
export const STATUS_DOT = {
  "status-sleep": "bg-[#64748b] shadow-[0_0_8px_rgba(100,116,139,0.5)]",
  "status-class": "bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)]",
  "status-study": "bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.6)]",
  "status-code": "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]",
  "status-break": "bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.6)]",
};
