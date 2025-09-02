import axiosInstance from "@/lib/axiosInstance";
import SwiftCodeDetail from "@/components/pages/bankcodes/SwifrCodeDetail"; // Adjust path as needed
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";

// Meta templates based on Bank Codes Meta title and Description.rtf
const metaTemplates = {
  title: "{bank_name} SWIFT Codes in {country} | {location}",
  description:
    "Find SWIFT codes for {bank_name} in {location}, {country}. Ensure secure international transfers with accurate bank codes!",
};

// Function to replace placeholders in meta templates
function applyMetaTemplate(template, values) {
  return template
    .replace(/{bank_name}/g, values.bank_name || "")
    .replace(/{location}/g, values.location || "")
    .replace(/{country}/g, values.country || "");
}

export async function generateMetadata({ params }) {
  const { swiftCode } = params;

  // Get host and country from headers
  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    // Fetch SWIFT code data
    const { data } = await axiosInstance.get(`/website/bankCode/${swiftCode}`);

    if (data.error || !data.bankCodes) {
      return {
        title: "SWIFT Code Details | Inform Readers",
        description: "Find SWIFT codes for secure international bank transfers.",
      };
    }

    const bankData = data.bankCodes;

    // Prepare values for meta template replacement
    const values = {
      bank_name: bankData?.bank || "",
      location: bankData?.city || "",
      country: bankData?.countryId?.name || country,
    };

    // Generate title and description
    const title = applyMetaTemplate(metaTemplates.title, values);
    const description = applyMetaTemplate(metaTemplates.description, values);

    return {
      title,
      description,
      keywords: [
        `${values.bank_name} SWIFT code`,
        `${values.bank_name} bank codes ${values.location}`,
        `SWIFT code ${values.location} ${values.country}`,
        `${values.bank_name} international transfers`,
        `bank codes ${values.country}`,
      ],
      openGraph: {
        title,
        description,
        url: `http://${host}/swiftcode/${swiftCode}`,
        siteName: "BankCodeFinder",
        images: [
          {
            url: `http://${host}/images/bank-code-og.jpg`, // Adjust to your actual image path
            width: 1200,
            height: 630,
            alt: `${values.bank_name} SWIFT Code - ${values.location}, ${values.country}`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "SWIFT Code Details | Inform Readers",
      description: "Explore SWIFT codes for secure international bank transfers.",
    };
  }
}

export default function Page() {
  return <SwiftCodeDetail />;
}