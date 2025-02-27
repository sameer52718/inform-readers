"use client"; // If using Next.js

import { useState } from "react";



const CategoryBox = ({ categories }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-full bg-gray-100 p-2 rounded border shadow">
      <div className="max-h-52 overflow-y-auto border border-gray-300 rounded">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-2 px-3 py-2 border-b last:border-none bg-white"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
              className="w-4 h-4"
            />
            <span className="text-gray-800">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryBox;
