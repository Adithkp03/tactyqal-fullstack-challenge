"use client";

import { useCallback, useEffect, useState } from "react";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  read_minutes: number;
  published_at: string;
};

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "Tactyqal",
  read_minutes: 3,
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(editingId ? "Saving changes..." : "Creating post...");
    const res = await fetch(
      editingId ? `/api/posts/${editingId}` : "/api/posts",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    if (res.ok) {
      setStatus(editingId ? "Post updated." : "Post created.");
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus(`Error: ${data.error ?? res.statusText}`);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this post?")) return;
    setStatus("Deleting...");
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setStatus(res.ok ? "Post deleted." : "Delete failed.");
    await load();
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      read_minutes: p.read_minutes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <a href="/" className="text-sm text-indigo-300 hover:text-indigo-200">
        &larr; Back to home
      </a>
      <p className="eyebrow mt-10">Blog admin</p>
      <h1 className="section-title">
        Manage <span className="gradient-text">posts</span>
      </h1>
      <p className="mt-4 max-w-2xl text-slate-400">
        Create, edit and delete blog posts through the new CRUD API
        (<code>GET/POST /api/posts</code>, <code>GET/PUT/DELETE /api/posts/:id</code>).
      </p>

      <form onSubmit={submit} className="card mt-10 space-y-4 p-6">
        <h2 className="text-lg font-semibold text-white">
          {editingId ? `Editing post #${editingId}` : "New post"}
        </h2>
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <textarea
          placeholder="Excerpt"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <textarea
          placeholder="Content"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <div className="flex flex-wrap gap-4">
          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-slate-400">
            Read minutes
            <input
              type="number"
              min={1}
              value={form.read_minutes}
              onChange={(e) =>
                setForm({ ...form, read_minutes: Number(e.target.value) })
              }
              className="w-20 rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
            />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">
            {editingId ? "Save changes" : "Create post"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel edit
            </button>
          )}
          <span className="text-sm text-slate-400">{status}</span>
        </div>
      </form>

      <div className="mt-10 space-y-3">
        {loading ? (
          <p className="text-slate-500">Loading posts...</p>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-xs text-slate-500">
                  /blog/{p.slug} &bull; {p.published_at} &bull; {p.read_minutes}{" "}
                  min
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/blog/${p.slug}`}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate-300 hover:border-indigo-400/50"
                >
                  View
                </a>
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate-300 hover:border-indigo-400/50"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-400/60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
