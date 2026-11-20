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
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("adminToken") ?? "");
  }, []);

  function saveToken(v: string) {
    setToken(v);
    localStorage.setItem("adminToken", v);
  }

  function authHeaders(): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

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
        headers: { "Content-Type": "application/json", ...authHeaders() },
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
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setStatus(
      res.ok
        ? "Post deleted."
        : res.status === 401
          ? "Unauthorized — check the admin token."
          : "Delete failed."
    );
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
      <a href="/" className="text-sm text-neutral-300 hover:text-neutral-200">
        &larr; Back to home
      </a>
      <p className="eyebrow mt-10">Blog admin</p>
      <h1 className="section-title">
        Manage <span className="gradient-text">posts</span>
      </h1>
      <p className="mt-4 max-w-2xl text-neutral-400">
        Create, edit and delete blog posts through the new CRUD API
        (<code>GET/POST /api/posts</code>, <code>GET/PUT/DELETE /api/posts/:id</code>).
      </p>
      <p className="mt-3 max-w-2xl text-xs text-neutral-500">
        Seed posts are abbreviated samples rebuilt from the excerpts on the
        current homepage; the existing WordPress blog is offline (critical
        error), so full-text migration was not possible.
      </p>
      <label className="mt-6 block max-w-md text-sm text-neutral-400">
        Admin token (required when the site is deployed)
        <input
          type="password"
          value={token}
          onChange={(e) => saveToken(e.target.value)}
          placeholder="ADMIN_TOKEN"
          className="mt-2 w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white/60 focus:outline-none"
        />
      </label>

      <form onSubmit={submit} className="card mt-10 space-y-4 p-6">
        <h2 className="text-lg font-semibold text-white">
          {editingId ? `Editing post #${editingId}` : "New post"}
        </h2>
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white/60 focus:outline-none"
        />
        <textarea
          placeholder="Excerpt"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white/60 focus:outline-none"
        />
        <textarea
          placeholder="Content"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white/60 focus:outline-none"
        />
        <div className="flex flex-wrap gap-4">
          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white/60 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-400">
            Read minutes
            <input
              type="number"
              min={1}
              value={form.read_minutes}
              onChange={(e) =>
                setForm({ ...form, read_minutes: Number(e.target.value) })
              }
              className="w-20 rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-white focus:border-white/60 focus:outline-none"
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
          <span className="text-sm text-neutral-400">{status}</span>
        </div>
      </form>

      <div className="mt-10 space-y-3">
        {loading ? (
          <p className="text-neutral-500">Loading posts...</p>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-xs text-neutral-500">
                  /blog/{p.slug} &bull; {p.published_at} &bull; {p.read_minutes}{" "}
                  min
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/blog/${p.slug}`}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-neutral-300 hover:border-white/40"
                >
                  View
                </a>
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-neutral-300 hover:border-white/40"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white hover:border-white/50"
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
