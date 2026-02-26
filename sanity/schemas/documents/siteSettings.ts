import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
      description: "Your profile/avatar used on the homepage and about page",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "The production URL of this site",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "language",
      title: "Default Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Spanish", value: "es" },
          { title: "German", value: "de" },
        ],
      },
      initialValue: "en",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      description: "Copyright or custom footer text",
    }),
    defineField({
      name: "commentSettings",
      title: "Comment Settings",
      type: "commentSettings",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      description: "Fallback SEO settings for all pages",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
});
