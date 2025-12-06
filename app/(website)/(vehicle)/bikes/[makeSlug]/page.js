import React from "react";
import BikeListing from "../components/Listing";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { makeSlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";

  const name = makeSlug.replace(/-/g, " ");

  const alternates = buildHreflangLinks(`/bikes/${makeSlug}`, host);

  return {
    title: `${name} Bikes | Inform Readers`,
    description: `Find all ${name} bike models, specifications, pricing and full details. Updated motorcycle database on Inform Readers.`,
    keywords: [
      `${name} bikes`,
      `${name} motorcycle models`,
      `${name} bike specifications`,
      `${name} price`,
      "motorcycle brands",
      "bike reviews",
      "inform readers bikes",
    ],
    alternates,
    openGraph: {
      title: `${name} Bikes | Inform Readers`,
      description: `Browse all ${name} motorcycles. View specifications, prices, images and detailed comparisons.`,
      type: "website",
      siteName: "Inform Readers",
      url: alternates.canonical,
    },
  };
}

const page = () => {
  return <BikeListing />;
};

export default page;
