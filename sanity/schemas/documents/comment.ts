import { defineField, defineType } from "sanity";

export default defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required().max(2000),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "honeypot",
      title: "Honeypot",
      type: "string",
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Created At, New",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      content: "content",
      postTitle: "post.title",
      approved: "approved",
    },
    prepare({ name, content, postTitle, approved }) {
      return {
        title: `${name} on "${postTitle || "Unknown Post"}"`,
        subtitle: `${approved ? "Approved" : "Pending"} - ${content?.substring(0, 60) || ""}...`,
      };
    },
  },
});
