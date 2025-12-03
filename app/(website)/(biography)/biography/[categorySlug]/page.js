import CategoryListing from "@/components/pages/biography/CategoryListing";
import { buildHreflangLinks } from "@/lib/hreflang";
import { headers } from "next/headers";
import React from "react";

export async function generateMetadata({ params }) {
  const { categorySlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/biography/${categorySlug}`, host, true);

  return {
    title: "Famous Celebrity Biographies || Inform Readers",
    description:
      "Explore thousands of biographies of actors, musicians, leaders, and other famous personalities from around the world. Learn about their life, career, and achievements.",
    keywords: [
      "celebrity biographies",
      "famous people",
      "actors biography",
      "singers biography",
      "historical figures",
      "leaders biography",
      "famous personalities",
    ],
    alternates,
    openGraph: {
      title: "Famous Celebrity Biographies - Explore & Discover",
      description:
        "Discover detailed biographies of famous actors, singers, politicians, scientists, and more. Search and explore global personalities.",
      type: "website",
      url: "https://informreaders.com/biography",
      siteName: "Inform Readers",
    },
  };
}

const page = () => {
  return <CategoryListing />;
};

export default page;
