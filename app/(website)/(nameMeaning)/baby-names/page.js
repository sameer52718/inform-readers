import NameMeaning from "@/components/pages/babynames/NameTables";
import { buildHreflangLinks } from "@/lib/hreflang";
import { headers } from "next/headers";

// Server-side metadata

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";

  const alternates = buildHreflangLinks("/baby-names/", host);

  return {
    title: "Baby Name Meanings | Boy & Girl Names by Religion & Culture",
    description:
      "Discover meaningful baby names for boys and girls. Explore name origins, meanings, and cultural significance across various religions and traditions.",
    keywords: [
      "baby names",
      "boy names",
      "girl names",
      "name meanings",
      "religious names",
      "name origin",
      "cultural names",
      "Hindu names",
      "Muslim names",
      "Christian names",
      "Sikh names",
      "Indian baby names",
    ],
    alternates: alternates,
    openGraph: {
      title: "Baby Name Meanings | Boy & Girl Names by Religion & Culture",
      description:
        "Search and explore thousands of baby names with rich meanings and cultural roots. Find the perfect name today!",
      type: "website",
    },
  };
}

export default function Page() {
  return <NameMeaning />;
}
