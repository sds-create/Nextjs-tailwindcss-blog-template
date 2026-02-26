import { sanityFetch } from "@/sanity/lib/client";
import { authorQuery } from "@/sanity/lib/queries";
import InsightRoll from "@/src/components/About/InsightRoll";

const defaultInsights = [
  "20+ Projects Completed",
  "3+ Years of Freelancing",
  "99% Client Satisfaction",
  "20K+ Subscribers",
  "Authored In-Depth Course on Educative",
  "Contributed as a Technical Course Reviewer",
  "Recipient of the Hackernoon Noonies Award",
];

export default async function AboutLayout({ children }) {
  const author = await sanityFetch({
    query: authorQuery,
    tags: ["author"],
  });

  const insights = author?.insights?.length > 0 ? author.insights : defaultInsights;

  return (
    <main className="w-full flex flex-col items-center justify-between">
      <InsightRoll insights={insights} />
      {children}
    </main>
  );
}
