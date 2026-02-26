import { sanityFetch } from "@/sanity/lib/client";
import { featuredPostsQuery, recentPostsQuery } from "@/sanity/lib/queries";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPosts from "../components/Home/FeaturedPosts";
import RecentPosts from "../components/Home/RecentPosts";

export default async function Home() {
  const language = "en";

  const [featured, recent] = await Promise.all([
    sanityFetch({
      query: featuredPostsQuery,
      params: { language },
      tags: ["post"],
    }),
    sanityFetch({
      query: recentPostsQuery,
      params: { language, limit: 10 },
      tags: ["post"],
    }),
  ]);

  // Use featured for cover and featured sections, recent for recent section
  const coverPosts = featured?.length > 0 ? featured : recent || [];
  const featuredDisplay = featured?.length >= 3 ? featured.slice(0, 3) : [];
  const recentDisplay = recent?.slice(0, 6) || [];

  return (
    <main className="flex flex-col items-center justify-center">
      <HomeCoverSection blogs={coverPosts} />
      <FeaturedPosts blogs={featuredDisplay} />
      <RecentPosts blogs={recentDisplay} />
    </main>
  );
}
