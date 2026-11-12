import { PillLink, Tag } from "@/components/ui";
import { about, cv } from "@/content";

/**
 * "About me" on the homepage: who's behind xanti studios, the current role,
 * education and industry experience. Education and the current role are
 * read from the CV content, so both pages stay in step.
 */
export function AboutSection() {
  const now = cv.industry[0];
  return (
    // relative z-10 and a white background: the pinned work section below
    // tucks slightly underneath (it has a negative top margin).
    <section id="about" aria-labelledby="about-title" className="relative z-10 bg-white pt-24 pb-36 sm:pt-32 sm:pb-44">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-4">
        <div>
          <h2 id="about-title" data-scroll className="fx-slide section-title">
            About me
          </h2>
          <div data-scroll data-lag={0.1} className="fx-rise mt-6 flex max-w-[480px] flex-col gap-4 text-[17px] leading-[1.45] text-black/70">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div data-scroll data-lag={0.2} className="fx-rise mt-8">
            <PillLink href="/cv">Read my CV</PillLink>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div data-scroll className="fx-rise rounded-2xl bg-surface p-6 sm:p-7">
            <p className="text-sm text-black/45">Now</p>
            <p className="mt-2 text-xl font-medium tracking-[-0.01em]">{now.role}</p>
            <p className="mt-1 text-[15px] text-black/60">
              {now.org} · {now.period}
            </p>
          </div>

          <div data-scroll data-lag={0.1} className="fx-rise rounded-2xl bg-surface p-6 sm:p-7">
            <p className="text-sm text-black/45">Education</p>
            <ol className="mt-3 flex flex-col gap-4">
              {cv.education.map((e) => (
                <li key={e.org}>
                  <p className="text-[17px] font-medium leading-snug">{e.detail}</p>
                  <p className="mt-0.5 text-[15px] text-black/60">
                    {e.org} · {e.period}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div data-scroll data-lag={0.2} className="fx-rise rounded-2xl bg-surface p-6 sm:p-7">
            <p className="text-sm text-black/45">Industry experience with</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {about.industry.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
