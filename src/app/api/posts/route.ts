import { NextRequest, NextResponse } from "next/server";
import { createPost, listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await listPosts();
    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load posts", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }
    const post = await createPost({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      read_minutes: body.read_minutes,
      slug: body.slug,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const message = String(err);
    if (message.toLowerCase().includes("unique")) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post", detail: message },
      { status: 500 }
    );
  }
}
