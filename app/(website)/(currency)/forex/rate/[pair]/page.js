import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Image from "next/image";
import { Info, Globe, Zap, Smartphone } from "lucide-react";

// 👇 Dynamic Metadata (SEO)
export async function generateMetadata({ params }) {
  const { pair } = params;
  const { data } = await axiosInstance.get(`/website/currency/convert/${pair}`);
  if (data.error) return {};

  const { seo } = data || {};
  return {
    title: seo?.title || "Currency Converter",
    description: seo?.description || "Live forex conversion rates.",
    openGraph: {
      title: seo?.title,
      description: seo?.description,
    },
  };
}

// 👇 Fetch conversion data
async function getForexData(pair) {
  try {
    const { data } = await axiosInstance.get(`/website/currency/convert/${pair}`);
    if (data.error) return null;
    return data;
  } catch (error) {
    handleError(error);
    notFound();
  }
}

export default async function ForexPage({ params }) {
  const { pair } = params;
  const data = await getForexData(pair);
  if (!data?.success) notFound();

  const { data: conv } = data;

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl text-white md:text-5xl font-bold text-center">
              {conv.from.code} to {conv.to.code} Converter
            </h1>
          </div>
          <p className="text-center text-red-100 text-lg mb-8">{conv.resultFor1Unit}</p>

          {/* Main Conversion Card */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* From Currency */}
              <div className="text-center">
                {conv.from.country?.flag && (
                  <div className="mb-3 flex justify-center">
                    <Image
                      src={conv.from.country.flag}
                      alt={conv.from.fullName}
                      width={80}
                      height={80}
                      className="rounded-full shadow-lg"
                    />
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-800">{conv.from.code}</div>
                <div className="text-sm text-gray-600 mt-1">{conv.from.fullName}</div>
              </div>

              {/* Exchange Rate */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Exchange Rate</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  {conv.rate}
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Updated: {new Date(conv.updatedAt).toLocaleString()}
                </div>
              </div>

              {/* To Currency */}
              <div className="text-center">
                {conv.to.country?.flag && (
                  <div className="mb-3 flex justify-center">
                    <Image
                      src={conv.to.country.flag}
                      alt={conv.to.fullName}
                      width={80}
                      height={80}
                      className="rounded-full shadow-lg"
                    />
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-800">{conv.to.code}</div>
                <div className="text-sm text-gray-600 mt-1">{conv.to.fullName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Conversion Table */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Quick Conversion Table
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 5, 10, 25, 50, 100, 500, 1000].map((amount) => (
                <div
                  key={amount}
                  className="bg-gradient-to-br from-red-50 to-red-50 rounded-xl p-4 text-center border border-red-100"
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {amount} {conv.from.code}
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {(amount * parseFloat(conv.rate)).toFixed(2)} {conv.to.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Currency Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Currency Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* From Currency Info */}
            <Link
              href={`/forex/${conv?.from?.country?.name?.replaceAll(" ", "-")}`}
              className="group bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {conv.from.country?.flag && (
                  <Image
                    src={conv.from.country.flag}
                    alt={conv.from.fullName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{conv.from.fullName}</h3>
                  <p className="text-sm text-gray-600">{conv.from.code}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{conv.from.country?.countryCode?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Currency Code:</span>
                  <span className="font-semibold">{conv.from.code}</span>
                </div>
              </div>
            </Link>
            {/* To Currency Info */}

            <Link
              href={`/forex/${conv?.to?.country?.name?.replaceAll(" ", "-")}`}
              className="group bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {conv.to.country?.flag && (
                  <Image
                    src={conv.to.country.flag}
                    alt={conv.to.fullName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{conv.to.fullName}</h3>
                  <p className="text-sm text-gray-600">{conv.to.code}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{conv.to.country?.countryCode?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Currency Code:</span>
                  <span className="font-semibold">{conv.to.code}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Why Use Our Currency Converter?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mb-3 flex justify-center items-center">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="font-semibold mb-2 text-white text-2xl">Real-Time Rates</h3>
                <p className="text-sm text-red-100">
                  Live forex rates updated regularly for accurate conversions
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center items-center">
                  <Globe className="w-10 h-10" />
                </div>
                <h3 className="font-semibold mb-2 text-white text-2xl">Global Coverage</h3>
                <p className="text-sm text-red-100">Support for major world currencies and exchange pairs</p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center items-center">
                  <Smartphone className="w-10 h-10" />
                </div>
                <h3 className="font-semibold mb-2 text-white text-2xl">Easy to Use</h3>
                <p className="text-sm text-red-100">Simple, intuitive interface for quick conversions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Pairs */}
        {conv.relatedPairs?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Related Currency Pairs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conv.relatedPairs.map((pair) => (
                <Link
                  key={pair.pair}
                  href={`/forex/rate/${pair.pair}`}
                  className="group bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {pair.flag && (
                      <Image
                        src={pair.flag}
                        alt={pair.fullName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-800 group-hover:text-red-600 transition-colors">
                        {pair.from} → {pair.to}
                      </p>
                      <p className="text-sm text-gray-500">{pair.fullName}</p>
                    </div>
                    <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
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
                  How often are exchange rates updated?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  Our exchange rates are updated regularly throughout the day to ensure you get the most
                  accurate and current conversion rates for {conv.from.code} to {conv.to.code}.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  Are these rates suitable for bank transfers?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  These are mid-market rates for reference. Actual rates from banks and money transfer
                  services may differ slightly due to fees and markups.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  Can I use this for travel planning?
                  <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">
                  Yes! This converter is perfect for travel planning, helping you understand how much your{" "}
                  {conv.from.code} is worth in {conv.to.code} when visiting{" "}
                  {conv.to.country?.countryCode?.toUpperCase()}.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-gradient-to-br from-gray-50 to-red-50 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About {conv.from.code} to {conv.to.code} Exchange
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The {conv.from.fullName} ({conv.from.code}) to {conv.to.fullName} ({conv.to.code}) exchange rate
            is one of the actively traded currency pairs in the forex market. Our converter provides real-time
            rates to help you make informed decisions whether you're traveling, sending money internationally,
            or trading currencies.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Current rate:{" "}
            <span className="font-bold text-red-600">
              1 {conv.from.code} = {conv.rate} {conv.to.code}
            </span>
            . This means that for every {conv.from.code} you exchange, you'll receive approximately{" "}
            {conv.rate} {conv.to.code}.
          </p>
        </section>
      </div>
    </main>
  );
}
