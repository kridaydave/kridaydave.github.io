import Layout from "../components/Layout.jsx";

export default function NotFound() {
  return (
    <Layout active={null}>
      <section
        className="section"
        style={{ paddingTop: 140, paddingBottom: 80, textAlign: "center" }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            letterSpacing: "0.15em",
            color: "var(--text-tertiary)",
            marginBottom: "12px",
          }}
        >
          ERROR 404
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(48px, 8vw, 84px)",
            lineHeight: 1.1,
            marginBottom: "16px",
            fontWeight: 400,
          }}
        >
          Page Not Found
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "440px", margin: "0 auto 32px", fontSize: "16px" }}>
          This URL does not exist or might have been moved.
        </p>
        <a
          href="/index.html"
          className="post-back"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            border: "1px dashed var(--border)",
            borderRadius: "4px",
            background: "var(--surface-1)",
          }}
        >
          &larr; Back to home
        </a>
      </section>
    </Layout>
  );
}