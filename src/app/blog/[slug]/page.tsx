import Link from "next/link";
import { notFound } from "next/navigation";
import { coverFor } from "@/lib/blogImages";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="text-sm text-indigo-300 hover:text-indigo-200"
      >
        &larr; All posts
      </Link>
      {coverFor(post.slug) && (
        <div
          className="mt-8 h-56 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${coverFor(post.slug)})` }}
        />
      )}
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-white">
        {post.title}
      </h1>
      <p className="mt-4 text-sm text-slate-500">
        By {post.author} &bull; {post.read_minutes} min read &bull;{" "}
        {post.published_at}
      </p>
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-slate-300">
        {post.content.split(/\n+/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </main>
  );
}
