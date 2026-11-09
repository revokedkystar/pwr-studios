"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form. Submissions are forwarded to `email` by FormSubmit
 * (formsubmit.co), so the site needs no mail server or API key. The sender's
 * address is used as the reply-to, so replies go straight back to them.
 *
 * FormSubmit asks the inbox owner to confirm once: the first submission
 * triggers an activation email to `email`, and forwarding starts after the
 * link in it is clicked.
 */
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot: real people never see or fill this field.
    if (data.get("_honey")) return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          _subject: `New message from ${data.get("name")} via your portfolio`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) !== "true") throw new Error("Not sent");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl bg-surface p-8">
        <p className="text-2xl font-medium tracking-[-0.01em]">Thanks, message sent.</p>
        <p className="mt-2 text-[17px] text-black/60">I&apos;ll get back to you as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-black/60 underline underline-offset-4 hover:text-black"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-xl bg-surface px-4 py-3.5 text-[17px] outline-none placeholder:text-black/35 transition-shadow focus:shadow-[inset_0_0_0_1.5px_#000]";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Your name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Your email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="Your email"
            className={field}
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder="What would you like to talk about?"
          className={`${field} resize-y`}
        />
      </label>
      {/* Spam trap, hidden from people and screen readers. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-black px-7 py-3.5 text-base text-white transition-[opacity,translate] hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" ? (
          <p role="alert" className="text-sm text-black/70">
            That didn&apos;t send. Please try again, or email{" "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
            .
          </p>
        ) : (
          <p className="text-sm text-black/45">Goes straight to my inbox.</p>
        )}
      </div>
    </form>
  );
}
