import { useEffect, useState, useCallback } from "react";
import { useFormValue } from "sanity";
import { analyzeSeo, portableTextToPlainText } from "./utils";

function ScoreCircle({ score }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="bold" fill={color}>
          {score}
        </text>
      </svg>
    </div>
  );
}

function CheckItem({ check }) {
  const icons = { good: "checkmark", warning: "warning-outline", error: "close" };
  const colors = { good: "#22c55e", warning: "#f59e0b", error: "#ef4444" };
  const bgColors = { good: "#f0fdf4", warning: "#fffbeb", error: "#fef2f2" };
  const symbol = { good: "\u2713", warning: "\u26A0", error: "\u2717" };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        padding: "8px 12px",
        marginBottom: "4px",
        borderRadius: "6px",
        backgroundColor: bgColors[check.status],
        fontSize: "13px",
        lineHeight: "1.4",
      }}
    >
      <span style={{ color: colors[check.status], fontWeight: "bold", flexShrink: 0, fontSize: "14px" }}>
        {symbol[check.status]}
      </span>
      <div>
        <strong style={{ color: colors[check.status] }}>{check.label}</strong>
        <div style={{ color: "#6b7280", marginTop: "2px" }}>{check.message}</div>
      </div>
    </div>
  );
}

export function SeoCheckerPanel() {
  const title = useFormValue(["title"]);
  const slug = useFormValue(["slug", "current"]);
  const body = useFormValue(["body"]);
  const excerpt = useFormValue(["excerpt"]);
  const seoMetaTitle = useFormValue(["seo", "metaTitle"]);
  const seoMetaDescription = useFormValue(["seo", "metaDescription"]);
  const seoFocusKeyword = useFormValue(["seo", "focusKeyword"]);

  const [result, setResult] = useState(null);

  const runAnalysis = useCallback(() => {
    const bodyText = portableTextToPlainText(body);
    const analysis = analyzeSeo({
      title: title || "",
      metaTitle: seoMetaTitle || "",
      metaDescription: seoMetaDescription || "",
      excerpt: excerpt || "",
      bodyText,
      keyword: seoFocusKeyword || "",
      slug: slug || "",
    });
    setResult(analysis);
  }, [title, slug, body, excerpt, seoMetaTitle, seoMetaDescription, seoFocusKeyword]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  if (!result) {
    return (
      <div style={{ padding: "16px" }}>
        <p style={{ color: "#6b7280" }}>Loading SEO analysis...</p>
      </div>
    );
  }

  const goodCount = result.checks.filter((c) => c.status === "good").length;
  const warningCount = result.checks.filter((c) => c.status === "warning").length;
  const errorCount = result.checks.filter((c) => c.status === "error").length;

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>SEO Analysis</h3>
      <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
        Yoast-style content analysis for search engine optimization
      </p>

      <ScoreCircle score={result.score} />

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px", fontSize: "13px" }}>
        <span style={{ color: "#22c55e" }}>{goodCount} passed</span>
        <span style={{ color: "#f59e0b" }}>{warningCount} warnings</span>
        <span style={{ color: "#ef4444" }}>{errorCount} issues</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {result.checks
          .sort((a, b) => {
            const order = { error: 0, warning: 1, good: 2 };
            return order[a.status] - order[b.status];
          })
          .map((check, i) => (
            <CheckItem key={i} check={check} />
          ))}
      </div>

      <button
        type="button"
        onClick={runAnalysis}
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "8px",
          backgroundColor: "#7B00D3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        Re-analyze
      </button>
    </div>
  );
}
