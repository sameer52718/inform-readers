import { Search } from "lucide-react";
import Link from "next/link";
import LocationWeather from "@/components/weather/LocationWeather";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2 text-white">Weather Forecast</h1>
          <p className="text-red-100">Get accurate weather information for your location</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-300 rounded-sm p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Search for Weather</h2>
          <SearchForm />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Your Location</h2>
          <LocationWeather />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-300 rounded-sm p-4">
            <h3 className="font-medium text-gray-900 mb-3">Popular Locations</h3>
            <div className="space-y-2">
              {["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"].map(
                (city) => (
                  <Link
                    key={city}
                    href={`/weather/today/${encodeURIComponent(city)}`}
                    className="block text-red-600 hover:text-red-800 text-sm"
                  >
                    {city}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-sm p-4">
            <h3 className="font-medium text-gray-900 mb-3">Weather Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Current conditions and temperature</li>
              <li>• Hourly forecasts for the next 24 hours</li>
              <li>• 3-day detailed weather outlook</li>
              <li>• Air quality index and pollutant levels</li>
              <li>• Weather alerts and warnings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchForm() {
  return (
    <form action="/weather/search" method="get" className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          name="q"
          placeholder="Enter city, state, or ZIP code"
          className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500"
          required
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:bg-red-700"
      >
        Search
      </button>
    </form>
  );
}
