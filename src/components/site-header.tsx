import Image from "next/image";
import Link from "next/link";
import { nav } from "@/content";

/** Concave corner that flares the notch out into the top edge of the screen. */
function NotchEar({ side }: { side: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={`absolute top-0 size-5 ${side === "left" ? "-left-5" : "-right-5 -scale-x-100"}`}
    >
      <path d="M0 0H20V20A20 20 0 0 0 0 0Z" fill="#000" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    // A black notch hanging from the top edge of the screen, centred.
    <header className="fixed top-0 left-1/2 z-50 -translate-x-1/2">
      <nav aria-label="Sections" className="relative flex h-[53px] items-center gap-6 rounded-b-[18px] bg-black pr-2.5 pl-3 text-white sm:gap-8">
        <NotchEar side="left" />
        <NotchEar side="right" />
        <Link href="/" aria-label="xanti studios, home" className="flex min-h-12 shrink-0 items-center gap-2.5">
          {/* The mark sits straight on the black bar: no tile or border. */}
          <span className="grid size-[30px] place-items-center">
            <Image src="/websiteicon.png" alt="" width={156} height={154} preload className="size-[22px]" />
          </span>
          <span className="text-base font-semibold tracking-[-0.01em] whitespace-nowrap">xanti</span>
        </Link>
        <ul className="flex items-center gap-7 max-md:hidden">
          {nav.map((n) => (
            <li key={n.label}>
              <Link href={n.href} className="tap-area text-sm font-medium whitespace-nowrap text-white/60 transition-colors hover:text-white">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Contact button (opens the contact page), where the reference has its Download button. */}
        <Link
          href="/contact"
          className="tap-area flex h-[33px] shrink-0 items-center gap-1.5 rounded-[8px] bg-white px-4 text-xs font-semibold text-black transition-colors hover:bg-white/85 md:ml-2"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="1.5" y="3" width="13" height="10" rx="2" />
            <path d="m2 4 6 5 6-5" strokeLinejoin="round" />
          </svg>
          Contact
        </Link>
      </nav>
    </header>
  );
}
