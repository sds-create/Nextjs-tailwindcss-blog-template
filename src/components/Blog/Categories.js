import React from "react";
import Category from "./Category";

const Categories = ({ categories, currentSlug }) => {
  return (
    <div className="px-0 md:px-10 sxl:px-20 mt-10 border-t-2 text-dark dark:text-light border-b-2 border-solid border-dark dark:border-light py-4 flex items-start flex-wrap font-medium mx-5 md:mx-10">
      {categories.map((cat) => {
        const catSlug = typeof cat === "string" ? cat : cat.slug?.current || cat.slug || "";
        const catTitle = typeof cat === "string" ? cat : cat.title || "";
        return (
          <Category
            key={catSlug}
            link={`/categories/${catSlug}`}
            name={catTitle || catSlug}
            active={currentSlug === catSlug}
          />
        );
      })}
    </div>
  );
};

export default Categories;
