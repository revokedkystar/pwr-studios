"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth (eased) wheel scrolling for the page, with Lenis. Anchor links
 * still work. Off with reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: true, autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
