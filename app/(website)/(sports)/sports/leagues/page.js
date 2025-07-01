"use client";

import { useState, useEffect, useCallback } from "react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Icon } from "@iconify/react";

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <Icon icon="mdi:filter" className="w-6 h-6 text-red-600" />
          Filters
        </h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Leagues</label>
          <div className="relative">
            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by league name..."
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <div className="relative">
            <Icon icon="mdi:earth" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCountry}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="relative">
            <Icon icon="mdi:account-group" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedGender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Type Filter (Cup/League) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="relative">
            <Icon icon="mdi:trophy" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={isCup}
              onChange={(e) => handleFilterChange("isCup", e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
            >
              <option value="">All Types</option>
              <option value="true">Cup</option>
              <option value="false">League</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <Icon icon="mdi:trophy" className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">World Wide Leagues</h1>
              <p className="text-lg text-gray-600 mt-1">Discover professional leagues from around the world</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium flex items-center gap-2"
          >
            <Icon icon="mdi:filter" className="w-5 h-5" />
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
              <div className="text-center py-16">
                <Icon icon="mdi:loading" className="w-12 h-12 text-red-300 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Loading...</h3>
              </div>
            ) : leagues.length > 0 ? (
              <>
                <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
                  {leagues.map((league) => (
                    <article
                      key={league.idLeague}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                              {league.badge ? (
                                <img
                                  src={league.badge}
                                  alt={league.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon icon="mdi:trophy" className="w-8 h-8 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/sports/leagues/${league.idLeague}`}>
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                  {league.name}
                                </h3>
                              </Link>
                              {league.alternateName && (
                                <p className="text-sm text-gray-500 truncate">{league.alternateName}</p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${league.isCup ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {league.isCup ? "Cup" : "League"}
                          </span>
                        </div>

                        <div className="space-y-3 mb-5">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon icon="mdi:earth" className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-700">{league.country}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">Season {league.currentSeason}</span>
                          </div>

                          {league.formedYear && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon icon="mdi:trophy" className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">Founded {league.formedYear}</span>
                            </div>
                          )}
                        </div>

                        {league.description && (
                          <p className="text-sm text-gray-600 mb-5 line-clamp-2">{league.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium">
                              {league.gender}
                            </span>
                            {league.division && (
                              <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium">
                                Div {league.division}
                              </span>
                            )}
                          </div>

                          {league.website && (
                            <a
                              href={`https://${league.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                            >
                              <Icon icon="mdi:link" className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-10 flex justify-center gap-3">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-5 py-2.5 bg-red-100 text-red-700 rounded-xl disabled:opacity-50 hover:bg-red-200 transition-all font-medium"
                    >
                      Previous
                    </button>
                    <span className="px-5 py-2.5 text-gray-600 font-medium">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabledelitism={pagination.currentPage === pagination.totalPages}
                      className="px-5 py-2.5 bg-red-100 text-red-700 rounded-xl disabled:opacity-50 hover:bg-red-200 transition-all font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Icon icon="mdi:trophy" className="w-12 h-12 text-red-300 mx-auto mb-4" />
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