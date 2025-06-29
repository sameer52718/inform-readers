"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Holidays from "date-holidays";

const HolidayDetail = () => {
  const { code } = useParams();
  const [countryName, setCountryName] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize date-holidays
  const hd = new Holidays();

  useEffect(() => {
    if (!code) return;

    setIsLoading(true);

    // Initialize holidays for the selected country
    hd.init(code);

    // Get country name
    const countries = hd.getCountries();
    setCountryName(countries[code] || "Unknown Country");

    // Get holidays for the selected year
    const holidayList = hd.getHolidays(year).map((holiday) => ({
      date: holiday.date.split(" ")[0], // Extract date part (YYYY-MM-DD)
      day: new Date(holiday.date).toLocaleDateString("en-US", { weekday: "long" }),
      name: holiday.name,
      type: holiday.type,
      note: holiday.note || "",
    }));

    setHolidays(holidayList);
    setIsLoading(false);
  }, [code, year]);

  // Function to determine text styling based on holiday type
  const getHolidayClass = (type) => {
    switch (type.toLowerCase()) {
      case "public":
        return "text-red-600 font-semibold";
      case "religious":
        return "text-blue-600 font-semibold";
      case "observance":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Handle year change
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  // Generate year options (current year ± 5 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => year - 5 + i);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Holidays in {countryName} ({year})
        </h1>

        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Select Year
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading holidays...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Holidays List</h2>
            {holidays.length === 0 ? (
              <p className="text-gray-600">
                No holidays found for {countryName} in {year}.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Holiday Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {holidays
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((holiday, index) => (
                        <tr key={`${holiday.date}-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(holiday.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holiday.day}</td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${getHolidayClass(holiday.type)}`}
                          >
                            {holiday.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {holiday.type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{holiday.note || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Legend for holiday types */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Legend</h2>
          <div className="flex space-x-6">
            <div>
              <span className="text-red-600 font-semibold">■</span> Public Holiday
            </div>
            <div>
              <span className="text-blue-600 font-semibold">■</span> Religious Holiday
            </div>
            <div>
              <span className="text-green-600">■</span> Observance
            </div>
            <div>
              <span className="text-gray-600">■</span> Other
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HolidayDetail;
