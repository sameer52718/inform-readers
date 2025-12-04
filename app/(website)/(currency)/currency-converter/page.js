import CurrencyConverter from "@/components/pages/converters/currency/CurrencyConverter";
import { buildHreflangLinks } from "@/lib/hreflang";
import { headers } from "next/headers";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/currency-converter/`, host);
  return {
    title: "Currency Converter - InformReaders.com",
    description:
      "Convert currencies easily with our reliable and user-friendly currency converter tool, supporting multiple global currencies.",
    keywords: "currency converter, exchange rates, global currencies, InformReaders",
    alternates,
    openGraph: {
      title: "Currency Converter - InformReaders.com",
      description: "Convert currencies with ease using our reliable tool.",
      url: alternates.canonical,
      siteName: "InformReaders.com",
      type: "website",
    },
  };
}

export default function Page() {
  return <CurrencyConverter />;
}
