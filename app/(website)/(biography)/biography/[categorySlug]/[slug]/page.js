import axiosInstance from "@/lib/axiosInstance";
import BiographyDetail from "@/components/pages/biography/Detail";
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import { buildHreflangLinks } from "@/lib/hreflang";

const metaTemplates = {
  title: "{name} Biography, Age, Net Worth, Family & More in {country}",
  description:
    "Explore the life of {name}, a renowned {occupation} from {country}. Learn about {gender} age, net worth, family, career, and achievements.",
};

// Safe fallback helper
function safe(value, fallback = "Update Soon When Available") {
  return value && value !== "" ? value : fallback;
}

function applyMetaTemplate(template, values) {
  return template
    .replace(/{name}/g, safe(values.name))
    .replace(/{gender}/g, safe(values.gender))
    .replace(/{occupation}/g, safe(values.occupation))
    .replace(/{country}/g, safe(values.country));
}

export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/biography/${categorySlug}/${slug}`, host, true);
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    const { data } = await axiosInstance.get(`/website/biography/detail/${slug}`);

    if (data.error || !data.biography) {
      return {
        title: "Biography Details | Inform Readers",
        description:
          "Discover detailed biographies, life stories, net worth, and achievements of famous personalities.",
        alternates,
      };
    }

    const bio = data.biography;

    const values = {
      name: safe(bio?.name),
      gender: safe(bio?.personalInformation?.find((i) => i.name?.toLowerCase() === "gender")?.value),
      occupation: safe(
        bio?.professionalInformation?.find((i) => i.name?.toLowerCase() === "occupation")?.value
      ),
      country: safe(country),
    };

    const title = applyMetaTemplate(metaTemplates.title, values);
    const description = applyMetaTemplate(metaTemplates.description, values);

    return {
      title,
      description,
      keywords: [
        `${values.name} biography`,
        `${values.name} age`,
        `${values.name} net worth`,
        `${values.name} family`,
        `${values.name} career`,
      ],
      alternates,
      openGraph: {
        title,
        description,
        url: `http://${host}/biography/${slug}`,
        siteName: "InformReaders",
        images: [
          {
            url: bio?.image,
            width: 1200,
            height: 630,
            alt: `${values.name} - Biography`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Biography Details | Inform Readers",
      description:
        "Explore detailed biographies, career journeys, and personal life insights of famous people.",
      alternates,
    };
  }
}

export default function page() {
  return <BiographyDetail />;
}
