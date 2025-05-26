import React from "react";

const ResultDisplay = ({ amount, result, metadata }) => {
  return (
    <div className="text-center py-6 px-4 bg-gradient-to-r from-red-50 to-red-50 rounded-xl shadow-sm">
      <div className="animate-fadeIn">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-600">
          {amount} {metadata.from.symbol} ({metadata.from.code}) = {result} {metadata.to.symbol} (
          {metadata.to.code})
        </h3>
        <div className="text-gray-600 flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
          <p className="flex items-center">
            <span className="font-medium mr-2">From:</span>
            {metadata.from.country && (
              <span className="mr-2 text-xl">
                <img src={metadata.from.country.flag} alt={metadata.from.country.name} className="w-4 h-4" />
              </span>
            )}
            <span>{metadata.from.fullName}</span>
            {metadata.from.country && (
              <span className="text-gray-500 ml-1">({metadata.from.country.name})</span>
            )}
          </p>
          <p className="flex items-center">
            <span className="font-medium mr-2">To:</span>
            {metadata.to.country && (
              <span className="mr-2 text-xl">
                {" "}
                <img src={metadata.to.country.flag} alt={metadata.to.country.name} className="w-4 h-4" />
              </span>
            )}
            <span>{metadata.to.fullName}</span>
            {metadata.to.country && <span className="text-gray-500 ml-1">({metadata.to.country.name})</span>}
          </p>
        </div>
        <p className="text-gray-500 mt-4 text-sm">
          Last updated: {new Date(metadata.fetchedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
