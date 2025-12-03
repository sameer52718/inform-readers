import axiosInstance from "@/lib/axiosInstance";
import SwiftCodeDetail from "@/components/pages/bankcodes/SwifrCodeDetail";
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { swiftCode, countryCode, bankSlug, branchSlug } = params;

  // Get host and country from headers
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(
    `/bank-codes/${countryCode}/${bankSlug}/${branchSlug}/${swiftCode}/`,
    host
  );
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    // Fetch SWIFT code data
    const { data } = await axiosInstance.get(`/website/bankCode/${swiftCode}`);

    if (data.error || !data.bankCodes) {
      return {
        title: "SWIFT Code Details | Inform Readers",
        description: "Find SWIFT codes for secure international bank transfers.",
        alternates,
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
    const title = data.content.title;
    const description = data.content.paragraph;

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
      alternates,
      openGraph: {
        title,
        description,
        url: `http://${host}/bank-codes/${swiftCode}`,
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
