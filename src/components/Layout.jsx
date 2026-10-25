import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "../lib/utils";
import useScrollReveal from "../hooks/useScrollReveal.js";
import ReadingProgress from "./ReadingProgress";

const NAV_LINK =
  "rounded-full px-3.5 py-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink hover:bg-white/8 not-dark:hover:bg-black/6";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/index.html" },
  { key: "now", label: "Now", href: "/now.html" },
  { key: "blog", label: "Blog", href: "/blog.html" },
  { key: "rants", label: "Rants", href: "/rants.html" },
  { key: "favorites", label: "Favorites", href: "/favorites.html" },
];

/**
 * Pill in the top-left gutter: an arrow that flips to an X on hover. Stays put
 * under 640px, where it hugs the viewport edge instead of the column.
 */
function BackPill({ href, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="group fixed top-[60px] left-[max(14px,calc(50%-400px+16px))] z-[9999] inline-flex items-center gap-2 rounded-full border border-white/22 bg-[rgba(14,14,14,0.85)] px-3 py-1.5 font-mono text-xs tracking-[0.05em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl backdrop-saturate-[180%] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:border-sky-400/70 hover:bg-[rgba(26,26,26,0.95)] hover:text-sky-400 hover:shadow-[0_6px_24px_rgba(0,0,0,0.8),0_0_16px_rgba(56,189,248,0.3),inset_0_1px_1px_rgba(255,255,255,0.6)] max-[640px]:top-14 max-[640px]:left-3.5 max-[640px]:px-3 max-[640px]:py-1 max-[640px]:text-[11px] not-dark:bg-[rgba(255,255,255,0.9)] not-dark:text-[#111111] not-dark:border-black/20 not-dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)]"
    >
      <span className="relative inline-flex size-[13px] items-center justify-center" aria-hidden="true">
        <ArrowLeft className="absolute inset-0 scale-100 rotate-0 opacity-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-50 group-hover:rotate-90 group-hover:opacity-0" />
        <X className="absolute inset-0 scale-50 -rotate-90 text-sky-400 opacity-0 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100" />
      </span>
      <span>{label}</span>
    </a>
  );
}

/**
 * Two dashed rules framing the 800px column. The max() collapses them to the
 * viewport edge on narrow screens, which is what the old 768px media query
 * was doing by hand.
 */
function FrameLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
      <div className="absolute inset-y-0 left-[max(0px,calc(50%-400px))] w-px border-l border-dashed border-hair" />
      <div className="absolute inset-y-0 right-[max(0px,calc(50%-400px))] w-px border-r border-dashed border-hair" />
    </div>
  );
}

function ThemeToggle({ onToggle }) {
  return (
    <button
      className="grid size-9 place-items-center rounded-md text-ink transition-colors hover:bg-surface-2"
      type="button"
      aria-label="Toggle theme"
      onClick={onToggle}
    >
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="block size-[18px] dark:hidden" />
    </button>
  );
}

/**
 * Persistent viewport-edge progressive blur: content dissolves as it
 * leaves at the top of the screen and blurs as it enters at the bottom,
 * on every page. The site's own --background tints the top feather so
 * it reads in both themes.
 */
function EdgeBlurs() {
  return (
    <>
      <div className="edge-blur top" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="edge-blur bottom" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </>
  );
}

function Navbar({ active, homeMode, spyHash }) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {}
    setDark(next);
  };

  // A plain page highlights its own nav item. On the home page the scroll spy
  // takes over, because the hash links point at sections within one document.
  // The nav only carries one hash link (#top), so a spy hit on #about or
  // #contact matches nothing; fall back to Home rather than dropping the dot.
  const links = NAV_ITEMS.map((item) => {
    const href = homeMode && item.key === "home" ? "#top" : item.href;
    const isActive = homeMode ? spyHash === href || href === "#top" : active === item.key;
    return (
      <a
        key={item.key}
        href={href}
        className={cn(
          NAV_LINK,
          isActive && "bg-white/10 text-ink not-dark:bg-black/8"
        )}
      >
        {item.label}
      </a>
    );
  });

  return (
    <header
      className="fixed top-[14px] left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-white/25 bg-[rgba(10,10,14,0.74)] px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-[28px] backdrop-saturate-150 animate-[slideDown_0.5s_cubic-bezier(0.2,0.8,0.2,1)_both] not-dark:border-black/15 not-dark:bg-[rgba(255,255,255,0.85)] not-dark:shadow-[0_12px_36px_rgba(0,0,0,0.16)]"
    >
      <a
        href={homeMode ? "#top" : "/index.html"}
        className="mr-1 border-r border-white/15 px-3 py-1 font-serif text-[17px] italic leading-none text-ink not-dark:border-black/15"
      >
        Kriday
      </a>
      <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
        {links}
      </nav>
      <div className="flex items-center gap-1">
        <ThemeToggle onToggle={toggleTheme} />
        <button
          className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-white/8 not-dark:hover:bg-black/6 md:hidden"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Menu />
        </button>
      </div>
      <nav
        className={cn(
          "absolute right-0 top-[calc(100%+8px)] flex-col items-stretch gap-1 rounded-2xl border border-white/25 bg-[rgba(10,10,14,0.9)] p-3 backdrop-blur-[28px] not-dark:border-black/15 not-dark:bg-[rgba(255,255,255,0.94)] md:hidden",
          open ? "flex" : "hidden"
        )}
        aria-label="Mobile navigation"
        onClick={() => setOpen(false)}
      >
        {links}
      </nav>
    </header>
  );
}

function Footer({ showUses }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[2] mx-auto w-full max-w-column border-x border-t border-dashed border-hair bg-column px-4 pt-6 pb-8 text-center text-[13px] text-ink-3 backdrop-blur-[14px] [&_p+p]:mt-1 [&_strong]:font-semibold [&_strong]:text-ink-2">
      <p>
        Designed &amp; Developed by <strong>Kriday Dave</strong>
      </p>
      {showUses && (
        <p>
          <a
            href="/uses.html"
            className="text-ink-2 underline decoration-dashed underline-offset-[3px] transition-colors hover:text-ink"
          >
            Uses
          </a>
        </p>
      )}
      <p>
        &copy; <span id="year">{year}</span> All rights reserved.
      </p>
    </footer>
  );
}

/* --- Instant prefetch on hover / touch (port of initPrefetch) --- */
function initPrefetch() {
  const prefetched = new Set();

  function prefetchUrl(url) {
    if (!url || prefetched.has(url)) return;
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin) return;
      if (parsed.pathname === window.location.pathname) return;
      prefetched.add(parsed.href);
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = parsed.href;
      link.as = "document";
      document.head.appendChild(link);
    } catch (e) {}
  }

  const onEnter = (e) => {
    const anchor = e.target.closest && e.target.closest("a");
    if (anchor && anchor.href && !anchor.target) prefetchUrl(anchor.href);
  };
  document.addEventListener("pointerenter", onEnter, { passive: true, capture: true });
  document.addEventListener("touchstart", onEnter, { passive: true, capture: true });
  return () => {
    document.removeEventListener("pointerenter", onEnter, { capture: true });
    document.removeEventListener("touchstart", onEnter, { capture: true });
  };
}

/**
 * Which hash section the reader is looking at. Returns the hash so the Navbar
 * can render the active dot from state, rather than the old version poking
 * classList on the DOM behind React's back.
 */
function useScrollSpy(enabled) {
  const [activeHash, setActiveHash] = useState("#top");

  useEffect(() => {
    if (!enabled) return;

    function update() {
      const scrollPos = window.scrollY;
      const atBottom =
        scrollPos + window.innerHeight >= document.documentElement.scrollHeight - 80;

      if (atBottom) {
        setActiveHash("#contact");
        return;
      }
      const contactEl = document.querySelector("#contact");
      const aboutEl = document.querySelector("#about");
      if (contactEl && scrollPos + 180 >= contactEl.offsetTop) {
        setActiveHash("#contact");
      } else if (aboutEl && scrollPos + 180 >= aboutEl.offsetTop) {
        setActiveHash("#about");
      } else {
        setActiveHash("#top");
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [enabled]);

  return activeHash;
}

export default function Layout({
  active,
  homeMode = false,
  scrollSpy = false,
  showUses = false,
  progress = false,
  back = null,
  children,
}) {
  const spyHash = useScrollSpy(scrollSpy);
  const mainRef = useRef(null);

  useScrollReveal(mainRef);

  useEffect(() => {
    return initPrefetch();
  }, []);

  return (
    <>
      {progress && <ReadingProgress />}
      <EdgeBlurs />
      <FrameLines />
      <Navbar active={active} homeMode={homeMode} spyHash={spyHash} />
      {back && <BackPill href={back.href} label={back.label} />}
      <main
        id="top"
        ref={mainRef}
        className={cn(
          "relative z-[2] mx-auto flex w-full flex-col",
          homeMode &&
            "home bg-transparent",
          !homeMode &&
            "max-w-column border-x border-dashed border-hair bg-column px-4 pt-[76px] shadow-[0_0_0_1px_var(--column-bg)] backdrop-blur-[14px] max-[480px]:px-4"
        )}
      >
        {children}
      </main>
      <Footer showUses={showUses} />
    </>
  );
}