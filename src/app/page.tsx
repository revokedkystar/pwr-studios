// Placeholder content; replace with real work, writing and links.
const work = [
  { title: "Project One: the outcome it delivered", blurb: "One or two sentences on the problem, what you made, and the result.", href: "#" },
  { title: "Project Two: the outcome it delivered", blurb: "One or two sentences on the problem, what you made, and the result.", href: "#" },
];

const writing = [
  { title: "A question your note answers?", blurb: "A one-line hook that makes someone want to read it.", href: "#" },
  { title: "Another short essay title", blurb: "A one-line hook that makes someone want to read it.", href: "#" },
];

const nav = ["Work", "About", "Writing", "Play"];

const socials = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Instagram", href: "#" },
];

function List({ items }: { items: { title: string; blurb: string; href: string }[] }) {
  return (
    <ul className="space-y-8">
      {items.map((i) => (
        <li key={i.title}>
          <a href={i.href} className="group block">
            <h3 className="font-medium underline-offset-4 group-hover:underline">{i.title}</h3>
            <p className="mt-1 text-zinc-500">{i.blurb}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-20">
      <nav className="mb-20 flex gap-5 text-sm text-zinc-500">
        {nav.map((n) => (
          <a key={n} href={`#${n.toLowerCase()}`} className="hover:text-foreground">{n}</a>
        ))}
      </nav>

      <header>
        <h1 className="font-medium">
          p*wr studios, <span className="font-serif italic">a creative studio</span>
        </h1>
        <p className="mt-4 text-zinc-500">
          A short positioning line: what you do, who for, and a result you are proud of.
        </p>
      </header>

      <section id="work" className="mt-20">
        <h2 className="mb-8 text-sm text-zinc-500">Work</h2>
        <List items={work} />
      </section>

      <section id="writing" className="mt-20">
        <h2 className="mb-8 text-sm text-zinc-500">Writing</h2>
        <List items={writing} />
      </section>

      <footer id="about" className="mt-24 space-y-3 text-sm text-zinc-500">
        <a href="mailto:hello@example.com" className="hover:text-foreground">hello@example.com</a>
        <ul className="flex flex-wrap gap-4">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} className="hover:text-foreground">{s.label}</a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
