import { query, PostRow } from "./db";

export type { PostRow };

export async function listPosts(): Promise<PostRow[]> {
  return query<PostRow>(
    "SELECT * FROM posts ORDER BY published_at DESC, id DESC"
  );
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const rows = await query<PostRow>(
    "SELECT * FROM posts WHERE slug = $1 LIMIT 1",
    [slug]
  );
  return rows[0] ?? null;
}

export async function getPostById(id: number): Promise<PostRow | null> {
  const rows = await query<PostRow>(
    "SELECT * FROM posts WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createPost(input: {
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  read_minutes?: number;
  slug?: string;
}): Promise<PostRow> {
  const slug = input.slug?.trim() || slugify(input.title);
  const rows = await query<PostRow>(
    `INSERT INTO posts (slug, title, excerpt, content, author, read_minutes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      slug,
      input.title,
      input.excerpt ?? "",
      input.content ?? "",
      input.author ?? "Tactyqal",
      input.read_minutes ?? 3,
    ]
  );
  return rows[0];
}

export async function updatePost(
  id: number,
  input: Partial<{
    title: string;
    excerpt: string;
    content: string;
    author: string;
    read_minutes: number;
    slug: string;
  }>
): Promise<PostRow | null> {
  const existing = await getPostById(id);
  if (!existing) return null;
  const merged = { ...existing, ...input };
  const rows = await query<PostRow>(
    `UPDATE posts
       SET slug = $2, title = $3, excerpt = $4, content = $5,
           author = $6, read_minutes = $7, updated_at = $8
     WHERE id = $1
     RETURNING *`,
    [
      id,
      merged.slug,
      merged.title,
      merged.excerpt,
      merged.content,
      merged.author,
      merged.read_minutes,
      new Date().toISOString(),
    ]
  );
  return rows[0] ?? null;
}

export async function deletePost(id: number): Promise<boolean> {
  const existing = await getPostById(id);
  if (!existing) return false;
  await query("DELETE FROM posts WHERE id = $1", [id]);
  return true;
}
