"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Battery, Compass as GasPump, Calendar } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

const FilterSection = ({ filters, setFilters }) => {
  const fuelTypeOptions = ["PETROL", "ELECTRIC", "OTHER"];

  const yearOptions = [
    { value: "2023+", label: "2023 & Newer" },
    { value: "2020-2022", label: "2020 - 2022" },
    { value: "2015-2019", label: "2015 - 2019" },
    { value: "2010-2014", label: "2010 - 2014" },
    { value: "2010-", label: "2009 & Older" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
      // Reset modelId if makeId changes
      ...(name === "makeId" ? { modelId: undefined } : {}),
      page: 1, // Reset to page 1 on filter change
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicles..."
            name="search"
            value={filters.search || ""}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            name="year"
            value={filters.year || ""}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Year</option>
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
            {filters.vehicleType === "ELECTRIC" ? (
              <Battery className="h-5 w-5" />
            ) : (
              <GasPump className="h-5 w-5" />
            )}
          </div>
          <select
            name="vehicleType"
            value={filters.vehicleType || ""}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Fuel Type</option>
            {fuelTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0) + option.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const VehicleCard = ({ vehicle }) => {
  const isEV = vehicle.vehicleType === "ELECTRIC";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col">
        <div className="">
          <Image
            src={vehicle.image || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={vehicle.name}
            className="w-full h-64  object-cover"
            height={256}
            width={256}
          />
        </div>
        <div className=" p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">{vehicle.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{vehicle.year}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4  text-gray-600 mb-2">
            <div className="flex items-center">
              {isEV ? (
                <Battery className="h-5 w-5 mr-2 text-red-500" />
              ) : (
                <GasPump className="h-5 w-5 mr-2 text-red-500" />
              )}
              <span>{vehicle.vehicleType.charAt(0) + vehicle.vehicleType.slice(1).toLowerCase()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                isEV ? "bg-red-100 text-red-800" : "bg-red-100 text-red-800"
              }`}
            >
              {vehicle.vehicleType.charAt(0) + vehicle.vehicleType.slice(1).toLowerCase()}
            </span>
            <Link
              href={`/bikes/${vehicle?.makeId?.slug}/${vehicle.slug}`}
              className="text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const Pagination = ({ pagination, setFilters }) => {
  const { totalPages, currentPage } = pagination;
  const maxButtons = 5; // Maximum number of page buttons to show

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Calculate the range of pages to display
  const getPageNumbers = () => {
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);

    // Adjust start if end is at totalPages
    if (end === totalPages) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50 hover:bg-red-700"
      >
        Previous
      </button>

      {/* Always show first page */}
      {totalPages > maxButtons && currentPage > Math.floor(maxButtons / 2) + 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            1
          </button>
          {currentPage > Math.floor(maxButtons / 2) + 2 && <span className="px-4 py-2">...</span>}
        </>
      )}

      {/* Render page buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded-md ${
            currentPage === page ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Always show last page */}
      {totalPages > maxButtons && currentPage < totalPages - Math.floor(maxButtons / 2) && (
        <>
          {currentPage < totalPages - Math.floor(maxButtons / 2) - 1 && (
            <span className="px-4 py-2">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50 hover:bg-red-700"
      >
        Next
      </button>
    </div>
  );
};

const BikeListing = () => {
  const { makeSlug } = useParams();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12, // 12 vehicles (4 per row, 3 rows)
    search: "",
    categoryId: "",
    vehicleType: "",
    location: "",
    priceRange: "",
    year: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 12,
  });
  const [loading, setLoading] = useState(false);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const params = {
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")),
          page: filters.page.toString(),
          limit: filters.limit.toString(),
          category: "Bike",
          makeSlug,
        };

        const { data } = await axiosInstance.get("/website/bike", { params });

        setVehicles(data.data || []);
        setPagination(
          data.pagination || {
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            pageSize: 12,
          }
        );
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [filters, makeSlug]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Bikes", href: "/bikes" },
    { label: makeSlug.replace(/-/g, " ") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Find Your Perfect Car</h1>
              <p className="text-xl mb-8">
                Explore our extensive collection of premium cars, from innovative electric vehicles to
                powerful petrol engines.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        {/* Horizontal Filter Section */}
        <FilterSection filters={filters} setFilters={setFilters} />
        {/* Vehicle List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-center text-gray-500">No vehicles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
        {/* Pagination */}
        <Pagination pagination={pagination} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default BikeListing;
