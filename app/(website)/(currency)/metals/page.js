import React from "react";
import Landing from "./components/Landing";

export const metadata = {
  title: "Precious Metal Converter | Real-Time Gold, Silver, Platinum Prices",
  description:
    "Convert currencies to gold, silver, platinum, and other precious metals instantly using real-time market prices.",
  openGraph: {
    title: "Precious Metal Converter",
    description:
      "Get accurate real-time conversions between currencies and precious metals like gold, silver, and platinum.",
    type: "website",
  },
};

const Page = () => {
  return <Landing />;
};

export default Page;
