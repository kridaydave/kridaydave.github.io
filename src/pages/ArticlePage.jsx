import { useEffect, useMemo, useRef, useState } from "react";
import { Copy } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { POSTS, PROJECTS } from "../content/pages.js";
import { plainFromHtml, wordCount } from "../lib/text.js";
import { copyText } from "../lib/clipboard.js";
import { cn } from "../lib/utils";
import { ARTICLE_SECTION } from "../lib/styles.js";
import { POST_BODY, POST_CMD, POST_TERM } from "../lib/postBody.js";

const WORDS_PER_MINUTE = 200;

/**
 * Click-to-copy for `[data-copy]` elements inside a rendered HTML string.
 * Post bodies arrive as HTML, so there is no React node to attach a handler to;
 * this listens on the container instead. Port of script.js initCopyButtons,
 * which the first pass dropped and left the v5.0.0 install block inert.
 */
function useCopyDelegate(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onClick = async (event) => {
      const target = event.target.closest("[data-copy]");
      if (!target || !root.contains(target)) return;

      await copyText(target.dataset.copy);
      target.classList.add("copied");
      setTimeout(() => target.classList.remove("copied"), 1500);
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [containerRef]);
}

const ACTION_BTN =
  "inline-flex items-center gap-1.5 rounded border border-dotted border-hair bg-surface-1 px-2.5 py-[5px] font-mono text-[11px] tracking-[0.04em] text-ink-2 transition-all duration-150 hover:border-ink-2 hover:bg-surface-2 hover:text-ink";

/* Lucide has no brand icons, so the GitHub mark stays inline. */
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/** Copy button that flips its own label to "Copied!" for a beat (port of script.js initPostUtilities). */
function CopyAction({ getText, label, ariaLabel }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    await copyText(getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      className={cn(ACTION_BTN, copied && "border-[#22c55e] text-[#22c55e]")}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <Copy className="size-[13px]" />
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}

export default function ArticlePage({ type, slug }) {
  const isPost = type === "post";
  const article = (isPost ? POSTS[slug] : PROJECTS[slug]) ?? null;
  const bodyRef = useRef(null);
  useCopyDelegate(bodyRef);

  const readTime = useMemo(() => {
    if (!article) return null;
    const words = wordCount(plainFromHtml(article.body));
    return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
  }, [article]);

  if (!article) {
    return (
      <Layout active={null}>
        <article className={ARTICLE_SECTION}>
          <header className="mb-9">
            <h1 className="font-serif text-[clamp(34px,6vw,52px)] leading-[1.15] text-ink">
              Not found
            </h1>
          </header>
          <div className={POST_BODY}>
            <p>
              No {isPost ? "post" : "project"} at <code>{slug}</code>.{" "}
              <a
                href="/blog.html"
                className="text-ink underline decoration-dotted underline-offset-[3px] transition-colors hover:text-ink-2"
              >
                Back to blog ↗
              </a>
            </p>
          </div>
        </article>
      </Layout>
    );
  }

  return (
    <Layout
      active={isPost ? "blog" : "home"}
      progress={article.withProgress}
      back={{ href: article.backHref, label: article.backLabel }}
    >
      <article className={ARTICLE_SECTION}>
        <header className="mb-9">
          <div className="mb-[18px] flex flex-wrap items-center gap-3.5">
            <span className="rounded-[3px] border border-dotted border-hair bg-surface-1 px-2.25 py-[3px] font-mono text-[11px] tracking-[0.12em] text-ink-3">
              {article.tag}
            </span>
            <span className="font-mono text-[11px] tracking-[0.1em] text-ink-3">{article.date}</span>
            {isPost && (
              <span className="border-l border-dotted border-hair pl-2 font-mono text-[11px] tracking-[0.08em] text-ink-3">
                {readTime}
              </span>
            )}
          </div>
          <h1 className="font-serif text-[clamp(34px,6vw,52px)] leading-[1.15] text-ink">{article.title}</h1>
          <div className="mt-3.5 flex items-center gap-2.5">
            {!isPost && article.github && (
              <a
                className={ACTION_BTN}
                href={article.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <GithubIcon className="size-[13px]" />
                <span>GitHub</span>
              </a>
            )}
            <CopyAction
              getText={() => window.location.href}
              label="Copy Link"
              ariaLabel={isPost ? "Copy post link" : "Copy page link"}
            />
            {article.withCopyMarkdown && (
              <CopyAction
                getText={() =>
                  `# ${article.title}\n\n${window.location.href}\n\n${plainFromHtml(article.body)}`
                }
                label="Copy Text"
                ariaLabel="Copy post text"
              />
            )}
          </div>
        </header>

        {/* Body is authored build-time content generated by scripts/migrate.mjs, not user input. */}
        <div
          ref={bodyRef}
          className={cn(POST_BODY, POST_CMD, POST_TERM)}
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </article>
    </Layout>
  );
}
