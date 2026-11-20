// Verifies the production (Postgres) SQL statements used in src/lib/db.ts and
// src/lib/posts.ts against pg-mem, an in-memory Postgres implementation.
import { newDb } from "pg-mem";

const db = newDb();
const { Client } = db.adapters.createPg();
const client = new Client();
await client.connect();
const many = async (sql, params = []) => (await client.query(sql, params)).rows;

const CREATE_TABLE_PG = `
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Tactyqal',
  read_minutes INTEGER NOT NULL DEFAULT 3,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

let failures = 0;
const check = async (name, fn) => {
  try {
    const r = await fn();
    console.log(`ok   ${name}${r !== undefined ? ` -> ${JSON.stringify(r).slice(0, 120)}` : ""}`);
  } catch (e) {
    failures++;
    console.log(`FAIL ${name}: ${e.message.split("\n")[0]}`);
  }
};

await check("create table", () => many(CREATE_TABLE_PG));

await check("count cast", async () => {
  const rows = await many("SELECT COUNT(*)::text AS count FROM posts");
  if (rows[0].count !== "0") throw new Error("expected 0, got " + rows[0].count);
  return rows[0];
});

await check("seed insert on conflict", () =>
  many(
    `INSERT INTO posts (slug, title, excerpt, content, read_minutes, published_at)
     VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING`,
    ["test-post", "Test", "e", "c", 3, "2026-01-01"]
  )
);

await check("createPost insert returning", async () => {
  const rows = await many(
    `INSERT INTO posts (slug, title, excerpt, content, author, read_minutes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    ["second-post", "Second", "x", "y", "Tactyqal", 5]
  );
  if (rows.length !== 1 || rows[0].slug !== "second-post") throw new Error("bad insert");
  return rows[0].id;
});

await check("select by slug", async () => {
  const rows = await many("SELECT * FROM posts WHERE slug = $1 LIMIT 1", ["second-post"]);
  if (rows.length !== 1) throw new Error("not found");
});

const id = (await many("SELECT id FROM posts WHERE slug = $1", ["second-post"]))[0].id;

await check("updatePost update returning", async () => {
  const rows = await many(
    `UPDATE posts
       SET slug = $2, title = $3, excerpt = $4, content = $5,
           author = $6, read_minutes = $7, updated_at = $8
     WHERE id = $1
     RETURNING *`,
    [id, "renamed", "T", "e2", "c2", "A", 9, new Date().toISOString()]
  );
  if (rows.length !== 1 || rows[0].slug !== "renamed") throw new Error("bad update");
  return rows[0].slug;
});

await check("list order", async () => {
  const rows = await many("SELECT * FROM posts ORDER BY published_at DESC, id DESC");
  if (rows.length !== 2) throw new Error("expected 2 rows");
  return rows.map((r) => r.slug);
});

await check("delete", async () => {
  await many("DELETE FROM posts WHERE id = $1", [id]);
  const rows = await many("SELECT * FROM posts");
  if (rows.length !== 1) throw new Error("expected 1 row left");
});

await check("unique slug violation", async () => {
  try {
    await many(`INSERT INTO posts (slug, title) VALUES ($1, $2)`, ["test-post", "dupe"]);
    throw new Error("should have thrown");
  } catch (e) {
    if (!/unique/i.test(e.message)) throw e;
    return "unique violation raised";
  }
});

console.log(failures ? `\n${failures} FAILURES` : "\nall pg SQL checks passed");
process.exit(failures ? 1 : 0);
