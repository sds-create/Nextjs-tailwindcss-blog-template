import { definePlugin } from "sanity";
import { SeoCheckerPanel } from "./SeoCheckerPanel";

export const seoCheckerPlugin = definePlugin({
  name: "seo-checker",
  document: {
    inspectors: (prev, { documentType }) => {
      // Only show SEO checker for post and page types
      if (documentType === "post" || documentType === "page") {
        return [
          ...prev,
          {
            name: "seo-checker",
            title: "SEO",
            component: SeoCheckerPanel,
          },
        ];
      }
      return prev;
    },
  },
});
