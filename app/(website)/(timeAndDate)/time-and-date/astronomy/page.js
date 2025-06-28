"use client";

import { useState, useEffect } from "react";
import SunCalc from "suncalc";
import { Loader2 } from "lucide-react";

export default function AstronomyPage() {
  const [location, setLocation] = useState({ lat: 24.8607, lng: 67.0011 }); // Karachi
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const date = new Date();
    const sunTimes = SunCalc.getTimes(date, location.lat, location.lng);
    // Placeholder for astro.js eclipse/equinox data
    const astroData = {
      nextEclipse: "2025-03-29", // Mock data, replace with astro.js
      equinox: "2025-03-20",
    };
    setData({ sunTimes, astroData });
    setIsLoading(false);
  }, [location]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Astronomical Data</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={`${location.lat}, ${location.lng}`}
            onChange={(e) => {
              const [lat, lng] = e.target.value.split(",").map(Number);
              setLocation({ lat, lng });
            }}
            placeholder="Latitude, Longitude"
            className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600"
          />
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading astronomical data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sunrise & Sunset</h2>
            <p>Sunrise: {data?.sunTimes?.sunrise.toLocaleString()}</p>
            <p>Sunset: {data?.sunTimes?.sunset.toLocaleString()}</p>
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Astronomical Events</h2>
            <p>Next Eclipse: {data?.astroData?.nextEclipse}</p>
            <p>Equinox: {data?.astroData?.equinox}</p>
          </div>
        )}
      </div>
    </main>
  );
}
