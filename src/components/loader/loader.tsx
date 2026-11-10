"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PixelField } from "../pixel-field";
import "./loader.css";

const WORD = "xanti";
const WORDS = ["computing", "creativity", "code", "design", "motion"];
const INK = ["#3a3a3a", "#9a9a9a", "#ffffff"];

/** Shortest time the loader shows on a first visit, so it never just flickers. */
const MIN_MS = 1800;
/** On a repeat visit in the same session, a much quicker version. */
const MIN_MS_REPEAT = 350;
/** How long the exit takes before the loader is removed. */
const EXIT_MS = 1500;
const SEEN_KEY = "xanti-loader-seen";

/**
 * Typographic loading screen.
 *
 * Shown from the very first paint (it's in the server-rendered HTML). The
 * "xanti" wordmark rises in letter by letter beside a shimmering pixel tile,
 * a serif word cycles bottom left, and a counter climbs to 100 bottom right,
 * driven by real loading progress (images and fonts), with a minimum time.
 * At 100 the letters lift away and the black panel sweeps up with a curved
 * edge, while the page rises into place underneath.
 *
 * Repeat visits in the same session get a quick version. With reduced motion
 * it isn't shown at all (CSS), and if JavaScript never runs it hides itself.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.state = "gone";
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: treat as a first visit */
    }
    const minMs = seen ? MIN_MS_REPEAT : MIN_MS;
    el.dataset.state = "loading";
    html.dataset.ldr = "loading";
    window.scrollTo(0, 0);

    // Real progress: images on the page plus fonts, then the window load event.
    const imgs = Array.from(document.images);
    let fontsReady = false;
    let windowLoaded = document.readyState === "complete";
    document.fonts?.ready.then(() => (fontsReady = true));
    const onLoad = () => (windowLoaded = true);
    window.addEventListener("load", onLoad);
    const real = () => {
      if (windowLoaded && fontsReady) return 1;
      const done = imgs.filter((i) => i.complete).length;
      return 0.9 * ((done + (fontsReady ? 1 : 0)) / (imgs.length + 1));
    };

    // Stop the page scrolling behind the loader.
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    const start = performance.now();
    let shown = 0;
    let raf = 0;
    let exitTimer = 0;
    let wordTimer = 0;

    const finish = () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      el.dataset.state = "out";
      html.dataset.ldr = "out";
      exitTimer = window.setTimeout(() => {
        el.dataset.state = "gone";
        // Remove the attribute entirely so no transform is left on the page
        // (a leftover one would break fixed/pinned elements further down).
        delete html.dataset.ldr;
      }, EXIT_MS);
    };

    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / minMs);
      // Ease in and out, reaching 1 exactly at the minimum time.
      const timeRamp = 0.5 - Math.cos(Math.PI * t) / 2;
      const target = Math.min(real(), timeRamp);
      shown += (target - shown) * 0.18;
      if (target >= 1 && shown > 0.995) shown = 1;
      el.style.setProperty("--p", shown.toFixed(4));
      setCount(Math.round(shown * 100));
      if (shown >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Cycle the serif words.
    wordTimer = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), seen ? 200 : 380);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearInterval(wordTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      delete html.dataset.ldr;
    };
  }, []);

  return (
    <div ref={ref} className="ldr" role="status" aria-live="polite" aria-label={`Loading, ${count} percent`}>
      <div className="ldr__panel" />
      <div className="ldr__inner">
        <div className="ldr__top">
          <span>xanti studios</span>
          <span>by @h4tfi3ld</span>
        </div>

        <div className="ldr__mark" aria-hidden>
          {WORD.split("").map((ch, i) => (
            <span key={i} className="ldr__mask">
              <span className="ldr__char" style={{ "--i": i } as CSSProperties}>
                {ch}
              </span>
            </span>
          ))}
          <span className="ldr__tile">
            <PixelField palette={INK} cell={8} seed={11} scale={0.3} speed={0.05} className="absolute inset-0 size-full" />
          </span>
        </div>

        <div className="ldr__bottom">
          <span className="ldr__words" aria-hidden>
            {WORDS.map((w, i) => (
              <span
                key={w}
                className="ldr__word"
                data-on={i === word ? "true" : i === (word - 1 + WORDS.length) % WORDS.length ? "past" : "false"}
              >
                {w}
              </span>
            ))}
          </span>
          <span className="ldr__count" aria-hidden>
            {String(count).padStart(3, "0")}
            <sup>%</sup>
          </span>
        </div>
      </div>
      <div className="ldr__line" />
    </div>
  );
}
