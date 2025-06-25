import axiosInstance from "@/lib/axiosInstance";
import NameMeaning from "@/components/pages/babynames/NameDetail";

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const { data } = await axiosInstance.get(`/website/name/${slug}`);

    if (data.error || !data.data) {
      return {
        title: "Name Details | Infrom Readers",
        description: "Find detailed meanings, origin, and cultural background of baby names.",
      };
    }

    const nameData = data.data;

    const name = nameData?.name;
    const gender = nameData?.gender;
    const shortMeaning = nameData?.shortMeaning || "";
    const origion = nameData?.origion || "";
    const religion = nameData?.religionId?.name || "";

    return {
      title: `${name} - Meaning, Origin & Religion | Infrom Readers`,
      description: `${name} is a ${gender} name of ${origion} origin associated with ${religion}. ${shortMeaning}`,
      keywords: [
        `${name} name meaning`,
        `${name} origin`,
        `${name} religion`,
        `${name} baby name`,
        `meaning of the name ${name}`,
      ],
      openGraph: {
        title: `${name} - Meaning, Origin & Religion | Infrom Readers`,
        description: shortMeaning,
        url: `http://informreaders.com/names/${slug}`,
        siteName: "BabyNameFinder",
        images: [
          {
            url: "http://informreaders.com/images/baby-name-og.jpg", // You can replace this with a relevant image URL
            width: 1200,
            height: 630,
            alt: `${name} - Name Details`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Baby Name Details | Infrom Readers",
      description: "Explore baby name meanings, origins, and religious significance.",
    };
  }
}

export default function page() {
  return <NameMeaning />;
}
