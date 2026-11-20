import { NextRequest, NextResponse } from "next/server";
import { validatePostInput, writeAuthorized } from "@/lib/adminAuth";
import { deletePost, getPostById, updatePost } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx): Promise<number | null> {
  const { id } = await ctx.params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!writeAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const body = await req.json();
    const invalid = validatePostInput(body, true);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }
    const post = await updatePost(id, body ?? {});
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update post", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!writeAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
