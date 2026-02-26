export const cx = (...classNames) => classNames.filter(Boolean).join(" ");

export const sortBlogs = (blogs) => {
  return blogs
    .slice()
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};
