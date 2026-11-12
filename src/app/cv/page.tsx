import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollFx } from "@/components/scroll-fx";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PillLink, Tag } from "@/components/ui";
import { cv, socials } from "@/content";

const TITLE = "CV: @h4tfi3ld, Web Developer & Designer | xanti studios";
const DESCRIPTION =
  "The CV of @h4tfi3ld, a web developer and designer in Devon, UK: industry experience with Barclays, AWS and Drax, work history, education and skills.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cv" },
  // A page's openGraph replaces the layout's, so the shared fields are repeated.
  openGraph: { type: "website", siteName: "xanti studios", title: TITLE, description: DESCRIPTION, url: "/cv" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

type Job = { org: string; role: string; period: string; points: string[] };

/** Title on the left, content on the right: the layout the other sections use. */
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="bg-white pb-20 sm:pb-28">
      <div className="wrap grid gap-8 lg:grid-cols-2 lg:gap-4">
        <h2 id={id} data-scroll className="fx-slide section-title">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

function Jobs({ jobs }: { jobs: Job[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {jobs.map((j, i) => (
        <li key={j.org} data-scroll data-lag={i * 0.1} className="fx-rise rounded-2xl bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-xl font-medium tracking-[-0.01em]">{j.org}</h3>
            <p className="text-sm text-black/50 tabular-nums">{j.period}</p>
          </div>
          <div className="mt-2">
            <Tag>{j.role}</Tag>
          </div>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-normal text-black/65">
            {j.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export default function CvPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section aria-labelledby="cv-title" className="bg-white pt-36 pb-20 sm:pt-44 sm:pb-28">
          <div className="wrap grid gap-8 lg:grid-cols-2 lg:gap-4">
            <h1 id="cv-title" data-scroll className="fx-slide section-title">
              CV
            </h1>
            <div data-scroll data-lag={0.1} className="fx-rise">
              <p className="text-[17px] leading-[1.42] text-black/65">{cv.intro}</p>
              <div className="mt-8">
                <PillLink href="/contact">Get in touch</PillLink>
              </div>
            </div>
          </div>
        </section>

        <Block id="industry" title="Industry experience">
          <Jobs jobs={cv.industry} />
        </Block>

        <Block id="work" title="Work experience">
          <Jobs jobs={cv.work} />
        </Block>

        <Block id="education" title="Education">
          <ol className="flex flex-col gap-3">
            {cv.education.map((e, i) => (
              <li key={e.period} data-scroll data-lag={i * 0.1} className="fx-rise rounded-2xl bg-surface p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl font-medium tracking-[-0.01em]">{e.org}</h3>
                  <p className="text-sm text-black/50 tabular-nums">{e.period}</p>
                </div>
                <p className="mt-2 text-[15px] leading-normal text-black/65">{e.detail}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block id="skills" title="Technical skills">
          <ul className="flex flex-col gap-5">
            {cv.skills.map((s, i) => (
              <li key={s.name} data-scroll data-lag={i * 0.06} className="fx-rise">
                <div className="flex items-baseline justify-between text-[17px]">
                  <span>{s.name}</span>
                  <span className="text-sm text-black/50 tabular-nums">{s.level}%</span>
                </div>
                <div
                  role="meter"
                  aria-label={s.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={s.level}
                  className="mt-2 h-2 overflow-hidden rounded-full bg-surface"
                >
                  <div className="h-full rounded-full bg-black" style={{ width: `${s.level}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="elsewhere" title="Elsewhere">
          <ul data-scroll className="fx-rise flex flex-wrap gap-x-6 gap-y-2 text-[17px]">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="underline-offset-4 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Block>
      </main>
      <SiteFooter />
      <ScrollFx />
    </>
  );
}
