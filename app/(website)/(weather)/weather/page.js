"use client";

import { useState, useEffect } from "react";
import WeatherIcon from "@/components/weather/WeatherIcon";
import HourlyForecast from "@/components/weather/HourlyForcast";
import DailyForecast from "@/components/weather/DailyForcast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import LocationSearch from "@/components/weather/LocationSearch";
import { mockWeatherData, savedLocations, getBackgroundColor, getTextColor } from "@/constant/weather-data";
import { MapPin, AlertTriangle, BellRing } from "lucide-react";

export default function Home() {
  const [weatherData, setWeatherData] = useState(mockWeatherData);
  const [isDay, setIsDay] = useState(true);
  const [hasAlert, setHasAlert] = useState(true);

  useEffect(() => {
    // Determine if it's daytime based on current hour
    const currentHour = new Date().getHours();
    setIsDay(currentHour >= 6 && currentHour < 19);

    // Show weather alert randomly for demo purposes
    setHasAlert(Math.random() > 0.5);
  }, []);

  const handleLocationChange = (locationName) => {
    // In a real app, we would fetch data for the new location
    // For now, we'll just update the location name
    setWeatherData({
      ...weatherData,
      location: {
        ...weatherData.location,
        name: locationName,
      },
    });
  };

  const bgColor = getBackgroundColor(weatherData.current.condition.text, isDay);
  console.log(bgColor);

  return (
    <main className={`min-h-screen bg-white text-white transition-colors duration-1000 ease-in-out`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with location */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className={"text-black-500"} size={24} />
            <h1 className={`text-2xl font-bold ml-2 ${"text-black-500"}`}>
              {weatherData.location.name}, {weatherData.location.country}
            </h1>
          </div>
          {/* <LocationSearch
            savedLocations={savedLocations}
            onLocationSelect={handleLocationChange}
            textColor={"text-black-500"}
          /> */}
        </div>

        {/* Weather alert if present */}
        {hasAlert && (
          <div className="mb-6 bg-amber-500/70 backdrop-blur-md rounded-lg p-4 animate-pulse">
            <div className="flex items-start">
              <AlertTriangle className="flex-shrink-0 h-5 w-5 text-white mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Weather Alert</h3>
                <div className="mt-1 text-sm text-white opacity-90">
                  <p>Heavy rain expected this evening. Potential for local flooding in low-lying areas.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current weather */}
        <div
          className={`bg-red-500 backdrop-blur-md rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4">
                <WeatherIcon
                  condition={weatherData.current.condition.text}
                  size={80}
                  className={"text-white"}
                  isDay={isDay}
                />
              </div>
              <div>
                <h2 className={`text-5xl font-bold text-white`}>
                  {Math.round(weatherData.current.temp_c)}°C
                </h2>
                <p className={`text-xl text-white opacity-90`}>{weatherData.current.condition.text}</p>
                <p className={`text-sm text-white opacity-70`}>
                  Last updated: {weatherData.current.last_updated.split(" ")[1]}
                </p>
              </div>
            </div>

            <div className={`flex items-center space-x-3 text-white`}>
              <button className="flex items-center bg-white/20 backdrop-blur-md px-3 py-2 rounded-full hover:bg-white/30 transition-colors">
                <BellRing size={18} className="mr-2" />
                <span className="text-sm font-medium">Notify</span>
              </button>

              <button
                className="flex items-center bg-white/20 backdrop-blur-md px-3 py-2 rounded-full hover:bg-white/30 transition-colors"
                onClick={() => {
                  // Toggle between C and F
                  console.log("Toggle temperature unit");
                }}
              >
                <span className="text-sm font-medium">°C | °F</span>
              </button>
            </div>
          </div>

          {/* Hourly forecast */}
          <HourlyForecast forecast={weatherData.forecast[0].hour} />
        </div>

        {/* Weather details */}
        <WeatherDetails current={weatherData.current} textColor={"text-black-500"} />

        {/* 5-day forecast */}
        <DailyForecast forecast={weatherData.forecast} textColor={"text-black-500"} />

        {/* Footer with attribution */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${"text-black-500"} opacity-70`}>
            Weather data provided for demonstration purposes
          </p>
        </div>
      </div>
    </main>
  );
}
