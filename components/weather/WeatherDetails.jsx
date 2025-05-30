"use client";

import { 
  Wind, 
  Droplet, 
  Gauge, 
  Eye, 
  Cloud, 
  Thermometer, 
  Wind as Gust, 
  CloudRain, 
  Sun, 
  AlertOctagon 
} from "lucide-react";

export default function ExtraWeatherDetails({ current, textColor }) {
  if (!current) return null;

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Wind Speed and Direction */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Wind size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Wind Speed</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.wind_kph} km/h
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          Direction: {current.wind_dir} ({current.wind_degree}°)
        </p>
      </div>

      {/* Wind Gust */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Gust size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Wind Gust</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.gust_kph} km/h
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          {current.gust_mph} mph
        </p>
      </div>

      {/* Humidity */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Droplet size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Humidity</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.humidity}%
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>Relative</p>
      </div>

      {/* Pressure */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Gauge size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Pressure</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.pressure_mb} mb
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          {current.pressure_in} inHg
        </p>
      </div>

      {/* Precipitation */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <CloudRain size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Precipitation</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.precip_mm} mm
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          {current.precip_in} in
        </p>
      </div>

      {/* Cloud Cover */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Cloud size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Cloud Cover</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.cloud}%
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>Sky Coverage</p>
      </div>

      {/* Feels Like */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Thermometer size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Feels Like</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {Math.round(current.feelslike_c)}°C
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          {Math.round(current.feelslike_f)}°F
        </p>
      </div>

      {/* Visibility */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Eye size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Visibility</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.vis_km} km
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          {current.vis_miles} mi
        </p>
      </div>

      {/* UV Index */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Sun size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>UV Index</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          {current.uv}
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          {current.uv <= 2 ? "Low" : current.uv <= 5 ? "Moderate" : current.uv <= 7 ? "High" : "Very High"}
        </p>
      </div>

      {/* Air Quality: PM2.5 and PM10 */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <AlertOctagon size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Air Quality</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          PM2.5: {current.air_quality?.pm2_5?.toFixed(1)} μg/m³
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          PM10: {current.air_quality?.pm10?.toFixed(1)} μg/m³
        </p>
      </div>

      {/* Air Quality: CO and NO2 */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <AlertOctagon size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>Air Pollutants</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          CO: {current.air_quality?.co?.toFixed(1)} μg/m³
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          NO2: {current.air_quality?.no2?.toFixed(1)} μg/m³
        </p>
      </div>

      {/* Air Quality: O3 and SO2 */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <AlertOctagon size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>More Pollutants</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          O3: {current.air_quality?.o3?.toFixed(1)} μg/m³
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          SO2: {current.air_quality?.so2?.toFixed(1)} μg/m³
        </p>
      </div>

      {/* Air Quality: AQI Indices */}
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <AlertOctagon size={20} className={textColor} />
          <span className={`text-sm font-medium ${textColor} opacity-70`}>AQI Indices</span>
        </div>
        <p className={`text-lg font-semibold ${textColor}`}>
          US EPA: {current.air_quality?.["us-epa-index"]}
        </p>
        <p className={`text-sm ${textColor} opacity-70`}>
          UK DEFRA: {current.air_quality?.["gb-defra-index"]}
        </p>
      </div>
    </div>
  );
}