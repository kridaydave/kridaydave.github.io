import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/browser";
import { cn } from "../lib/utils";

/** Staggered character reveal for the profile subtitle (initCharReveal). */
export default function CharReveal({ text }) {
  const [revealed, setRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <span className="inline">
      {[...text].map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-[opacity,filter,transform] duration-[400ms] ease-out",
            revealed ? "translate-y-0 opacity-100 blur-none" : "translate-y-[5px] opacity-0 blur-[5px]"
          )}
          style={{ transitionDelay: `${i * 35}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
