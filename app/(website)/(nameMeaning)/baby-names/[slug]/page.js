import axiosInstance from "@/lib/axiosInstance";
import NameMeaning from "@/components/pages/babynames/NameDetail";
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const host = (await headers()).get("host") || "informreaders.com";

  try {
    const { data } = await axiosInstance.get(`/website/name/${slug}`, { params: { host } });
    const alternates = buildHreflangLinks(`/baby-names/${slug}/`, host, true);

    if (data.error || !data.data) {
      return {
        title: "Name Details | Inform Readers",
        description: "Find detailed meanings, origin, and cultural background of baby names.",
        alternates,
      };
    }

    const nameData = data.data;

    // Use SEO data from API response
    const seoTitle = nameData?.seo?.title || `${nameData?.name || ""} Name Meaning, Origin, and Usage - Inform Readers`;
    const seoDescription = nameData?.seo?.meta_description || nameData?.ai_overview_summary || `Explore the name ${nameData?.name || ""}, its meaning, origin, and cultural significance.`;
    const metaTags = nameData?.seo?.meta_tags || [];
    const focusKeywords = [
      ...(nameData?.focus_keywords?.hard_keywords || []),
      ...(nameData?.focus_keywords?.query_based_keywords || []),
      ...(nameData?.focus_keywords?.paa_keywords || []),
    ];

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [...metaTags, ...focusKeywords].filter(Boolean),
      alternates,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
      },
    };
  } catch (error) {
    return {
      title: "Baby Name Details | Inform Readers",
      description: "Explore baby name meanings, origins, and religious significance.",
    };
  }
}

export default function page() {
  return <NameMeaning />;
}
