import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Globe2, TrendingUp, Coins } from "lucide-react";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/currency-converter/symbols`, host);

  return {
    title: "Supported Currencies - InformReaders.com",
    description:
      "Explore all supported global currencies including USD, EUR, GBP, JPY, and more. View country flags, currency symbols, and full international currency details.",
    keywords:
      "supported currencies, currency list, global currencies, exchange currencies, world currencies, currency symbols, international currencies, InformReaders",
    alternates,
    openGraph: {
      title: "Supported Currencies - InformReaders.com",
      description:
        "View all supported global currencies with country flags, symbols, and international currency details.",
      url: alternates.canonical,
      siteName: "InformReaders.com",
      type: "website",
    },
  };
}

export default async function Page() {
  const response = await axiosInstance.get("/website/currency");
  const currencies = response.data?.currencies || [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Currency Converter", href: "/currency-converter" },
    { label: "Symbols" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-6 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Globe2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Supported Currencies</h1>
          </div>
          <p className="text-red-100 text-lg max-w-2xl">
            Explore our comprehensive list of supported currencies from around the world. Trade, convert, and
            transact with confidence across global markets.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold">{currencies.length}+</div>
              <div className="text-red-200 text-sm mt-1">Currencies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-red-200 text-sm mt-1">Trading</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Real-time</div>
              <div className="text-red-200 text-sm mt-1">Rates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Search and Filter Section */}
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Currency Directory</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Coins className="w-4 h-4" />
              <span>{currencies.length} currencies available</span>
            </div>
          </div>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currencies.map((item, index) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header with Flag and Currency Code */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {item.country?.flag ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
                      <img
                        src={item.country.flag}
                        alt={item.country.name}
                        className="relative w-14 h-10 rounded-lg object-cover shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg" />
                  )}

                  <div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {item.baseCurrency}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Currency Code</div>
                  </div>
                </div>

                <div className="text-3xl font-light text-red-600">{item.symbol}</div>
              </div>

              {/* Currency Name */}
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 leading-snug">{item.fullName}</h3>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

              {/* Country Info */}
              {item.country?.name && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-600">{item.country.name}</span>
                </div>
              )}

              {/* Hover Action */}
              {/* <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all">
                  View Exchange Rates
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {/* Empty State (if no currencies) */}
        {currencies.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Coins className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Currencies Available</h3>
            <p className="text-gray-600">Please check back later for updated currency listings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
