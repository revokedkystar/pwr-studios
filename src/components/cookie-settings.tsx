"use client";

import { useState } from "react";

/** The only thing the site stores in the browser (see the loader). */
const STORED_KEYS = ["xanti-loader-seen"];

const GROUPS = [
  {
    name: "Strictly necessary",
    state: "Always on",
    text: "One session storage value, xanti-loader-seen, which shortens the loading screen on your next page. It's cleared when you close the tab and never leaves your device.",
  },
  { name: "Analytics", state: "Not used", text: "No analytics or visitor tracking is installed on this site." },
  { name: "Marketing and advertising", state: "Not used", text: "No advertising, retargeting or social media tracking is installed." },
];

/**
 * Cookie settings: lists what the site can store in the browser (there are
 * no optional cookies to toggle) and clears it on request.
 */
export function CookieSettings() {
  const [cleared, setCleared] = useState(false);

  const clear = () => {
    try {
      STORED_KEYS.forEach((k) => {
        sessionStorage.removeItem(k);
        localStorage.removeItem(k);
      });
    } catch {
      /* storage blocked: nothing is stored either */
    }
    setCleared(true);
  };

  return (
    <div className="flex flex-col gap-3">
      {GROUPS.map((g) => (
        <section key={g.name} className="rounded-2xl bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-medium tracking-[-0.01em]">{g.name}</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm text-black/70 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">{g.state}</span>
          </div>
          <p className="mt-3 text-[15px] leading-normal text-black/70">{g.text}</p>
        </section>
      ))}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={clear}
          className="min-h-12 rounded-full bg-black px-7 py-3.5 text-base text-white transition-[opacity,translate] hover:-translate-y-0.5"
        >
          Clear stored data
        </button>
        <p role="status" className="text-sm text-black/70">
          {cleared ? "Done. Nothing from xanti.dev is stored in this browser now." : ""}
        </p>
      </div>
    </div>
  );
}
