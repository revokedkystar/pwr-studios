import type { ReactNode } from "react";

/** The p*wr asterisk mark. */
export function Asterisk({ className, fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {[0, 60, 120].map((r) => (
        <rect key={r} x="41" y="4" width="18" height="92" rx="9" fill={fill} transform={`rotate(${r} 50 50)`} />
      ))}
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Black pill plus a separate round arrow button, the site's main call to action. */
export function PillLink({
  href,
  children,
  invert = false,
}: {
  href: string;
  children: ReactNode;
  invert?: boolean;
}) {
  const tone = invert ? "bg-white text-black" : "bg-black text-white";
  return (
    <a href={href} className="group inline-flex items-center gap-2">
      <span className={`${tone} rounded-full px-6 py-3 text-base leading-5 transition-transform duration-300 group-hover:-translate-y-0.5`}>
        {children}
      </span>
      <span className={`${tone} grid size-11 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45`}>
        <ArrowIcon className="size-4" />
      </span>
    </a>
  );
}

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[13px] ${dark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/80"}`}
    >
      {children}
    </span>
  );
}
