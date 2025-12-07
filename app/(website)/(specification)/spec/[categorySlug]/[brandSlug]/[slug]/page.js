import React from "react";

import axiosInstance from "@/lib/axiosInstance";
import SpecificationDetail from "@/components/pages/specification/Detail";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { slug, categorySlug, brandSlug } = await params;
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/spec/${categorySlug}/${brandSlug}/${slug}`, host);
  try {
    const { data } = await axiosInstance.get(`/website/specification/${categorySlug}/${brandSlug}/${slug}`);

    const product = data?.specification;
    const productName = product?.name ?? "Product";
    const productCategory = params.category.replace(/-/g, " ");

    return {
      title: `${productName} Specification | ${productCategory} Details | Inform Readers`,
      description: `Explore detailed specifications, features, and user reviews for ${productName} in the ${productCategory} category.`,
      openGraph: {
        title: `${productName} | ${productCategory} Specification`,
        description: `View full specs, performance details, and reviews for ${productName}.`,
        siteName: "Inform Readers",
        locale: "en_US",
        type: "article",
      },
      alternates,
    };
  } catch (error) {
    return {
      title: "Product Specification | Inform Readers",
      description: "Explore product specifications, features, and reviews for all categories.",
      alternates,
    };
  }
}

const page = () => {
  return <SpecificationDetail />;
};

export default page;
