import BankCountryListing from "@/components/pages/swiftcode/country";
import React from "react";

export const metadata = {
  title: "Find Bank SWIFT Codes by Country || Inform Readers",
  description:
    "Easily find bank SWIFT codes (BIC codes) worldwide. Select a country to see all major banks and their SWIFT codes for secure international transactions.",
  keywords: [
    "SWIFT codes",
    "BIC codes",
    "bank codes",
    "international bank transfer",
    "find bank swift code",
    "swift codes by country",
  ],
  openGraph: {
    title: "Find Bank SWIFT Codes by Country",
    description:
      "Select your country to browse banks and get their SWIFT/BIC codes for secure international money transfers.",
    type: "website",
    siteName: "Inform Readers",
  },
};

const Page = () => {
  return <BankCountryListing />;
};

export default Page;
