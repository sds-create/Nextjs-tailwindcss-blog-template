import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "metaTitleTemplate",
      title: "Meta Title Template",
      type: "string",
      description: "Template for page titles. Use %s for the page title. E.g., '%s | My Blog'",
      initialValue: "%s | SDS Create Blog",
    }),
    defineField({
      name: "defaultMetaDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph Image",
      type: "image",
      description: "Fallback image for social sharing (1200x630px recommended)",
    }),
    defineField({
      name: "robotsTxt",
      title: "Robots.txt Content",
      type: "text",
      rows: 10,
      description: "Custom robots.txt directives",
      initialValue: `User-agent: *\nAllow: /\nDisallow: /studio\n`,
    }),
    defineField({
      name: "sitemapExcludePaths",
      title: "Sitemap Exclude Paths",
      type: "array",
      of: [{ type: "string" }],
      description: "Paths to exclude from the sitemap (e.g., /studio, /api)",
    }),
    defineField({
      name: "googleVerification",
      title: "Google Site Verification",
      type: "string",
      description: "Google Search Console verification meta tag content",
    }),
    defineField({
      name: "enableJsonLd",
      title: "Enable JSON-LD Structured Data",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "SEO Settings",
      };
    },
  },
});
