import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/* Hover card preview for the essay wall — same mouse-follow mechanic as
   ObsidianUI's hover-img block (gsap quickTo, scale on enter, stack of
   slides removed), but the popup shows the essay's title and a short
   summary instead of an image. The words are the preview; there are no
   assets to maintain.

   Adapted to this bench:
   - TSX → JSX (no Next.js, no "use client").
   - The CSS lives in styles/site.css (.hover-card-*), tokens mapped to
     the site's own ink/ground/border vars. */

/**
 * @typedef {Object} EssayItem
 * @property {string} title  Essay title
 * @property {string} label  Date / category line shown in the card
 * @property {string} summary  One-or-two sentence preview of the essay
 * @property {string} [href]  Where the row links (posts are real pages)
 */

/** @type {EssayItem[]} */
const defaultEssays = [
    {
        title: "The t4, the tea and a bumble-bee",
        label: "Essay · Sep 6, 2026",
        href: "posts/t4-cuda-update-01.html",
        summary:
            "Five weeks of CUDA kernel research on free Colab T4s: measured wins, a falsified hypothesis, and a 0.5B model that learned to say I don't know.",
    },
    {
        title: "Simplicity is the new sophistication",
        label: "Essay · Aug 31, 2026",
        href: "posts/simplicity-is-the-new-sophistication.html",
        summary:
            "How an 8GB downloads folder turned into a bloated 35k-line MCP server, the rate limit hell of early agent tools, and stripping it down for the stateless v5 era.",
    },
    {
        title: "Multi-agent coding loops will wreck your git history",
        label: "Essay · Aug 29, 2026",
        href: "posts/multi-agent-git-chaos.html",
        summary:
            "Why concurrent coding agents break git repos and how intent verification prevents silent merge regressions.",
    },
];

/**
 * @param {Object} props
 * @param {EssayItem[]} [props.essays]
 * @param {string} [props.className]
 */
export function HoverCard({ essays = defaultEssays, className }) {
    /** @type {React.RefObject<HTMLDivElement | null>} */
    const containerRef = useRef(null);
    /** @type {React.RefObject<HTMLDivElement | null>} */
    const cardRef = useRef(null);
    const xToRef = useRef(null);
    const yToRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const wall = containerRef.current?.querySelector(
            ".hover-card-wall"
        );

        if (!card || !wall) return;

        const rows = gsap.utils.toArray(".hover-card-row", wall);

        gsap.set(card, { scale: 0, xPercent: -50, yPercent: -50 });

        xToRef.current = gsap.quickTo(card, "x", {
            duration: 0.4,
            ease: "power3.out",
        });
        yToRef.current = gsap.quickTo(card, "y", {
            duration: 0.4,
            ease: "power3.out",
        });

        const handleMouseMove = (e) => {
            xToRef.current?.(e.clientX);
            yToRef.current?.(e.clientY);
        };

    const handleMouseLeave = () => {
        gsap.to(card, {
            scale: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
        });
    };

    wall.addEventListener("mousemove", handleMouseMove);
    wall.addEventListener("mouseleave", handleMouseLeave);

    const rowListeners = [];
    /* row-to-row state: the inner content leaves toward where you came
       from and the next essay's words arrive from where you're going.
       A parked tween timer is safe — gsap overwrites "auto". */
    let currentIdx = -1;
    let swapTween = null;

    const fill = (row) => {
        const d = row.dataset;
        card.querySelector(".hover-card-date").textContent = d.date;
        card.querySelector(".hover-card-title").textContent = d.title;
        card.querySelector(".hover-card-summary").textContent = d.summary;
    };

    rows.forEach((row, index) => {
        const handleMouseEnter = () => {
            /* only when gliding from one row to the NEXT does the content
               transition — arriving at a hidden card has nothing to leave */
            const switching = gsap.getProperty(card, "scaleX") > 0.5 && index !== currentIdx && currentIdx !== -1;
            const inner = card.querySelector(".hover-card-inner");
            if (switching) {
                const dir = index > currentIdx ? 1 : -1;
                if (swapTween) swapTween.kill();
                swapTween = gsap
                    .timeline()
                    .to(inner, {
                        opacity: 0,
                        y: dir * 9,
                        duration: 0.12,
                        ease: "power2.in",
                        onComplete: () => fill(row),
                    })
                    .to(inner, {
                        opacity: 1,
                        y: 0,
                        duration: 0.18,
                        ease: "power2.out",
                    });
            } else {
                fill(row);
            }
            currentIdx = index;
            gsap.to(card, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        row.addEventListener("mouseenter", handleMouseEnter);
        rowListeners.push(() =>
            row.removeEventListener("mouseenter", handleMouseEnter)
        );
    });

    return () => {
        wall.removeEventListener("mousemove", handleMouseMove);
        wall.removeEventListener("mouseleave", handleMouseLeave);
        rowListeners.forEach((cleanup) => cleanup());
    };
    }, [essays]);

    return (
        <div className={`hover-card-container ${className || ""}`} ref={containerRef}>
            <div className="hover-card-wall">
                {essays.map((essay, index) => (
                    <a
                        className="hover-card-row"
                        key={index}
                        href={essay.href}
                        data-title={essay.title}
                        data-date={essay.label}
                        data-summary={essay.summary}
                    >
                        <h2>{essay.title}</h2>
                        <p>{essay.label}</p>
                    </a>
                ))}
            </div>

            <div className="hover-card-pop" ref={cardRef} aria-hidden="true">
                <div className="hover-card-inner">
                    <span className="hover-card-date"></span>
                    <h4 className="hover-card-title"></h4>
                    <p className="hover-card-summary"></p>
                </div>
            </div>
        </div>
    );
}

export default HoverCard;
