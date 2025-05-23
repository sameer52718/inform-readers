import React from "react";
import { PlayCircle } from "lucide-react";
import formatDate from "@/lib/formatDate";

const ProductInfoCard = ({ name, specs = [], createdAt }) => {
  return (
    <div className="bg-gray-50 px-6 pt-5 pb-3 rounded-xl w-full mb-6 shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-5 hover:text-red-600 transition-colors">
        <a href="#" className="hover:underline">
          {name}
        </a>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {specs.slice(0, 6).map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <PlayCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm sm:text-base">
              {spec.name}:{" "}
              {spec.value ? (spec.value.length > 50 ? `${spec.value.slice(0, 50)}...` : spec.value) : "---"}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300 mx-2 mt-5">
        <div className="flex flex-col items-center py-3">
          <span className="text-gray-800 text-base font-medium">Listing Date</span>
          <span className="text-gray-600 text-sm">{formatDate(createdAt, "DD MMMM YYYY")}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoCard;
