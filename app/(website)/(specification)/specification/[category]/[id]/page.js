import React from "react";

import axiosInstance from "@/lib/axiosInstance";
import SpecificationDetail from "@/components/pages/specification/Detail";

export async function generateMetadata({ params }) {
  try {
    const { data } = await axiosInstance.get(`/website/specification/${params.category}/${params.id}`);

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
    };
  } catch (error) {
    return {
      title: "Product Specification | Inform Readers",
      description: "Explore product specifications, features, and reviews for all categories.",
    };
  }
}

const page = () => {
  return <SpecificationDetail />;
};

export default page;
