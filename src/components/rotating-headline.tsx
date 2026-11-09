"use client";

import { useEffect, useState } from "react";
import { PixelField } from "./pixel-field";

const INK = ["#ffffff", "#8f8f8f", "#0a0a0a"];

function Tile() {
  return (
    <span className="relative mx-[0.12em] inline-block size-[0.72em] translate-y-[0.06em] overflow-hidden align-baseline">
      <PixelField palette={INK} cell={10} seed={3} scale={0.25} speed={0.02} className="absolute inset-0 size-full" />
    </span>
  );
}

const lines = [
  <>
    Computing <Tile /> meets
    <br />
    creativity
  </>,
  <>
    Developer
    <br />
    &amp; designer
  </>,
];

/** Huge italic serif hero line that cross-fades between two phrases. */
export function RotatingHeadline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % lines.length), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="display grid text-center">
      <span className="sr-only">Joshua Hatfield: computing meets creativity. Developer and designer.</span>
      {lines.map((line, n) => (
        <span
          key={n}
          aria-hidden
          className="[grid-area:1/1] transition-[opacity,filter,translate] duration-700 ease-out"
          style={{
            opacity: n === i ? 1 : 0,
            filter: n === i ? "blur(0)" : "blur(12px)",
            translate: n === i ? "0 0" : "0 0.12em",
          }}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
