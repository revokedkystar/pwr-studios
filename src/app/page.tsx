import type { CSSProperties } from "react";
import { PixelField } from "@/components/pixel-field";
import { RotatingHeadline } from "@/components/rotating-headline";
import { WorldClocks } from "@/components/world-clocks";
import { ArrowIcon, Asterisk, PillLink, Tag } from "@/components/ui";
import {
  caseStudies,
  clocks,
  faqs,
  moments,
  nav,
  notes,
  playTiles,
  process,
  site,
  sky,
  socials,
} from "@/content";

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="wrap flex items-center justify-between pt-4 sm:pt-[30px]">
        <nav className="flex h-12 items-center gap-6 rounded-full bg-white px-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <a href="#top" aria-label="p*wr studios, home" className="mr-1 sm:mr-4">
            <Asterisk className="size-6" />
          </a>
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="hidden text-base text-black/90 transition-colors hover:text-sky sm:inline">
              {n.label}
            </a>
          ))}
        </nav>
        <PillLink href={site.bookCall}>Book a call</PillLink>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex h-[100svh] max-h-[880px] min-h-[600px] items-center overflow-hidden">
      <PixelField palette={sky} mode="clouds" speed={0.012} seed={7} className="absolute inset-0 size-full" />
      <div className="wrap relative pt-10">
        <RotatingHeadline />
        <p className="mx-auto mt-6 max-w-[680px] text-center text-lg leading-[1.45] sm:mt-8 sm:text-xl">{site.intro}</p>
      </div>
    </section>
  );
}

function BrowserMock({ dark }: { dark: boolean }) {
  const frame = dark ? "bg-[#151816] text-white/50" : "bg-white text-black/40";
  const block = dark ? "bg-white/[0.07]" : "bg-black/[0.05]";
  return (
    <div className={`absolute inset-0 top-[12%] left-[7%] flex overflow-hidden rounded-tl-xl shadow-[0_0_0_1px_rgba(0,0,0,0.04)] ${frame}`}>
      <div className={`flex w-[7%] flex-col items-center gap-3 pt-4 ${block}`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`size-3 rounded ${block}`} />
        ))}
      </div>
      <div className="flex-1 p-[4%]">
        <p className="text-[11px]">Add a screenshot of the finished work here</p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`aspect-[4/5] rounded-lg ${block}`} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`aspect-[4/3] rounded-lg ${block}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className="bg-white pt-6 pb-16 sm:pb-20">
      <h2 className="sr-only">Work</h2>
      <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,530px)] lg:gap-4">
        <div className="flex flex-col gap-16 lg:gap-14">
          {caseStudies.map((c) => (
            <a key={c.title} href={c.href} className="group block">
              <div className="relative aspect-[2/1] overflow-hidden rounded-[28px] max-sm:aspect-[4/3]">
                <PixelField palette={c.palette} seed={c.seed} cell={22} mode="flat" className="absolute inset-0 size-full" />
                <BrowserMock dark={c.dark} />
                <span className="absolute top-2 right-2 grid size-10 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowIcon className="size-4" />
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <h3 className="mt-2 max-w-[580px] text-[26px] leading-[1.15] font-medium tracking-[-0.01em] sm:text-[32px]">
                {c.title}
              </h3>
              <p className="mt-2 text-base text-black/55">{c.client}</p>
            </a>
          ))}
        </div>

        <div id="play" className="grid grid-cols-2 content-start gap-3 sm:gap-4">
          <h3 className="sr-only">Play</h3>
          {playTiles.map((t) => (
            <a
              key={t.title}
              href="#"
              className="group relative grid aspect-[3/2] place-items-center overflow-hidden rounded-[20px]"
              style={{ background: t.bg, color: t.fg }}
            >
              <span className="font-serif text-4xl italic transition-transform duration-500 group-hover:scale-110 sm:text-5xl">
                {t.glyph}
              </span>
              <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {t.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Momentum() {
  return (
    <section aria-labelledby="momentum" className="relative">
      <PixelField palette={sky} mode="fade-up" seed={41} className="h-[220px] w-full sm:h-[300px]" />
      <div className="bg-sky pt-10 pb-16 text-white sm:pb-20">
        <div className="relative mx-auto aspect-square w-[min(520px,82vw)]">
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <PixelField
              palette={["#00aaff", "#7ccbff", "#ffffff"]}
              cell={14}
              scale={0.13}
              seed={5}
              speed={0.01}
              className="size-full"
            />
          </div>
          <Asterisk className="absolute top-1/2 left-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_0_rgba(0,0,0,0.08)]" fill="#ffffff" />
          {process.map((p) => (
            <span
              key={p.label}
              className="absolute flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-sm whitespace-nowrap text-black shadow-sm"
              style={{ left: p.x, top: p.y }}
            >
              <span className="size-3 rounded-sm" style={{ background: p.color }} />
              {p.label}
            </span>
          ))}
        </div>

        <div className="wrap mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-4">
          <h2 id="momentum" className="text-[44px] leading-none font-medium tracking-[-0.01em] sm:text-6xl">
            Built for momentum
          </h2>
          <div className="max-w-[480px]">
            <p className="text-lg leading-[1.3] sm:text-xl">
              Good ideas lose energy in hand-offs. We keep strategy, design and build in one small team, so your project
              keeps moving from the first workshop to launch day. Here&apos;s how that works.
            </p>
            <div className="mt-7">
              <PillLink href="#">How we work</PillLink>
            </div>
          </div>
        </div>
      </div>
      <PixelField palette={sky} mode="fade-down" seed={58} className="h-[220px] w-full sm:h-[300px]" />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-24 lg:py-0">
      <div className="wrap relative lg:h-[820px]">
        <div className="relative z-10 mx-auto max-w-[480px] text-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <h2 className="section-title">
            Beyond
            <br />
            the brief
          </h2>
          <p className="mx-auto mt-6 max-w-[360px] text-[17px] leading-[1.42] text-black/65">
            Always making, rarely alone. Running workshops, hosting design nights, and sharing plenty of laughs in
            between.
          </p>
          <div className="mt-7">
            <PillLink href="#">More about us</PillLink>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-0 lg:block">
          {moments.map((m, i) => (
            <li
              key={m.caption}
              className={`${i >= 6 ? "max-lg:hidden" : ""} group relative h-40 overflow-hidden rounded-[22px] lg:absolute lg:top-(--y) lg:left-(--x) lg:h-(--h) lg:w-(--w) lg:rotate-(--r)`}
              style={
                {
                  "--x": m.x,
                  "--y": m.y,
                  "--w": `${m.w}px`,
                  "--h": `${m.h}px`,
                  "--r": `${m.r}deg`,
                  background: m.tint,
                } as CSSProperties
              }
            >
              <span className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] rounded-full bg-white/85 px-2 py-0.5 text-[11px] text-black/70 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                {m.caption}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="bg-white pt-24 pb-24 sm:pt-28 sm:pb-32">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-start">
        <h2 className="section-title">Field notes</h2>
        <div>
          <p className="text-[17px] leading-[1.42] text-black/65">
            Writing on design, brands, and what we learn shipping both.
          </p>
          <div className="mt-6">
            <PillLink href="#">More writing</PillLink>
          </div>
        </div>
      </header>

      <div className="no-scrollbar mt-14 overflow-x-auto sm:mt-20">
        <ul className="wrap flex gap-8 pb-8 sm:gap-14">
          {notes.map((n, i) => (
            <li key={n.title} className="shrink-0 pt-2">
              <a
                href={n.href}
                className="stamp block w-[260px] sm:w-[300px]"
                style={{ rotate: `${[-1.5, 1, -0.8, 1.4][i % 4]}deg` }}
              >
                <div className="aspect-square overflow-hidden">
                  <PixelField palette={n.palette} seed={100 + i * 13} cell={12} dither={1.5} scale={0.14} className="size-full" />
                </div>
                <div className="perforation -mx-1 my-2" />
                <div className="flex items-end justify-between px-1 pb-1" style={{ color: n.color }}>
                  <div>
                    <p className="text-[10px] tabular-nums">{n.date}</p>
                    <p className="mt-0.5 max-w-[150px] font-serif text-[26px] leading-[0.9] italic">{n.title}</p>
                  </div>
                  <span className="text-4xl leading-none tabular-nums">{n.number}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SmallTalk() {
  return (
    <section aria-labelledby="small-talk" className="bg-white pt-16 pb-24 sm:pb-36">
      <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-4">
        <div>
          <h2 id="small-talk" className="section-title">
            Small talk
          </h2>
          <p className="mt-6 max-w-[352px] text-[17px] leading-[1.42] text-black/62">
            The quick answers are here. For anything else, just ask.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-surface">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-5 text-[17px]">
                {f.q}
                <svg viewBox="0 0 16 16" className="faq-plus size-4 shrink-0 text-black/50 transition-[rotate] duration-300" aria-hidden>
                  <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm leading-normal text-black/62">{f.a}</p>
            </details>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="group flex items-center gap-3 rounded-2xl bg-surface py-3 pr-3 pl-5 text-[17px] text-black/35 transition-colors hover:text-black/60"
          >
            <span className="size-7 overflow-hidden rounded-sm">
              <PixelField palette={sky} cell={4} dither={1} scale={0.4} seed={9} className="size-full" />
            </span>
            <span className="flex-1">Ask us anything else</span>
            <span className="grid size-8 place-items-center rounded-full bg-black/15 text-white transition-colors group-hover:bg-black">
              <ArrowIcon className="size-3.5 -rotate-45" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="overflow-hidden bg-white pt-10">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-4">
        <div>
          <p className="font-serif text-[52px] leading-none tracking-[-0.01em] italic sm:text-6xl">
            p*wr
            <br />
            studios
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-base">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hover:text-sky">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-sky">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap justify-between gap-10">
          <nav className="flex flex-col gap-1.5 text-base">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="hover:text-sky">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="h-fit">
            <WorldClocks clocks={clocks} />
          </div>
        </div>
      </div>

      <div className="wrap relative mt-16 h-[46vw] max-h-[620px] sm:mt-24" aria-hidden>
        <svg viewBox="0 0 100 100" className="absolute top-0 left-1/2 w-[min(92vw,1100px)] -translate-x-1/2">
          <defs>
            <pattern id="stripes" width="1.4" height="1.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="0.55" height="1.4" fill="#00aaff" />
            </pattern>
            <mask id="asterisk">
              {[0, 60, 120].map((r) => (
                <rect key={r} x="41" y="4" width="18" height="92" rx="9" fill="#fff" transform={`rotate(${r} 50 50)`} />
              ))}
            </mask>
          </defs>
          <rect width="100" height="100" fill="url(#stripes)" mask="url(#asterisk)" />
        </svg>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Work />
        <Momentum />
        <About />
        <Writing />
        <SmallTalk />
      </main>
      <Footer />
    </>
  );
}
