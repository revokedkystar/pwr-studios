"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { legalLinks } from "@/legal";
import "./page-transition.css";

/** Name shown on the curtain for each page. */
const LABELS: Record<string, string> = {
  "/": "Home",
  "/graphics": "Graphics",
  "/experience": "Experience",
  "/cv": "CV",
  "/contact": "Contact",
  ...Object.fromEntries(legalLinks.map((l) => [l.href, l.label])),
};

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const COVER_MS = 560;
const REVEAL_MS = 700;
/** If the next page never arrives (offline, error), lift the curtain anyway. */
const GIVE_UP_MS = 6000;

/**
 * Page transition curtain.
 *
 * Clicking a link to another page on this site raises a black panel from
 * the bottom of the screen with a curved leading edge (the same look as the
 * loading screen) and the destination's name. Behind it the new page is
 * loaded with the client router, then the panel carries on up and off the
 * screen, revealing the page at the top.
 *
 * It catches every internal link, plain <a> tags as well as next/link, in
 * the capture phase, before Link's own handler: preventing the default
 * there makes Link stand down. Links to the same page (#sections), other
 * sites, files, new tabs and modified clicks are left alone. With reduced
 * motion it does nothing, and the browser and router behave as normal.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const arrived = useRef<(() => void) | null>(null);
  const busy = useRef(false);
  const [label, setLabel] = useState("");

  // The new page has rendered: let the waiting transition carry on.
  useEffect(() => {
    arrived.current?.();
    arrived.current = null;
  }, [pathname]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const panel = root.querySelector<HTMLElement>("[data-panel]")!;
    const text = root.querySelector<HTMLElement>("[data-label]")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    const run = async (href: string, path: string) => {
      busy.current = true;
      setLabel(LABELS[path] ?? "xanti");
      root.dataset.state = "on";

      // 1. Cover: the panel rises from below the screen to fill it.
      const cover = panel.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], {
        duration: COVER_MS,
        easing: EASE,
        fill: "forwards",
      });
      text.animate(
        [
          { opacity: 0, transform: "translateY(40%)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 420, delay: COVER_MS * 0.45, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "both" },
      );
      await cover.finished;

      // 2. Load the new page behind it, and wait until it has rendered.
      const arrival = new Promise<void>((resolve) => {
        arrived.current = resolve;
        window.setTimeout(resolve, GIVE_UP_MS);
      });
      router.push(href);
      await Promise.all([arrival, new Promise((r) => setTimeout(r, 180))]);
      await frame();

      // 3. Reveal: the panel carries on up and off the screen.
      text.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(-30%)" }], {
        duration: 260,
        easing: "ease-in",
        fill: "forwards",
      });
      const reveal = panel.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
        duration: REVEAL_MS,
        delay: 120,
        easing: EASE,
        fill: "forwards",
      });
      await reveal.finished;
      panel.getAnimations().forEach((a) => a.cancel());
      text.getAnimations().forEach((a) => a.cancel());
      root.dataset.state = "off";
      busy.current = false;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (e.g. a #section link): leave it to the browser / smooth scroll.
      if (url.pathname === window.location.pathname) return;
      // Files such as images and certificates.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      if (reduced.matches) return;
      e.preventDefault();
      if (busy.current) return;
      void run(url.pathname + url.search + url.hash, url.pathname);
    };

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div ref={ref} className="ptx" data-state="off" aria-hidden>
      <div data-panel className="ptx__panel">
        <span data-label className="ptx__label">
          {label}
        </span>
      </div>
    </div>
  );
}
