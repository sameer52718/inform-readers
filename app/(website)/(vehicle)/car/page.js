"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import VehicleCard from "@/components/vehicle/vehicleCard";
import FilterSection from "@/components/vehicle/FilterSection";
import { cars } from "@/constant/car-data";

const CarListing = () => {
  const [filters, setFilters] = useState({
    priceRange: "",
    vehicleType: "",
    location: "",
    year: "",
    fuelType: "",
    brand: "",
  });

  return (
    <>
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">Find Your Perfect Car</h1>
              <p className="text-xl text-white mb-8">
                Explore our extensive collection of premium cars, from innovative electric vehicles to
                powerful petrol engines.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <FilterSection type="car" filters={filters} setFilters={setFilters} />

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 gap-8">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: car.id * 0.1 }}
            >
              <VehicleCard vehicle={car} type="car" />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CarListing;
