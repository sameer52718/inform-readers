"use client";

import { useState, useMemo } from "react";
import { PureCountryFilter } from "..//components/filters/PureCountryFilter";
import { mockPlayers, getPlayerNationalities } from "@/constant/sports";

export default function PlayersPage() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [positionFilter, setPositionFilter] = useState("");

  const availableCountries = getPlayerNationalities();
  const positions = [...new Set(mockPlayers.map((p) => p.position))].sort();

  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter((player) => {
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(player.nationality);
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.alternateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = !positionFilter || player.position === positionFilter;
      return matchesCountry && matchesSearch && matchesPosition;
    });
  }, [selectedCountries, searchTerm, positionFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <span className="text-white text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Players</h1>
              <p className="text-gray-600">Discover professional players and their career statistics</p>
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

          {/* Players Grid */}
          <section className="lg:col-span-3">
            {filteredPlayers.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlayers.map((player) => (
                  <article
                    key={player.idPlayer}
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
                              <span className="text-red-500 text-xl">👤</span>
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
                          <span className="text-gray-400">🌍</span>
                          <span className="font-medium">{player.nationality}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">⚽</span>
                          <span>{player.position}</span>
                        </div>

                        {player.dateBorn && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">🎂</span>
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
                            <span className="text-gray-400">📍</span>
                            <span>{player.birthLocation}</span>
                          </div>
                        )}
                      </div>

                      {/* Physical Stats */}
                      {(player.height || player.weight) && (
                        <div className="flex gap-4 mb-4 text-sm">
                          {player.height && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">📏</span>
                              <span>{player.height}</span>
                            </div>
                          )}
                          {player.weight && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">⚖️</span>
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
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{player.gender}</span>
                          <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                            {player.position}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {player.facebook && (
                            <a
                              href={`https://facebook.com/${player.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <span className="text-xs">📘</span>
                            </a>
                          )}
                          {player.twitter && (
                            <a
                              href={`https://twitter.com/${player.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-500 p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <span className="text-xs">🐦</span>
                            </a>
                          )}
                          {player.instagram && (
                            <a
                              href={`https://instagram.com/${player.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-500 hover:text-pink-600 p-1 rounded hover:bg-pink-50 transition-colors"
                            >
                              <span className="text-xs">📷</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl text-gray-300 block mb-4">👤</span>
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
