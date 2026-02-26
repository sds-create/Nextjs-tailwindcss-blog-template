import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, _type } = body;

    // Verify the webhook secret
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Revalidate based on content type
    switch (_type) {
      case "post":
        revalidateTag("posts");
        revalidateTag("featured");
        revalidateTag("recent");
        break;
      case "category":
        revalidateTag("categories");
        break;
      case "author":
        revalidateTag("author");
        break;
      case "siteSettings":
        revalidateTag("settings");
        break;
      case "seoSettings":
        revalidateTag("seo-settings");
        break;
      case "navigation":
        revalidateTag("navigation");
        break;
      case "comment":
        revalidateTag("comments");
        break;
      default:
        // Revalidate everything for unknown types
        revalidateTag("posts");
        revalidateTag("settings");
    }

    return NextResponse.json({ revalidated: true, type: _type });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
