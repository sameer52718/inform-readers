import axiosInstance from "@/lib/axiosInstance";
import NameMeaning from "@/components/pages/babynames/NameDetail";
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
const metaTemplates = {
  title: "{name} Meaning, Origin & Popularity in {country}",
  description:
    "Discover the meaning of the {gender} name {name}, its {origin} roots, {religion} influence, and popularity in {country}.",
};

function applyMetaTemplate(template, values) {
  return template
    .replace(/{name}/g, values.name || "")
    .replace(/{gender}/g, values.gender || "")
    .replace(/{origin}/g, values.origin || "")
    .replace(/{religion}/g, values.religion || "")
    .replace(/{country}/g, values.country || "");
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    const { data } = await axiosInstance.get(`/website/name/${slug}`, { params: { host } });

    if (data.error || !data.data) {
      return {
        title: "Name Details | Infrom Readers",
        description: "Find detailed meanings, origin, and cultural background of baby names.",
      };
    }

    const nameData = data.data;
    console.log(nameData);

    const values = {
      name: nameData?.name || "",
      gender: nameData?.gender || "",
      origin: nameData?.origion || "",
      religion: nameData?.religionId?.name || "",
      country,
    };

    const title = nameData.content.title;
    const description = nameData.content.intro;

    return {
      title,
      description,
      keywords: [
        `${values.name} name meaning`,
        `${values.name} origin`,
        `${values.name} religion`,
        `${values.name} baby name`,
        `meaning of the name ${values.name}`,
      ],
      openGraph: {
        title,
        description,
        siteName: "BabyNameFinder",
        images: [
          {
            url: `http://${host}/images/baby-name-og.jpg`,
            width: 1200,
            height: 630,
            alt: `${values.name} - Name Details`,
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
