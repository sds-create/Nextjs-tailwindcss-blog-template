"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { projectId, dataset, apiVersion } from "./lib/client";

const singletonTypes = new Set(["siteSettings", "seoSettings"]);

// Custom desk structure for singletons
const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      // Singletons
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.listItem()
        .title("SEO Settings")
        .child(
          S.document().schemaType("seoSettings").documentId("seoSettings")
        ),
      S.divider(),
      // Content types
      ...S.documentTypeListItems().filter(
        (listItem: any) =>
          !singletonTypes.has(listItem.getId()) &&
          listItem.getId() !== "navigation"
      ),
      S.divider(),
      // Navigation
      S.listItem()
        .title("Navigation")
        .child(S.documentTypeList("navigation").title("Navigation Menus")),
    ]);

export default defineConfig({
  name: "blog-studio",
  title: "Blog CMS",
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: schemaTypes,
    // Prevent new singletons from being created
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Prevent singletons from being duplicated or deleted
    actions: (input, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return input.filter(
          ({ action }) =>
            action && ["publish", "discardChanges", "restore"].includes(action)
        );
      }
      return input;
    },
  },
});
