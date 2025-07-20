"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Clock as ClockIcon,
  Calendar,
  MapPin,
  Sun,
  Calculator,
  Book,
  Globe,
  Search,
  Loader2,
} from "lucide-react";
import { DateTime } from "luxon";
import axiosInstance from "@/lib/axiosInstance";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export default function TimeAndDatePage() {
  const features = [
    {
      name: "World Clock",
      path: "/time-and-date/world-clock",
      icon: ClockIcon,
      description:
        "View current times across multiple cities and time zones worldwide, with real-time updates and customizable displays.",
    },
    {
      name: "Time Zone Converter",
      path: "/time-and-date/time-zone-converter",
      icon: MapPin,
      description:
        "Easily convert times between different zones, perfect for scheduling international meetings or travel planning.",
    },
    {
      name: "Calendar",
      path: "/time-and-date/calendar",
      icon: Calendar,
      description:
        "Access a dynamic calendar with customizable views to plan your events and track important dates.",
    },
    {
      name: "Holidays & Events",
      path: "/time-and-date/holidays",
      icon: Calendar,
      description:
        "Explore global holidays and events, with filters by country and category for easy reference.",
    },
    {
      name: "Astronomical Data",
      path: "/time-and-date/astronomy",
      icon: Sun,
      description: "Discover sunrise, sunset, moon phases, and other celestial events for any location.",
    },
    {
      name: "Calculators",
      path: "/time-and-date/calculators",
      icon: Calculator,
      description:
        "Use time and date calculators for countdowns, age calculations, and business date planning.",
    },
    {
      name: "Learn",
      path: "/time-and-date/learn",
      icon: Book,
      description: "Dive into educational resources about timekeeping, calendars, and global time systems.",
    },
    {
      name: "Weather",
      path: "/time-and-date/weather",
      icon: Globe,
      description: "Check current weather conditions and forecasts for cities around the world.",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([
    { name: "Karachi", zone: "Asia/Karachi" },
    { name: "New York", zone: "America/New_York" },
    { name: "London", zone: "Europe/London" },
    { name: "Tokyo", zone: "Asia/Tokyo" },
  ]);
  const [times, setTimes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch capital cities for search suggestions
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axiosInstance.get("/common/city?capital=true");
        setFilteredCities(data.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Update clock times every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      cities.forEach((city) => {
        const dt = DateTime.now().setZone(city.zone);
        newTimes[city.name] = {
          time: dt.toFormat("hh:mm:ss a"),
          date: dt.toFormat("cccc, LLLL d, yyyy"),
          offset: dt.toFormat("ZZZZ"),
        };
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [cities]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      const filtered = filteredCities.filter((city) =>
        city.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(filteredCities);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Your Ultimate Time and Date Companion
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Discover world clocks, time zone converters, calendars, holidays, and more—all in one place.
          </p>
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for a city (e.g., London, New York)"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-4 pr-12 rounded-full border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            {searchTerm && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCities.map((city) => (
                  <Link
                    key={city._id}
                    href={`/time-and-date/astronomy/${city.name.toLowerCase().replace(/\s+/g, "-")}/${
                      city.country.countryCode
                    }`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {city.name} ({city.country.countryCode})
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* World Clock Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">World Clock</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cities.map((city) => (
                <div key={city.zone} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">{city.name}</h3>
                  <Clock
                    value={times[city.name]?.time}
                    size={120}
                    renderNumbers
                    className="mb-4"
                    hourHandWidth={4}
                    minuteHandWidth={3}
                    secondHandWidth={2}
                    hourMarksWidth={3}
                    renderHourMarks
                    renderMinuteMarks
                  />
                  <p className="text-sm text-gray-500">{times[city.name]?.date}</p>
                  <p className="text-sm text-gray-500">{times[city.name]?.offset}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-6">
            <Link href="/time-and-date/world-clock" className="text-red-600 hover:underline font-medium">
              View Full World Clock
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Time and Date Tools</h2>
            <p className="text-gray-600 mt-2">
              Discover powerful features to stay on top of time, wherever you are.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.path}
                href={feature.path}
                className="flex flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <feature.icon className="h-8 w-8 text-red-600 mr-4" />
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
