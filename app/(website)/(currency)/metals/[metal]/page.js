import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

async function fetchMetalData(metal) {
  try {
    const { data } = await axiosInstance.get(`/website/metal/${metal}`);
    return data;
  } catch (error) {
    console.error("Error fetching metal data:", error);
    notFound();
  }
}

export default async function MetalPage({ params }) {
  const { metal } = await params;
  const response = await fetchMetalData(metal);

  if (!response?.success) notFound();

  const { data, related, seo } = response;

  // Get metal icon based on type
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

  // Sort prices - major currencies first
  const majorCurrencies = ["USD", "EUR", "GBP", "JPY", "CNY"];
  const sortedPrices = [...data.prices].sort((a, b) => {
    const aIndex = majorCurrencies.indexOf(a.currencyCode);
    const bIndex = majorCurrencies.indexOf(b.currencyCode);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.currencyCode.localeCompare(b.currencyCode);
  });

  const topPrices = sortedPrices.slice(0, 6);
  const otherPrices = sortedPrices.slice(6);

  return (
    <>
      <head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-red-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-7xl">{getMetalIcon(data.metal.symbol)}</div>
              <div>
                <h1 className="text-5xl font-bold mb-3 text-white">{data.metal.name} Prices</h1>
                <div className="flex items-center gap-4 text-red-200">
                  <span className="text-xl font-mono">{data.metal.symbol}</span>
                  <span className="text-lg">•</span>
                  <span>Price per {data.metal.unit}</span>
                  <span className="text-lg">•</span>
                  <span className="text-sm">
                    Last updated:{" "}
                    {new Date(data.updatedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Live Market Data</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Featured Prices - Cards */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Major Currency Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPrices.map((price, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-red-600 to-red-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {price.country?.flag && (
                        <img
                          src={price.country.flag}
                          alt={price.country.name}
                          className="w-10 h-10 rounded-full shadow-md border-2 border-white"
                        />
                      )}
                      <div>
                        <div className="text-white font-bold text-lg">{price.currencyCode}</div>
                        <div className="text-red-100 text-xs">{price.country?.name || "International"}</div>
                      </div>
                    </div>
                    <div className="text-3xl text-white">{price.symbol}</div>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {price.symbol}
                      {price.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      per {data.metal.unit} of {data.metal.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All Prices - Comprehensive Table */}
          {otherPrices.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">All Available Currencies</h2>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                        <th className="py-4 px-6 text-left font-semibold">Country</th>
                        <th className="py-4 px-6 text-left font-semibold">Currency</th>
                        <th className="py-4 px-6 text-left font-semibold">Code</th>
                        <th className="py-4 px-6 text-right font-semibold">Price ({data.metal.unit})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherPrices.map((price, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-gray-100 hover:bg-red-50 transition-colors ${
                            idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {price.country?.flag && (
                                <img
                                  src={price.country.flag}
                                  alt={price.country.name}
                                  className="w-8 h-8 rounded-md shadow-sm"
                                />
                              )}
                              <span className="font-medium text-gray-800">{price.country?.name || "-"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">{price.currencyCode}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-sm font-mono font-semibold text-gray-800">
                              {price.symbol}
                              <span className="text-gray-400">•</span>
                              {price.currencyCode}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="text-xl font-bold text-gray-900">
                              {price.symbol}
                              {price.price}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Info Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-8 shadow-md">
              <div className="flex items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3">About {data.metal.name} Pricing</h3>
                  <p className="text-amber-800 leading-relaxed">
                    {data.metal.name} prices are quoted per {data.metal.unit} and vary across currencies due
                    to exchange rates and local market conditions. The prices shown are updated in real-time
                    and reflect current global market rates. {data.metal.symbol} is traded internationally and
                    serves as both an investment vehicle and industrial commodity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Metals */}
          {related?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">⚡ Explore Other Metals</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 
                             hover:border-red-500 hover:shadow-2xl transition-all duration-300 
                             flex flex-col items-center text-center hover:-translate-y-2"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">
                      {getMetalIcon(item.symbol)}
                    </div>
                    <div className="font-bold text-lg text-gray-900 mb-1">{item.name}</div>
                    <div className="text-sm text-gray-500 font-mono">{item.symbol}</div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-red-600">→</span>
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
