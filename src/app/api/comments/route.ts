import { NextResponse } from "next/server";
import { writeClient } from "../../../../sanity/lib/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, content, postId, honeypot } = body;

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      // Silently reject spam but return success to not alert the bot
      return NextResponse.json({ message: "Comment submitted" });
    }

    // Validate required fields
    if (!name || !email || !content || !postId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Comment too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitize = (str: string) =>
      str
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .trim();

    // Create comment document in Sanity
    const comment = await writeClient.create({
      _type: "comment",
      name: sanitize(name),
      email: sanitize(email),
      content: sanitize(content),
      post: { _type: "reference", _ref: postId },
      approved: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Comment submitted and awaiting approval",
      id: comment._id,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}
