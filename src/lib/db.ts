import path from "path";

/**
 * Database access layer.
 *
 * - Production (DATABASE_URL set): Neon Postgres over HTTP via
 *   @neondatabase/serverless.
 * - Local development (no DATABASE_URL): a SQLite file at ./data/blog.db
 *   via better-sqlite3, so the whole app runs with zero setup.
 *
 * Both drivers expose the same async query() interface. Schema creation
 * and seeding are idempotent and run lazily on first use.
 */

export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  read_minutes: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

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

const CREATE_TABLE_SQLITE = `
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Tactyqal',
  read_minutes INTEGER NOT NULL DEFAULT 3,
  published_at TEXT NOT NULL DEFAULT (date('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;

const SEED_POSTS: Array<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  read_minutes: number;
  published_at: string;
}> = [
  {
    slug: "elevator-pitch-for-entrepreneurs",
    title: "The elevator pitch for business entrepreneurs",
    excerpt:
      "An elevator pitch is the fastest way to describe what your startup does and why it matters. Here is how to make yours land in under 30 seconds.",
    content:
      "An elevator pitch is the fastest way to describe what your startup does and why it matters.\n\nA strong pitch answers three questions in order: what problem you solve, who you solve it for, and why your approach works. Keep it under 30 seconds, cut every word that does not carry weight, and end with a clear ask.\n\nPractice it out loud until it sounds like a conversation, not a script.",
    read_minutes: 3,
    published_at: "2024-05-01",
  },
  {
    slug: "how-to-build-a-tech-startup-team",
    title: "How to build a tech startup team?",
    excerpt:
      "In the early days, the fewer employees, the better. Managing people takes up a lot of time, so hire slowly and for the gaps that actually block you.",
    content:
      "In the early days, the fewer employees, the better. Managing people takes up a lot of time, and every early hire shapes the culture.\n\nStart by listing the skills the founding team already covers, then hire only for the gaps that block the next milestone. Generalists who can ship beat specialists who need managing.\n\nLook for people who have built things on their own initiative. Side projects tell you more than resumes.",
    read_minutes: 4,
    published_at: "2024-04-20",
  },
  {
    slug: "11-reasons-startups-fail-at-idea-stage",
    title: "11 reasons why startups fail at the idea stage",
    excerpt:
      "The default state of a startup is failure. Most ideas die before a single user tries the product, and the reasons are surprisingly consistent.",
    content:
      "The default state of a startup is failure, and most ideas die before a single user tries the product.\n\nThe most common causes: solving a problem nobody has, building before talking to users, confusing interest with commitment, and quitting before the first real iteration.\n\nThe fix is boring but reliable: talk to ten potential users before writing a line of code, and charge someone something as early as you can.",
    read_minutes: 3,
    published_at: "2024-04-10",
  },
  {
    slug: "50-no-code-startup-app-ideas",
    title: "50 No-code startup app ideas",
    excerpt:
      "A list of 50 unique ideas you can explore for your startup, each one buildable with modern no-code tools in weeks, not months.",
    content:
      "No-code tools have removed the biggest excuse for not starting. Here are 50 ideas you can build this month.\n\nFrom local service marketplaces to niche subscription boxes, each idea on this list can be prototyped with tools like Glide, Bubble or Softr in a few weeks.\n\nPick one, talk to five people who would use it, and build the smallest version that solves their problem.",
    read_minutes: 5,
    published_at: "2025-07-09",
  },
  {
    slug: "30-startup-ideas-food-waste",
    title: "30 Startup ideas to solve food waste problems",
    excerpt:
      "Food waste is a massive problem. Every year, we throw away one-third of all food produced. These 30 ideas attack it from every angle.",
    content:
      "Every year, we throw away one-third of all food produced. That is a massive problem, and a massive opportunity.\n\nThese 30 ideas attack food waste from every angle: redistribution marketplaces, expiry tracking, surplus delivery, compost logistics and more.\n\nThe best ones start local. One restaurant, one apartment complex, one school canteen.",
    read_minutes: 4,
    published_at: "2024-03-15",
  },
  {
    slug: "50-startup-ideas-gen-z",
    title: "50 Startup ideas for Gen-Z Entrepreneurs",
    excerpt:
      "Looking at the opportunities ahead, Generation Z entrepreneurs have advantages no earlier cohort had. Here are 50 ideas matched to those strengths.",
    content:
      "Generation Z entrepreneurs have advantages no earlier cohort had: native fluency in social distribution, comfort with AI tools, and zero attachment to how industries used to work.\n\nThese 50 ideas are matched to those strengths, from creator-economy tooling to climate apps.\n\nYour unfair advantage is speed. Use it.",
    read_minutes: 6,
    published_at: "2024-03-05",
  },
];

let initPromise: Promise<void> | null = null;

function usePostgres() {
  return Boolean(process.env.DATABASE_URL);
}

async function pgQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const { neon } = await import("@neondatabase/serverless");
  const client = neon(process.env.DATABASE_URL as string);
  const rows = await client(sql, params);
  return rows as T[];
}

async function sqliteQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const Database = (await import("better-sqlite3")).default;
  const fs = await import("fs");
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "blog.db"));
  try {
    // Convert $N placeholders to anonymous ?, reordering the params array
    // to match placeholder appearance order (better-sqlite3 binds strictly
    // positionally).
    const ordered: unknown[] = [];
    let replaced = 0;
    const converted = sql.replace(/\$(\d+)/g, (_m, n) => {
      ordered.push(params[Number(n) - 1]);
      replaced++;
      return "?";
    });
    // Statements written with native ? placeholders (e.g. seed inserts)
    // keep their original params untouched.
    const bound = replaced > 0 ? ordered : params;
    const trimmed = converted.trim().toUpperCase();
    if (trimmed.startsWith("SELECT") || trimmed.includes("RETURNING")) {
      return db.prepare(converted).all(...(bound as never[])) as T[];
    }
    db.prepare(converted).run(...(bound as never[]));
    return [] as T[];
  } finally {
    db.close();
  }
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureSchema();
  if (usePostgres()) return pgQuery<T>(sql, params);
  return sqliteQuery<T>(sql, params);
}

async function ensureSchema(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (usePostgres()) {
      await pgQuery(CREATE_TABLE_PG);
      const count = await pgQuery<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM posts"
      );
      if (Number(count[0]?.count ?? 0) === 0) {
        for (const p of SEED_POSTS) {
          await pgQuery(
            `INSERT INTO posts (slug, title, excerpt, content, read_minutes, published_at)
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING`,
            [p.slug, p.title, p.excerpt, p.content, p.read_minutes, p.published_at]
          );
        }
      }
    } else {
      await sqliteQuery(CREATE_TABLE_SQLITE);
      const count = await sqliteQuery<{ count: number }>(
        "SELECT COUNT(*) AS count FROM posts"
      );
      if (Number(count[0]?.count ?? 0) === 0) {
        for (const p of SEED_POSTS) {
          await sqliteQuery(
            `INSERT OR IGNORE INTO posts (slug, title, excerpt, content, read_minutes, published_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [p.slug, p.title, p.excerpt, p.content, p.read_minutes, p.published_at]
          );
        }
      }
    }
  })().catch((err) => {
    initPromise = null;
    throw err;
  });
  return initPromise;
}
