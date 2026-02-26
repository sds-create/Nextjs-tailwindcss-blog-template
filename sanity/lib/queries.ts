import { groq } from "next-sanity";

// ─── Site Settings ──────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    logo,
    profileImage,
    description,
    siteUrl,
    language,
    socialLinks[] {
      platform,
      url
    },
    footerText,
    commentSettings,
    defaultSeo
  }
`;

// ─── SEO Settings ───────────────────────────────────────────────

export const seoSettingsQuery = groq`
  *[_type == "seoSettings"][0] {
    metaTitleTemplate,
    defaultMetaDescription,
    defaultOgImage,
    robotsTxt,
    sitemapExcludePaths,
    googleVerification,
    enableJsonLd
  }
`;

// ─── Navigation ─────────────────────────────────────────────────

export const navigationQuery = groq`
  *[_type == "navigation" && slug.current == $slug][0] {
    title,
    items[] {
      label,
      url,
      openInNewTab
    }
  }
`;

// ─── Posts ───────────────────────────────────────────────────────

export const allPostsQuery = groq`
  *[_type == "post" && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    updatedAt,
    excerpt,
    image,
    isFeatured,
    readingTime,
    viewCount,
    language,
    "author": author-> { name, slug, image },
    "categories": categories[]-> { title, slug },
    "tags": tags[]-> { title, slug }
  }
`;

export const featuredPostsQuery = groq`
  *[_type == "post" && isFeatured == true && language == $language] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    image,
    readingTime,
    "author": author-> { name, slug, image },
    "categories": categories[]-> { title, slug },
    "tags": tags[]-> { title, slug }
  }
`;

export const recentPostsQuery = groq`
  *[_type == "post" && language == $language] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    image,
    readingTime,
    "author": author-> { name, slug, image },
    "categories": categories[]-> { title, slug },
    "tags": tags[]-> { title, slug }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    updatedAt,
    excerpt,
    image,
    body,
    isFeatured,
    readingTime,
    viewCount,
    commentsEnabled,
    language,
    "author": author-> { name, slug, image, bio, socialLinks },
    "categories": categories[]-> { title, slug },
    "tags": tags[]-> { title, slug },
    seo
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

// ─── Categories ─────────────────────────────────────────────────

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    image,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id) && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    image,
    readingTime,
    "author": author-> { name, slug, image },
    "categories": categories[]-> { title, slug },
    "tags": tags[]-> { title, slug }
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    image,
    seo
  }
`;

// ─── Tags ───────────────────────────────────────────────────────

export const allTagsQuery = groq`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`;

// ─── Comments ───────────────────────────────────────────────────

export const commentsByPostQuery = groq`
  *[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt desc) {
    _id,
    name,
    content,
    createdAt
  }
`;

export const pendingCommentsQuery = groq`
  *[_type == "comment" && approved == false] | order(createdAt desc) {
    _id,
    name,
    email,
    content,
    createdAt,
    "postTitle": post-> title,
    "postSlug": post-> slug
  }
`;

// ─── Author ─────────────────────────────────────────────────────

export const authorQuery = groq`
  *[_type == "author"][0] {
    _id,
    name,
    slug,
    image,
    bio,
    socialLinks,
    insights,
    skills
  }
`;

// ─── Pages ──────────────────────────────────────────────────────

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    slug,
    body,
    language,
    seo
  }
`;

// ─── Sitemap helpers ────────────────────────────────────────────

export const sitemapPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    publishedAt,
    updatedAt,
    language
  }
`;

export const sitemapCategoriesQuery = groq`
  *[_type == "category" && defined(slug.current)] {
    "slug": slug.current
  }
`;
