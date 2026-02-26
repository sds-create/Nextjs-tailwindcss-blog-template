"use client";
import React, { useEffect, useState } from "react";

const ViewCounter = ({ slug, noCount = false, showCount = true }) => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const updateViews = async () => {
      try {
        const method = noCount ? "GET" : "POST";
        const res = await fetch(
          `/api/views?slug=${encodeURIComponent(slug)}`,
          { method }
        );
        if (res.ok) {
          const data = await res.json();
          setViews(data.viewCount || 0);
        }
      } catch (error) {
        console.error("Error updating view count:", error);
      }
    };

    updateViews();
  }, [slug, noCount]);

  if (showCount) {
    return <div>{views} views</div>;
  }
  return null;
};

export default ViewCounter;
