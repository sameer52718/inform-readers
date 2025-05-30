"use client";

import { useState, useEffect } from "react";
import WeatherIcon from "@/components/weather/WeatherIcon";
import HourlyForecast from "@/components/weather/HourlyForcast";
import DailyForecast from "@/components/weather/DailyForcast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import { MapPin, AlertTriangle, BellRing } from "lucide-react";
import axios from "axios";
import formatDate from "@/lib/formatDate";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [hasAlert, setHasAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherByIP = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Step 1: Use IP-based location detection via WeatherAPI's IP lookup
        const ipResponse = await axios.get(`https://api.weatherapi.com/v1/ip.json?key=${API_KEY}&q=auto:ip`);
        const location = ipResponse.data;

        // Step 2: Fetch weather data for the detected location
        const weatherResponse = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: API_KEY,
            q: `${location.lat},${location.lon}`,
            days: 15,
            aqi: "yes",
            alerts: "yes",
          },
        });

        const data = weatherResponse.data;
        setWeatherData(data);

        // Determine if it's daytime based on current hour and location data
        const currentHour = new Date(data.location.localtime).getHours();
        setIsDay(data.current.is_day === 1);

        // Check for weather alerts
        setHasAlert(data.alerts && data.alerts.alert && data.alerts.alert.length > 0);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherByIP();

    return () => controller.abort();
  }, []);

  const bgColor = isDay
    ? "bg-gradient-to-br from-blue-400 to-blue-600"
    : "bg-gradient-to-br from-gray-800 to-blue-900";
  const textColor = "text-white";

  return (
    <main className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-1000 ease-in-out`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with location */}
        <div className="flex items-center justify-between mb-6">
          {isLoading ? (
            <div className="flex items-center animate-pulse">
              <MapPin className={textColor} size={24} />
              <div className="h-8 bg-white/20 rounded w-1/3 ml-2" />
            </div>
          ) : (
            <div className="flex items-center">
              <MapPin className={textColor} size={24} />
              <h1 className={`text-2xl font-bold ml-2 ${textColor}`}>
                {weatherData?.location.name}, {weatherData?.location.country}
              </h1>
            </div>
          )}
        </div>

        {/* Error message if fetch fails */}
        {error && (
          <div className="mb-6 bg-red-500/70 backdrop-blur-md rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="flex-shrink-0 h-5 w-5 text-white mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Error</h3>
                <div className="mt-1 text-sm text-white opacity-90">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather alert if present */}
        {!isLoading && hasAlert && weatherData?.alerts?.alert?.length > 0 && (
          <div className="mb-6 bg-amber-500/70 backdrop-blur-md rounded-lg p-4 animate-pulse">
            <div className="flex items-start">
              <AlertTriangle className="flex-shrink-0 h-5 w-5 text-white mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Weather Alert</h3>
                <div className="mt-1 text-sm text-white opacity-90">
                  <p>{weatherData.alerts.alert[0].headline}</p>
                  <p>{weatherData.alerts.alert[0].desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current weather */}
        <div
          className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl`}
        >
          {isLoading ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between animate-pulse">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4 w-20 h-20 bg-white/20 rounded" />
                <div>
                  <div className="h-12 bg-white/20 rounded w-24 mb-2" />
                  <div className="h-6 bg-white/20 rounded w-32 mb-2" />
                  <div className="h-4 bg-white/20 rounded w-40" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 bg-white/20 rounded-full w-24" />
                <div className="h-10 bg-white/20 rounded-full w-24" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4">
                  <WeatherIcon
                    condition={weatherData?.current.condition.text}
                    size={80}
                    className={textColor}
                    isDay={isDay}
                  />
                </div>
                <div>
                  <h2 className={`text-5xl font-bold ${textColor}`}>
                    {Math.round(weatherData?.current.temp_c)}°C
                  </h2>
                  <p className={`text-xl ${textColor} opacity-90`}>{weatherData?.current.condition.text}</p>
                  <p className={`text-sm ${textColor} opacity-70`}>
                    Last updated: {formatDate(weatherData?.current.last_updated)}
                  </p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 ${textColor}`}>
                <button className="flex items-center bg-white/20 backdrop-blur-md px-3 py-2 rounded-full hover:bg-white/30 transition-colors">
                  <BellRing size={18} className="mr-2" />
                  <span className="text-sm font-medium">Notify</span>
                </button>

                <button
                  className="flex items-center bg-white/20 backdrop-blur-md px-3 py-2 rounded-full hover:bg-white/30 transition-colors"
                  onClick={() => {
                    console.log("Toggle temperature unit");
                  }}
                >
                  <span className="text-sm font-medium">°C | °F</span>
                </button>
              </div>
            </div>
          )}

          {/* Hourly forecast */}
          {isLoading ? (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 animate-pulse">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-3 bg-white/10 rounded-lg">
                    <div className="h-4 bg-white/20 rounded w-1/2 mx-auto mb-2" />
                    <div className="h-8 bg-white/20 rounded w-12 mx-auto mb-2" />
                    <div className="h-4 bg-white/20 rounded w-1/3 mx-auto" />
                  </div>
                ))}
            </div>
          ) : (
            <HourlyForecast forecast={weatherData?.forecast.forecastday[0].hour} />
          )}
        </div>
        {/* Weather details and extra details */}
        {isLoading ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-lg">
                  <div className="h-4 bg-white/20 rounded w-1/2 mb-2" />
                  <div className="h-6 bg-white/20 rounded w-3/4" />
                </div>
              ))}
          </div>
        ) : (
          <>
            <WeatherDetails current={weatherData?.current} textColor={textColor} />
          </>
        )}

        {/* 5-day forecast */}
        {isLoading ? (
          <div className="mt-8 space-y-4 animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/4" />
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-white/20 rounded w-1/4" />
                    <div className="h-8 bg-white/20 rounded w-12" />
                    <div className="h-4 bg-white/20 rounded w-1/3" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <DailyForecast
            forecast={weatherData?.forecast.forecastday}
            textColor={textColor}
            bgColor={bgColor}
          />
        )}

        {/* Footer with attribution */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${textColor} opacity-70`}>Weather data provided by WeatherAPI.com</p>
        </div>
      </div>
    </main>
  );
}
