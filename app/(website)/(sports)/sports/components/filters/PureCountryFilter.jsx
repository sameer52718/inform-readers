"use client";

import { useState, useMemo } from "react";

export function PureCountryFilter({
  selectedCountries,
  onCountriesChange,
  availableCountries,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(() => {
    return availableCountries.filter((country) => country.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [availableCountries, searchTerm]);

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter((c) => c !== country));
    } else {
      onCountriesChange([...selectedCountries, country]);
    }
  };

  const clearAllFilters = () => {
    onCountriesChange([]);
    setSearchTerm("");
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <span className="text-red-500">🌍</span>
          Filter by Country
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>

        {/* Selected Countries */}
        {selectedCountries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Selected ({selectedCountries.length})</span>
              <button
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((country) => (
                <span
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-200 flex items-center gap-1"
                >
                  {country}
                  <span className="text-xs">✕</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Available Countries */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Available Countries</span>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCountries.includes(country)
                      ? "bg-red-50 text-red-600 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{country}</span>
                    {selectedCountries.includes(country) && <span className="text-red-500">✓</span>}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">No countries found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
