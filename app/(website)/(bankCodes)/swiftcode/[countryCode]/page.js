import SwiftCodeLanding from "@/components/pages/swiftcode/listing";


export async function generateMetadata({ params }) {
  const countryCode = params?.countryCode?.toUpperCase() || "Selected Country";

  return {
    title: `Bank SWIFT Codes in ${countryCode} || Inform Readers`,
    description: `Browse all banks in ${countryCode} and find their SWIFT/BIC codes. Search by bank name, city, or branch to get the right code for international money transfers.`,
    keywords: [
      `${countryCode} bank swift codes`,
      `${countryCode} bic codes`,
      `${countryCode} bank codes`,
      `${countryCode} bank swift code list`,
      `find bank swift code ${countryCode}`,
    ],
    openGraph: {
      title: `Bank SWIFT Codes in ${countryCode}`,
      description: `Search and browse bank SWIFT codes in ${countryCode}. Get the correct SWIFT/BIC code for international wire transfers.`,
      type: "website",
      siteName: "Inform Readers",
    },
  };
}


const Page = () => {
  return <SwiftCodeLanding />;
};

export default Page;
