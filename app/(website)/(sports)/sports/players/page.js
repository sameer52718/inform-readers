"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Filters = ({ onFilterChange, filters }) => {
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [selectedCountry, setSelectedCountry] = useState(filters.nationality || "");
  const [selectedGender, setSelectedGender] = useState(filters.gender || "");
  const [selectedPosition, setSelectedPosition] = useState(filters.position || "");
  const [selectedTeam, setSelectedTeam] = useState(filters.team || "");

  // Fetch countries and teams for filter
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [countriesResponse, teamsResponse] = await Promise.all([
          axiosInstance.get("/website/league/country"),
          axiosInstance.get("/website/team", { params: { limit: 100 } }),
        ]);
        if (!countriesResponse.data.error) {
          setCountries(countriesResponse.data.countries);
        }
        if (!teamsResponse.data.error) {
          setTeams(teamsResponse.data.teams);
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
    if (key === "nationality") setSelectedCountry(value);
    if (key === "gender") setSelectedGender(value);
    if (key === "position") setSelectedPosition(value);
    if (key === "team") setSelectedTeam(value);
    onFilterChange(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCountry("");
    setSelectedGender("");
    setSelectedPosition("");
    setSelectedTeam("");
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Players</label>
          <div className="relative">
            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by player name..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <select
            value={selectedCountry}
            onChange={(e) => handleFilterChange("nationality", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Nationalities</option>
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

        {/* Position Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            value={selectedPosition}
            onChange={(e) => handleFilterChange("position", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Positions</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => handleFilterChange("team", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
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

export default function PlayersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [players, setPlayers] = useState([]);
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
      const { data } = await axiosInstance.get("/website/player", { params });
      if (!data.error) {
        setPlayers(data.players);
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
              <Icon icon="mdi:account" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Players</h1>
              <p className="text-gray-600">Discover professional players and their career statistics</p>
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

          {/* Players Grid */}
          <section className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <Icon icon="mdi:loading" className="w-16 h-16 text-gray-300 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Loading...</h3>
              </div>
            ) : players.length > 0 ? (
              <>
                <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
                  {players.map((player) => (
                    <Link
                      key={player.idPlayer}
                      href={`/sports/players/${player.idPlayer}`}
                      className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {player.thumb ? (
                                <img
                                  src={player.thumb}
                                  alt={player.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon icon="mdi:account" className="w-6 h-6 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold group-hover:text-red-600 transition-colors">
                                {player.name}
                              </h3>
                              {player.number && <p className="text-sm text-gray-500">#{player.number}</p>}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              player.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {player.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon icon="mdi:earth" className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{player.nationality}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Icon icon="mdi:soccer" className="w-5 h-5 text-gray-400" />
                            <span>{player.position}</span>
                          </div>

                          {player.dateBorn && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon icon="mdi:cake" className="w-5 h-5 text-gray-400" />
                              <span>{new Date(player.dateBorn).toLocaleDateString()}</span>
                              <span className="text-gray-400">
                                (Age{" "}
                                {Math.floor(
                                  (Date.now() - new Date(player.dateBorn).getTime()) /
                                    (365.25 * 24 * 60 * 60 * 1000)
                                )}
                                )
                              </span>
                            </div>
                          )}

                          {player.birthLocation && (
                            <div className="flex items-center gap-2 text-sm">
                              <Icon icon="mdi:map-marker" className="w-5 h-5 text-gray-400" />
                              <span>{player.birthLocation}</span>
                            </div>
                          )}
                        </div>

                        {(player.height || player.weight) && (
                          <div className="flex gap-4 mb-4 text-sm">
                            {player.height && (
                              <div className="flex items-center gap-1">
                                <Icon icon="mdi:ruler" className="w-5 h-5 text-gray-400" />
                                <span>{player.height}</span>
                              </div>
                            )}
                            {player.weight && (
                              <div className="flex items-center gap-1">
                                <Icon icon="mdi:scale" className="w-5 h-5 text-gray-400" />
                                <span>{player.weight}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {player.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{player.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {player.gender}
                            </span>
                            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                              {player.position}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {player.facebook && (
                              <a
                                href={`https:///${player.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <Icon icon="mdi:facebook" className="w-4 h-4" />
                              </a>
                            )}
                            {player.twitter && (
                              <a
                                href={`https:///${player.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-500 p-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <Icon icon="mdi:twitter" className="w-4 h-4" />
                              </a>
                            )}
                            {player.instagram && (
                              <a
                                href={`https:///${player.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-500 hover:text-pink-600 p-1 rounded hover:bg-pink-50 transition-colors"
                              >
                                <Icon icon="mdi:instagram" className="w-4 h-4" />
                              </a>
                            )}
                          </div>
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
                <Icon icon="mdi:account" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No players found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}