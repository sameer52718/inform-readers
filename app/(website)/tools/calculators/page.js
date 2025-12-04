import React from "react";
import { TOOL_CATEGORIES } from "@/constant/tools"; // Adjust path as needed
import Link from "next/link";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/tools/calculators/`, host);

  return {
    title: "Free Calculator Tools - Physics & Maths | Inform Readers",
    description:
      "Explore free calculator tools at Inform Readers for physics and maths. Solve equations, calculate force, velocity, and more effortlessly.",
    keywords:
      "free calculator tools, physics calculator, maths calculator, force calculator, quadratic solver, Inform Readers",
    alternates,
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Free Calculator Tools - Physics & Maths | Inform Readers",
      description:
        "Explore free calculator tools at Inform Readers for physics and maths. Solve equations, calculate force, velocity, and more effortlessly.",
      type: "website",
      url: alternates.canonical,
    },
  };
}

const Calculators = () => {
  // Get all tools from the calculators category, handling deep nesting
  const calculatorsCategory = TOOL_CATEGORIES.find((category) => category.id === "calculators");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Calculators" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Calculators</h1>
        <div className="space-y-6">
          {calculatorsCategory?.subcategories?.map((subcategory) => (
            <div key={subcategory.id}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{subcategory.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategory.tools.map((tool) => (
                  <Link
                    href={tool.path}
                    key={tool.id}
                    className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
                  >
                    <span className="text-2xl">🧮</span> {/* Placeholder icon */}
                    <div>
                      <p className="text-gray-900 font-medium">{tool.name}</p>
                      <p className="text-sm text-gray-600">Click to use this tool</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculators;
