// Placeholder projects; replace with real work.
const projects = [
  { title: "Project One", tag: "Branding", year: "2026" },
  { title: "Project Two", tag: "Web", year: "2026" },
  { title: "Project Three", tag: "Motion", year: "2025" },
  { title: "Project Four", tag: "Identity", year: "2025" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <header className="flex items-center justify-between">
        <span className="font-mono text-sm">p*wr studios</span>
        <nav className="flex gap-6 text-sm">
          <a href="#work" className="hover:underline">Work</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </header>

      <section className="py-32">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">p*wr studios</h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-500">
          A creative studio making brands, websites and motion.
        </p>
      </section>

      <section id="work" className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <article key={p.title} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="aspect-video rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            <h2 className="mt-4 font-medium">{p.title}</h2>
            <p className="text-sm text-zinc-500">{p.tag} · {p.year}</p>
          </article>
        ))}
      </section>

      <footer id="contact" className="mt-32 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800">
        <a href="mailto:hello@example.com" className="hover:underline">hello@example.com</a>
        <p className="mt-2">© 2026 p*wr studios</p>
      </footer>
    </main>
  );
}
