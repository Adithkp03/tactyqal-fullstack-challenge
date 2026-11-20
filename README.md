# Tactyqal Labs — Fullstack Developer Intern Hire-a-thon

Submission for the Tactyqal Labs Fullstack Developer Intern hiring challenge.

## What this is

1. **Task 1 — Homepage redesign.** A modern, responsive redesign of the
   Tactyqal Labs homepage (originally CodeIgniter) built with Next.js,
   React, TypeScript and Tailwind CSS. All real content (success stories,
   program structure, tools, testimonials, pricing, FAQ, contact) is
   preserved and reorganized with a clearer visual hierarchy.
2. **Task 2 — Blog backend.** A replacement for the current WordPress blog:
   a `posts` table (slug, title, excerpt, content, author, read time,
   publish date, timestamps) with a REST CRUD API and a simple admin UI.

   - `GET    /api/posts` — list all posts
   - `POST   /api/posts` — create a post
   - `GET    /api/posts/:id` — fetch one post
   - `PUT    /api/posts/:id` — update a post
   - `DELETE /api/posts/:id` — delete a post

   The blog is rendered at `/blog` and `/blog/[slug]`, managed at `/admin`,
   and the redesigned homepage's blog section is served by the same backend.

   Seed posts are **abbreviated samples** rebuilt from the excerpts shown on
   the current homepage. They are not migrated articles: the existing
   WordPress blog (tactyqal.com/blog) currently returns a critical error on
   every page, so full text could not be retrieved. Replacing them with the
   real articles is a one-time paste job in `/admin` once the content is
   available.

## Stack

- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS
- Database: Neon Postgres in production (`DATABASE_URL`), local SQLite
  (`better-sqlite3`, zero setup) in development. The schema is created and
  seeded with the current Tactyqal blog posts automatically on first use.

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000  — redesigned homepage
# http://localhost:3000/blog  — blog served by the new backend
# http://localhost:3000/admin — blog admin UI (uses the CRUD API)
```

Production: set `DATABASE_URL` to a Neon Postgres connection string and
`ADMIN_TOKEN` to a long random string, then deploy to Vercel. Write API
calls (`POST /api/posts`, `PUT/DELETE /api/posts/:id`) require
`Authorization: Bearer <ADMIN_TOKEN>`; the admin UI at `/admin` has a token
field for this. Reads stay public. With no `ADMIN_TOKEN` set (local
development), writes are open so the demo runs with zero setup. See
`.env.example`.

## Notes

- Built with AI assistance (allowed by the challenge rules).
- Original site: https://tactyqal.com/
