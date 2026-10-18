import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/browser";
import ReadingProgress from "./ReadingProgress";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/index.html" },
  { key: "now", label: "Now", href: "/now.html" },
  { key: "blog", label: "Blog", href: "/blog.html" },
  { key: "rants", label: "Rants", href: "/rants.html" },
  { key: "favorites", label: "Favorites", href: "/favorites.html" },
];

const REVEAL_GROUPS = [
  ".about-content",
  ".contact-grid",
  ".projects-grid",
  ".latest-note-card",
  ".timeline",
  ".writing-list",
  ".tech-filters",
  ".tech-grid",
  ".quote-section",
  ".cta-section",
  ".goat-card",
  ".media-grid",
  ".activity-graph-wrap",
  ".rants-list",
];

/** Pill in the top-left gutter: an arrow that flips to an X on hover. */
function BackPill({ href, label }) {
  return (
    <a href={href} className="floating-back-btn" aria-label={label}>
      <span className="btn-icon-wrap" aria-hidden="true">
        <svg
          className="icon-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <svg
          className="icon-close"
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </span>
      <span>{label}</span>
    </a>
  );
}

function FrameLines() {
  return (
    <div className="frame-lines" aria-hidden="true">
      <div className="frame-line frame-line--left"></div>
      <div className="frame-line frame-line--right"></div>
    </div>
  );
}

function ThemeToggle({ onToggle }) {
  return (
    <button className="theme-toggle" type="button" aria-label="Toggle theme" onClick={onToggle}>
      <svg
        className="icon-sun"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        className="icon-moon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}

function Navbar({ active, homeMode }) {
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

  const links = NAV_ITEMS.map((item) => {
    const isActive = active === item.key;
    const href =
      homeMode && item.key === "home" ? "#top" : item.href;
    return (
      <a key={item.key} href={href} className={`nav-link${isActive ? " active" : ""}`}>
        {item.label}
      </a>
    );
  });

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href={homeMode ? "#top" : "/index.html"} className="navbar-logo">
          Kriday
        </a>
        <nav className="navbar-links" aria-label="Main navigation">
          {links}
        </nav>
        <div className="navbar-actions">
          <ThemeToggle onToggle={toggleTheme} />
          <div className="navbar-divider"></div>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <nav
        className={`mobile-nav${open ? " open" : ""}`}
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
    <footer className="site-footer">
      <p>
        Designed &amp; Developed by <strong>Kriday Dave</strong>
      </p>
      {showUses && (
        <p>
          <a href="/uses.html" className="about-link">
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

/* --- Scroll reveal (port of script.js initScrollReveal) --- */
function initScrollReveal() {
  REVEAL_GROUPS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      el.dataset.delay = String(Math.min(i, 2));
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
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

/* --- Active nav link on scroll (port of initActiveNav, hash links only) --- */
function useScrollSpy(enabled) {
  useEffect(() => {
    if (!enabled) return;
    function updateActiveNav() {
      const scrollPos = window.scrollY;
      const isAtBottom =
        scrollPos + window.innerHeight >= document.documentElement.scrollHeight - 80;
      let activeHash = "#top";

      if (isAtBottom) {
        activeHash = "#contact";
      } else {
        const contactEl = document.querySelector("#contact");
        const aboutEl = document.querySelector("#about");
        if (contactEl && scrollPos + 180 >= contactEl.offsetTop) {
          activeHash = "#contact";
        } else if (aboutEl && scrollPos + 180 >= aboutEl.offsetTop) {
          activeHash = "#about";
        }
      }

      document
        .querySelectorAll('.nav-link[href^="#"]')
        .forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === activeHash)
        );
    }
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
    return () => window.removeEventListener("scroll", updateActiveNav);
  }, [enabled]);
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
  useEffect(() => {
    initScrollReveal();
    return initPrefetch();
  }, []);
  useScrollSpy(scrollSpy);

  return (
    <>
      {progress && <ReadingProgress />}
      <FrameLines />
      <Navbar active={active} homeMode={homeMode} />
      {back && <BackPill href={back.href} label={back.label} />}
      <main id="top">{children}</main>
      <Footer showUses={showUses} />
    </>
  );
}