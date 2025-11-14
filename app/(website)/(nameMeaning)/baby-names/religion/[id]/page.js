import NameMeaning from "@/components/pages/babynames/CategoryPage";
import axiosInstance from "@/lib/axiosInstance";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const { data } = await axiosInstance.get("/common/category", {
      params: { type: "Name" },
    });

    const category = data.categories.find((cat) => cat._id === id);

    if (!category) {
      return {
        title: "Baby Name Meanings by Religion | Infrom Readers",
        description: "Explore baby names categorized by different religions.",
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
