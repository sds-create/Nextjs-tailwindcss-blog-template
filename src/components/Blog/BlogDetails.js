import { format, parseISO } from "date-fns";
import Link from "next/link";
import React from "react";
import ViewCounter from "./ViewCounter";

const BlogDetails = ({ blog, slug: blogSlug }) => {
  const tagSlug = blog.tags?.[0]?.slug?.current || blog.tags?.[0]?.slug || "";
  const tagTitle = blog.tags?.[0]?.title || "";

  return (
    <div className="px-2 md:px-10 bg-accent dark:bg-accentDark text-light dark:text-dark py-2 flex items-center justify-around flex-wrap text-lg sm:text-xl font-medium mx-5 md:mx-10 rounded-lg">
      <time className="m-3">
        {blog.publishedAt
          ? format(parseISO(blog.publishedAt), "LLLL d, yyyy")
          : ""}
      </time>
      <span className="m-3">
        <ViewCounter slug={blogSlug} />
      </span>
      {blog.readingTime && (
        <div className="m-3">{blog.readingTime} min read</div>
      )}
      {tagTitle && (
        <Link href={`/categories/${tagSlug}`} className="m-3">
          #{tagTitle}
        </Link>
      )}
    </div>
  );
};

export default BlogDetails;
