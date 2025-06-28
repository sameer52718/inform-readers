"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Loader2, Clock } from "lucide-react";

export default function WorldClockPage() {
  const [cities, setCities] = useState([
    { name: "Karachi", zone: "Asia/Karachi" },
    { name: "New York", zone: "America/New_York" },
    { name: "London", zone: "Europe/London" },
    // Add more cities
  ]);
  const [times, setTimes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      cities.forEach((city) => {
        newTimes[city.name] = DateTime.now().setZone(city.zone).toFormat("HH:mm:ss");
      });
      setTimes(newTimes);
      setIsLoading(false);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [cities]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">World Clock</h1>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading clocks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div key={city.name} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{city.name}</h2>
                </div>
                <p className="text-2xl font-mono text-gray-700">{times[city.name]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
