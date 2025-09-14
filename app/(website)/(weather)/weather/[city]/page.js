"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import WeatherIcon from "@/components/weather/WeatherIcon";
import HourlyForecast from "@/components/weather/HourlyForcast";
import DailyForecast from "@/components/weather/DailyForcast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import { MapPin, AlertTriangle, BellRing, Search } from "lucide-react";
import formatDate from "@/lib/formatDate";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export async function generateMetadata({ params }) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  try {
    const response = await axios.get("https://api.weatherapi.com/v1/current.json", {
      params: { key: API_KEY, q: params.city },
    });

    const location = response.data.location;
    const current = response.data.current;

    return {
      title: `Weather in ${location.name}, ${location.country} | 15-Day Forecast`,
      description: `${current.condition.text}, ${Math.round(current.temp_c)}°C right now. See hourly and 15-day forecast for ${location.name}.`,
      openGraph: {
        title: `Weather in ${location.name}`,
        description: `${current.condition.text}, High ${current.temp_c}°C. View extended forecast, alerts & air quality.`,
        url: `https://informreaders.com/weather/${params.city}`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Weather Forecast | Inform Readers",
      description: "Search and view 15-day weather forecasts for cities worldwide.",
    };
  }
}


export default function CityWeather() {
  const { city } = useParams();

  const [weatherData, setWeatherData] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [hasAlert, setHasAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: API_KEY,
            q: city,
            days: 15,
            aqi: "yes",
            alerts: "yes",
          },
        });

        const data = response.data;
        setWeatherData(data);
        setIsDay(data.current.is_day === 1);
        setHasAlert(data.alerts && data.alerts.alert && data.alerts.alert.length > 0);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const response = await axios.get("https://api.weatherapi.com/v1/search.json", {
        params: { key: API_KEY, q: searchQuery },
      });
      if (response.data.length > 0) {
        router.push(`/weather/${response.data[0].name.toLowerCase()}`);
      } else {
        setError("City not found. Please try another city.");
      }
    } catch (err) {
      setError("Error searching for city. Please try again.");
    }
  };

  const bgColor = isDay
    ? "bg-gradient-to-b from-blue-500 to-blue-300"
    : "bg-gradient-to-b from-gray-900 to-blue-800";
  const textColor = "text-white";

  return (
    <main className={`min-h-screen ${bgColor} ${textColor}`}>
      <header className="bg-white/10 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin size={24} />
            <h1 className="text-2xl text-white font-bold">
              {isLoading ? "Loading..." : `${weatherData?.location.name}, ${weatherData?.location.country}`}
            </h1>
          </div>
          <form onSubmit={handleSearch} className="flex items-center bg-white/20 rounded-full px-4 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="bg-transparent text-white placeholder-white/70 focus:outline-none"
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-500/70 rounded-lg p-4">
            <p>{error}</p>
          </div>
        )}

        {hasAlert && weatherData?.alerts?.alert?.length > 0 && (
          <div className="mb-6 bg-amber-500/70 rounded-lg p-4 animate-pulse">
            <div className="flex items-start">
              <AlertTriangle size={20} className="mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium">Weather Alert</h3>
                <p className="text-sm opacity-90">{weatherData.alerts.alert[0].headline}</p>
                <p className="text-sm opacity-90">{weatherData.alerts.alert[0].desc}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
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
                <WeatherIcon
                  condition={weatherData?.current.condition.text}
                  size={80}
                  className={textColor}
                  isDay={isDay}
                />
                <div className="ml-4">
                  <h2 className="text-5xl text-white font-bold">
                    {Math.round(weatherData?.current.temp_c)}°C
                  </h2>
                  <p className="text-xl opacity-90">{weatherData?.current.condition.text}</p>
                  <p className="text-sm opacity-70">
                    Last updated: {formatDate(weatherData?.current.last_updated)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center bg-white/20 rounded-full px-3 py-2 hover:bg-white/30">
                  <BellRing size={18} className="mr-2" />
                  <span className="text-sm font-medium">Notify</span>
                </button>
                <button className="flex items-center bg-white/20 rounded-full px-3 py-2 hover:bg-white/30">
                  <span className="text-sm font-medium">°C | °F</span>
                </button>
              </div>
            </div>
          )}

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

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
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
          <WeatherDetails current={weatherData?.current} textColor={textColor} />
        )}

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

        <footer className="mt-8 text-center text-sm opacity-70">
          <p>Weather data provided by WeatherAPI.com</p>
        </footer>
      </div>
    </main>
  );
}
