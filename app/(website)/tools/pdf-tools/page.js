import React from "react";
import { TOOL_CATEGORIES } from "@/constant/tools"; // Adjust path as needed
import Link from "next/link";

export const metadata = {
  title: "Free PDF Tools - Convert, Merge, Compress | Inform Readers",
  description:
    "Access free PDF tools at Inform Readers to convert, merge, and compress PDFs effortlessly. Simplify your PDF management tasks today.",
  keywords: "free pdf tools, pdf to jpg, merge pdf, compress pdf, Inform Readers",
  author: "Inform Readers",
  robots: "index, follow",
  openGraph: {
    title: "Free PDF Tools - Convert, Merge, Compress | Inform Readers",
    description:
      "Access free PDF tools at Inform Readers to convert, merge, and compress PDFs effortlessly. Simplify your PDF management tasks today.",
    type: "website",
    url: "https://www.informreaders.com/tools/pdf-tools",
  },
};

const PDFTools = () => {
  // Get the PDF tools from TOOL_CATEGORIES
  const pdfTools = TOOL_CATEGORIES.find((category) => category.id === "pdf-tools")?.tools || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">PDF Tools</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfTools.map((tool) => (
            <Link
              href={tool.path}
              key={tool.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
            >
              <span className="text-2xl">📄</span> {/* Placeholder icon */}
              <div>
                <p className="text-gray-900 font-medium">{tool.name}</p>
                <p className="text-sm text-gray-600">Click to use this tool</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
