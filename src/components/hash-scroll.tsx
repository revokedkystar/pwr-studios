"use client";

import { useEffect } from "react";

/**
 * Scrolls to the section named in the address (e.g. /#graphics) once the
 * page has mounted. Needed when arriving from another page via a menu link:
 * the default jump can happen before the pinned sections have finished
 * setting up, which then leaves the page at the top.
 */
/** Sections that moved to another page, so old shared links still land on them. */
const MOVED: Record<string, string> = { graphics: "/graphics", industry: "/graphics" };

export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    if (!document.getElementById(id) && MOVED[id]) {
      window.location.replace(`${MOVED[id]}#${id}`);
      return;
    }
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    // Once straight away, then again after the pinned sections have settled.
    const timers = [50, 400, 900].map((ms) => window.setTimeout(go, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
