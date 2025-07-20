"use client";

import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import { Loader2, Clock as ClockIcon, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export default function WorldClockPage() {
  const [cities, setCities] = useState([
    { name: "Karachi", zone: "Asia/Karachi" },
    { name: "New York", zone: "America/New_York" },
    { name: "London", zone: "Europe/London" },
  ]);
  const [allCities, setAllCities] = useState([]);
  const [times, setTimes] = useState({});
  const [tableTimes, setTableTimes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeFormat, setTimeFormat] = useState("12h");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // Fetch capital cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axiosInstance.get("/common/city?capital=true");
        setAllCities(data.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []); // No dependencies, runs once

  // Update clock times every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      cities.forEach((city) => {
        const dt = DateTime.now().setZone(city.zone);
        newTimes[city.name] = {
          time: dt.toFormat(timeFormat === "12h" ? "hh:mm:ss a" : "HH:mm:ss"),
          date: dt.toFormat("cccc, LLLL d, yyyy"),
          dst: dt.isInDST ? "DST" : "",
          offset: dt.toFormat("ZZZZ"),
          offsetValue: dt.offset,
        };
      });
      setTimes(newTimes);
    };

    updateTimes(); // Initial call
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [cities, timeFormat]); // Only depends on cities and timeFormat

  const removeCity = useCallback((zone) => {
    setCities((prev) => prev.filter((c) => c.zone !== zone));
  }, []);

  const toggleTimeFormat = useCallback(() => {
    setTimeFormat((prev) => (prev === "12h" ? "24h" : "12h"));
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Debounced search handler
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredCities = allCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCities = [...filteredCities].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    if (key === "name") {
      return direction * a.name.localeCompare(b.name);
    } else if (key === "offset") {
      const offsetA = tableTimes[a.name]?.offsetValue || 0;
      const offsetB = tableTimes[b.name]?.offsetValue || 0;
      return direction * (offsetA - offsetB);
    }
    return 0;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">World Clock</h1>

        {/* Controls */}
        {/* <div className="mb-8 flex gap-4 items-center">
          <button
            onClick={toggleTimeFormat}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            {timeFormat === "12h" ? "Switch to 24h" : "Switch to 12h"}
          </button>
        </div> */}

        {/* City Clocks */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading clocks...</p>
          </div>
        ) : cities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-700">No cities selected</p>
            <p className="mt-2 text-sm text-gray-500">Add a city to view its time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cities.map((city) => (
              <div key={city.zone} className="bg-white rounded-xl shadow-sm p-6 relative">
                <button
                  onClick={() => removeCity(city.zone)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{city.name}</h2>
                </div>
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
                <p className="text-sm text-gray-500">
                  {times[city.name]?.offset} {times[city.name]?.dst}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Table of All Capital Cities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Capital Cities</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md p-2 w-full max-w-md"
            />
          </div>
          {sortedCities.length === 0 ? (
            <p className="text-gray-500">No cities match your search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort("name")} className="flex items-center gap-1">
                        City
                        {sortConfig.key === "name" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort("offset")} className="flex items-center gap-1">
                        Time Zone
                        {sortConfig.key === "offset" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DST
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCities.map((city) => {
                    const dt = DateTime.now().setZone(city.zone);

                    const cityTime = {
                      time: dt.toFormat(timeFormat === "12h" ? "cccc hh:mm:ss a" : "cccc HH:mm:ss"),
                      date: dt.toFormat("LLLL d, yyyy"),
                      dst: dt.isInDST ? "DST" : "",
                      offset: dt.toFormat("ZZZZ"),
                      offsetValue: dt.offset,
                    };

                    return (
                      <tr key={city._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {city.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cityTime?.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cityTime?.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cityTime?.offset}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cityTime?.dst}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
