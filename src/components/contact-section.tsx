import { ContactDetails } from "@/components/contact-details";
import { ContactForm } from "@/components/contact-form";

/**
 * Homepage contact section: a clear call to action, direct links and a short
 * enquiry form (the same form as the contact page). Stacks on phones, sits
 * side by side from lg up.
 */
export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-cta" className="bg-white pt-8 pb-24 sm:pb-32">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-4">
        <div>
          <h2 id="contact-cta" data-scroll className="fx-slide section-title">
            Got a project
            <br />
            in mind?
          </h2>
          <p data-scroll data-lag={0.1} className="fx-rise mt-6 max-w-[380px] text-[17px] leading-[1.42] text-black/62">
            Websites, web apps or graphics: tell me what you&apos;re planning and I&apos;ll get back to you, usually
            within a couple of days.
          </p>
          <div data-scroll data-lag={0.2} className="fx-rise mt-10 max-w-[380px]">
            <ContactDetails />
          </div>
        </div>
        <div data-scroll data-lag={0.15} className="fx-rise">
          <ContactForm compact />
        </div>
      </div>
    </section>
  );
}
