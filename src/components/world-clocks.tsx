"use client";

import { useEffect, useState } from "react";

type Clock = { city: string; zone: string };

function read(zone: string, now: Date) {
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  const offset =
    new Intl.DateTimeFormat("en-GB", { timeZone: zone, timeZoneName: "shortOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  const hour = Number(time.slice(0, 2));
  return { time, offset, day: hour >= 7 && hour < 19 };
}

function Sun() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <rect key={r} x="7.4" y="0.8" width="1.2" height="2.4" rx="0.6" fill="currentColor" transform={`rotate(${r} 8 8)`} />
      ))}
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
      <path d="M10.5 2.5a5.5 5.5 0 1 0 3 9.6A6 6 0 0 1 10.5 2.5z" fill="currentColor" />
    </svg>
  );
}

/** Local time in each studio city. Time is read only on the client, after mount. */
export function WorldClocks({ clocks }: { clocks: Clock[] }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <table className="text-base tabular-nums">
      <tbody>
        {clocks.map((c, n) => {
          const r = now ? read(c.zone, now) : null;
          return (
            <tr key={c.zone} className={n === 0 ? "text-black" : "text-black/45"}>
              <td className="pr-2 pb-1.5 align-middle">{r ? r.day ? <Sun /> : <Moon /> : <span className="block size-3.5" />}</td>
              <td className="pr-4 pb-1.5 sm:pr-8">{c.city}</td>
              <td className="pr-4 pb-1.5 sm:pr-8">{r?.time ?? "--:--"}</td>
              <td className="pb-1.5 text-right">{r?.offset ?? ""}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
