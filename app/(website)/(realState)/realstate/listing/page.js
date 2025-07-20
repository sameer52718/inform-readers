"use client";
import React, { useState } from "react";
import { MapPin, Bed, Bath, Square, Search, DollarSign, Home, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
const PropertyListing = () => {
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const router = useRouter();

  const properties = [
    {
      id: 1,
      title: "Luxury Waterfront Villa",
      description:
        "Stunning waterfront property with panoramic views, modern amenities, and private dock access. Perfect for luxury living.",
      location: "Miami Beach, FL",
      price: "$2,500,000",
      image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
      beds: 5,
      baths: 4,
      sqft: 4200,
      type: "Villa",
    },
    {
      id: 2,
      title: "Downtown Penthouse",
      description:
        "Exclusive penthouse in the heart of downtown with floor-to-ceiling windows and private terrace.",
      location: "New York, NY",
      price: "$3,800,000",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      beds: 3,
      baths: 3,
      sqft: 2800,
      type: "Penthouse",
    },
    {
      id: 3,
      title: "Modern Family Home",
      description: "Spacious family home with open concept living, gourmet kitchen, and landscaped backyard.",
      location: "Los Angeles, CA",
      price: "$1,950,000",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      beds: 4,
      baths: 3,
      sqft: 3200,
      type: "House",
    },
    {
      id: 4,
      title: "Urban Loft",
      description: "Contemporary loft space with industrial features, high ceilings, and city views.",
      location: "Chicago, IL",
      price: "$850,000",
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
      beds: 2,
      baths: 2,
      sqft: 1500,
      type: "Loft",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">Explore Real Estate Listings</h1>
              <p className="text-xl text-white mb-8">
                Discover your dream home or next investment opportunity with our curated property listings.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
              >
                <option value="">Property Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
              >
                <option value="">Price Range</option>
                <option value="0-500000">Under $500,000</option>
                <option value="500000-1000000">$500,000 - $1M</option>
                <option value="1000000-2000000">$1M - $2M</option>
                <option value="2000000+">$2M+</option>
              </select>
            </div>

            <div className="relative">
              <Bed className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
              >
                <option value="">Bedrooms</option>
                <option value="1">1+ Bed</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
              </select>
            </div>

            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
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
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{property.price}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{property.description}</p>

                  <div className="flex items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      <span>{property.beds} beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2" />
                      <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-5 w-5 mr-2" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-600">{property.type}</span>
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => router.push(`/realstate/prop-1`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PropertyListing;
