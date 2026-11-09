import type { CSSProperties } from "react";
import Image from "next/image";
import { PixelField } from "@/components/pixel-field";
import { RotatingHeadline } from "@/components/rotating-headline";
import { ScrollFx } from "@/components/scroll-fx";
import { StackShowcase } from "@/components/stack-showcase";
import { WorldClocks } from "@/components/world-clocks";
import { ArrowIcon, Asterisk, PillLink, Tag } from "@/components/ui";
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

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="wrap flex items-center justify-between pt-4 sm:pt-[30px]">
        <nav className="flex h-12 items-center gap-6 rounded-full bg-white px-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <a href="#top" aria-label="p*wr studios, home" className="mr-1 sm:mr-4">
            <Asterisk className="size-6" />
          </a>
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="hidden text-base text-black/90 transition-colors hover:text-black/50 sm:inline">
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
      <div data-scroll className="fx-parallax absolute inset-x-0 -top-40 bottom-0 [--speed:420px]">
        <PixelField palette={cloud} mode="clouds" speed={0.012} seed={7} className="size-full" />
      </div>
      <div data-scroll className="fx-hero-out wrap relative pt-10">
        <RotatingHeadline />
        <p className="mx-auto mt-6 max-w-[680px] text-center text-lg leading-[1.45] sm:mt-8 sm:text-xl">{site.intro}</p>
      </div>
    </section>
  );
}

function Screenshot({ src, alt, dark, wide = false }: { src: string; alt: string; dark: boolean; wide?: boolean }) {
  return (
    <div
      className={`absolute inset-0 top-[12%] left-[7%] overflow-hidden rounded-tl-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06)] ${dark ? "bg-[#141414]" : "bg-white"}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={wide ? "(min-width: 1024px) 1200px, 92vw" : "(min-width: 1024px) 600px, 92vw"}
        className="fx-colour object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
  );
}

function Work() {
  return (
    <section id="work" className="bg-white pt-6 pb-16 sm:pb-20">
      <h2 className="sr-only">Work</h2>
      {/* First project runs full width; the rest sit two to a row. */}
      <div className="wrap grid gap-16 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-20">
        {caseStudies.map((c, i) => (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            data-scroll
            data-lag={i === 2 ? 0.15 : 0}
            className={`fx-rise group block ${i === 0 ? "lg:col-span-2" : ""}`}
          >
            <div
              className={`fx-scale relative overflow-hidden rounded-[28px] max-sm:aspect-[4/3] ${i === 0 ? "aspect-[2/1] lg:aspect-[21/9]" : "aspect-[2/1] lg:aspect-[3/2]"}`}
            >
              <PixelField palette={c.palette} seed={c.seed} cell={22} mode="flat" className="absolute inset-0 size-full" />
              <Screenshot src={c.image} alt={c.alt} dark={c.dark} wide={i === 0} />
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
          <Asterisk className="absolute top-1/2 left-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 fx-spin [--turn:-360deg] drop-shadow-[0_2px_0_rgba(0,0,0,0.08)]" fill="#ffffff" />
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
            Built for momentum
          </h2>
          <div data-scroll data-lag={0.15} className="fx-rise max-w-[480px]">
            <p className="text-lg leading-[1.3] sm:text-xl">
              Good ideas lose energy in hand-offs. We keep strategy, design and build in one small team, so your project
              keeps moving from the first workshop to launch day. Here&apos;s how that works.
            </p>
            <div className="mt-7">
              <PillLink href="#" invert>
                How we work
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
            Posters, campaigns and social graphics for fashion, sport and community organisations. Scroll to bring
            them into colour.
          </p>
          <div className="mt-7">
            <PillLink href={site.bookCall}>Commission a graphic</PillLink>
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
          Industry experiences completed with {certificateMeta.issuer}, working through real briefs set by Barclays,
          Amazon Web Services and Drax.
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
        <div data-scroll className="fx-rise">
          <p className="font-serif text-[52px] leading-none tracking-[-0.01em] italic sm:text-6xl">
            p*wr
            <br />
            studios
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
        <svg viewBox="0 0 100 100" data-scroll className="fx-spin absolute top-0 [--turn:240deg] left-1/2 w-[min(92vw,1100px)] -translate-x-1/2">
          <defs>
            <pattern id="stripes" width="1.4" height="1.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="0.55" height="1.4" fill="#0a0a0a" />
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
