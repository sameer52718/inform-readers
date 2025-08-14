"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export default function LocationHeader({ location, currentPage = "weather/today" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${currentPage}/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-slate-50 border-b border-gray-300 p-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-600" />
          <div>
            <h1 className="text-lg font-medium text-gray-900">{location}</h1>
            <p className="text-sm text-gray-600">{formatDate()}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter city or ZIP code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-8 pr-3 py-1 text-sm border border-gray-400 rounded-sm bg-white focus:outline-none focus:border-red-500"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
          </div>
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:bg-red-700"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
