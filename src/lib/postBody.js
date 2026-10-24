/**
 * Typography for rendered article bodies.
 *
 * The body is authored HTML injected with dangerouslySetInnerHTML, so the
 * descendants cannot carry their own classes. Tailwind's arbitrary variants
 * let the container style its children instead of a `.post-body` rule:
 * `[&_p]:...` targets paragraphs, `[&_ul>li::before]:...` the list bullets.
 */
export const POST_BODY = [
  "font-sans text-[17.5px] leading-[1.82] tracking-[-0.012em] text-[#ededed]",
  "antialiased [font-feature-settings:'cv02','cv03','cv04','cv11']",

  "[&_p]:mb-[22px]",

  "[&_h2]:mt-[46px] [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-[32px]",
  "[&_h2]:font-normal [&_h2]:leading-[1.25] [&_h2]:tracking-[-0.02em] [&_h2]:text-white",

  "[&_strong]:font-semibold [&_strong]:text-ink",

  "[&_code]:rounded-[3px] [&_code]:border [&_code]:border-solid [&_code]:border-hair",
  "[&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono",
  "[&_code]:text-[0.85em] [&_code]:whitespace-nowrap",

  "[&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:border",
  "[&_pre]:border-dashed [&_pre]:border-hair [&_pre]:bg-surface-1 [&_pre]:p-[18px]",

  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_pre_code]:text-[13.5px] [&_pre_code]:leading-[1.7] [&_pre_code]:whitespace-pre",
  "[&_pre_code]:text-ink",

  "[&_ul]:mb-5 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-2.5",
  "[&_ul_li]:relative [&_ul_li]:pl-[22px]",
  "[&_ul_li::before]:absolute [&_ul_li::before]:left-1 [&_ul_li::before]:content-['-']",
  "[&_ul_li::before]:text-ink-3",

  "[&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[14px]",
  "[&_th]:border [&_th]:border-dashed [&_th]:border-hair [&_th]:px-3 [&_th]:py-2",
  "[&_th]:text-left [&_th]:align-top [&_th]:font-mono [&_th]:text-[10.5px]",
  "[&_th]:font-medium [&_th]:tracking-[2px] [&_th]:uppercase [&_th]:text-ink-3",
  "[&_td]:border [&_td]:border-dashed [&_td]:border-hair [&_td]:px-3 [&_td]:py-2",
  "[&_td]:text-left [&_td]:align-top",
  "[&_td:first-child]:w-[76px] [&_td:first-child]:font-mono [&_td:first-child]:text-[12.5px]",
  "[&_td:first-child]:whitespace-nowrap [&_td:first-child]:text-ink-2",

  /* Inline link used inside post prose. */
  "[&_.post-link]:text-ink [&_.post-link]:underline [&_.post-link]:decoration-dotted",
  "[&_.post-link]:underline-offset-[3px] [&_.post-link:hover]:text-ink-2",

  /* Aside block: a dashed left rule with italic text. */
  "[&_.post-note]:my-9 [&_.post-note]:border-l [&_.post-note]:border-dashed",
  "[&_.post-note]:border-hair-strong [&_.post-note]:py-1 [&_.post-note]:pl-[22px]",
  "[&_.post-note_p]:mb-0 [&_.post-note_p]:italic [&_.post-note_p]:text-ink-2",
].join(" ");

/**
 * The copy-to-clipboard command block that ships inside post HTML.
 *
 * The markup is generated at build time, so the styles live on the container
 * as arbitrary variants rather than on the elements themselves. `.copied` is
 * toggled on the block by the click delegate in ArticlePage.
 */
export const POST_CMD = [
  "[&_.project-cmd]:my-[18px] [&_.project-cmd]:mb-6 [&_.project-cmd]:flex",
  "[&_.project-cmd]:items-center [&_.project-cmd]:justify-between [&_.project-cmd]:gap-2",
  "[&_.project-cmd]:rounded [&_.project-cmd]:border [&_.project-cmd]:border-dashed",
  "[&_.project-cmd]:border-hair [&_.project-cmd]:bg-surface-1 [&_.project-cmd]:px-4",
  "[&_.project-cmd]:py-3 [&_.project-cmd]:font-mono [&_.project-cmd]:text-[13px]",
  "[&_.project-cmd]:cursor-pointer [&_.project-cmd]:select-none",
  "[&_.project-cmd]:transition-[background,border-color] [&_.project-cmd]:duration-150",
  "[&_.project-cmd:hover]:border-hair-strong [&_.project-cmd:hover]:bg-surface-2",
  "[&_.project-cmd.copied]:border-[#22c55e]",
  "[&_.project-cmd_code]:bg-transparent [&_.project-cmd_code]:border-0 [&_.project-cmd_code]:p-0",
  "[&_.project-cmd_code]:text-[13px] [&_.project-cmd_code]:text-ink",
  "[&_.project-cmd_code]:overflow-hidden [&_.project-cmd_code]:text-ellipsis",
  "[&_.project-cmd_code]:whitespace-nowrap",

  "[&_.copy-btn]:flex [&_.copy-btn]:size-5 [&_.copy-btn]:shrink-0",
  "[&_.copy-btn]:items-center [&_.copy-btn]:justify-center [&_.copy-btn]:text-ink-3",
  "[&_.project-cmd:hover_.copy-btn]:text-ink",

  "[&_.icon-copy]:block [&_.icon-check]:hidden [&_.icon-check]:text-[#22c55e]",
  "[&_.project-cmd.copied_.icon-copy]:hidden",
  "[&_.project-cmd.copied_.icon-check]:block [&_.project-cmd.copied_.icon-check]:text-[#22c55e]",
].join(" ");

/**
 * Hover tooltip for a defined term (`<span class="term" data-term="...">`).
 * The bubble is a pseudo-element, so the whole thing is variant-driven.
 */
export const POST_TERM = [
  "[&_.term]:relative [&_.term]:cursor-help [&_.term]:border-b",
  "[&_.term]:border-dashed [&_.term]:border-hair-strong [&_.term]:outline-none",

  "[&_.term::after]:absolute [&_.term::after]:bottom-[calc(100%+10px)]",
  "[&_.term::after]:left-1/2 [&_.term::after]:z-60 [&_.term::after]:w-[260px]",
  "[&_.term::after]:max-w-[78vw] [&_.term::after]:-translate-x-1/2",
  "[&_.term::after]:rounded-[6px] [&_.term::after]:border [&_.term::after]:border-dashed",
  "[&_.term::after]:border-hair-strong [&_.term::after]:bg-background",
  "[&_.term::after]:px-3.5 [&_.term::after]:py-2.5 [&_.term::after]:text-[12.5px]",
  "[&_.term::after]:leading-[1.55] [&_.term::after]:text-left [&_.term::after]:whitespace-normal",
  "[&_.term::after]:text-ink-2 [&_.term::after]:opacity-0 [&_.term::after]:pointer-events-none",
  "[&_.term::after]:tracking-normal [&_.term::after]:not-italic",
  "[&_.term::after]:shadow-[0_10px_30px_rgba(0,0,0,0.35)] [&_.term::after]:transition-opacity",
  "[&_.term::after]:duration-150 [&_.term::after]:content-[attr(data-term)]",

  "[&_.term::before]:absolute [&_.term::before]:bottom-[calc(100%+4px)]",
  "[&_.term::before]:left-1/2 [&_.term::before]:z-60 [&_.term::before]:-translate-x-1/2",
  "[&_.term::before]:border-[6px] [&_.term::before]:border-transparent",
  "[&_.term::before]:border-t-[color:var(--border-strong)] [&_.term::before]:opacity-0",
  "[&_.term::before]:pointer-events-none [&_.term::before]:transition-opacity",
  "[&_.term::before]:duration-150",

  "[&_.term:hover::after]:opacity-100 [&_.term:focus::after]:opacity-100",
  "[&_.term:hover::before]:opacity-100 [&_.term:focus::before]:opacity-100",
].join(" ");
