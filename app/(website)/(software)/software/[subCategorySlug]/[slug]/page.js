import { headers } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import SoftwareDetail from "@/components/pages/software/SoftwareDetail";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { slug, subCategorySlug } = await params;

  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/software/${subCategorySlug}/${slug}/`, host);
  try {
    const { data } = await axiosInstance.get(`/website/software/${slug}`, { params: { host } });
    if (data.error || !data.data) {
      return {
        title: "Software Details | Inform Readers",
        description: "Find and download the latest software and games.",
        alternates,
      };
    }

    const content = data.content;

    return {
      title: content.title,
      description: content.intro,
      alternates,
    };
  } catch (error) {
    return {
      title: "Software Details | Inform Readers",
      description: "Explore software downloads, versions, and system requirements.",
      alternates,
    };
  }
}

export default function Page() {
  return <SoftwareDetail />;
}
