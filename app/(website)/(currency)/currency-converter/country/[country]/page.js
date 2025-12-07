import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { Crown, Globe, Plane } from "lucide-react";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

// ✅ Fetch data server-side
async function getCountryForex(country) {
  try {
    const { data } = await axiosInstance.get(`/website/currency/${country}`);

    if (!data.success) {
      notFound();
    }

    return data;
  } catch (error) {
    console.error("Error fetching forex country data:", error);
    notFound();
  }
}

// ✅ Generate Metadata
export async function generateMetadata({ params }) {
  const { country } = await params;
  const data = await getCountryForex(country);
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/currency-converter/country/${country}`, host);
  if (!data) return {};

  const { seo } = data;
  return {
    title: seo?.title || "Currency Information",
    description: seo?.description || "Explore currency exchange rates and information.",
    alternates,
    openGraph: {
      title: seo?.title,
      description: seo?.description,
    },
  };
}

export default async function ForexCountryPage({ params }) {
  const { country } = await params;
  const data = await getCountryForex(country);

  if (!data) notFound();

  const { data: forex } = data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Currency Converter", href: "/currency-converter" },
    { label: forex.currency.name },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
            <div className="relative">
              <Image
                src={forex.country.flag}
                alt={forex.country.name}
                width={120}
                height={120}
                className="rounded-full shadow-2xl border-4 border-white"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{forex.country.name}</h1>
              <p className="text-red-100 text-lg">
                {forex.country.region && `Region: ${forex.country.region}`}
              </p>
            </div>
          </div>

          {/* Currency Highlight Card */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Official Currency</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{forex.currency.name}</h2>
              <div className="flex items-center justify-center gap-4 text-xl text-gray-600">
                <span className="font-semibold">{forex.currency.code}</span>
                {forex.currency.symbol && (
                  <>
                    <span>•</span>
                    <span className="text-2xl font-bold text-red-600">{forex.currency.symbol}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {new Date(forex.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Currency Overview */}
        <Breadcrumb items={breadcrumbItems} />
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              About {forex.currency.code}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-red-50 rounded-xl p-6 border border-red-100">
                <div className="text-red-600 text-3xl mb-2">🏛️</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-2xl">Currency Name</h3>
                <p className="text-gray-700">{forex.currency.name}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-purple-50 rounded-xl p-6 border border-red-100">
                <div className="text-red-600 text-3xl mb-2">🔤</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-2xl">Currency Code</h3>
                <p className="text-gray-700 text-2xl font-bold">{forex.currency.code}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="text-purple-600 text-3xl mb-2">💲</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-2xl">Currency Symbol</h3>
                <p className="text-gray-700 text-3xl font-bold">{forex.currency.symbol || "—"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Conversions */}
        {forex.conversions?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Popular {forex.currency.code} Conversions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forex.conversions.map((conv) => (
                <Link
                  key={conv.pair}
                  href={`/currency-converter/${conv.pair}`}
                  className="group bg-white border-2 border-gray-100 hover:border-red-400 hover:shadow-xl transition-all duration-300 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                      {conv.from} → {conv.to}
                    </p>
                    <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                      →
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Exchange Rate</p>
                    <p className="text-xl font-bold text-gray-800">
                      1 {conv.from} = {conv.rate} {conv.to}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Currency Statistics */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Why Track {forex.currency.code} Exchange Rates?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mb-3 flex justify-center items-center">
                  <Globe className="w-10 h-10" />
                </div>
                <h3 className="font-semibold mb-2 text-white text-xl">International Trade</h3>
                <p className="text-sm text-red-100">
                  Essential for businesses and individuals conducting cross-border transactions
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center items-center">
                  <Plane className="w-10 h-10" />
                </div>
                <h3 className="font-semibold mb-2 text-white text-xl">Travel Planning</h3>
                <p className="text-sm text-red-100">
                  Plan your budget when traveling to or from {forex.country.name}
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center items-center">
                  <Crown className="w-10 h-10" />
                </div>
                <h3 className="font-semibold mb-2 text-white text-xl">Investment Decisions</h3>
                <p className="text-sm text-red-100">
                  Track currency performance for forex trading and investments
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">Quick Facts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">🗺️</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-2xl">Country</h3>
                    <p className="text-gray-600">{forex.country.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">💵</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-2xl">Currency</h3>
                    <p className="text-gray-600">{forex.currency.name}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">🔢</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-2xl">ISO Code</h3>
                    <p className="text-gray-600 font-mono text-lg">{forex.currency.code}</p>
                  </div>
                </div>
                {forex.country.region && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-2xl">Region</h3>
                      <p className="text-gray-600">{forex.country.region}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Countries */}
        {forex.related?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Explore Other Currencies
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {forex.related.map((rel) => (
                <Link
                  key={rel.country}
                  href={rel.link}
                  className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-red-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Image
                        src={rel.flag}
                        alt={rel.country}
                        width={56}
                        height={56}
                        className="rounded-full shadow-md border-2 border-gray-100 group-hover:border-red-300 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-800 group-hover:text-red-600 transition-colors">
                        {rel.country}
                      </p>
                      <p className="text-sm text-gray-500">{rel.currencyName}</p>
                    </div>
                    <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Currency Code</p>
                    <p className="font-mono font-bold text-gray-800 text-lg">{rel.currency}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  What is the official currency of {forex.country.name}?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  The official currency of {forex.country.name} is the {forex.currency.name} (
                  {forex.currency.code}).
                  {forex.currency.symbol && ` It is represented by the symbol ${forex.currency.symbol}.`}
                </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  Where can I exchange {forex.currency.code}?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  You can exchange {forex.currency.code} at banks, currency exchange offices, airports, and
                  online forex platforms. Always compare rates to get the best deal for your currency
                  exchange.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  How often do {forex.currency.code} exchange rates change?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  Exchange rates fluctuate constantly based on market conditions, economic factors, and global
                  events. Our platform provides regularly updated rates to help you stay informed.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  Is {forex.currency.code} a stable currency?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  Currency stability depends on various economic factors including inflation, government
                  policies, trade balance, and political stability. Monitor the exchange rates on our platform
                  to track {forex.currency.code} performance.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="bg-gradient-to-br from-gray-50 to-red-50 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About {forex.country.name} Currency</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The {forex.currency.name} ({forex.currency.code}) is the official currency of {forex.country.name}
            .{forex.country.region && ` Located in ${forex.country.region}, `}
            {forex.country.name} uses this currency for all domestic transactions and international trade.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Understanding the {forex.currency.code} exchange rate is crucial for anyone planning to visit{" "}
            {forex.country.name}, conducting business with {forex.country.name}, or investing in the region's
            economy. Our platform provides up-to-date conversion rates and comprehensive information to help
            you make informed financial decisions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you're a traveler, business professional, or forex trader, knowing the current value of{" "}
            {forex.currency.code}
            against major world currencies can help you plan better and maximize your financial outcomes.
            Check our popular conversion rates above to see how {forex.currency.code} compares to other
            currencies.
          </p>
        </section>
      </div>
    </main>
  );
}
