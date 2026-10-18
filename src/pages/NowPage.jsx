import Layout from "../components/Layout.jsx";
import { useWallClock } from "../hooks/useClock.js";

const UPDATED_LABEL = `Last updated: ${new Date().toLocaleString("en-US", {
  month: "long",
  year: "numeric",
})}`;

function ClockFace({ hourDeg, minuteDeg, secondDeg }) {
  return (
    <svg className="now-clock-face" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      {/* Dashed ring */}
      <circle className="now-clock-ring" cx="110" cy="110" r="100" />
      {/* Hour ticks */}
      <line className="now-clock-tick now-clock-tick-major" x1="110" y1="18" x2="110" y2="30" />
      <line className="now-clock-tick" x1="160" y1="23.4" x2="155" y2="32.1" />
      <line className="now-clock-tick" x1="196.6" y1="60" x2="187.9" y2="65" />
      <line className="now-clock-tick now-clock-tick-major" x1="202" y1="110" x2="190" y2="110" />
      <line className="now-clock-tick" x1="196.6" y1="160" x2="187.9" y2="155" />
      <line className="now-clock-tick" x1="160" y1="196.6" x2="155" y2="187.9" />
      <line className="now-clock-tick now-clock-tick-major" x1="110" y1="202" x2="110" y2="190" />
      <line className="now-clock-tick" x1="60" y1="196.6" x2="65" y2="187.9" />
      <line className="now-clock-tick" x1="23.4" y1="160" x2="32.1" y2="155" />
      <line className="now-clock-tick now-clock-tick-major" x1="18" y1="110" x2="30" y2="110" />
      <line className="now-clock-tick" x1="23.4" y1="60" x2="32.1" y2="65" />
      <line className="now-clock-tick" x1="60" y1="23.4" x2="65" y2="32.1" />
      {/* Hands */}
      <line
        className="now-clock-hand now-clock-hand--hour"
        id="now-hand-hour"
        x1="110"
        y1="120"
        x2="110"
        y2="55"
        transform={`rotate(${hourDeg ?? 0}, 110, 110)`}
      />
      <line
        className="now-clock-hand now-clock-hand--minute"
        id="now-hand-minute"
        x1="110"
        y1="124"
        x2="110"
        y2="35"
        transform={`rotate(${minuteDeg ?? 0}, 110, 110)`}
      />
      <line
        className="now-clock-hand now-clock-hand--second"
        id="now-hand-second"
        x1="110"
        y1="126"
        x2="110"
        y2="28"
        transform={`rotate(${secondDeg ?? 0}, 110, 110)`}
      />
      {/* Center dot */}
      <circle className="now-clock-center" cx="110" cy="110" r="4" />
    </svg>
  );
}

const BLOCKS = [
  {
    title: "Building",
    items: (
      <>
        <li>
          <a href="https://github.com/Epoch-AI-Lab/blueline" target="_blank" rel="noreferrer">
            Blueline
          </a>{" "}
          - sandboxed package installs and supply chain review for coding agents
        </li>
        <li>
          <a href="https://github.com/Epoch-AI-Lab/oot" target="_blank" rel="noreferrer">
            Oot
          </a>{" "}
          - code governance for multi-agent repos
        </li>
        <li>
          Running{" "}
          <a href="https://theepoch.in" target="_blank" rel="noreferrer">
            Epoch AI Labs
          </a>
          , testing model behavior and agent coordination
        </li>
      </>
    ),
  },
  {
    title: "Studying",
    items: (
      <>
        <li>JEE preparation - physics, chemistry, math. Daily problem sets.</li>
        <li>School in parallel. Classes 12 PM to 4 PM, study blocks before and after.</li>
      </>
    ),
  },
  {
    title: "Watching",
    items: (
      <>
        <li>Rewatching Naruto Shippuden arcs when I need a break</li>
        <li>The Boys season 4</li>
      </>
    ),
  },
  {
    title: "Reading",
    items: (
      <>
        <li>Agent protocol specs (MCP, A2A)</li>
        <li>Whatever shows up on HN that looks interesting</li>
      </>
    ),
  },
];

export default function NowPage() {
  const clock = useWallClock();

  return (
    <Layout active="now">
      {/* Clock hero */}
      <section className="section now-hero">
        <div className="now-clock-wrap">
          <ClockFace
            hourDeg={clock?.hourDeg}
            minuteDeg={clock?.minuteDeg}
            secondDeg={clock?.secondDeg}
          />
        </div>
        <p className="now-clock-label">AHMEDABAD, INDIA</p>
        <p className="now-digital" id="now-digital-time">
          {clock ? clock.time : "--:--:-- IST"}
        </p>
        <div className="now-activity-pill">
          <span
            className={`now-dot${clock ? ` ${clock.statusClass}` : ""}`}
            id="now-dot"
          ></span>
          <span id="now-activity-text">{clock ? clock.activity : "Loading..."}</span>
        </div>
      </section>

      {/* Content blocks */}
      <section className="section">
        <div className="now-blocks">
          {BLOCKS.map((block) => (
            <div key={block.title} className="now-block">
              <p className="now-block-title">{block.title}</p>
              <div className="now-block-content">
                <ul>{block.items}</ul>
              </div>
            </div>
          ))}
        </div>
        <p className="now-updated" id="now-updated">
          {UPDATED_LABEL}
        </p>
      </section>
    </Layout>
  );
}