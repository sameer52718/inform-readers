"use client";

import { useState, useMemo } from "react";
import { PureCountryFilter } from "../components/filters/PureCountryFilter";
import { mockLeagues, getLeagueCountries } from "@/constant/sports";

export default function LeaguesPage() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const availableCountries = getLeagueCountries();

  const filteredLeagues = useMemo(() => {
    return mockLeagues.filter((league) => {
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(league.country);
      const matchesSearch =
        league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.alternateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.country.toLowerCase().includes(searchTerm.toLowerCase());
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
              <span className="text-white text-2xl">🏆</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Football Leagues</h1>
              <p className="text-gray-600">Discover professional football leagues from around the world</p>
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

          {/* Leagues Grid */}
          <section className="lg:col-span-3">
            {filteredLeagues.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeagues.map((league) => (
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
                            <h3 className="text-lg font-semibold group-hover:text-red-600 transition-colors truncate">
                              {league.name}
                            </h3>
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
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{league.gender}</span>
                          {league.division && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              Div {league.division}
                            </span>
                          )}
                        </div>

                        {league.website && (
                          <a
                            href={league.website}
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
