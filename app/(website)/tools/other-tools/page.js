import React from "react";
import { TOOL_CATEGORIES } from "@/constant/tools"; // Adjust path as needed
import Link from "next/link";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/tools/other-tools/`, host);

  return {
    title: "Free Other Tools - Unit Converter, Text to Speech | Inform Readers",
    description:
      "Discover free other tools at Inform Readers, including unit converter, text to speech, and more. Enhance your productivity effortlessly.",
    keywords: "free other tools, unit converter, text to speech, Inform Readers",
    alternates,
    author: "Inform Readers",
    robots: "index, follow",
    openGraph: {
      title: "Free Other Tools - Unit Converter, Text to Speech | Inform Readers",
      description:
        "Discover free other tools at Inform Readers, including unit converter, text to speech, and more. Enhance your productivity effortlessly.",
      type: "website",
      url: alternates.canonical,
    },
  };
}

const OtherTools = () => {
  const calculatorsCategory = TOOL_CATEGORIES.find((category) => category.id === "other-tools");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Other Tools" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Other Tools</h1>
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
                    <span className="text-2xl">🔧</span> {/* Placeholder icon */}
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

export default OtherTools;
