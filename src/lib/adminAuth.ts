import { NextRequest } from "next/server";

/**
 * Write-access guard for the blog API.
 *
 * When ADMIN_TOKEN is set (production), POST/PUT/DELETE require
 * `Authorization: Bearer <ADMIN_TOKEN>`. When it is not set (local
 * development), writes are allowed so the demo runs with zero setup.
 * Reads are always public.
 */
export function writeAuthorized(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    const header = req.headers.get("authorization") ?? "";
    return header === `Bearer ${token}`;
  }
  // No token configured: fail closed in production. Open writes exist only
  // for local development (next dev, NODE_ENV=development).
  if (process.env.NODE_ENV === "production") {
    console.error(
      "ADMIN_TOKEN is not set: refusing blog write requests in production."
    );
    return false;
  }
  return true;
}

export interface PostInput {
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  read_minutes?: number;
  slug?: string;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Returns an error message, or null when the input is valid. */
export function validatePostInput(
  body: unknown,
  partial: boolean
): string | null {
  if (typeof body !== "object" || body === null) return "Invalid body";
  const b = body as Record<string, unknown>;

  function str(
    key: keyof PostInput,
    max: number,
    required: boolean
  ): string | null {
    const v = b[key as string];
    if (v === undefined || v === null || v === "") {
      return required ? `${key} is required` : null;
    }
    if (typeof v !== "string") return `${key} must be a string`;
    if (v.length > max) return `${key} must be at most ${max} characters`;
    return null;
  }

  for (const check of [
    str("title", 200, !partial),
    str("excerpt", 500, false),
    str("content", 20000, false),
    str("author", 100, false),
  ]) {
    if (check) return check;
  }

  if (b.read_minutes !== undefined && b.read_minutes !== null) {
    const n = Number(b.read_minutes);
    if (!Number.isInteger(n) || n < 1 || n > 120) {
      return "read_minutes must be an integer between 1 and 120";
    }
  }

  if (b.slug !== undefined && b.slug !== null && b.slug !== "") {
    if (typeof b.slug !== "string" || !SLUG_RE.test(b.slug)) {
      return "slug must be lowercase letters, numbers and hyphens";
    }
  }

  return null;
}
