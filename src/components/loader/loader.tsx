"use client";

import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { useEffect, useRef } from "react";
import { createReel, DURATION } from "./reel";
import "./loader.css";

// The reel's typefaces. Archivo needs its width axis for the condensed and
// expanded words.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"] });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"] });

const W = 1920;
const H = 1080;
/** Hold on the final logo frame for a moment before leaving. */
const HOLD_MS = 450;
/** On a repeat visit in the same session the reel is skipped. */
const MIN_MS_REPEAT = 350;
/** How long the exit takes before the loader is removed. */
const EXIT_MS = 1500;
/** Longest wait for the reel's fonts before playing anyway. */
const FONT_WAIT_MS = 3000;
const SEEN_KEY = "xanti-loader-seen";

/**
 * Loading screen: the xanti studios motion reel.
 *
 * Shown from the very first paint (it's in the server-rendered HTML). On the
 * first visit in a session the 15-second reel plays once, fitted to the
 * screen, with a Skip button (or Esc). When it ends, or is skipped, and the
 * page has finished loading, the black panel sweeps up with a curved edge
 * while the page rises into place underneath.
 *
 * Repeat visits in the same session skip the reel. With reduced motion the
 * loader isn't shown at all (CSS), and if JavaScript never runs it hides
 * itself.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    const vp = vpRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const skipBtn = skipRef.current;
    if (!el || !vp || !stage || !canvas || !svg || !skipBtn) return;
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
    el.dataset.state = "loading";
    html.dataset.ldr = "loading";
    window.scrollTo(0, 0);

    // Stop the page scrolling behind the loader.
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    let pageLoaded = document.readyState === "complete";
    let reelDone = seen;
    let finished = false;
    let disposed = false;
    let raf = 0;
    let exitTimer = 0;
    let holdTimer = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
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
    // Leave once the reel is over (or skipped) and the page has loaded.
    const maybeFinish = () => {
      if (reelDone && pageLoaded) finish();
    };
    const onLoad = () => {
      pageLoaded = true;
      maybeFinish();
    };
    window.addEventListener("load", onLoad);

    const skip = () => {
      reelDone = true;
      el.dataset.skipped = "true";
      maybeFinish();
    };
    skipBtn.addEventListener("click", skip);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    // Fit the 1920×1080 stage inside the screen.
    const fit = () => {
      const r = vp.getBoundingClientRect();
      const s = Math.min(r.width / W, r.height / H);
      stage.style.transform = `translate(${(r.width - W * s) / 2}px, ${(r.height - H * s) / 2}px) scale(${s})`;
    };
    window.addEventListener("resize", fit);

    if (seen) {
      // Repeat visit: just a quick black screen while the page settles.
      holdTimer = window.setTimeout(maybeFinish, MIN_MS_REPEAT);
    } else {
      fit();
      const fonts = {
        display: archivo.style.fontFamily,
        serif: instrumentSerif.style.fontFamily,
        mono: jetbrainsMono.style.fontFamily,
      };
      const reel = createReel(canvas, svg, fonts);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
      }
      const fontsReady = Promise.all([
        document.fonts.load(`900 100px ${fonts.display}`),
        document.fonts.load(`100 100px ${fonts.display}`),
        document.fonts.load(`900 ultra-condensed 100px ${fonts.display}`),
        document.fonts.load(`900 ultra-expanded 100px ${fonts.display}`),
        document.fonts.load(`italic 400 100px ${fonts.serif}`),
        document.fonts.load(`600 100px ${fonts.mono}`),
        document.fonts.load(`400 100px ${fonts.mono}`),
      ]).catch(() => undefined);
      const timeout = new Promise((r) => setTimeout(r, FONT_WAIT_MS));

      Promise.race([fontsReady, timeout]).then(() => {
        if (disposed || finished) return;
        reel.prepare();
        el.dataset.playing = "true";
        let t = 0;
        let last = performance.now();
        const tick = (now: number) => {
          if (reelDone) return;
          t = Math.min(DURATION, t + Math.min(0.1, (now - last) / 1000));
          last = now;
          reel.render(t);
          if (t >= DURATION) {
            holdTimer = window.setTimeout(() => {
              reelDone = true;
              maybeFinish();
            }, HOLD_MS);
            return;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(holdTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", fit);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      skipBtn.removeEventListener("click", skip);
      delete html.dataset.ldr;
    };
  }, []);

  return (
    <div ref={ref} className="ldr" role="status" aria-label="Loading xanti studios">
      <div className="ldr__panel" />
      <div ref={vpRef} className="ldr__vp" aria-hidden>
        <div ref={stageRef} className="ldr__stage">
          <canvas ref={canvasRef} width={W} height={H} className="ldr__canvas" />
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="ldr__logo">
            <defs>
              <clipPath id="gclipA">
                <rect x="0" y="0" width={W} height="0" />
                <rect x="0" y="0" width={W} height="0" />
                <rect x="0" y="0" width={W} height="0" />
              </clipPath>
              <clipPath id="gclipB">
                <rect x="0" y="0" width={W} height="0" />
                <rect x="0" y="0" width={W} height="0" />
                <rect x="0" y="0" width={W} height="0" />
              </clipPath>
            </defs>
            <g id="logoRoot" style={{ display: "none" }}>
              <g id="ghostA" clipPath="url(#gclipA)" />
              <g id="ghostB" clipPath="url(#gclipB)" />
              <g id="mainLockup" />
              <text id="subLeft" x="0" y="0" fill="#888888" fontSize="24" letterSpacing="3" />
              <text id="subRight" x="0" y="0" fill="#ffffff" fontSize="24" letterSpacing="3" textAnchor="end" />
            </g>
          </svg>
        </div>
      </div>
      <button ref={skipRef} type="button" className="ldr__skip">
        Skip
      </button>
    </div>
  );
}
