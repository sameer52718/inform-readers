import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, MapPin } from "lucide-react";
import { cities } from "@/constant/cities";

export const CitySelector = ({ selectedCities, onCitySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const selectedCityIds = selectedCities.map((city) => city.id);
    const available = cities.filter((city) => !selectedCityIds.includes(city.id));
    const filtered = available.filter(
      (city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered.slice(0, 10)); // Limit to 10 results
  }, [searchTerm, selectedCities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    onCitySelect(city);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm"
      >
        <Plus size={20} />
        <span>Add City</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{city.name}</p>
                      <p className="text-sm text-gray-500">
                        {city.country} • UTC{city.offset >= 0 ? `+${city.offset}` : city.offset}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                {searchTerm ? "No cities found" : "Start typing to search cities"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
