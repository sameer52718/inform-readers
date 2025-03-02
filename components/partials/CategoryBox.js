"use client"; // If using Next.js

import { Icon } from "@iconify/react";
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
    <div className="w-full rounded border">
      <div className="max-h-52 overflow-y-auto border border-gray-300 rounded">
        {categories.map((category, index) => (
          <label
            key={index}
            className="flex items-center bg-white px-1 py-1.5 cursor-pointer space-x-2"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
              className="peer hidden"
            />
            {/* Checkbox icons */}
            <div className="w-6 h-6 flex items-center justify-center transition-all">
              <Icon
                icon="system-uicons:checkbox-empty"
                width="21"
                height="21"
                className="peer-checked:hidden text-gray-500"
              />
              <Icon
                icon="akar-icons:check-box"
                width="24"
                height="24"
                className="hidden peer-checked:block text-blue-500"
              />
            </div>
            {/* Category Name */}
            <span className="text-gray-700">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryBox;
