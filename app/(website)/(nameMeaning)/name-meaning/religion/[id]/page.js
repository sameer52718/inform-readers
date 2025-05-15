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
      openGraph: {
        title: `${category.name} Baby Names with Meanings | Infrom Readers`,
        description: `Explore a curated collection of ${category.name} baby names and their meanings.`,
        url: `https://informreaders.com/name-meaning/religion/${id}`,
        siteName: "BabyNameFinder",
        images: [
          {
            url: "https://informreaders.com/images/baby-names-cover.jpg",
            width: 1200,
            height: 630,
            alt: `${category.name} Baby Names`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
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
