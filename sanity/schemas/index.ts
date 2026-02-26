import post from "./documents/post";
import author from "./documents/author";
import category from "./documents/category";
import tag from "./documents/tag";
import comment from "./documents/comment";
import siteSettings from "./documents/siteSettings";
import navigation from "./documents/navigation";
import page from "./documents/page";
import seoSettings from "./documents/seoSettings";

import seo from "./objects/seo";
import portableText from "./objects/portableText";
import socialLink from "./objects/socialLink";
import codeBlock from "./objects/codeBlock";
import commentSettings from "./objects/commentSettings";

export const schemaTypes = [
  // Documents
  post,
  author,
  category,
  tag,
  comment,
  siteSettings,
  navigation,
  page,
  seoSettings,
  // Objects
  seo,
  portableText,
  socialLink,
  codeBlock,
  commentSettings,
];
