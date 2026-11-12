import { PillLink } from "@/components/ui";
import { process } from "@/content";

/**
 * "How it works": the four steps of a website project, from first message
 * to launch. Sits above the contact section, so step 1 is right below it.
 */
export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-white pt-16 pb-16 sm:pt-20 sm:pb-24">
      <header className="wrap grid gap-8 lg:grid-cols-[1fr_352px] lg:items-end">
        <h2 id="process-title" data-scroll className="fx-slide section-title">
          How it
          <br />
          works
        </h2>
        <p data-scroll data-lag={0.1} className="fx-rise text-[17px] leading-[1.42] text-black/65">
          From your first message to a live website, in four steps. You always know what happens next, and what it
          costs.
        </p>
      </header>

      <ol className="wrap mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((step, i) => (
          <li key={step.title} data-scroll data-lag={i * 0.1} className="fx-rise flex flex-col rounded-2xl bg-surface p-6 sm:p-7">
            <span className="font-serif text-[56px] leading-none italic text-black/20" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-8 text-xl font-medium tracking-[-0.01em]">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-[15px] leading-normal text-black/62">{step.text}</p>
          </li>
        ))}
      </ol>

      <div data-scroll className="fx-rise wrap mt-10 flex justify-center">
        <PillLink href="#contact">Start with step 1</PillLink>
      </div>
    </section>
  );
}
