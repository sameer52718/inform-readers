import React from "react";
import Listing from "../../components/CarListing";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {

  const { makeSlug, modelSlug } = await params;
  const title = "Car Listings | Inform Readers";
  const description =
    "Browse all car listings including latest models, specifications, price details, and comparisons. Find the best cars based on brand, model, and features on Inform Readers.";

  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/cars/${makeSlug}/${modelSlug}`, host);

  return {
    title,
    description,
    keywords: [
      "car listings",
      "latest cars",
      "car models",
      "car specifications",
      "inform readers cars",
    ],
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: "website",
      siteName: "Inform Readers",
    },
  };
}


const Page = () => {
  return <Listing />;
};

export default Page;
