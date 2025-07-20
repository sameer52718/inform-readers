"use client";
import { Bed, Bath, Square, Heart, MapPin, Search, ChevronDown, Home, Building, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const PropertyGrid = () => {
  const router = useRouter();

  const properties = [
    {
      id: 1,
      title: "Cozy Family Home",
      location: "Seattle, WA",
      price: "$750,000",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      beds: 3,
      baths: 2,
      sqft: 2000,
      type: "House",
    },
    {
      id: 2,
      title: "Urban Loft",
      location: "Portland, OR",
      price: "$450,000",
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      beds: 1,
      baths: 1,
      sqft: 950,
      type: "Apartment",
    },
    {
      id: 3,
      title: "Suburban Ranch",
      location: "Austin, TX",
      price: "$580,000",
      image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg",
      beds: 4,
      baths: 2,
      sqft: 2400,
      type: "House",
    },
    {
      id: 4,
      title: "Mountain View Condo",
      location: "Denver, CO",
      price: "$420,000",
      image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: "Condo",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-8">Latest Properties</h2>
        <Link href={"/realstate/listing"} className="text-red-500">
          View More
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-600">{property.type}</span>
                <span className="text-lg font-bold text-red-600">{property.price}</span>
              </div>

              <h3 className="text-lg font-semibold mb-2" onClick={() => router.push(`/realstate/prop-1`)}>
                {property.title}
              </h3>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.beds} beds</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.baths} baths</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  const router = useRouter();
  const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Beverly Hills, CA",
      price: "$2,500,000",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      beds: 4,
      baths: 3,
      sqft: 3200,
    },
    {
      id: 2,
      title: "Waterfront Apartment",
      location: "Miami Beach, FL",
      price: "$1,800,000",
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
      beds: 3,
      baths: 2,
      sqft: 2100,
    },
    {
      id: 3,
      title: "Downtown Penthouse",
      location: "New York, NY",
      price: "$3,200,000",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      beds: 5,
      baths: 4,
      sqft: 4500,
    },
  ];

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <Link href={"/realstate/listing"} className="text-red-500">
          View More
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                <Heart className="h-5 w-5 text-red-500" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-4">{property.location}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-red-600">{property.price}</span>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => router.push(`/realstate/prop-1`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState("BUY");
  const [selectedCity, setSelectedCity] = useState("Islamabad");
  const [location, setLocation] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const tabs = [
    { id: "BUY", label: "BUY", icon: Home },
    { id: "RENT", label: "RENT", icon: Building },
    { id: "PROJECTS", label: "PROJECTS", icon: Wrench },
  ];

  const cities = [
    "Islamabad",
    "Karachi",
    "Lahore",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 border-b-2 border-red-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Form */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* City Selector */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">CITY</label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none outline-none bg-white"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Location Input */}
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">LOCATION</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location, area, or neighborhood"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-3 flex items-end">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>FIND</span>
            </button>
          </div>
        </div>

        {/* More Options Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between text-sm">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showMoreOptions ? "rotate-180" : ""}`}
              />
              <span>More Options</span>
            </button>

            <div className="flex flex-wrap items-center space-x-4 mt-2 md:mt-0">
              <button className="text-red-600 hover:text-red-800 transition-colors">Change Currency</button>
              <span className="text-gray-300">|</span>
              <button className="text-red-600 hover:text-red-800 transition-colors">Change Area Unit</button>
              <span className="text-gray-300">|</span>
              <button className="text-red-600 hover:text-red-800 transition-colors">Reset Search</button>
            </div>
          </div>

          {/* Expanded Options */}
          {showMoreOptions && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>Any</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>Any Price</option>
                  <option>Under $500k</option>
                  <option>$500k - $1M</option>
                  <option>$1M - $2M</option>
                  <option>Above $2M</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>Any</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                  <option>5+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RealEstate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div
          className="relative h-[600px] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
            <div className="text-center  mb-8">
              <h1 className="text-4xl text-white md:text-6xl font-bold mb-4">
                Search properties for sale in Pakistan
              </h1>
            </div>

            <SearchBar />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <FeaturedProperties />
          <PropertyGrid />
        </div>
      </main>
    </div>
  );
};

export default RealEstate;
