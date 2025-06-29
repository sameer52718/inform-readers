"use client";
import React, { useState, useEffect } from "react";
import { Globe, Info } from "lucide-react";
import { cities } from "@/constant/cities";
import { TimeZoneCard } from "./components/TimeZoneCard";
import { CitySelector } from "./components/CitySelector";
import { TimeInput } from "./components/TimeInput";
import { getTimeInTimezone, convertTimeToTimezone } from "@/lib/timeUtils";

export default function TimeZoneConverter() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [baseTime, setBaseTime] = useState(new Date());
  const [isUsingCurrentTime, setIsUsingCurrentTime] = useState(true);

  // Initialize with some default cities
  useEffect(() => {
    const defaultCities = ["new-york", "london", "tokyo", "sydney"];
    const initialCities = defaultCities.map((id) => cities.find((city) => city.id === id)).filter(Boolean);

    setSelectedCities(
      initialCities.map((city) => ({
        ...city,
        currentTime: getTimeInTimezone(city.timezone),
      }))
    );
  }, []);

  // Update times every second for current time mode
  useEffect(() => {
    let interval;

    if (isUsingCurrentTime) {
      interval = setInterval(() => {
        setBaseTime(new Date());
        setSelectedCities((prev) =>
          prev.map((city) => ({
            ...city,
            currentTime: getTimeInTimezone(city.timezone),
          }))
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUsingCurrentTime]);

  // Update times when base time changes (for custom time mode)
  useEffect(() => {
    if (!isUsingCurrentTime && selectedCities.length > 0) {
      const referenceCity = selectedCities[0];
      setSelectedCities((prev) =>
        prev.map((city) => ({
          ...city,
          currentTime: convertTimeToTimezone(baseTime, referenceCity.timezone, city.timezone),
        }))
      );
    }
  }, [baseTime, isUsingCurrentTime]);

  const handleCitySelect = (city) => {
    const newCity = {
      ...city,
      currentTime: isUsingCurrentTime
        ? getTimeInTimezone(city.timezone)
        : convertTimeToTimezone(baseTime, selectedCities[0]?.timezone || "UTC", city.timezone),
    };

    setSelectedCities((prev) => [...prev, newCity]);
  };

  const handleCityRemove = (cityId) => {
    setSelectedCities((prev) => prev.filter((city) => city.id !== cityId));
  };

  const handleTimeChange = (newTime) => {
    setBaseTime(newTime);
    setIsUsingCurrentTime(false);
  };

  const handleCurrentTimeToggle = () => {
    if (!isUsingCurrentTime) {
      setIsUsingCurrentTime(true);
      setBaseTime(new Date());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Globe size={32} className="text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">World Time Zone Converter</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert time across multiple time zones instantly. Add cities, set specific times, and see the
            corresponding time in all your selected locations.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <CitySelector selectedCities={selectedCities} onCitySelect={handleCitySelect} />

              <TimeInput onTimeChange={handleTimeChange} currentTime={baseTime} />

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-start space-x-2">
                  <Info size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">How it works:</p>
                    <ul className="space-y-1 text-red-700">
                      <li>• Add cities to compare time zones</li>
                      <li>• Use current time for live updates</li>
                      <li>• Set custom time for planning</li>
                      <li>• Remove cities you don't need</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Zone Cards */}
            <div className="lg:col-span-3">
              {selectedCities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {selectedCities.map((city) => (
                    <TimeZoneCard
                      key={city.id}
                      city={city}
                      onRemove={handleCityRemove}
                      isRemovable={selectedCities.length > 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                  <Globe size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cities selected</h3>
                  <p className="text-gray-500 mb-6">Add some cities to start comparing time zones</p>
                  <CitySelector selectedCities={selectedCities} onCitySelect={handleCitySelect} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
