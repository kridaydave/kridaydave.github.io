import { useEffect, useState } from "react";

/**
 * Live IST routine status (port of script.js getISTRoutine/initRoutineClock).
 * Returns null until the first tick so the markup can keep showing the
 * "--:--:-- IST" placeholder exactly like the static site did.
 */
export function getISTRoutine(hour, minute) {
  const mins = hour * 60 + minute;
  if (mins < 480) return { activity: "Sleeping / AFK", statusClass: "status-sleep" };
  if (mins < 720) return { activity: "Morning prep & problem solving", statusClass: "status-study" };
  if (mins < 960) return { activity: "In classes", statusClass: "status-class" };
  if (mins < 1020) return { activity: "Break & reset", statusClass: "status-break" };
  if (mins < 1200) return { activity: "Studying (JEE prep)", statusClass: "status-study" };
  if (mins < 1260) return { activity: "Dinner & break", statusClass: "status-break" };
  return { activity: "Hacking & shipping agent tooling", statusClass: "status-code" };
}

function istNow() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(now);

  let h = 0;
  let m = 0;
  let s = 0;
  for (const part of parts) {
    if (part.type === "hour") h = parseInt(part.value, 10);
    if (part.type === "minute") m = parseInt(part.value, 10);
    if (part.type === "second") s = parseInt(part.value, 10);
  }
  if (h === 24) h = 0;

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  return { h, m, s, time: `${time} IST` };
}

export function useISTStatus() {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const tick = () => {
      const { h, m, time } = istNow();
      setStatus({ time, ...getISTRoutine(h, m) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return status;
}

/** Analog wall clock for the Now page: hand angles + digital + routine. */
export function useWallClock() {
  const [state, setState] = useState(null);
  useEffect(() => {
    const tick = () => {
      const { h, m, s, time } = istNow();
      setState({
        hourDeg: (h % 12) * 30 + m * 0.5,
        minuteDeg: m * 6 + s * 0.1,
        secondDeg: s * 6,
        time,
        ...getISTRoutine(h, m),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return state;
}