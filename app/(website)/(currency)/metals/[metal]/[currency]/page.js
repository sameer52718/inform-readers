import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

async function fetchMetalCurrency(metal, currency) {
  try {
    const { data } = await axiosInstance.get(`/website/metal/rate/${metal}-in-${currency}`);
    return data;
  } catch (error) {
    console.error("Error fetching metal-currency data:", error);
    notFound();
  }
}

export default async function MetalCurrencyPage({ params }) {
  const { metal, currency } = params;

  const response = await fetchMetalCurrency(metal, currency);
  if (!response || !response.success) notFound();

  const { data, related, seo } = response;

  const metalInfo = data.metal;
  const currencyInfo = data.currency;

  // Get metal icon
  const getMetalIcon = (symbol) => {
    const icons = {
      Au: "🥇",
      Ag: "⚪",
      Pt: "💍",
      Pd: "🔘",
      Cu: "🔶",
      Al: "⚙️",
      Zn: "🔩",
      Ni: "🪙",
    };
    return icons[symbol] || "⚡";
  };

  return (
    <>
      <head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600  to-red-700 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <span className="text-5xl text-white">{getMetalIcon(metalInfo.symbol)}</span>
                <span className="text-3xl">→</span>
                {currencyInfo.country?.flag && (
                  <img
                    src={currencyInfo.country.flag}
                    alt={currencyInfo.country.name}
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white"
                  />
                )}
              </div>

              <h1 className="text-5xl font-bold mb-4 text-white">
                {metalInfo.name} Price in {currencyInfo.code}
              </h1>

              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-5 py-2 text-green-300 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Live Rate</span>
              </div>

              <p className="text-red-200 text-sm">
                Last updated:{" "}
                {new Date(data.fetchedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-12 pb-16">
          {/* Main Price Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="text-center">
              <div className="mb-6">
                <span className="text-gray-600 text-lg font-medium">
                  1 {metalInfo.unit} of {metalInfo.name}
                </span>
              </div>

              <div className="mb-8">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-2">
                  {currencyInfo.symbol}
                  {metalInfo.price}
                </div>
                <div className="text-2xl text-gray-500 font-medium">{currencyInfo.code}</div>
              </div>

              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full px-6 py-3">
                <span className="text-red-700 font-semibold">{metalInfo.symbol}</span>
                <span className="text-red-400">⇄</span>
                <span className="text-pink-700 font-semibold">{currencyInfo.code}</span>
              </div>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Metal Info Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{getMetalIcon(metalInfo.symbol)}</span>
                <h2 className="text-2xl font-bold text-amber-900">Metal Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                  <span className="text-amber-700 font-medium">Name</span>
                  <span className="text-amber-900 font-bold">{metalInfo.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                  <span className="text-amber-700 font-medium">Symbol</span>
                  <span className="text-amber-900 font-mono font-bold text-lg">{metalInfo.symbol}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                  <span className="text-amber-700 font-medium">Unit</span>
                  <span className="text-amber-900 font-bold">{metalInfo.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 font-medium">Current Price</span>
                  <span className="text-amber-900 font-bold text-xl">
                    {currencyInfo.symbol}
                    {metalInfo.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Currency Info Card */}
            <div className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                {currencyInfo.country?.flag ? (
                  <img
                    src={currencyInfo.country.flag}
                    alt={currencyInfo.country.name}
                    className="w-12 h-12 rounded-lg shadow-md"
                  />
                ) : (
                  <span className="text-4xl">💱</span>
                )}
                <h2 className="text-2xl font-bold text-red-900">Currency Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-red-200">
                  <span className="text-red-700 font-medium">Currency</span>
                  <span className="text-red-900 font-bold">{currencyInfo.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-red-200">
                  <span className="text-red-700 font-medium">Code</span>
                  <span className="text-red-900 font-mono font-bold text-lg">{currencyInfo.code}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-red-200">
                  <span className="text-red-700 font-medium">Symbol</span>
                  <span className="text-red-900 font-bold text-2xl">{currencyInfo.symbol}</span>
                </div>
                {currencyInfo.country && (
                  <div className="flex justify-between items-center">
                    <span className="text-red-700 font-medium">Country</span>
                    <span className="text-red-900 font-bold">{currencyInfo.country.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conversion Info Box */}
          <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-8 mb-12 border-2 border-red-200">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-3">
                  Understanding {metalInfo.name} Pricing
                </h3>
                <p className="text-red-800 leading-relaxed">
                  The price shown represents the current market rate for {metalInfo.name} ({metalInfo.symbol})
                  per {metalInfo.unit} in {currencyInfo.name} ({currencyInfo.code}). Metal prices fluctuate
                  based on global market conditions, supply and demand, and economic factors. This rate is
                  updated in real-time to reflect the latest trading values.
                </p>
              </div>
            </div>
          </div>

          {/* Related Rates */}
          {related?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Metal Rates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    className="group bg-white hover:bg-gradient-to-br hover:from-red-600 hover:to-pink-600 
                             rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 
                             border-2 border-gray-200 hover:border-transparent hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <span className="text-gray-400 group-hover:text-white transition-colors text-xl">
                        →
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 group-hover:text-red-100 transition-colors">
                      View current rate
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
