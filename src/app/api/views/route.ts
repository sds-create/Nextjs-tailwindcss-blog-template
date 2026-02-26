import { NextResponse } from "next/server";
import { writeClient } from "../../../../sanity/lib/client";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    // Find the post by slug
    const post = await writeClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id, viewCount }`,
      { slug }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count
    const newCount = (post.viewCount || 0) + 1;
    await writeClient.patch(post._id).set({ viewCount: newCount }).commit();

    return NextResponse.json({ viewCount: newCount });
  } catch (error) {
    console.error("Error updating view count:", error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}
