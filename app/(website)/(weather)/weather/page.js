"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Search, MapPin, Sun, Moon } from "lucide-react";
import WeatherIcon from "@/components/weather/WeatherIcon";
import countriesCities from "@/constant/countriesCities";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDay, setIsDay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("Unknown");

  useEffect(() => {
    const fetchWeatherByIP = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Step 1: Get user's location via IP
        const ipResponse = await axios.get(`https://api.weatherapi.com/v1/ip.json?key=${API_KEY}&q=auto:ip`);
        const userCountry = ipResponse.data.country_name;
        setCountry(userCountry);

        // Step 2: Get major cities for the country (fallback to Pakistan if country not in mapping)
        const cities = countriesCities[userCountry] || countryCities.Pakistan;

        // Step 3: Fetch weather for each city
        const promises = cities.map((city) =>
          axios.get("https://api.weatherapi.com/v1/current.json", {
            params: { key: API_KEY, q: city, aqi: "yes" },
          })
        );
        const responses = await Promise.all(promises);
        const data = responses.map((res) => res.data);
        setWeatherData(data);

        // Set daytime based on first city's data
        setIsDay(data[0].current.is_day === 1);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherByIP();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const response = await axios.get("https://api.weatherapi.com/v1/search.json", {
        params: { key: API_KEY, q: searchQuery },
      });
      if (response.data.length > 0) {
        window.location.href = `/weather/${response.data[0].name.toLowerCase()}`;
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
            <h1 className="text-2xl text-white font-bold">{country} Weather</h1>
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4">
                  <div className="h-6 bg-white/20 rounded w-1/2 mb-2" />
                  <div className="h-10 bg-white/20 rounded w-1/3" />
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherData.map((data, index) => (
              <Link href={`/weather/${data.location.name.toLowerCase()}`} key={index}>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl text-white font-semibold">{data.location.name}</h2>
                      <p className="text-sm opacity-70">{data.location.country}</p>
                    </div>
                    <WeatherIcon
                      condition={data.current.condition.text}
                      size={40}
                      isDay={data.current.is_day === 1}
                    />
                  </div>
                  <p className="text-3xl font-bold mt-2">{Math.round(data.current.temp_c)}°C</p>
                  <p className="text-sm">{data.current.condition.text}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-8 text-center text-sm opacity-70">
          <p>Weather data provided by WeatherAPI.com</p>
        </footer>
      </div>
    </main>
  );
}
