import Layout from "../components/Layout.jsx";
import InfoBlock from "../components/InfoBlock.jsx";
import { SECTION, UPDATED_LABEL_CLASS } from "../lib/styles.js";
import { STATUS_DOT } from "../lib/routine.js";
import { cn } from "../lib/utils.js";
import { useWallClock } from "../hooks/useClock.js";

const UPDATED_LABEL = `Last updated: ${new Date().toLocaleString("en-US", {
  month: "long",
  year: "numeric",
})}`;

/* Dot colour per routine slot comes from lib/routine.js. */

const TICK = "stroke-ink-3 [stroke-width:1.5] [stroke-linecap:round]";
const TICK_MAJOR = "stroke-ink [stroke-width:2]";

/* Twelve ticks on 15-degree steps around a 110,110 origin, with the four
   cardinal ones drawn heavier. */
const TICKS = [
  ["110", "18", "110", "30", true],
  ["160", "23.4", "155", "32.1", false],
  ["196.6", "60", "187.9", "65", false],
  ["202", "110", "190", "110", true],
  ["196.6", "160", "187.9", "155", false],
  ["160", "196.6", "155", "187.9", false],
  ["110", "202", "110", "190", true],
  ["60", "196.6", "65", "187.9", false],
  ["23.4", "160", "32.1", "155", false],
  ["18", "110", "30", "110", true],
  ["23.4", "60", "32.1", "65", false],
  ["60", "23.4", "65", "32.1", false],
];

function ClockFace({ hourDeg, minuteDeg, secondDeg }) {
  return (
    <svg className="size-full" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle
        className="fill-none stroke-hair [stroke-width:1.5] [stroke-dasharray:4_4]"
        cx="110"
        cy="110"
        r="100"
      />
      {TICKS.map(([x1, y1, x2, y2, major], i) => (
        <line
          key={i}
          className={major ? `${TICK} ${TICK_MAJOR}` : TICK}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      ))}
      <line
        className="stroke-ink [stroke-width:3.5] [stroke-linecap:round]"
        x1="110"
        y1="120"
        x2="110"
        y2="55"
        transform={`rotate(${hourDeg ?? 0}, 110, 110)`}
      />
      <line
        className="stroke-ink [stroke-width:2.5] [stroke-linecap:round]"
        x1="110"
        y1="124"
        x2="110"
        y2="35"
        transform={`rotate(${minuteDeg ?? 0}, 110, 110)`}
      />
      <line
        className="stroke-[#22c55e] [stroke-width:1.5] [stroke-linecap:round]"
        x1="110"
        y1="126"
        x2="110"
        y2="28"
        transform={`rotate(${secondDeg ?? 0}, 110, 110)`}
      />
      <circle className="fill-ink" cx="110" cy="110" r="4" />
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
      <section className={`${SECTION} flex flex-col items-center gap-4 pt-30 pb-8 max-[480px]:pt-30 max-[480px]:pb-8`}>
        <div className="relative size-[220px]">
          <ClockFace
            hourDeg={clock?.hourDeg}
            minuteDeg={clock?.minuteDeg}
            secondDeg={clock?.secondDeg}
          />
        </div>
        <p className="mt-1 text-center font-mono text-[11px] tracking-[0.1em] text-ink-3">
          AHMEDABAD, INDIA
        </p>
        <p className="font-mono text-[28px] font-semibold tracking-[0.04em] text-ink">
          {clock ? clock.time : "--:--:-- IST"}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-dotted border-hair bg-surface-1 px-3.5 py-1.5 font-mono text-[12px] text-ink-2">
          <span
            className={cn("size-[7px] rounded-full bg-[#22c55e]", clock && STATUS_DOT[clock.statusClass])}
            aria-hidden="true"
          />
          <span>{clock ? clock.activity : "Loading..."}</span>
        </div>
      </section>

      <section className={SECTION}>
        {BLOCKS.map((block, i) => (
          <InfoBlock
            key={block.title}
            title={block.title}
            items={block.items}
            last={i === BLOCKS.length - 1}
          />
        ))}
        <p className={UPDATED_LABEL_CLASS}>{UPDATED_LABEL}</p>
      </section>
    </Layout>
  );
}
