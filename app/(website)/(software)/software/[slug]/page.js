import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import axiosInstance from "@/lib/axiosInstance";
import SoftwareDetail from "@/components/pages/software/SoftwareDetail";

// Helper to apply template replacements
function applyTemplate(template, values) {
  return template
    .replace(/{Software Name}/g, values.softwareName || "")
    .replace(/{Version}/g, values.version || "")
    .replace(/{Operating System}/g, values.os || "")
    .replace(/{Country}/g, values.country || "")
    .replace(/{Status}/g, values.status || "")
    .replace(/{File Size}/g, values.fileSize || "")
    .replace(/{Last Update}/g, values.lastUpdate || "")
    .replace(/{Memory}/g, values.memory || "")
    .replace(/{Processor}/g, values.processor || "")
    .replace(/{Storage}/g, values.storage || "");
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    const { data } = await axiosInstance.get(`/website/software/${slug}`);
    if (data.error || !data.data) {
      return {
        title: "Software Details | Inform Readers",
        description: "Find and download the latest software and games.",
      };
    }

    const softwareData = data.data;

    const values = {
      softwareName: softwareData.name,
      version: softwareData.version,
      os: "Windows", // Assuming from component; adjust if data has OS
      country,
      status: softwareData.tag?.[0] || "Free", // From tag
      fileSize: `${softwareData.size} MB`,
      lastUpdate: new Date(softwareData.lastUpdate).toLocaleDateString(),
      memory: "4 GB RAM", // From hardcoded systemRequirements; adjust if dynamic
      processor: "64-bit processor",
      storage: "500 MB available space",
    };

    // Use first meta title and description
    const titleTemplate = "Download {Software Name} {Version} for {Operating System} in {Country}";
    const descTemplate =
      "Download {Software Name} {Version} ({File Size}) for {Operating System} in {Country}, updated {Last Update}. Requires {Memory} RAM, {Processor}, {Storage}. {Status}.";

    const title = applyTemplate(titleTemplate, values);
    const description = applyTemplate(descTemplate, values);

    return {
      title,
      description,
      keywords: [
        `${values.softwareName} download`,
        `${values.softwareName} ${values.version}`,
        `${values.softwareName} for ${values.os}`,
        `free ${values.softwareName} in ${values.country}`,
      ],
      openGraph: {
        title,
        description,
        url: `http://${host}/software/${slug}`,
        siteName: "SoftwareFinder",
        images: [
          {
            url: softwareData.logo,
            width: 1200,
            height: 630,
            alt: `${values.softwareName} - Software Details`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Software Details | Inform Readers",
      description: "Explore software downloads, versions, and system requirements.",
    };
  }
}

export default function Page() {
  return <SoftwareDetail />;
}
