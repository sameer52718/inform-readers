"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Filters = ({ onFilterChange, filters }) => {
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [selectedCountry, setSelectedCountry] = useState(filters.country || "");
  const [selectedGender, setSelectedGender] = useState(filters.gender || "");
  const [selectedLeague, setSelectedLeague] = useState(filters.league || "");

  // Fetch countries and leagues for filter
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [countriesResponse, leaguesResponse] = await Promise.all([
          axiosInstance.get("/website/league/country"),
          axiosInstance.get("/website/league", { params: { limit: 100 } }),
        ]);
        if (!countriesResponse.data.error) {
          setCountries(countriesResponse.data.countries);
        }
        if (!leaguesResponse.data.error) {
          setLeagues(leaguesResponse.data.leagues);
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchFiltersData();
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
    if (key === "league") setSelectedLeague(value);
    onFilterChange(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCountry("");
    setSelectedGender("");
    setSelectedLeague("");
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Icon icon="mdi:filter" className="w-5 h-5 text-red-500" />
          Filters
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Teams</label>
          <div className="relative">
            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by team name..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
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

        {/* League Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
          <select
            value={selectedLeague}
            onChange={(e) => handleFilterChange("league", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Leagues</option>
            {leagues.map((league) => (
              <option key={league.idLeague} value={league._id}>
                {league.name}
              </option>
            ))}
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

export default function TeamsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [teams, setTeams] = useState([]);
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
      const { data } = await axiosInstance.get("/website/team", { params });
      if (!data.error) {
        setTeams(data.teams);
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
              <Icon icon="mdi:shield" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Football Teams</h1>
              <p className="text-gray-600">Explore professional football teams and their home stadiums</p>
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

          {/* Teams Grid */}
          <section className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <Icon icon="mdi:loading" className="w-16 h-16 text-gray-300 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Loading...</h3>
              </div>
            ) : teams.length > 0 ? (
              <>
                <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
                  {teams.map((team) => (
                    <Link
                      key={team.idTeam}
                      href={`/sports/teams/${team.idTeam}`}
                      className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {team.badge ? (
                                <img
                                  src={team.badge}
                                  alt={team.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon icon="mdi:shield" className="w-6 h-6 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold group-hover:text-red-600 transition-colors">
                                {team.name}
                              </h3>
                              {team.shortName && <p className="text-sm text-gray-500">{team.shortName}</p>}
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                            {team.gender}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon icon="mdi:earth" className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{team.country}</span>
                          </div>

                          {team.stadium?.name && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon icon="mdi:stadium" className="w-5 h-5 text-gray-400" />
                              <span>{team.stadium.name}</span>
                            </div>
                          )}

                          {team.stadium?.capacity && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon icon="mdi:account-group" className="w-5 h-5 text-gray-400" />
                              <span>{team.stadium.capacity.toLocaleString()} capacity</span>
                            </div>
                          )}

                          {team.formedYear && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-400" />
                              <span>Founded {team.formedYear}</span>
                            </div>
                          )}
                        </div>

                        {team.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{team.description}</p>
                        )}

                        {team.leagues?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Leagues:</p>
                            <div className="flex flex-wrap gap-2">
                              {team.leagues.map((league, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs"
                                >
                                  {league.leagueName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            {team.stadium?.location && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                <Icon icon="mdi:map-marker" className="w-4 h-4 inline mr-1" /> {team.stadium.location.split(",")[0]}
                              </span>
                            )}
                          </div>

                          {team.website && (
                            <a
                              href={team.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Icon icon="mdi:link" className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Link>
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
                <Icon icon="mdi:shield" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}