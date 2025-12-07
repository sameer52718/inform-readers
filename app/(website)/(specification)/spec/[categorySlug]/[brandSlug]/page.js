import { buildHreflangLinks } from "@/lib/hreflang";
import { headers } from "next/headers";
import React from "react";
import SpecificationCategory from "@/components/pages/specification/Category";

export async function generateMetadata({ params }) {
  const { categorySlug, brandSlug } = await params;
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/spec/${categorySlug}/${brandSlug}/`, host);
  return {
    title: "Product Specifications & Comparisons | Inform Readers",
    description:
      "Browse detailed product specifications across multiple categories. Compare features, prices, and find the perfect product for your needs.",
    keywords: [
      "product specifications",
      "compare products",
      "product features",
      "product details",
      "product prices",
      "electronics specs",
      "inform readers",
    ],
    alternates,
    openGraph: {
      title: "Product Specifications & Comparisons",
      description:
        "Explore and compare product specifications by category. Find the best products with detailed data and prices.",
      type: "website",
      siteName: "Inform Readers",
    },
  };
}

const page = () => {
  return <SpecificationCategory />;
};

export default page;
