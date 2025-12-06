import React from "react";
import SpecificationLanding from "@/components/pages/specification/Landing";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/spec`, host);

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

const Page = () => {
  return <SpecificationLanding />;
};

export default Page;
