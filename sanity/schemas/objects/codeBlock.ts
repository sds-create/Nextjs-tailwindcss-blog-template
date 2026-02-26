import { defineField, defineType } from "sanity";

export default defineType({
  name: "codeBlock",
  title: "Code Block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "Python", value: "python" },
          { title: "Bash", value: "bash" },
          { title: "JSON", value: "json" },
          { title: "JSX", value: "jsx" },
          { title: "TSX", value: "tsx" },
          { title: "Markdown", value: "markdown" },
          { title: "SQL", value: "sql" },
          { title: "YAML", value: "yaml" },
          { title: "Go", value: "go" },
          { title: "Rust", value: "rust" },
          { title: "Other", value: "text" },
        ],
      },
      initialValue: "javascript",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
      description: "Optional filename to display above the code block",
    }),
  ],
  preview: {
    select: {
      language: "language",
      code: "code",
    },
    prepare({ language, code }) {
      return {
        title: `Code: ${language || "text"}`,
        subtitle: code ? code.substring(0, 50) + "..." : "Empty",
      };
    },
  },
});
