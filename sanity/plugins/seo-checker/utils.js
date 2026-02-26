/**
 * SEO Checker utility functions
 * Provides Yoast/RankMath-style analysis for Sanity blog posts.
 */

/**
 * @param {string} text - Raw text from Portable Text body
 * @param {string} keyword - Focus keyword
 * @returns {{ score: number; checks: Array<{ label: string; status: 'good'|'warning'|'error'; message: string }> }}
 */
export function analyzeSeo({ title, metaTitle, metaDescription, excerpt, bodyText, keyword, slug }) {
  const checks = [];
  const focusKw = (keyword || "").toLowerCase().trim();
  const resolvedTitle = metaTitle || title || "";
  const resolvedDescription = metaDescription || excerpt || "";

  // ── Focus Keyword Presence ────────────────────
  if (!focusKw) {
    checks.push({
      label: "Focus keyword",
      status: "warning",
      message: "No focus keyword set. Add one in the SEO section.",
    });
  } else {
    // In title
    if (resolvedTitle.toLowerCase().includes(focusKw)) {
      checks.push({ label: "Keyword in title", status: "good", message: "Focus keyword appears in the title." });
    } else {
      checks.push({ label: "Keyword in title", status: "error", message: "Focus keyword does not appear in the title." });
    }

    // In meta description
    if (resolvedDescription.toLowerCase().includes(focusKw)) {
      checks.push({ label: "Keyword in description", status: "good", message: "Focus keyword appears in the meta description." });
    } else {
      checks.push({ label: "Keyword in description", status: "warning", message: "Focus keyword not found in meta description." });
    }

    // In slug
    if (slug && slug.toLowerCase().includes(focusKw.replace(/\s+/g, "-"))) {
      checks.push({ label: "Keyword in slug", status: "good", message: "Focus keyword appears in the URL slug." });
    } else {
      checks.push({ label: "Keyword in slug", status: "warning", message: "Consider including the focus keyword in the URL slug." });
    }

    // In body text
    if (bodyText && bodyText.toLowerCase().includes(focusKw)) {
      const count = (bodyText.toLowerCase().match(new RegExp(focusKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
      const words = bodyText.split(/\s+/).length;
      const density = ((count * focusKw.split(/\s+/).length) / words * 100).toFixed(1);
      if (parseFloat(density) >= 0.5 && parseFloat(density) <= 3) {
        checks.push({ label: "Keyword density", status: "good", message: `Keyword density is ${density}% (${count} occurrences). Ideal range: 0.5-3%.` });
      } else if (parseFloat(density) < 0.5) {
        checks.push({ label: "Keyword density", status: "warning", message: `Keyword density is ${density}% (${count} occurrences). Consider using it more often.` });
      } else {
        checks.push({ label: "Keyword density", status: "warning", message: `Keyword density is ${density}% (${count} occurrences). This might be too high.` });
      }
    } else {
      checks.push({ label: "Keyword in content", status: "error", message: "Focus keyword does not appear in the content body." });
    }
  }

  // ── Title Length ───────────────────────────────
  const titleLen = resolvedTitle.length;
  if (titleLen === 0) {
    checks.push({ label: "Title", status: "error", message: "No title set." });
  } else if (titleLen < 30) {
    checks.push({ label: "Title length", status: "warning", message: `Title is ${titleLen} chars. Recommended: 30-60 characters.` });
  } else if (titleLen <= 60) {
    checks.push({ label: "Title length", status: "good", message: `Title is ${titleLen} chars. This is within the ideal range.` });
  } else {
    checks.push({ label: "Title length", status: "warning", message: `Title is ${titleLen} chars. It may be truncated in search results (max ~60).` });
  }

  // ── Meta Description Length ───────────────────
  const descLen = resolvedDescription.length;
  if (descLen === 0) {
    checks.push({ label: "Meta description", status: "error", message: "No meta description set. Add one in the SEO section or use the excerpt." });
  } else if (descLen < 120) {
    checks.push({ label: "Description length", status: "warning", message: `Meta description is ${descLen} chars. Recommended: 120-160 characters.` });
  } else if (descLen <= 160) {
    checks.push({ label: "Description length", status: "good", message: `Meta description is ${descLen} chars. This is within the ideal range.` });
  } else {
    checks.push({ label: "Description length", status: "warning", message: `Meta description is ${descLen} chars. It may be truncated in search results.` });
  }

  // ── Content Length / Readability ───────────────
  if (bodyText) {
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    if (wordCount < 300) {
      checks.push({ label: "Content length", status: "error", message: `Content has ~${wordCount} words. Aim for at least 300 words.` });
    } else if (wordCount < 600) {
      checks.push({ label: "Content length", status: "warning", message: `Content has ~${wordCount} words. Longer content (600+) often ranks better.` });
    } else {
      checks.push({ label: "Content length", status: "good", message: `Content has ~${wordCount} words. Good length for SEO.` });
    }

    // Readability: average sentence length
    const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length > 0) {
      const avgSentenceLength = wordCount / sentences.length;
      if (avgSentenceLength <= 20) {
        checks.push({ label: "Readability", status: "good", message: `Average sentence length is ${avgSentenceLength.toFixed(0)} words. Good readability.` });
      } else {
        checks.push({ label: "Readability", status: "warning", message: `Average sentence length is ${avgSentenceLength.toFixed(0)} words. Try to keep sentences under 20 words.` });
      }
    }
  } else {
    checks.push({ label: "Content", status: "error", message: "No content body found." });
  }

  // ── Calculate Overall Score ───────────────────
  const total = checks.length;
  const good = checks.filter((c) => c.status === "good").length;
  const score = total > 0 ? Math.round((good / total) * 100) : 0;

  return { score, checks };
}

/**
 * Extract plain text from Portable Text blocks
 */
export function portableTextToPlainText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .filter((block) => block._type === "block")
    .map((block) => {
      return (block.children || []).map((child) => child.text || "").join("");
    })
    .join("\n");
}
