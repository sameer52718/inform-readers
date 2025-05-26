export const metadata = {
  title: "Currency Converter - InformReaders.com",
  description:
    "Convert currencies easily with our reliable and user-friendly currency converter tool, supporting multiple global currencies.",
  keywords: "currency converter, exchange rates, global currencies, InformReaders",
  openGraph: {
    title: "Currency Converter - InformReaders.com",
    description: "Convert currencies with ease using our reliable tool.",
    url: "https://www.informreaders.com/currency-converter",
    siteName: "InformReaders.com",
    images: [
      {
        url: "https://www.informreaders.com/og-image-currency.jpg",
        width: 1200,
        height: 630,
        alt: "Currency Converter",
      },
    ],
    type: "website",
  },
};

import CurrencyConverter from "@/components/pages/converters/currency/CurrencyConverter";

export default function Page() {
  return <CurrencyConverter />;
}
