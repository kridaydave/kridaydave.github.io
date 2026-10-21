import { useEffect } from "react";
import { prefersReducedMotion } from "../lib/browser";

/**
 * Scroll-reveal for elements marked with `data-reveal`.
 *
 * The entrance is a Tailwind transition on the element itself: it starts
 * hidden, and the observer swaps it for the visible state. The classes are
 * applied imperatively because the observer owns them, not React — but they
 * are literal strings in this file, so Tailwind's scanner still emits them.
 *
 * The class lists are split into single tokens because `classList.add` throws
 * on a string containing spaces, and a throw inside this effect tears down
 * the whole React tree.
 */
const REVEAL_BASE = [
  "transition-[opacity,transform]",
  "duration-700",
  "ease-[cubic-bezier(0.2,0.75,0.25,1)]",
];
const REVEAL_HIDDEN = ["opacity-0", "translate-y-[30px]"];
const REVEAL_SHOWN = ["opacity-100", "translate-y-0"];

export default function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = (rootRef && rootRef.current) || document;
    if (!root) return;

    const targets = root.querySelectorAll("[data-reveal]");
    targets.forEach((el, i) => {
      el.classList.add(...REVEAL_BASE, ...REVEAL_HIDDEN);
      // The first three items stagger, then the rest arrive together.
      el.style.transitionDelay = `${Math.min(i, 2) * 100}ms`;
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => {
        el.classList.remove(...REVEAL_HIDDEN);
        el.classList.add(...REVEAL_SHOWN);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove(...REVEAL_HIDDEN);
          entry.target.classList.add(...REVEAL_SHOWN);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [rootRef]);
}
