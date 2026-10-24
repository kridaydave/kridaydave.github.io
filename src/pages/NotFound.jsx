import Layout from "../components/Layout.jsx";
import { SECTION } from "../lib/styles.js";

export default function NotFound() {
  return (
    <Layout active={null}>
      <section className="border-t border-dashed border-hair px-4 pt-[140px] pb-20 text-center max-[480px]:px-3">
        <p className="mb-3 font-mono text-[13px] tracking-[0.15em] text-ink-3">ERROR 404</p>
        <h1 className="mb-4 font-serif text-[clamp(48px,8vw,84px)] leading-[1.1] font-normal">
          Page Not Found
        </h1>
        <p className="mx-auto mb-8 max-w-[440px] text-[16px] text-ink-2">
          This URL does not exist or might have been moved.
        </p>
        <a
          href="/index.html"
          className="inline-flex items-center gap-1.5 rounded border border-dashed border-hair bg-surface-1 px-4 py-2 font-mono text-[13px] tracking-[0.06em] text-ink-3 transition-colors hover:text-ink"
        >
          ← Back to home
        </a>
      </section>
    </Layout>
  );
}
