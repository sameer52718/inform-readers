"use client";

import { useState, useMemo } from "react";
import { PureCountryFilter } from "../components/filters/PureCountryFilter";
import { mockTeams, getTeamCountries } from "@/constant/sports";

export default function TeamsPage() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const availableCountries = getTeamCountries();

  const filteredTeams = useMemo(() => {
    return mockTeams.filter((team) => {
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(team.country);
      const matchesSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.alternateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.stadium.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCountry && matchesSearch;
    });
  }, [selectedCountries, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <span className="text-white text-2xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Football Teams</h1>
              <p className="text-gray-600">Explore professional football teams and their home stadiums</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <PureCountryFilter
              selectedCountries={selectedCountries}
              onCountriesChange={setSelectedCountries}
              availableCountries={availableCountries}
            />
          </aside>

          {/* Teams Grid */}
          <section className="lg:col-span-3">
            {filteredTeams.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <article
                    key={team.idTeam}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {team.badge ? (
                              <img src={team.badge} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-red-500 text-xl">🛡️</span>
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
                          <span className="text-gray-400">🌍</span>
                          <span className="font-medium">{team.country}</span>
                        </div>

                        {team.stadium.name && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">🏟️</span>
                            <span>{team.stadium.name}</span>
                          </div>
                        )}

                        {team.stadium.capacity && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">👥</span>
                            <span>{team.stadium.capacity.toLocaleString()} capacity</span>
                          </div>
                        )}

                        {team.formedYear && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">📅</span>
                            <span>Founded {team.formedYear}</span>
                          </div>
                        )}
                      </div>

                      {team.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{team.description}</p>
                      )}

                      {/* Leagues */}
                      {team.leagues.length > 0 && (
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
                          {team.stadium.location && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              📍 {team.stadium.location.split(",")[0]}
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
                            <span className="text-sm">🔗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl text-gray-300 block mb-4">🛡️</span>
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
