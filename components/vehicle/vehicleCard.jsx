"use client";
import React from "react";
import { MapPin, Calendar, Compass as GasPump, Battery, Gauge, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
const VehicleCard = ({ vehicle, type = "cars" }) => {
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
            src={
              vehicle.image
                ? vehicle.image === "Not Available"
                  ? "https://via.placeholder.com/300x200?text=No+Image"
                  : vehicle.image
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={vehicle.name}
            className="w-full h-64  object-cover"
            height={256}
            width={256}
          />
        </div>
        <div className=" p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold line-clamp-2 mb-2">{vehicle.name}</h3>
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
              href={`/${type}/${vehicle?.makeId?.slug || vehicle?.make?.slug}/${vehicle.slug}`}
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

export default VehicleCard;
