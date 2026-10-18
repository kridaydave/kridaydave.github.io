import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/browser";

/** Staggered character reveal for the profile subtitle (initCharReveal). */
export default function CharReveal({ text }) {
  const [revealed, setRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <span className={`char-reveal${revealed ? " revealed" : ""}`}>
      {[...text].map((char, i) => (
        <span
          key={i}
          className="char"
          style={{ transitionDelay: `${i * 35}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}