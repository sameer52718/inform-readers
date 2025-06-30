"use client";

import { useState, useEffect, useCallback } from "react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import debounce from "lodash/debounce";
import Link from "next/link";

const Filters = ({ onFilterChange, filters }) => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [selectedCountry, setSelectedCountry] = useState(filters.country || "");
  const [selectedGender, setSelectedGender] = useState(filters.gender || "");
  const [isCup, setIsCup] = useState(filters.isCup || "");

  // Fetch countries for filter
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axiosInstance.get("/website/league/country");
        if (!data.error) {
          setCountries(data.countries);
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchCountries();
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      onFilterChange({ ...filters, name: value });
    }, 500),
    [filters, onFilterChange]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === "country") setSelectedCountry(value);
    if (key === "gender") setSelectedGender(value);
    if (key === "isCup") setIsCup(value);
    onFilterChange(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCountry("");
    setSelectedGender("");
    setIsCup("");
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <span className="text-red-500">🌍</span>
          Filters
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Leagues</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by league name..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={selectedGender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Type Filter (Cup/League) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={isCup}
            onChange={(e) => handleFilterChange("isCup", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Types</option>
            <option value="true">Cup</option>
            <option value="false">League</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default function LeaguesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
  });

  const fetchData = useCallback(async (page, limit, filters) => {
    try {
      setIsLoading(true);
      const params = { page, limit, ...filters };
      const { data } = await axiosInstance.get("/website/league", { params });
      if (!data.error) {
        setLeagues(data.leagues);
        setPagination(data.pagination);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pagination.currentPage, pagination.pageSize, filters);
  }, [pagination.currentPage, pagination.pageSize, filters, fetchData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <span className="text-white text-2xl">🏆</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Football Leagues</h1>
              <p className="text-gray-600">Discover professional football leagues from around the world</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Filters onFilterChange={handleFilterChange} filters={filters} />
          </aside>

          {/* Leagues Grid */}
          <section className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <span className="text-6xl text-gray-300 block mb-4">⏳</span>
                <h3 className="text-xl font-semibold text-gray-600">Loading...</h3>
              </div>
            ) : leagues.length > 0 ? (
              <>
                <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
                  {leagues.map((league) => (
                    <article
                      key={league.idLeague}
                      className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {league.badge ? (
                                <img
                                  src={league.badge}
                                  alt={league.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-red-500 text-xl">🏆</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/sports/leagues/${league.idLeague}`}>
                                <h3 className="text-lg font-semibold group-hover:text-red-600 transition-colors ">
                                  {league.name}
                                </h3>
                              </Link>
                              {league.alternateName && (
                                <p className="text-sm text-gray-500 truncate">{league.alternateName}</p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              league.isCup ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {league.isCup ? "Cup" : "League"}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">🌍</span>
                            <span className="font-medium">{league.country}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">📅</span>
                            <span>Season {league.currentSeason}</span>
                          </div>

                          {league.formedYear && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400">🏆</span>
                              <span>Founded {league.formedYear}</span>
                            </div>
                          )}
                        </div>

                        {league.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{league.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {league.gender}
                            </span>
                            {league.division && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                Div {league.division}
                              </span>
                            )}
                          </div>

                          {league.website && (
                            <a
                              href={`https://${league.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <span className="text-sm">🔗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl text-gray-300 block mb-4">🏆</span>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No leagues found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
