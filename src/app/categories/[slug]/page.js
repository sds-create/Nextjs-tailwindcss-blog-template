import { sanityFetch } from "@/sanity/lib/client";
import {
  allCategoriesQuery,
  allPostsQuery,
  postsByCategoryQuery,
} from "@/sanity/lib/queries";
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";

export async function generateStaticParams() {
  const categories = await sanityFetch({
    query: allCategoriesQuery,
    tags: ["category"],
  });
  const paths = [{ slug: "all" }];
  (categories || []).forEach((cat) => {
    if (cat.slug?.current) {
      paths.push({ slug: cat.slug.current });
    }
  });
  return paths;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.replaceAll("-", " ")} Blogs`,
    description: `Learn more about ${
      slug === "all" ? "web development" : slug
    } through our collection of expert blogs and tutorials`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const language = "en";

  // Fetch categories and posts in parallel
  const [allCategories, posts] = await Promise.all([
    sanityFetch({
      query: allCategoriesQuery,
      tags: ["category"],
    }),
    slug === "all"
      ? sanityFetch({
          query: allPostsQuery,
          params: { language },
          tags: ["post"],
        })
      : sanityFetch({
          query: postsByCategoryQuery,
          params: { categorySlug: slug, language },
          tags: ["post", "category"],
        }),
  ]);

  // Build category list with "all" prepended
  const categoryList = [
    { slug: { current: "all" }, title: "all" },
    ...(allCategories || []),
  ];

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl">
          #{slug}
        </h1>
        <span className="mt-2 inline-block">
          Discover more categories and expand your knowledge!
        </span>
      </div>
      <Categories categories={categoryList} currentSlug={slug} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
        {(posts || []).map((blog, index) => (
          <article
            key={blog._id || index}
            className="col-span-1 row-span-1 relative"
          >
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
    </article>
  );
}
