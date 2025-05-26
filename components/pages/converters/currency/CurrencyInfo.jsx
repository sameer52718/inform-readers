import React from "react";

const CurrencyInfo = ({ metadata }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Currency Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-red-500 text-xl mb-3 flex items-center">
                {metadata.from.country && (
                  <span className="mr-2 text-2xl">
                    <img src={metadata.from.country.flag} alt={metadata.from.country.name} className="w-6" />
                  </span>
                )}
                {metadata.from.fullName} ({metadata.from.code})
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex">
                  <span className="font-medium w-28">Code:</span>
                  <span>{metadata.from.code}</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-28">Symbol:</span>
                  <span>{metadata.from.symbol}</span>
                </li>
                {metadata.from.country && (
                  <>
                    <li className="flex">
                      <span className="font-medium w-28">Country:</span>
                      <span>{metadata.from.country.name}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-28">Country Code:</span>
                      <span>{metadata.from.country.countryCode.toUpperCase()}</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-red-500 mb-3 text-xl flex items-center">
                {metadata.to.country && (
                  <span className="mr-2 text-2xl">
                    <img src={metadata.to.country.flag} alt={metadata.to.country.name} className="w-6" />
                  </span>
                )}
                {metadata.to.fullName} ({metadata.to.code})
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex">
                  <span className="font-medium w-28">Code:</span>
                  <span>{metadata.to.code}</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-28">Symbol:</span>
                  <span>{metadata.to.symbol}</span>
                </li>
                {metadata.to.country && (
                  <>
                    <li className="flex">
                      <span className="font-medium w-28">Country:</span>
                      <span>{metadata.to.country.name}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-28">Country Code:</span>
                      <span>{metadata.to.country.countryCode.toUpperCase()}</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyInfo;
