// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { cars } from "@/constant/car-data";

// import {
//   Search,
//   DollarSign,
//   MapPin,
//   Filter,
//   Car,
//   Battery,
//   Compass as GasPump,
//   Calendar,
//   Bike,
//   Gauge,
// } from "lucide-react";
// const FilterSection = ({ type, filters, setFilters }) => {
//   const isCar = type === "car";
//   const vehicleTypeOptions = ["Sedan", "SUV", "Hatchback", "Convertible", "Pickup", "Van"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         <div className="relative">
//           <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Location"
//             name="location"
//             value={filters.location}
//             onChange={handleChange}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//           />
//         </div>

//         <div className="relative">
//           <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <select
//             name="vehicleType"
//             value={filters.vehicleType}
//             onChange={handleChange}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
//           >
//             <option value="">Vehicle Type</option>
//             {vehicleTypeOptions.map((option) => (
//               <option key={option} value={option.toLowerCase()}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="relative">
//           <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <select
//             name="priceRange"
//             value={filters.priceRange}
//             onChange={handleChange}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
//           >
//             <option value="">Price Range</option>
//             <option value="0-10000">Under $10,000</option>
//             <option value="10000-25000">$10,000 - $25,000</option>
//             <option value="25000-50000">$25,000 - $50,000</option>
//             <option value="50000+">$50,000+</option>
//           </select>
//         </div>

//         <div className="relative">
//           <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <select
//             name="year"
//             value={filters.year}
//             onChange={handleChange}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
//           >
//             <option value="">Year</option>
//             <option value="2023+">2023 & Newer</option>
//             <option value="2020-2022">2020 - 2022</option>
//             <option value="2015-2019">2015 - 2019</option>
//             <option value="2010-2014">2010 - 2014</option>
//             <option value="2010-">2009 & Older</option>
//           </select>
//         </div>

//         <div className="relative">
//           <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
//             {filters.fuelType === "electric" ? (
//               <Battery className="h-5 w-5" />
//             ) : (
//               <GasPump className="h-5 w-5" />
//             )}
//           </div>
//           <select
//             name="fuelType"
//             value={filters.fuelType}
//             onChange={handleChange}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
//           >
//             <option value="">Fuel Type</option>
//             <option value="petrol">Petrol</option>
//             <option value="diesel">Diesel</option>
//             <option value="hybrid">Hybrid</option>
//             <option value="electric">Electric</option>
//           </select>
//         </div>

//         <button
//           className={`${
//             isCar ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
//           } text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2`}
//         >
//           <Search className="h-5 w-5" />
//           <span>Search</span>
//         </button>
//       </div>

//       <div className="flex flex-wrap items-center gap-4 mt-4">
//         <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
//           <Filter className="h-4 w-4" />
//           More Filters
//         </button>
//         <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
//           Price: Low to High
//         </button>
//         <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
//           Recently Added
//         </button>
//         <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
//           Top Rated
//         </button>
//       </div>
//     </div>
//   );
// };

// const VehicleCard = ({ vehicle, type }) => {
//   const isCar = type === "car";
//   const isEV = vehicle.fuelType === "Electric";

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
//       <div className="flex flex-col md:flex-row">
//         <div className="md:w-1/3">
//           <img src={vehicle.image} alt={vehicle.title} className="w-full h-64 md:h-full object-cover" />
//         </div>
//         <div className="md:w-2/3 p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-2xl font-semibold mb-2">{vehicle.title}</h3>
//               <div className="flex items-center text-gray-600 mb-2">
//                 <MapPin className="h-4 w-4 mr-1" />
//                 <span>{vehicle.location}</span>
//               </div>
//               <div className="flex items-center text-gray-600 mb-4">
//                 <Calendar className="h-4 w-4 mr-1" />
//                 <span>{vehicle.year}</span>
//               </div>
//             </div>
//             <span className="text-2xl font-bold text-red-600">{vehicle.price}</span>
//           </div>

//           <p className="text-gray-600 mb-4">{vehicle.description}</p>

//           <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 mb-6">
//             <div className="flex items-center">
//               {isEV ? (
//                 <Battery className="h-5 w-5 mr-2 text-red-500" />
//               ) : (
//                 <GasPump className="h-5 w-5 mr-2 text-red-500" />
//               )}
//               <span>{vehicle.fuelType}</span>
//             </div>

//             <div className="flex items-center">
//               <span className="font-medium mr-2">Transmission:</span>
//               <span>{vehicle.transmission}</span>
//             </div>

//             <div className="flex items-center">
//               <Gauge className="h-5 w-5 mr-2" />
//               <span>{`${vehicle.mileage} miles`}</span>
//             </div>
//           </div>

//           <div className="flex justify-between items-center">
//             <span
//               className={`text-sm font-medium px-3 py-1 rounded-full ${
//                 isEV ? "bg-red-100 text-red-800" : "bg-red-100 text-red-800"
//               }`}
//             >
//               {vehicle.fuelType}
//             </span>
//             <button
//               className={`text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors `}
//             >
//               View Details
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CarListing = () => {
//   const [filters, setFilters] = useState({
//     priceRange: "",
//     vehicleType: "",
//     location: "",
//     year: "",
//     fuelType: "",
//     brand: "",
//   });

//   return (
//     <>
//       <div className="bg-gradient-to-br from-red-500 to-red-700 text-white py-16">
//         <div className="container mx-auto px-4">
//           <div className="max-w-3xl mx-auto text-center">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">Find Your Perfect Car</h1>
//               <p className="text-xl text-white mb-8">
//                 Explore our extensive collection of premium cars, from innovative electric vehicles to
//                 powerful petrol engines.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {/* Filters */}
//         <FilterSection type="car" filters={filters} setFilters={setFilters} />

//         {/* Vehicle Grid */}
//         <div className="grid grid-cols-1 gap-8">
//           {cars.map((car) => (
//             <motion.div
//               key={car.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: car.id * 0.1 }}
//             >
//               <VehicleCard vehicle={car} type="car" />
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CarListing;
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Car, Battery, Compass as GasPump, Calendar } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const FilterSection = ({ filters, setFilters, makes, models }) => {
  const fuelTypeOptions = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "OTHER"];

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <div className="relative">
          <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            name="makeId"
            value={filters.makeId || ""}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
          >
            <option value="">Make</option>
            {makes.map((make) => (
              <option key={make._id} value={make._id}>
                {make.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            name="modelId"
            value={filters.modelId || ""}
            onChange={handleChange}
            disabled={!filters.makeId}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white disabled:opacity-50"
          >
            <option value="">Model</option>
            {models.map((model) => (
              <option key={model._id} value={model._id}>
                {model.name}
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
          <img
            src={vehicle.image || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={vehicle.name}
            className="w-full h-64  object-cover"
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
            <a
              href={`/car/${vehicle._id}`}
              className="text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Pagination = ({ pagination, setFilters }) => {
  const { totalPages, currentPage } = pagination;

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50 hover:bg-red-700"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

const CarListing = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12, // 12 vehicles (4 per row, 3 rows)
    search: "",
    makeId: "",
    modelId: "",
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
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch filter data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [makesRes, modelsRes] = await Promise.all([
          axiosInstance.get("/common/make"),
          axiosInstance.get("/common/model"),
        ]);
        setMakes(makesRes.data.data || []);
        setModels(modelsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFilterData();
  }, []);

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
        };

        const { data } = await axiosInstance.get("/website/vehicle", { params });

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
  }, [filters]);

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
        {/* Horizontal Filter Section */}
        <FilterSection filters={filters} setFilters={setFilters} makes={makes} models={models} />
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

export default CarListing;
