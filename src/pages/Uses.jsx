import Layout from "../components/Layout.jsx";

const UPDATED_LABEL = "Last updated: September 2026";

function Chip({ src, alt, letter }) {
  return (
    <span className="logo-chip">
      {src ? <img src={`assets/uses/${src}`} alt={alt} loading="lazy" /> : letter}
    </span>
  );
}

function Pair({ src, alt, letter, children }) {
  return (
    <span className="uses-pair">
      <Chip src={src} alt={alt} letter={letter} />
      {children}
    </span>
  );
}

export default function Uses() {
  return (
    <Layout active={null} showUses>
      {/* Uses header */}
      <section className="section uses-header-section">
        <h1 className="section-title">Uses</h1>
        <p className="blog-desc">
          The tools and stack I build with. Inspired by{" "}
          <a
            href="https://uses.tech"
            target="_blank"
            rel="noreferrer"
            className="about-link"
            style={{ whiteSpace: "nowrap" }}
          >
            uses.tech ↗
          </a>
        </p>
      </section>

      {/* Content blocks */}
      <section className="section">
        <div className="now-blocks">
          <div className="now-block">
            <p className="now-block-title">Editor &amp; Terminal</p>
            <div className="now-block-content">
              <ul>
                <li>
                  <Pair src="zed.png" alt="Zed">
                    Zed
                  </Pair>
                  ,{" "}
                  <Pair src="git.png" alt="Git">
                    Git
                  </Pair>{" "}
                  via Zed's source control,{" "}
                  <Pair src="github.png" alt="GitHub">
                    GitHub
                  </Pair>{" "}
                  for everything.
                </li>
                <li>
                  <Pair src="jetbrains.png" alt="JetBrains Mono">
                    JetBrains Mono
                  </Pair>{" "}
                  everywhere — editor and this site.
                </li>
              </ul>
            </div>
          </div>

          <div className="now-block">
            <p className="now-block-title">Agent Stack</p>
            <div className="now-block-content">
              <ul>
                <li>
                  Building on the{" "}
                  <a href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer">
                    MCP
                  </a>{" "}
                  and A2A protocol specs.
                </li>
                <li>
                  <Pair src="opencode.png" alt="Opencode">
                    Opencode
                  </Pair>
                  ,{" "}
                  <Pair src="antigravity.png" alt="Google Antigravity">
                    Antigravity
                  </Pair>
                  ,{" "}
                  <Pair letter="O">OMP</Pair>, and{" "}
                  <Pair src="cline.png" alt="Cline">
                    Cline
                  </Pair>{" "}
                  for agentic work.
                </li>
              </ul>
            </div>
          </div>

          <div className="now-block">
            <p className="now-block-title">This Site</p>
            <div className="now-block-content">
              <ul>
                <li>
                  React + Tailwind, compiled by Vite, served as static assets from a Cloudflare
                  Worker.
                </li>
                <li>
                  Type: Instrument Serif for headings, Inter / Geist for body, JetBrains Mono for
                  labels and code.
                </li>
                <li>
                  Dark / light toggle persisted in <code>localStorage</code>, RSS at{" "}
                  <a href="/rss.xml">/rss.xml</a>, agent-readable index at{" "}
                  <a href="/llms.txt">/llms.txt</a>.
                </li>
              </ul>
            </div>
          </div>

          <div className="now-block">
            <p className="now-block-title">Stay Current</p>
            <div className="now-block-content">
              <ul>
                <li>
                  <Pair src="x.png" alt="X">
                    X
                  </Pair>{" "}
                  and{" "}
                  <Pair src="reddit.png" alt="Reddit">
                    Reddit
                  </Pair>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="now-updated">{UPDATED_LABEL}</p>
      </section>
    </Layout>
  );
}