import Link from "next/link";
import { WorldClocks } from "@/components/world-clocks";
import { clocks, nav, socials } from "@/content";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-white pt-10">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-4">
        <div data-scroll className="fx-rise">
          <p className="font-serif text-[52px] leading-none tracking-[-0.01em] italic sm:text-6xl">
            by
            <br />
            @h4tfi3ld
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-3 text-base">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="tap-target justify-center hover:text-black/50">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap justify-between gap-10">
          <nav className="-mt-3 flex flex-col text-base">
            {nav.map((n) => (
              <Link key={n.label} href={n.href} className="tap-target hover:text-black/50">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="h-fit">
            <WorldClocks clocks={clocks} />
          </div>
        </div>
      </div>

      <div className="wrap relative mt-16 h-[46vw] max-h-[620px] sm:mt-24" aria-hidden>
        {/* The logo shape, cut out of diagonal stripes with a CSS mask. */}
        <div
          data-scroll
          className="logo-stripes fx-spin absolute top-0 left-1/2 aspect-[156/154] w-[min(92vw,1100px)] -translate-x-1/2 [--turn:240deg]"
        />
      </div>
    </footer>
  );
}
