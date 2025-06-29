"use client";

import { useState, useEffect } from "react";
import { formatDistance, addDays, subDays, differenceInDays } from "date-fns";
import { getZonedTime } from "timezone-support";
import { Loader2, Calendar, Clock, Globe } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance"; // Assuming axiosInstance is configured

const Tools = () => {
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  // Date Calculator State
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [daysToAddSub, setDaysToAddSub] = useState(0);
  const [dateCalcResult, setDateCalcResult] = useState(null);

  // Countdown Timer State
  const [targetDateTime, setTargetDateTime] = useState(new Date());
  const [countdown, setCountdown] = useState("");

  // Meeting Planner State
  const [selectedCities, setSelectedCities] = useState([]);
  const [meetingDateTime, setMeetingDateTime] = useState(new Date());
  const [meetingTimes, setMeetingTimes] = useState([]);

  useEffect(() => {
    // Fetch cities for Meeting Planner
    const fetchCities = async () => {
      try {
        const { data } = await axiosInstance.get(`/common/city?capital=true`);
        setCities(data.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Update Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (targetDateTime > now) {
        const distance = formatDistance(targetDateTime, now, { includeSeconds: true });
        setCountdown(distance);
      } else {
        setCountdown("Event has passed!");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateTime]);

  // Date Calculator: Calculate difference or add/subtract days
  const handleDateCalc = () => {
    if (daysToAddSub !== 0) {
      const resultDate =
        daysToAddSub > 0 ? addDays(startDate, daysToAddSub) : subDays(startDate, Math.abs(daysToAddSub));
      setDateCalcResult({
        type: "addSub",
        result: resultDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } else {
      const diff = differenceInDays(endDate, startDate);
      setDateCalcResult({
        type: "difference",
        result: `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""} ${
          diff >= 0 ? "forward" : "backward"
        }`,
      });
    }
  };

  // Meeting Planner: Calculate local times for selected cities
  const handleMeetingPlan = () => {
    const localTimes = selectedCities.map((city) => {
      // Use city's timezone or fall back to user's local timezone
      const timezone = city.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const zonedDateTime = getZonedTime(meetingDateTime, { timeZone: timezone });
      return {
        city: city.name,
        countryCode: city.country.countryCode,
        localTime: zonedDateTime.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
    setMeetingTimes(localTimes);
  };

  // Handle city selection for Meeting Planner
  const handleCityToggle = (city) => {
    setSelectedCities((prev) =>
      prev.some((c) => c.name === city.name) ? prev.filter((c) => c.name !== city.name) : [...prev, city]
    );
  };

  return (
    <main className=" min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Date & Time Tools</h1>

        {/* Date Calculator */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-red-600" />
            Date Calculator
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate)) setStartDate(newDate);
                }}
                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (for difference)
              </label>
              <input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate)) setEndDate(newDate);
                }}
                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days to Add/Subtract</label>
              <input
                type="number"
                value={daysToAddSub}
                onChange={(e) => setDaysToAddSub(parseInt(e.target.value) || 0)}
                placeholder="Enter positive or negative number"
                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <button
              onClick={handleDateCalc}
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Calculate
            </button>
            {dateCalcResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  {dateCalcResult.type === "difference"
                    ? `Difference: ${dateCalcResult.result}`
                    : `Resulting Date: ${dateCalcResult.result}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-red-600" />
            Countdown Timer
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date & Time</label>
              <input
                type="datetime-local"
                value={targetDateTime.toISOString().slice(0, 16)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate)) setTargetDateTime(newDate);
                }}
                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">Time Remaining: {countdown}</p>
            </div>
          </div>
        </div>

        {/* Meeting Planner */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-red-600" />
            Meeting Planner
          </h2>
          {isLoadingCities ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Cities</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {cities.map((city) => (
                    <label key={city?._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCities.some((c) => c.name === city.name)}
                        onChange={() => handleCityToggle(city)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        {city.name} ({city.country.countryCode})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date & Time</label>
                <input
                  type="datetime-local"
                  value={meetingDateTime.toISOString().slice(0, 16)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate)) setMeetingDateTime(newDate);
                  }}
                  className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <button
                onClick={handleMeetingPlan}
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Plan Meeting
              </button>
              {meetingTimes.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Local Times</h3>
                  <ul className="space-y-2">
                    {meetingTimes.map((time, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {time.city} ({time.countryCode}): {time.localTime}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Tools;
