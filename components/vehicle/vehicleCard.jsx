import React from "react";
import { MapPin, Calendar, Compass as GasPump, Battery, Gauge, DollarSign } from "lucide-react";

const VehicleCard = ({ vehicle, type }) => {
  const isCar = type === "car";
  const isEV = vehicle.fuelType === "Electric";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img src={vehicle.image} alt={vehicle.title} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold mb-2">{vehicle.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{vehicle.location}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{vehicle.year}</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600">{vehicle.price}</span>
          </div>

          <p className="text-gray-600 mb-4">{vehicle.description}</p>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              {isEV ? (
                <Battery className="h-5 w-5 mr-2 text-red-500" />
              ) : (
                <GasPump className="h-5 w-5 mr-2 text-red-500" />
              )}
              <span>{vehicle.fuelType}</span>
            </div>

            {isCar && "transmission" in vehicle && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Transmission:</span>
                <span>{vehicle.transmission}</span>
              </div>
            )}

            <div className="flex items-center">
              <Gauge className="h-5 w-5 mr-2" />
              <span>{isCar ? `${vehicle.mileage} miles` : `${vehicle.engineSize} cc`}</span>
            </div>

            {!isCar && "bikeType" in vehicle && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Type:</span>
                <span>{vehicle.bikeType}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                isEV ? "bg-red-100 text-red-800" : "bg-red-100 text-red-800"
              }`}
            >
              {vehicle.fuelType}
            </span>
            <button
              className={`text-white px-6 py-2 rounded-lg transition-colors ${
                isCar ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
