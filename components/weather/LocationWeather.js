"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { formatConditionIcon } from "@/lib/weather";
import TempToggle from "./TempToggle";

export default function LocationWeather() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState("F");
  const router = useRouter();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`/api/weather/current?lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error("Failed to fetch weather");

          const data = await response.json();
          setLocation(data.location);
          setWeather(data.current);
        } catch (err) {
          setError("Failed to get weather for your location");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied. Please enable location services.");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const getTemp = (tempF, tempC) => {
    return tempUnit === "C" ? Math.round(tempC) : Math.round(tempF);
  };

  const getFeelsLike = (feelsF, feelsC) => {
    return tempUnit === "C" ? Math.round(feelsC) : Math.round(feelsF);
  };

  const viewFullForecast = () => {
    if (location) {
      router.push(`/weather/today/${encodeURIComponent(`${location.name}, ${location.region}`)}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded-sm p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
          <span className="text-gray-700">Getting your location...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-300 rounded-sm p-6">
        <div className="flex items-center text-red-700 mb-3">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Location Error</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weather || !location) {
    return (
      <div className="bg-white border border-gray-300 rounded-sm p-6">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Get weather for your current location</p>
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
          >
            Get My Weather
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            {location.name}, {location.region}
          </h2>
        </div>
        <TempToggle onToggle={setTempUnit} />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={formatConditionIcon(weather.condition.icon)}
          alt={weather.condition.text}
          className="w-16 h-16"
        />
        <div>
          <div className="text-4xl font-bold text-gray-900">
            {getTemp(weather.temp_f, weather.temp_c)}°{tempUnit}
          </div>
          <div className="text-sm text-gray-600">{weather.condition.text}</div>
          <div className="text-sm text-gray-600">
            Feels like {getFeelsLike(weather.feelslike_f, weather.feelslike_c)}°{tempUnit}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Humidity</span>
          <span className="font-medium text-gray-900">{weather.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Wind</span>
          <span className="font-medium text-gray-900">{Math.round(weather.wind_mph)} mph</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Visibility</span>
          <span className="font-medium text-gray-900">{weather.vis_miles} mi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">UV Index</span>
          <span className="font-medium text-gray-900">{weather.uv}</span>
        </div>
      </div>

      <button
        onClick={viewFullForecast}
        className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
      >
        View Full Forecast
      </button>
    </div>
  );
}
