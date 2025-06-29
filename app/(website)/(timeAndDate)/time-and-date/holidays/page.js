"use client";
import React, { useState, useEffect } from "react";
import Holidays from "date-holidays";
import { Loader2 } from "lucide-react";
import Link from "next/link";
const HolidaysPage = () => {
  const [countries, setCountries] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize date-holidays
  const hd = new Holidays();

  useEffect(() => {
    // Get all countries
    const countryList = hd.getCountries();
    const countryArray = Object.entries(countryList)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Group countries by first letter
    const groupedCountries = countryArray.reduce((acc, country) => {
      const firstLetter = country.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(country);
      return acc;
    }, {});

    setCountries(groupedCountries);

    // Get holidays for the next 7 days (including today)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 6); // Next 7 days

    const holidaysByDate = {};
    countryArray.forEach(({ code, name }) => {
      hd.init(code);
      const holidays = hd.getHolidays(today.getFullYear()).filter((holiday) => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= today && holidayDate <= endDate;
      });

      holidays.forEach((holiday) => {
        const dateKey = holiday.date.split(" ")[0]; // YYYY-MM-DD
        if (!holidaysByDate[dateKey]) {
          holidaysByDate[dateKey] = [];
        }
        holidaysByDate[dateKey].push({ ...holiday, country: name });
      });
    });

    // Convert to array and sort by date
    const upcoming = Object.entries(holidaysByDate)
      .map(([date, holidays]) => ({
        date,
        holidays: holidays.sort((a, b) => a.country.localeCompare(b.country)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    setUpcomingHolidays(upcoming);
    setIsLoading(false);
  }, []);

  // Get color class based on holiday type
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

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Global Holidays</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading holidays...</p>
          </div>
        ) : (
          <>
            {/* Section 1: Countries by Alphabetical Order */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Countries</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {Object.keys(countries)
                  .sort()
                  .map((letter) => (
                    <div key={letter} className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                        {letter}
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {countries[letter].map(({ code, name }) => (
                          <li key={code}>
                            <Link
                              href={`/time-and-date/holidays/${code}`}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </section>

            {/* Section 2: Upcoming Holidays (Next 7 Days) */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Holidays (Next 7 Days)</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {upcomingHolidays.length === 0 ? (
                  <p className="text-gray-600">No holidays in the next 7 days.</p>
                ) : (
                  upcomingHolidays.map(({ date, holidays }) => (
                    <div key={date} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {holidays.map((holiday, index) => (
                          <div
                            key={`${holiday.date}-${holiday.country}-${index}`}
                            className="flex justify-between border-b border-gray-200 py-2"
                          >
                            <span className={getHolidayClass(holiday.type)}>{holiday.name}</span>
                            <span className="text-gray-600">{holiday.country}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default HolidaysPage;
