import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import {
  ArrowLeftRight,
  Scale,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  Calculator,
  BarChart3,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MetalComparePage({ params }) {
  const { pair } = params;

  let data = null;
  let related = [];

  try {
    const res = await axiosInstance.get(`/website/metal/compare/${pair}`);
    if (res.data.success) {
      data = res.data.data;
      related = res.data.related;
      seo = res.data.seo;
    }
  } catch (err) {
    console.error("Error fetching comparison data:", err.message);
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Comparison Not Available</h2>
          <p className="text-gray-600 mb-6 max-w-md">We couldn't find price data for this metal pair.</p>
          <Link
            href="/metals"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Browse All Metals
          </Link>
        </div>
      </div>
    );
  }

  const { base, quote, ratio } = data;

  // Calculate percentage difference
  const basePrice = parseFloat(base.priceUSD.replace(/[^0-9.-]/g, ""));
  const quotePrice = parseFloat(quote.priceUSD.replace(/[^0-9.-]/g, ""));
  const priceDiff = (((basePrice - quotePrice) / quotePrice) * 100).toFixed(2);
  const isBaseHigher = basePrice > quotePrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-16 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Live Market Data</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            {base.fullName} vs {quote.fullName}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Real-time precious metal comparison and price ratio analysis
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-16">
        {/* MAIN COMPARISON CARD */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 mb-8">
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Base Metal */}
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-50 rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-2xl mb-4 font-bold text-2xl">
                  {base.symbol}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{base.fullName}</h3>
                <p className="text-4xl font-bold text-red-600 mb-2">{base.priceUSD}</p>
                <p className="text-sm font-medium text-gray-600 bg-white/60 inline-block px-3 py-1 rounded-full">
                  Per {base.unit}
                </p>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-600 rounded-full blur-xl opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                    <ArrowLeftRight className="w-8 h-8" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Versus</p>
              </div>

              {/* Quote Metal */}
              <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 text-white rounded-2xl mb-4 font-bold text-2xl">
                  {quote.symbol}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{quote.fullName}</h3>
                <p className="text-4xl font-bold text-gray-700 mb-2">{quote.priceUSD}</p>
                <p className="text-sm font-medium text-gray-600 bg-white/60 inline-block px-3 py-1 rounded-full">
                  Per {quote.unit}
                </p>
              </div>
            </div>

            {/* Ratio Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-red-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Scale className="text-red-600 w-6 h-6" />
                    <h4 className="text-lg font-bold text-gray-800">Price Ratio</h4>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{ratio}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    1 {base.unit} of {base.fullName} equals the price of {ratio.split(":")[1]} {quote.unit} of{" "}
                    {quote.fullName}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    {isBaseHigher ? (
                      <TrendingUp className="text-green-600 w-6 h-6" />
                    ) : (
                      <TrendingDown className="text-blue-600 w-6 h-6" />
                    )}
                    <h4 className="text-lg font-bold text-gray-800">Price Difference</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{Math.abs(priceDiff)}%</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {base.fullName} is {isBaseHigher ? "more" : "less"} expensive than {quote.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INSIGHTS SECTION */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Market Insights</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  The {base.fullName}/{quote.fullName} ratio is a key indicator for precious metal investors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Historical trends show this ratio fluctuates based on market demand and supply</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Current prices are updated in real-time from global markets</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Quick Conversion</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">
                  If you buy 1 {base.unit} of {base.fullName}
                </p>
                <p className="text-lg font-bold text-gray-800">
                  You could get ≈ {ratio.split(":")[1]} {quote.unit} of {quote.fullName}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Investment equivalence</p>
                <p className="text-lg font-bold text-gray-800">
                  ${basePrice.toFixed(2)} = ${quotePrice.toFixed(2)} × {ratio.split(":")[1]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED COMPARISONS */}
        {related.length > 0 && (
          <section className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Compare with Other Metals</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.map((metal) => (
                <Link
                  key={metal.metalCode}
                  href={`/metals/compare/${metal.fullName.toLowerCase()}-vs-${base.fullName.toLowerCase()}`}
                  className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-red-300 hover:-translate-y-2 transition-all duration-300 p-6 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/5 transition-all duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors font-bold text-gray-700 group-hover:text-red-600">
                      {metal.symbol}
                    </div>
                    <p className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                      {metal.fullName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors">
                      Compare now →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
            <RefreshCw className="w-4 h-4 text-red-600 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-sm font-medium text-gray-700">
              Last updated:{" "}
              <span className="text-gray-900 font-semibold">
                {new Date(base.fetchedAt).toLocaleString("en-US", {
                  timeZone: "Asia/Karachi",
                })}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
