import Link from "next/link";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata = { title: "Blog — Tactyqal Labs" };

export default async function BlogPage() {
  const posts = await listPosts();
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <Link href="/" className="text-sm text-indigo-300 hover:text-indigo-200">
        &larr; Back to home
      </Link>
      <p className="eyebrow mt-10">Blog</p>
      <h1 className="section-title">
        Ideas worth <span className="gradient-text">building on</span>
      </h1>
      <p className="mt-4 max-w-2xl text-slate-400">
        Essays and playbooks from the Tactyqal team on startups, no-code and
        building young. Served by the new blog backend.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="card group p-6 transition hover:border-indigo-400/40"
          >
            <div className="h-28 rounded-xl bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-sky-500/30" />
            <h2 className="mt-5 text-lg font-semibold text-white group-hover:text-indigo-200">
              {p.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-slate-400">
              {p.excerpt}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              By {p.author} &bull; {p.read_minutes} min read &bull;{" "}
              {p.published_at}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
