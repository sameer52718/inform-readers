import React from "react";
import {
  Search,
  DollarSign,
  MapPin,
  Filter,
  Car,
  Battery,
  Compass as GasPump,
  Calendar,
  Bike,
} from "lucide-react";

const FilterSection = ({ type, filters, setFilters }) => {
  const isCar = type === "car";
  const vehicleTypeOptions = isCar
    ? ["Sedan", "SUV", "Hatchback", "Convertible", "Pickup", "Van"]
    : ["Sport", "Cruiser", "Touring", "Adventure", "Scooter", "Dirt"];

  const vehicleIcon = isCar ? (
    <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
  ) : (
    <Bike className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="relative">
          {vehicleIcon}
          <select
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Vehicle Type</option>
            {vehicleTypeOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Price Range</option>
            <option value="0-10000">Under $10,000</option>
            <option value="10000-25000">$10,000 - $25,000</option>
            <option value="25000-50000">$25,000 - $50,000</option>
            <option value="50000+">$50,000+</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Year</option>
            <option value="2023+">2023 & Newer</option>
            <option value="2020-2022">2020 - 2022</option>
            <option value="2015-2019">2015 - 2019</option>
            <option value="2010-2014">2010 - 2014</option>
            <option value="2010-">2009 & Older</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
            {filters.fuelType === "electric" ? (
              <Battery className="h-5 w-5" />
            ) : (
              <GasPump className="h-5 w-5" />
            )}
          </div>
          <select
            name="fuelType"
            value={filters.fuelType}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </div>

        <button
          className={`${
            isCar ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
          } text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Price: Low to High
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Recently Added
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Top Rated
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
