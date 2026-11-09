"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };

/** Small solid square used as the site's pixel marker. */
function Pixel({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block size-1.5 shrink-0 bg-current ${className}`} />;
}

/**
 * Site header: an index-style menu pinned top-left and a contact bar pinned
 * top-right.
 *
 * - The menu lists the sections as "01 Work", "02 Graphics"… in mono caps and
 *   highlights the section currently on screen. On phones it collapses to the
 *   logo plus a Menu toggle.
 * - The contact bar shows the email address (mailto link) with an attached
 *   Copy button that copies it to the clipboard.
 */
export function SiteHeader({ nav, email, contact }: { nav: NavItem[]; email: string; contact: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Highlight whichever section's top has passed 40% of the way down the screen.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [nav]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = contact;
    }
  };

  return (
    // The header spans the page width, so only the menu and contact bar take clicks.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="wrap flex items-start justify-between gap-3 pt-4 sm:pt-[30px]">
        <nav
          aria-label="Sections"
          className="pointer-events-auto w-[184px] rounded-md border border-black/10 bg-white/85 p-1.5 font-mono shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md max-sm:w-auto"
        >
          <div className="flex items-center gap-2.5">
            <a href="#top" aria-label="Joshua Hatfield, home" className="grid size-9 shrink-0 place-items-center rounded-[4px] bg-black">
              <Image src="/websiteicon.png" alt="" width={156} height={154} preload className="size-5" />
            </a>
            <span className="text-[11px] leading-tight tracking-[0.06em] uppercase max-sm:hidden">
              Joshua
              <br />
              Hatfield
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="px-2 text-[11px] tracking-[0.08em] uppercase sm:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>

          <ul id="site-menu" className={`mt-1.5 border-t border-black/10 pt-1.5 ${open ? "" : "max-sm:hidden"}`}>
            {nav.map((n, i) => {
              const on = active === n.href.slice(1);
              return (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    aria-current={on ? "true" : undefined}
                    className={`flex items-center gap-2.5 rounded-[4px] px-2 py-1.5 text-[12px] tracking-[0.08em] uppercase transition-colors ${
                      on ? "bg-black text-white" : "text-black/80 hover:bg-black/[0.06] hover:text-black"
                    }`}
                  >
                    <span className={`tabular-nums ${on ? "text-white/50" : "text-black/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{n.label}</span>
                    {on && <Pixel />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pointer-events-auto flex overflow-hidden rounded-md border border-black bg-black font-mono text-[12px] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <a href={contact} className="flex items-center gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-white hover:text-black">
            <Pixel className="animate-pulse" />
            <span className="tracking-[0.08em] uppercase sm:hidden">Contact</span>
            <span className="max-sm:hidden">{email}</span>
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${email}`}
            className="min-w-[72px] border-l border-white/20 px-3 tracking-[0.08em] uppercase transition-colors hover:bg-white hover:text-black max-sm:hidden"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
