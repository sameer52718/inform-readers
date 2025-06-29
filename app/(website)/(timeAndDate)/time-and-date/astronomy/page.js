"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
const Cities = () => {
  const [allCities, setAllCities] = useState([]);
  const [groupedCities, setGroupedCities] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axiosInstance.get("/common/city?capital=true");
        const cities = data.cities || [];

        // Sort cities alphabetically by name
        const sortedCities = cities.sort((a, b) => a.name.localeCompare(b.name));

        // Group cities by first letter
        const grouped = sortedCities.reduce((acc, city) => {
          const firstLetter = city.name[0].toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          acc[firstLetter].push(city);
          return acc;
        }, {});

        setAllCities(cities);
        setGroupedCities(grouped);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Capital Cities</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading cities...</p>
          </div>
        ) : (
          <section className="bg-white rounded-xl shadow-sm p-6">
            {Object.keys(groupedCities).length === 0 ? (
              <p className="text-gray-600">No capital cities found.</p>
            ) : (
              Object.keys(groupedCities)
                .sort()
                .map((letter) => (
                  <div key={letter} className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                      {letter}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {groupedCities[letter].map((city) => (
                        <li key={city?._id}>
                          <Link
                            href={`/time-and-date/astronomy/${city?.name
                              ?.toLowerCase()
                              ?.replace(/\s+/g, "-")}/${city?.country?.countryCode}`}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {city.name} ({city?.country?.countryCode?.toUpperCase()})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Cities;
