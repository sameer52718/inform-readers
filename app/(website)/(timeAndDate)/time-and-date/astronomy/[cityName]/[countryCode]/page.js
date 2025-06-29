"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SunCalc from "suncalc";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance"; // Assuming axiosInstance is configured

const AstronomicalDetail = () => {
  const { cityName: citySlug, countryCode } = useParams();

  const cityName = citySlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const [cityData, setCityData] = useState(null);
  const [astronomicalData, setAstronomicalData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Placeholder for equinoxes and eclipses (static data for 2025 as SunCalc doesn't provide this)
  const equinoxes2025 = [
    { date: "2025-03-20", event: "Vernal Equinox" },
    { date: "2025-09-22", event: "Autumnal Equinox" },
  ];
  const eclipses2025 = [
    { date: "2025-03-29", event: "Total Lunar Eclipse" },
    { date: "2025-09-07", event: "Total Lunar Eclipse" },
  ];

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const { data } = await axiosInstance.get(`/common/city`, {
          params: { name: cityName, country: countryCode },
        });
        const city = data.cities.find(
          (c) => c.name.toLowerCase() === cityName.toLowerCase() && c.country.countryCode === countryCode
        );
        console.log(city);

        if (!city) {
          throw new Error("City not found");
        }
        setCityData(city);
      } catch (error) {
        console.error("Error fetching city data:", error);
        setCityData({ name: cityName, countryCode, latitude: null, longitude: null });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCityData();
  }, [cityName, countryCode]);

  useEffect(() => {
    if (!cityData || !cityData.lat || !cityData.lng) return;

    // Calculate astronomical data using SunCalc
    const times = SunCalc.getTimes(selectedDate, cityData.lat, cityData.lng);
    const moonIllumination = SunCalc.getMoonIllumination(selectedDate);
    const moonTimes = SunCalc.getMoonTimes(selectedDate, cityData.lat, cityData.lng);
    // Format times to local timezone
    const formatTime = (date) =>
      date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-";

    // Determine moon phase
    const getMoonPhase = (fraction) => {
      if (fraction === 0) return "New Moon";
      if (fraction < 0.25) return "Waxing Crescent";
      if (fraction === 0.25) return "First Quarter";
      if (fraction < 0.5) return "Waxing Gibbous";
      if (fraction === 0.5) return "Full Moon";
      if (fraction < 0.75) return "Waning Gibbous";
      if (fraction === 0.75) return "Last Quarter";
      if (fraction < 1) return "Waning Crescent";
      return "New Moon";
    };

    // Check if selected date is an equinox or eclipse
    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    const isEquinox = equinoxes2025.find((e) => e.date === selectedDateStr);
    const isEclipse = eclipses2025.find((e) => e.date === selectedDateStr);
    console.log({
      sunrise: formatTime(times.sunrise),
      sunset: formatTime(times.sunset),
      dawn: formatTime(times.dawn),
      dusk: formatTime(times.dusk),
      moonrise: formatTime(moonTimes.rise),
      moonset: formatTime(moonTimes.set),
      moonPhase: getMoonPhase(moonIllumination.phase),
      equinox: isEquinox ? isEquinox.event : "-",
      eclipse: isEclipse ? isEclipse.event : "-",
    });

    setAstronomicalData({
      sunrise: formatTime(times.sunrise),
      sunset: formatTime(times.sunset),
      dawn: formatTime(times.dawn),
      dusk: formatTime(times.dusk),
      moonrise: formatTime(moonTimes.rise),
      moonset: formatTime(moonTimes.set),
      moonPhase: getMoonPhase(moonIllumination.phase),
      equinox: isEquinox ? isEquinox.event : "-",
      eclipse: isEclipse ? isEclipse.event : "-",
    });
  }, [cityData, selectedDate]);

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Astronomical Data for {cityData?.name || cityName} ({countryCode.toUpperCase()})
        </h1>
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h .$t-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading city data...</p>
          </div>
        ) : !cityData?.lat || !cityData?.lng ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-red-600">
              Unable to fetch astronomical data: Latitude and longitude not available for {cityName}.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Astronomical Data for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sunrise</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.sunrise}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sunset</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.sunset}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dawn</td>
                    <td className="px-6 py-4 whitespace-nowrapso wrap text-sm text-gray-900">
                      {astronomicalData.dawn}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dusk</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.dusk}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Moonrise
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.moonrise}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Moonset</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.moonset}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Moon Phase
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.moonPhase}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Equinox</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.equinox}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Eclipse</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {astronomicalData.eclipse}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AstronomicalDetail;
