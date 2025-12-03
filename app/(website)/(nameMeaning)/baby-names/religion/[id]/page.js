import NameMeaning from "@/components/pages/babynames/CategoryPage";
import axiosInstance from "@/lib/axiosInstance";
import { buildHreflangLinks } from "@/lib/hreflang";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const host = (await headers()).get("host") || "informreaders.com";

    const { data } = await axiosInstance.get("/common/category", {
      params: { type: "Name" },
    });

    const category = data.categories.find((cat) => cat._id === id);
    const alternates = buildHreflangLinks(`/baby-names/religion/${id}/`, host);

    if (!category) {
      return {
        title: "Baby Name Meanings by Religion | Infrom Readers",
        description: "Explore baby names categorized by different religions.",
        alternates,
      };
    }

    return {
      title: `${category.name} Baby Names with Meanings | Infrom Readers`,
      description: `Discover beautiful ${category.name} baby names with deep meanings and cultural significance.`,
      keywords: [
        `${category.name} baby names`,
        `${category.name} names meaning`,
        "baby name search",
        "religious baby names",
        "unique baby names",
      ],
      alternates,
    };
  } catch (error) {
    return {
      title: "Baby Name Meanings | Infrom Readers",
      description: "Explore baby names by religion and meaning.",
    };
  }
}

export default function Page() {
  return <NameMeaning />;
}
