import { useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import { POSTS, PROJECTS } from "../content/pages.js";
import { plainFromHtml, wordCount } from "../lib/text.js";
import { copyText } from "../lib/clipboard.js";

const WORDS_PER_MINUTE = 200;

const LINK_ICON = (
  <svg
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const COPY_ICON = (
  <svg
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const GITHUB_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

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
      className={`post-action-btn${copied ? " copied" : ""}`}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {COPY_ICON}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}

export default function ArticlePage({ type, slug }) {
  const isPost = type === "post";
  const article = (isPost ? POSTS[slug] : PROJECTS[slug]) ?? null;

  const readTime = useMemo(() => {
    if (!article) return null;
    const words = wordCount(plainFromHtml(article.body));
    return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
  }, [article]);

  if (!article) {
    return (
      <Layout active={null}>
        <article className="section post-section">
          <header className="post-header">
            <h1 className="post-title">Not found</h1>
          </header>
          <div className="post-body">
            <p>
              No {isPost ? "post" : "project"} at <code>{slug}</code>.{" "}
              <a href="/blog.html" className="post-link">
                Back to blog &nearr;
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
      <article className="section post-section">
        <header className="post-header">
          <div className="post-meta-row">
            <span className="post-tag">{article.tag}</span>
            <span className="post-date">{article.date}</span>
            {isPost && <span className="post-read-time">{readTime}</span>}
          </div>
          <h1 className="post-title">{article.title}</h1>
          <div className="post-actions-row">
            {!isPost && article.github && (
              <a
                className="post-action-btn"
                href={article.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                {GITHUB_ICON}
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
        <div className="post-body" dangerouslySetInnerHTML={{ __html: article.body }} />
      </article>
    </Layout>
  );
}
