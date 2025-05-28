import React from "react";
import { ArrowRightCircle, Loader2 } from "lucide-react";

const ConverterSection = ({
  currencies,
  metalPrices,
  metalAmount,
  setMetalAmount,
  metalFromCurrency,
  setMetalFromCurrency,
  selectedMetal,
  setSelectedMetal,
  error,
  metalResult,
  metalMetadata,
  fetchedAt,
  isLoading,
}) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 pb-4 border-b border-gray-100">
            Convert Currency to Metal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={metalAmount}
                  onChange={(e) => setMetalAmount(parseFloat(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
              <select
                value={metalFromCurrency}
                onChange={(e) => setMetalFromCurrency(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none bg-white"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">Metal</label>
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none bg-white"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                {metalPrices.map((metal) => (
                  <option key={metal.metalCode} value={metal.metalCode}>
                    {metal.symbol} {metal.metalCode} - {metal.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="animate-spin text-red-600 mr-2" size={24} />
              <span className="text-gray-600">Calculating conversion...</span>
            </div>
          ) : metalResult && metalMetadata ? (
            <div className="text-center py-6 px-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center justify-center mb-2">
                <div className="text-lg font-medium text-gray-500 mr-3">
                  {metalAmount} {metalMetadata.currency.symbol} ({metalMetadata.currency.code})
                </div>
                <ArrowRightCircle className="text-red-500 mx-2" size={24} />
                <div className="text-lg font-bold text-red-700">
                  {metalResult} {metalMetadata.metal.unit}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {metalResult} {metalMetadata.metal.unit} of {metalMetadata.metal.fullName}
              </h3>
              <div className="text-gray-500 text-sm mt-3 flex flex-wrap justify-center gap-x-6">
                <span className="inline-flex items-center">
                  <span className="font-medium mr-1">Price per {metalMetadata.metal.unit}:</span>
                  {metalMetadata.metal.price} {metalMetadata.currency.code}
                </span>
                <span className="inline-flex items-center">
                  <span className="font-medium mr-1">Last updated:</span>
                  {fetchedAt
                    ? new Date(fetchedAt).toLocaleString("en-US", { timeZone: "Asia/Karachi" })
                    : "N/A"}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ConverterSection;
