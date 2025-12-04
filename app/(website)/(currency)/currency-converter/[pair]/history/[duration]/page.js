import { headers } from "next/headers";
import ChartClient from "./components/ChartClient";
import { buildHreflangLinks } from "@/lib/hreflang";

export async function generateMetadata({ params }) {
  const { pair, duration } = params;

  const [from, to] = pair.toUpperCase().split("-TO-");

  const rangeLabel =
    {
      "7d": "7 Days",
      "30d": "30 Days",
      "90d": "90 Days",
      "1y": "1 Year",
    }[duration] || "History";

  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/currency-converter/${pair}/history/${duration}`, host);
  const title = `${from} to ${to} - ${rangeLabel} Exchange Rate History`;
  const description = `View historical ${from} to ${to} exchange rates for the past ${rangeLabel}. Interactive chart with daily forex trend data.`;

  return {
    title,
    description,
    keywords: `${from} to ${to} history, ${from} ${to} chart, forex history, ${duration} exchange rate, currency converter`,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: "website",
      siteName: "InformReaders.com",
    },
  };
}

export default async function Page({ params }) {
  return <ChartClient />;
}
