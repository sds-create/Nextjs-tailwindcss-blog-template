import BlogDetails from "@/src/components/Blog/BlogDetails";
import RenderPortableText from "@/src/components/Blog/RenderPortableText";
import Tag from "@/src/components/Elements/Tag";
import siteMetadata from "@/src/utils/siteMetaData";
import { sanityFetch } from "@/sanity/lib/client";
import {
  postBySlugQuery,
  postSlugsQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await sanityFetch({
    query: postSlugsQuery,
    tags: ["post"],
  });
  return (slugs || []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });
  if (!blog) return;

  const publishedAt = new Date(blog.publishedAt).toISOString();
  const modifiedAt = new Date(
    blog.updatedAt || blog.publishedAt
  ).toISOString();

  const ogImageUrl = blog.image
    ? urlFor(blog.image).width(1200).height(630).url()
    : siteMetadata.socialBanner;

  const ogImages = [{ url: ogImageUrl }];
  const authorName = blog.author?.name || siteMetadata.author;

  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt,
      url: `${siteMetadata.siteUrl}/blogs/${slug}`,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors: [authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt,
      images: ogImages,
    },
  };
}

// Utility: extract headings from Portable Text for table of contents
function extractHeadings(body) {
  if (!body || !Array.isArray(body)) return [];
  const headings = [];

  body.forEach((block) => {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children
        ?.map((child) => child.text)
        .join("") || "";
      headings.push({
        _key: block._key,
        style: block.style,
        text,
      });
    }
  });

  // Nest h3s under their preceding h2
  const toc = [];
  let currentH2 = null;

  headings.forEach((heading) => {
    if (heading.style === "h2") {
      currentH2 = {
        url: `#${heading._key}`,
        title: heading.text,
        items: [],
      };
      toc.push(currentH2);
    } else if (heading.style === "h3") {
      const item = {
        url: `#${heading._key}`,
        title: heading.text,
        items: [],
      };
      if (currentH2) {
        currentH2.items.push(item);
      } else {
        toc.push(item);
      }
    }
  });

  return toc;
}

function TableOfContentsItem({ item, level = "two" }) {
  return (
    <li className="py-1">
      <a
        href={item.url}
        data-level={level}
        className="data-[level=two]:pl-0 data-[level=two]:pt-2
                  data-[level=two]:border-t border-solid border-dark/40
                  data-[level=three]:pl-4
                  sm:data-[level=three]:pl-6
                  flex items-center justify-start"
      >
        {level === "three" && (
          <span className="flex w-1 h-1 rounded-full bg-dark mr-2">
            &nbsp;
          </span>
        )}
        <span className="hover:underline">{item.title}</span>
      </a>
      {item.items?.length > 0 && (
        <ul className="mt-1">
          {item.items.map((subItem) => (
            <TableOfContentsItem
              key={subItem.url}
              item={subItem}
              level="three"
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const blog = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });

  if (!blog) {
    notFound();
  }

  const imageUrl = blog.image
    ? urlFor(blog.image).width(1600).height(900).url()
    : "";
  const tagSlug =
    blog.tags?.[0]?.slug?.current || blog.tags?.[0]?.slug || "";
  const tagTitle = blog.tags?.[0]?.title || "";
  const toc = extractHeadings(blog.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: blog.title,
    description: blog.excerpt,
    image: imageUrl ? [imageUrl] : [siteMetadata.socialBanner],
    datePublished: new Date(blog.publishedAt).toISOString(),
    dateModified: new Date(
      blog.updatedAt || blog.publishedAt
    ).toISOString(),
    author: [
      {
        "@type": "Person",
        name: blog.author?.name || siteMetadata.author,
        url: siteMetadata.twitter,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <div className="mb-8 text-center relative w-full h-[70vh] bg-dark">
          <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {tagTitle && (
              <Tag
                name={tagTitle}
                link={`/categories/${tagSlug}`}
                className="px-6 text-sm py-2"
              />
            )}
            <h1 className="inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6">
              {blog.title}
            </h1>
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40" />
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={blog.title || ""}
              width={1600}
              height={900}
              className="aspect-square w-full h-full object-cover object-center"
              priority
              sizes="100vw"
            />
          )}
        </div>
        <BlogDetails blog={blog} slug={slug} />

        <div className="grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10">
          <div className="col-span-12 lg:col-span-4">
            {toc.length > 0 && (
              <details
                className="border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto"
                open
              >
                <summary className="text-lg font-semibold capitalize cursor-pointer">
                  Table Of Content
                </summary>
                <ul className="mt-4 font-in text-base">
                  {toc.map((item) => (
                    <TableOfContentsItem key={item.url} item={item} />
                  ))}
                </ul>
              </details>
            )}
          </div>
          <RenderPortableText content={blog.body} />
        </div>
      </article>
    </>
  );
}
