import Link from "next/link";
import { listPosts } from "@/lib/posts";
import { coverFor } from "@/lib/blogImages";
import Faq from "@/components/Faq";
import MobileNav from "@/components/MobileNav";

export const dynamic = "force-dynamic";

const stories = [
  {
    name: "KrishiDrishti",
    tag: "AgriTech / AI",
    img: "/images/krishidrishti.jpg",
    text: "AI-powered soil analysis & crop recommendation app that can impact millions of local farmers in India.",
  },
  {
    name: "One Last Chapter",
    tag: "Subscription",
    img: "/images/olc.jpg",
    text: "Book subscription service for kids, started by a 13-year-old and generating INR 1,00,000 monthly revenue.",
  },
  {
    name: "Elenor Vegan Handbags",
    tag: "E-commerce",
    img: "/images/elenor.jpg",
    text: "Corporate gifting platform selling vegan handbags, started by a 16-year-old. INR 9,000 in the first week.",
  },
  {
    name: "Paws of Promise",
    tag: "Marketplace",
    img: "/images/paws.jpg",
    text: "Virtual pet adoption app connecting pet lovers with pets from shelters.",
  },
  {
    name: "AudioNova",
    tag: "AI Music",
    img: "/images/audionova.jpg",
    text: "AI music and video production company built by a student founder.",
  },
  {
    name: "Converza",
    tag: "EdTech",
    img: "/images/converza.jpg",
    text: "Spanish learning app featuring Luna, a friendly AI language-learning bot.",
  },
];

const weeks = [
  {
    span: "Weeks 1-2",
    title: "Ideation & Market Research",
    text: "Find a problem worth solving and validate it with real people before building anything.",
  },
  {
    span: "Weeks 3-4",
    title: "Design & Prototyping",
    text: "Turn the idea into a clickable product your first users can react to.",
  },
  {
    span: "Weeks 5-6",
    title: "Full-Stack Development",
    text: "Build the real app with modern no-code and AI-assisted tools, guided 1:1.",
  },
  {
    span: "Weeks 7-8",
    title: "Launch & Marketing",
    text: "Ship on Product Hunt, get your first users and learn to sell what you built.",
  },
];

const reasons = [
  {
    title: "1:1 Personalized Mentoring",
    text: "Every student gets dedicated, expert guidance. No group classes.",
  },
  {
    title: "Full-Stack App, No Code Needed",
    text: "Students build real apps using modern no-code tools and platforms.",
  },
  {
    title: "Proven Track Record",
    text: "100+ successful students, real revenue and top university admits.",
  },
  {
    title: "University Admission Edge",
    text: "Stand out in applications with real-world projects and achievements.",
  },
  {
    title: "Revenue Generation",
    text: "Students learn to build, launch and monetize their own apps.",
  },
  {
    title: "Lifelong Support",
    text: "From ideation to launch and beyond, we stay with your student.",
  },
  {
    title: "Pitch & Presentation Skills",
    text: "Learn to pitch, present and launch on Product Hunt.",
  },
  {
    title: "Startup Ideas 101",
    text: "Learn how to identify and validate profitable startup ideas from our founder.",
  },
];

const tools = [
  "Startup Idea Generator",
  "Fundability Assessment",
  "Team Evaluation Tool",
  "Pitch Deck Analyzer",
  "Top 10 Traits For Business Success",
  "Cofounder Compatibility Test",
  "Problem-Solution Fit",
  "Landing Page Assessment",
];

const testimonials = [
  {
    name: "Aarav Sharma",
    quote: "I had been struggling to find a tech cofounder. Now I don't need one.",
  },
  {
    name: "Isha Patel",
    quote: "Now I feel independent and can build anything I want.",
  },
  {
    name: "Rohan Verma",
    quote: "It's the future.",
  },
  {
    name: "Simran Kaur",
    quote:
      "I can focus on the creative side and don't have to worry about whether it can be built.",
  },
  {
    name: "Devansh Mehta",
    quote: "I went from having no idea to launching my own app.",
  },
  {
    name: "Priya Nair",
    quote: "My impact app was only in my head until I built it.",
  },
];

export default async function Home() {
  const posts = (await listPosts()).slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="text-lg font-bold text-white">
            Tactyqal<span className="text-indigo-400"> Labs</span>
          </a>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#stories" className="hover:text-white">Success Stories</a>
            <a href="#program" className="hover:text-white">Program</a>
            <a href="#why" className="hover:text-white">Why Us</a>
            <a href="#tools" className="hover:text-white">Tools</a>
            <a href="#blog" className="hover:text-white">Blog</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a
              href="#contact"
              className="rounded-lg bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400"
            >
              Book Free Consultation
            </a>
          </div>
          <MobileNav />
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 text-center">
          <p className="eyebrow">8-week 1:1 program for teen builders</p>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Empower your kid to build the next app that{" "}
            <span className="gradient-text">impacts millions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            1:1 mentoring from idea to full-stack app. No coding needed.
            University admissions edge, grants and media coverage included.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#contact" className="btn-primary">
              Book Free Consultation
            </a>
            <a href="#stories" className="btn-ghost">
              See student apps
            </a>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["100+", "Students mentored"],
              ["Top", "University admissions"],
              ["1000s", "Of people impacted"],
            ].map(([num, label]) => (
              <div key={label} className="card p-6">
                <p className="text-3xl font-bold text-white">{num}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section id="stories" className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow">Success stories</p>
          <h2 className="section-title">
            Real students. Real apps.{" "}
            <span className="gradient-text">Real success.</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <div key={s.name} className="card p-6">
                <div
                  className="flex h-40 items-end rounded-xl bg-cover bg-center p-4"
                  style={{ backgroundImage: `url(${s.img})` }}
                >
                  <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-indigo-200">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program */}
      <section id="program" className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow">The program</p>
          <h2 className="section-title">
            From idea to full app in{" "}
            <span className="gradient-text">8 weeks</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {weeks.map((w, i) => (
              <div key={w.span} className="card relative p-6">
                <p className="text-4xl font-bold text-indigo-500/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  {w.span}
                </p>
                <h3 className="mt-2 font-semibold text-white">{w.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{w.text}</p>
              </div>
            ))}
          </div>
          <blockquote className="card mx-auto mt-16 max-w-3xl p-8 text-center">
            <p className="text-xl italic text-slate-200">
              &ldquo;Learn to sell. Learn to build. If you can do both, you will
              be unstoppable.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-slate-500">
              &mdash; Naval Ravikant
            </footer>
          </blockquote>
          <p className="mt-10 text-center text-sm text-slate-400">
            Personal 1:1 live sessions &bull; 1 hour each &bull; Expert guidance
            on admissions, revenue, recognition and grants
          </p>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow">Why us</p>
          <h2 className="section-title">
            Why parents choose{" "}
            <span className="gradient-text">Tactyqal Labs</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="card p-6">
                <h3 className="font-semibold text-white">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow">Free tools</p>
          <h2 className="section-title">
            Startup tools used by{" "}
            <span className="gradient-text">1000+ entrepreneurs</span>
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <div
                key={t}
                className="card flex items-center gap-3 p-5 text-sm text-slate-200 transition hover:border-indigo-400/40"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                {t}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="#contact" className="btn-ghost">
              Access all tools free
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title">
            What our <span className="gradient-text">students say</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card p-6">
                <blockquote className="text-slate-300">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="text-sm font-medium text-indigo-300">
                    {t.name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Blog (served by the new backend) */}
      <section id="blog" className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow">Blog</p>
          <h2 className="section-title">
            Learn from <span className="gradient-text">industry experts</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="card group p-6 transition hover:border-indigo-400/40"
              >
                <div
                  className="h-28 rounded-xl bg-gradient-to-br from-indigo-500/30 to-sky-500/20 bg-cover bg-center"
                  style={
                    coverFor(p.slug)
                      ? { backgroundImage: `url(${coverFor(p.slug)})` }
                      : undefined
                  }
                />
                <h3 className="mt-4 font-semibold text-white group-hover:text-indigo-200">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {p.excerpt}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  By {p.author} &bull; {p.read_minutes} min read
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="btn-ghost">
              Read all articles
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-line py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="section-title">
            Start your teen&apos;s{" "}
            <span className="gradient-text">entrepreneurial journey</span>
          </h2>
          <div className="card mt-12 p-10">
            <p className="text-sm text-slate-400 line-through">₹25,000</p>
            <p className="mt-1 text-5xl font-bold text-white">₹16,000</p>
            <p className="mt-2 text-sm text-indigo-300">
              Limited time offer &mdash; only 15 spots this month
            </p>
            <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm text-slate-300">
              {[
                "8 weeks of 1:1 mentoring",
                "Full-stack app development",
                "Product Hunt launch",
                "Pitch deck creation",
                "Marketing strategy",
                "Ongoing lifetime support",
                "Results guaranteed or money back",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 text-indigo-400">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#contact" className="btn-primary mt-10">
              Enroll now
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <Faq />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-line py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-10 text-center">
            <p className="eyebrow">Contact</p>
            <h2 className="section-title">
              Ready to start your teen&apos;s{" "}
              <span className="gradient-text">success story?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Reach out to our dedicated team for any inquiries, assistance or
              information you need.
            </p>
            <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-line p-4">
                <p className="text-slate-500">Email</p>
                <p className="mt-1 font-medium text-white">
                  tactyqal.labs@gmail.com
                </p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-slate-500">Phone</p>
                <p className="mt-1 font-medium text-white">+91-98047-72106</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-slate-500">Hours</p>
                <p className="mt-1 font-medium text-white">
                  Mon&ndash;Sat, 9am&ndash;7pm
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Response time: within 24 hours
            </p>
            <a
              href="mailto:tactyqal.labs@gmail.com"
              className="btn-primary mt-8"
            >
              Book a free appointment
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center text-sm text-slate-500">
        <p>
          Tactyqal Labs &mdash; homepage redesign concept, built for the
          Fullstack Developer Intern hire-a-thon.
        </p>
      </footer>
    </main>
  );
}
