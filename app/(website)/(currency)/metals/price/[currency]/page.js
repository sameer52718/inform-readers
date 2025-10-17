import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";

async function fetchMetalPrices(currency) {
  try {
    const { data } = await axiosInstance.get(`/website/metal/price/${currency}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch metal prices:", error);
    notFound();
  }
}

export default async function MetalPricesPage({ params }) {
  const { currency } = params;
  const data = await fetchMetalPrices(currency);

  if (!data?.success) notFound();

  const { currency: curr, data: metals, related, seo } = data;

  // Separate precious metals from others
  const preciousMetals = metals.filter((m) => ["XAU", "XAG", "XPT", "XPD"].includes(m.metalCode));
  const otherMetals = metals.filter((m) => !["XAU", "XAG", "XPT", "XPD"].includes(m.metalCode));

  return (
    <>
      <head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              {curr.country && (
                <>
                  <Image
                    src={curr.country.flag}
                    alt={curr.country.name}
                    width={64}
                    height={64}
                    className="rounded-full shadow-lg"
                  />
                  <div className="text-left">
                    <h1 className="text-4xl font-bold mb-1 text-white">{curr.country.name}</h1>
                    <p className="text-red-100 text-lg">
                      {curr.fullName} ({curr.code})
                    </p>
                  </div>
                </>
              )}
            </div>
            <p className="text-center text-red-50 text-lg max-w-2xl mx-auto">
              Live precious metal and commodity prices updated in real-time
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8">
          {/* Precious Metals Cards */}
          {preciousMetals.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Precious Metals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {preciousMetals.map((metal) => (
                  <div
                    key={metal.metalCode}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-yellow-400"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{metal.symbol}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        LIVE
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{metal.fullName}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {curr.symbol}
                      {metal.price}
                    </div>
                    <p className="text-sm text-gray-500">per {metal.unit}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Updated: {new Date(metal.fetchedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other Metals Table */}
          {otherMetals.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Industrial & Base Metals</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-500 to-red-700 text-white">
                        <th className="py-4 px-6 text-left font-semibold">Metal</th>
                        <th className="py-4 px-6 text-left font-semibold">Symbol</th>
                        <th className="py-4 px-6 text-left font-semibold">Unit</th>
                        <th className="py-4 px-6 text-right font-semibold">Price ({curr.code})</th>
                        <th className="py-4 px-6 text-left font-semibold">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherMetals.map((metal, index) => (
                        <tr
                          key={metal.metalCode}
                          className={`border-b border-gray-100 hover:bg-red-50 transition ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="py-4 px-6 font-semibold text-gray-800">{metal.fullName}</td>
                          <td className="py-4 px-6 text-gray-600">{metal.symbol}</td>
                          <td className="py-4 px-6 text-gray-600">{metal.unit}</td>
                          <td className="py-4 px-6 text-right font-bold text-gray-900 text-lg">
                            {curr.symbol}
                            {metal.price}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(metal.fetchedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Info Box */}
          <section className="mb-12">
            <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
              <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">About Metal Prices</h3>
              <p className="text-red-800 text-sm leading-relaxed">
                Metal prices are updated in real-time and reflect current market rates in {curr.fullName}.
                Precious metals like gold and silver are often traded as investment assets, while industrial
                metals are key commodities in manufacturing and construction.
              </p>
            </div>
          </section>

          {/* Related Currencies */}
          {related?.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                View Prices in Other Currencies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.code}
                    href={r.url}
                    className="group bg-white hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 
                             text-gray-800 hover:text-white border border-gray-200 hover:border-transparent
                             px-5 py-4 rounded-xl text-center font-semibold transition-all duration-300
                             shadow-sm hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <div className="text-lg mb-1">{r.code}</div>
                    <div className="text-xs opacity-70 group-hover:opacity-100">{r.name}</div>
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
