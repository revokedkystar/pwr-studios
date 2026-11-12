import { contact, socials } from "@/content";

/**
 * Direct ways to get in touch: email (mailto:), phone (tel:) and socials.
 * Email and phone only show once they're set in `contact` (content.ts).
 */
export function ContactDetails({ className = "" }: { className?: string }) {
  const tel = contact.phone.replace(/[^\d+]/g, "");
  return (
    <dl className={`grid gap-5 text-base ${className}`}>
      {contact.email && (
        <div>
          <dt className="text-sm text-black/45">Email</dt>
          <dd>
            <a href={`mailto:${contact.email}`} className="tap-target underline-offset-4 hover:underline">
              {contact.email}
            </a>
          </dd>
        </div>
      )}
      {tel && (
        <div>
          <dt className="text-sm text-black/45">Phone</dt>
          <dd>
            <a href={`tel:${tel}`} className="tap-target underline-offset-4 hover:underline">
              {contact.phone}
            </a>
          </dd>
        </div>
      )}
      <div>
        <dt className="text-sm text-black/45">Elsewhere</dt>
        <dd className="flex flex-wrap gap-x-3">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="tap-target justify-center underline-offset-4 hover:underline">
              {s.label}
            </a>
          ))}
        </dd>
      </div>
    </dl>
  );
}
