import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

const portableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || "Blog image"}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => {
      return (
        <div className="relative my-6">
          {value.filename && (
            <div className="absolute right-0 top-0 bg-accent text-light px-2 py-1 text-sm rounded-bl">
              {value.filename}
            </div>
          )}
          <pre className="bg-dark text-light rounded-lg p-4 overflow-x-auto">
            <code className={`language-${value.language || "text"}`}>
              {value.code}
            </code>
          </pre>
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const target = value?.href?.startsWith("http") ? "_blank" : undefined;
      return (
        <Link
          href={value?.href || "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-accent dark:text-accentDark underline underline-offset-2 hover:opacity-80"
        >
          {children}
        </Link>
      );
    },
    code: ({ children }) => (
      <code className="bg-dark/10 dark:bg-light/10 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    highlight: ({ children }) => (
      <mark className="bg-accent/20 dark:bg-accentDark/20 px-1 rounded">
        {children}
      </mark>
    ),
  },
  block: {
    h2: ({ children, value }) => (
      <h2 id={value._key} className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        <a href={`#${value._key}`} className="no-underline hover:underline">
          {children}
        </a>
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={value._key} className="text-xl md:text-2xl font-bold mt-8 mb-3">
        <a href={`#${value._key}`} className="no-underline hover:underline">
          {children}
        </a>
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent dark:border-accentDark bg-accent/10 dark:bg-accentDark/10 p-4 px-6 rounded-r-lg my-6 not-italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 marker:text-accent dark:marker:text-accentDark">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};

const RenderPortableText = ({ content }) => {
  if (!content) return null;
  return (
    <div
      className="col-span-12 lg:col-span-8 font-in prose sm:prose-base md:prose-lg max-w-max
      dark:prose-invert first-letter:text-3xl sm:first-letter:text-5xl"
    >
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
};

export default RenderPortableText;
