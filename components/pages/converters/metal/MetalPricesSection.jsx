import React from "react";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

const MetalPricesSection = ({ currencies, metalPrices, metalCurrency, setMetalCurrency, isLoading }) => {
  const getMetalCardColor = (index) => {
    const colors = [
      "from-yellow-500/10 to-amber-600/10 border-yellow-200", // Gold
      "from-gray-500/10 to-gray-600/10 border-gray-200", // Silver
      "from-gray-600/10 to-gray-800/10 border-gray-300", // Platinum
      "from-red-500/10 to-red-600/10 border-red-200", // Copper
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Current Metal Prices</h3>
              <p className="text-gray-500">Latest market rates for precious metals</p>
            </div>

            <div className="mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-2 text-gray-700">Display Currency</label>
              <div className="relative">
                <select
                  value={metalCurrency}
                  onChange={(e) => setMetalCurrency(e.target.value)}
                  className="w-full md:w-64 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none bg-white"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  {currencies.map((currency) => (
                    <option key={currency.baseCurrency} value={currency.baseCurrency}>
                      {currency.baseCurrency} - {currency.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                      <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : metalPrices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metalPrices.map((metal, index) => (
                <div
                  key={metal.metalCode}
                  className={`p-6 bg-gradient-to-br ${getMetalCardColor(
                    index
                  )} border rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:-translate-y-1`}
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-3">
                      {index === 0 ? (
                        <Sparkles className="text-yellow-600" size={24} />
                      ) : index === 1 ? (
                        <Sparkles className="text-gray-500" size={24} />
                      ) : (
                        <TrendingUp className="text-red-600" size={24} />
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {metal.fullName} <span className="text-sm text-gray-500">({metal.symbol})</span>
                    </h4>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 flex items-baseline">
                      {metal.price}
                      <span className="text-sm ml-1 text-gray-500">{metalCurrency}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Per {metal.unit}</p>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={14} className="mr-1" />
                    <span>
                      Updated:{" "}
                      {new Date(metal.fetchedAt).toLocaleString("en-US", {
                        timeZone: "Asia/Karachi",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No metal prices available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MetalPricesSection;
