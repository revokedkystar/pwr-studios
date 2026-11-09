import type { CSSProperties } from "react";
import Image from "next/image";
import { PinnedWork } from "@/components/pinned-work";
import { PixelField } from "@/components/pixel-field";
import { HERO_DISSOLVE } from "@/components/hero-events";
import { HeroHeadline } from "@/components/hero-headline";
import { ScrollFx } from "@/components/scroll-fx";
import { StackShowcase } from "@/components/stack-showcase";
import { WorldClocks } from "@/components/world-clocks";
import { ArrowIcon, PillLink, Tag } from "@/components/ui";
import {
  caseStudies,
  certificateMeta,
  certificates,
  clocks,
  faqs,
  graphics,
  logos,
  nav,
  notes,
  process,
  site,
  cloud,
  ink,
  socials,
  stack,
} from "@/content";

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

function Header() {
  return (
    // A black notch hanging from the top edge of the screen, centred.
    <header className="fixed top-0 left-1/2 z-50 -translate-x-1/2">
      <nav aria-label="Sections" className="relative flex h-[53px] items-center gap-6 rounded-b-[18px] bg-black pr-2.5 pl-3 text-white sm:gap-8">
        <NotchEar side="left" />
        <NotchEar side="right" />
        <a href="#top" aria-label="p*wr, home" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-[30px] place-items-center rounded-[8px] bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
            <Image src="/websiteicon.png" alt="" width={156} height={154} preload className="size-[18px]" />
          </span>
          <span className="text-base font-semibold tracking-[-0.01em] whitespace-nowrap">p*wr</span>
        </a>
        <ul className="flex items-center gap-7 max-md:hidden">
          {nav.map((n) => (
            <li key={n.label}>
              <a href={n.href} className="text-sm font-medium whitespace-nowrap text-white/60 transition-colors hover:text-white">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Contact button, in the slot where the reference has its Download button. */}
        <a
          href={site.contact}
          className="flex h-[33px] shrink-0 items-center gap-1.5 rounded-[8px] bg-white px-4 text-xs font-semibold text-black transition-colors hover:bg-white/85 md:ml-2"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="1.5" y="3" width="13" height="10" rx="2" />
            <path d="m2 4 6 5 6-5" strokeLinejoin="round" />
          </svg>
          Contact
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    // Tall section with a sticky panel: the hero stays pinned while scrolling
    // through it, and HeroHeadline scrubs the intro from that scroll.
    <section id="top" data-hero className="relative z-10 h-[220svh] bg-white">
      <div className="sticky top-0 flex h-svh min-h-[600px] items-center overflow-hidden">
        <div className="absolute inset-x-0 -top-40 bottom-0">
          <PixelField palette={cloud} mode="clouds" speed={0.012} seed={7} dissolveOn={HERO_DISSOLVE} className="size-full" />
        </div>
        <div className="wrap relative pt-10">
          <HeroHeadline />
          <p className="mx-auto mt-6 max-w-[680px] text-center text-lg leading-[1.45] sm:mt-8 sm:text-xl">{site.intro}</p>
        </div>
      </div>
    </section>
  );
}

function Momentum() {
  return (
    <section aria-labelledby="momentum" className="relative overflow-x-clip">
      <PixelField palette={ink} mode="fade-up" seed={41} className="h-[220px] w-full sm:h-[300px]" />
      <div className="bg-ink pt-10 pb-16 text-white sm:pb-20">
        <div data-scroll className="fx-grow relative mx-auto aspect-square w-[min(520px,82vw)]">
          <div className="fx-spin absolute inset-0 overflow-hidden rounded-full [--turn:140deg]">
            <PixelField
              palette={["#0a0a0a", "#4a4a4a", "#d4d4d4"]}
              cell={14}
              scale={0.13}
              seed={5}
              speed={0.01}
              className="size-full"
            />
          </div>
          <Image
            src="/websiteicon.png"
            alt=""
            width={156}
            height={154}
            className="absolute top-1/2 left-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 fx-spin [--turn:-360deg] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
          />
          {process.map((p, i) => (
            <span
              key={p.label}
              data-scroll
              data-lag={0.2 + i * 0.15}
              className="fx-rise absolute flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-sm whitespace-nowrap text-black shadow-sm"
              style={{ left: p.x, top: p.y }}
            >
              <span className="size-3 rounded-sm" style={{ background: p.color }} />
              {p.label}
            </span>
          ))}
        </div>

        <div className="wrap mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-4">
          <h2 id="momentum" data-scroll className="fx-slide text-[44px] leading-none font-medium tracking-[-0.01em] sm:text-6xl">
            How I work
          </h2>
          <div data-scroll data-lag={0.15} className="fx-rise max-w-[480px]">
            <p className="text-lg leading-[1.3] sm:text-xl">
              I like taking an idea from the first sketch to something real: planning it out, designing how it should
              look and feel, then building it in code. Here&apos;s the stack I use to get there.
            </p>
            <div className="mt-7">
              <PillLink href="#stack" invert>
                See my stack
              </PillLink>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <StackShowcase areas={stack} />
        </div>
      </div>
      <PixelField palette={ink} mode="fade-down" seed={58} className="h-[220px] w-full sm:h-[300px]" />
    </section>
  );
}

function Graphics() {
  return (
    <section id="graphics" className="relative overflow-hidden bg-white py-24 lg:py-0">
      <div className="wrap relative lg:h-[860px]">
        <div className="relative z-10 mx-auto max-w-[480px] text-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <h2 data-scroll className="fx-rise fx-scale section-title">
            Graphic
            <br />
            design
          </h2>
          <p data-scroll data-lag={0.1} className="fx-rise mx-auto mt-6 max-w-[380px] text-[17px] leading-[1.42] text-black/65">
            Posters, campaigns and social graphics I&apos;ve designed for fashion, sport and community projects. Scroll
            to bring them into colour.
          </p>
          <div className="mt-7">
            <PillLink href={site.contact}>Say hello</PillLink>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-0 lg:block">
          {graphics.map((g, i) => (
            <li
              key={g.src}
              data-scroll
              data-lag={(i % 3) * 0.12}
              className={`${g.w > g.h ? "col-span-2 aspect-[3/1]" : "aspect-[4/5]"} fx-rise fx-parallax-lg group relative overflow-hidden rounded-[22px] bg-surface lg:absolute lg:top-(--y) lg:left-(--x) lg:aspect-auto lg:h-(--h) lg:w-(--w) lg:rotate-(--r) lg:hover:z-20`}
              style={
                {
                  "--x": g.x,
                  "--y": g.y,
                  "--w": `${g.w}px`,
                  "--h": `${g.h}px`,
                  "--r": `${g.r}deg`,
                  "--speed": `${[-260, 180, -120, 240, -200, 140][i % 6]}px`,
                } as CSSProperties
              }
            >
              <a href={g.src} target="_blank" rel="noreferrer" className="block size-full">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="fx-colour object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Certificates() {
  return (
    <section id="certificates" className="bg-white pt-24 pb-10 sm:pt-28">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-start">
        <h2 data-scroll className="fx-slide section-title">Certificates</h2>
        <p data-scroll data-lag={0.1} className="fx-rise text-[17px] leading-[1.42] text-black/65">
          Industry experiences I&apos;ve completed with {certificateMeta.issuer}, working through real briefs set by
          Barclays, Amazon Web Services and Drax.
        </p>
      </header>

      <ul className="wrap mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((c, i) => (
          <li key={c.image} data-scroll data-lag={i * 0.1} className="fx-rise">
            <a href={c.image} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-[3508/2483] overflow-hidden rounded-[20px] bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                <Image
                  src={c.image}
                  alt={`${certificateMeta.issuer} certificate: ${c.title} with ${c.partner}`}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92vw"
                  className="fx-colour object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Tag>{c.partner}</Tag>
                <Tag>{certificateMeta.issuer}</Tag>
              </div>
              <h3 className="mt-2 text-lg leading-snug font-medium">{c.title}</h3>
              <p className="mt-1 text-sm text-black/50">Issued {certificateMeta.issued}</p>
            </a>
          </li>
        ))}
      </ul>

      <div data-scroll className="fx-rise wrap mt-20 sm:mt-28">
        <p className="text-sm text-black/50">Experience with</p>
        <ul className="mt-6 flex flex-wrap items-center gap-x-14 gap-y-8">
          {logos.map((l) => (
            <li key={l.name}>
              <Image src={l.src} alt={l.name} width={140} height={40} className="mono h-10 w-auto sm:h-12" />
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
        <h2 data-scroll className="fx-slide section-title">Field notes</h2>
        <div data-scroll data-lag={0.1} className="fx-rise">
          <p className="text-[17px] leading-[1.42] text-black/65">
            Writing on design, code, and what I learn building both.
          </p>
          <div className="mt-6">
            <PillLink href="#">More writing</PillLink>
          </div>
        </div>
      </header>

      <div className="no-scrollbar mt-14 overflow-x-auto sm:mt-20">
        <ul className="wrap flex gap-8 pb-8 sm:gap-14">
          {notes.map((n, i) => (
            <li
              key={n.title}
              data-scroll
              data-lag={i * 0.12}
              className="fx-drop shrink-0 pt-2"
              style={{ "--tilt": `${i % 2 ? 12 : -12}deg` } as CSSProperties}
            >
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
          <h2 id="small-talk" data-scroll className="fx-slide section-title">
            Small talk
          </h2>
          <p className="mt-6 max-w-[352px] text-[17px] leading-[1.42] text-black/62">
            The quick answers are here. For anything else, just ask.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((f, i) => (
            <details key={f.q} data-scroll data-lag={i * 0.08} className="fx-rise group rounded-2xl bg-surface">
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
            data-scroll
            data-lag={0.4}
            className="fx-rise group flex items-center gap-3 rounded-2xl bg-surface py-3 pr-3 pl-5 text-[17px] text-black/35 transition-colors hover:text-black/60"
          >
            <span className="size-7 overflow-hidden rounded-sm">
              <PixelField palette={ink} cell={4} dither={1} scale={0.4} seed={9} className="size-full" />
            </span>
            <span className="flex-1">Ask me anything else</span>
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
        <div data-scroll className="fx-rise">
          <p className="font-serif text-[52px] leading-none tracking-[-0.01em] italic sm:text-6xl">
            Joshua
            <br />
            Hatfield
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-base">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hover:text-black/50">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-black/50">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap justify-between gap-10">
          <nav className="flex flex-col gap-1.5 text-base">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="hover:text-black/50">
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
        {/* The logo shape, cut out of diagonal stripes with a CSS mask. */}
        <div
          data-scroll
          className="logo-stripes fx-spin absolute top-0 left-1/2 aspect-[156/154] w-[min(92vw,1100px)] -translate-x-1/2 [--turn:240deg]"
        />
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
        <PinnedWork items={caseStudies} />
        <Momentum />
        <Graphics />
        <Certificates />
        <Writing />
        <SmallTalk />
      </main>
      <Footer />
      <ScrollFx />
    </>
  );
}
