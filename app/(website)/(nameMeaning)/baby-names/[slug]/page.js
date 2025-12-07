import axiosInstance from "@/lib/axiosInstance";
import NameMeaning from "@/components/pages/babynames/NameDetail";
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    const { data } = await axiosInstance.get(`/website/name/${slug}`, { params: { host } });
    const alternates = buildHreflangLinks(`/baby-names/${slug}/`, host);

    if (data.error || !data.data) {
      return {
        title: "Name Details | Infrom Readers",
        description: "Find detailed meanings, origin, and cultural background of baby names.",
        alternates,
      };
    }

    const nameData = data.data;

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
      alternates,
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
