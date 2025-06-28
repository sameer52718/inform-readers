"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import { Loader2 } from "lucide-react";

export default function TimeZoneConverterPage() {
  const [fromCity, setFromCity] = useState("Asia/Karachi");
  const [toCity, setToCity] = useState("America/New_York");
  const [dateTime, setDateTime] = useState(DateTime.now().toISO());
  const [result, setResult] = useState(null);

  const cities = [
    { name: "Karachi", zone: "Asia/Karachi" },
    { name: "New York", zone: "America/New_York" },
    { name: "London", zone: "Europe/London" },
    // Add more cities
  ];

  const handleConvert = () => {
    const fromTime = DateTime.fromISO(dateTime, { zone: fromCity });
    const toTime = fromTime.setZone(toCity);
    setResult({
      from: fromTime.toFormat("yyyy-MM-dd HH:mm:ss ZZZZ"),
      to: toTime.toFormat("yyyy-MM-dd HH:mm:ss ZZZZ"),
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Time Zone Converter</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">From</label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600"
              >
                {cities.map((city) => (
                  <option key={city.zone} value={city.zone}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600"
              >
                {cities.map((city) => (
                  <option key={city.zone} value={city.zone}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                value={DateTime.fromISO(dateTime).toFormat("yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setDateTime(DateTime.fromISO(e.target.value).toISO())}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>
          <button
            onClick={handleConvert}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Convert
          </button>
          {result && (
            <div className="mt-6">
              <p className="text-gray-700">
                <strong>{result.from}</strong> in {cities.find((c) => c.zone === fromCity)?.name}
              </p>
              <p className="text-gray-700">
                <strong>{result.to}</strong> in {cities.find((c) => c.zone === toCity)?.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
