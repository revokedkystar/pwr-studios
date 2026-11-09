/**
 * Contact form endpoint. The browser posts here, and the message is forwarded
 * to the inbox by FormSubmit (formsubmit.co) from the server, so the address
 * it goes to never reaches the page or the browser bundle.
 *
 * Set CONTACT_EMAIL in the hosting environment to change where messages go.
 *
 * FormSubmit asks the inbox owner to confirm once: the first message sends an
 * activation email to that inbox, and forwarding starts once the link in it
 * is clicked.
 */
const INBOX = process.env.CONTACT_EMAIL || "hatfij08@gmail.com";
const SITE = "https://pwr-studios.vercel.app";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field, so quietly accept.
  if (text(body._honey, 200)) return Response.json({ ok: true });

  const name = text(body.name, 100);
  const email = text(body.email, 200);
  const message = text(body.message, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  // FormSubmit expects to be called from a web page, so pass the page along.
  const origin = request.headers.get("origin") || SITE;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/contact`,
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _replyto: email,
        _subject: `New message from ${name} via your portfolio`,
        _template: "table",
        _captcha: "false",
      }),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    if (!res.ok || String(json.success) !== "true") {
      console.error("Contact form: FormSubmit refused the message", res.status, json.message);
      return Response.json({ ok: false, error: "The message couldn't be delivered." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form: could not reach FormSubmit", err);
    return Response.json({ ok: false, error: "The message couldn't be delivered." }, { status: 502 });
  }
}
