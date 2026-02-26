import { NextResponse } from "next/server";
import { writeClient, client } from "../../../../sanity/lib/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 }
      );
    }

    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ viewCount }`,
      { slug }
    );

    return NextResponse.json({ viewCount: post?.viewCount || 0 });
  } catch (error) {
    console.error("Error fetching view count:", error);
    return NextResponse.json(
      { error: "Failed to fetch view count" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
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
