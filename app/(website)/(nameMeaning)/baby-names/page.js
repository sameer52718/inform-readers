import NameMeaning from "@/components/pages/babynames/NameTables";

// Server-side metadata
export const metadata = {
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
  openGraph: {
    title: "Baby Name Meanings | Boy & Girl Names by Religion & Culture",
    description:
      "Search and explore thousands of baby names with rich meanings and cultural roots. Find the perfect name today!",
    type: "website",
  },
};

export default function Page() {
  return <NameMeaning />;
}
