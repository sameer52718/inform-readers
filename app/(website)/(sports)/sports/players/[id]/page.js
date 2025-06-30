"use client";

import { useParams } from "next/navigation";
import { mockPlayers, mockTeams } from "@/constant/sports";
import Link from "next/link";

export default function PlayerDetailPage() {
  const params = useParams();
  const playerId = params.id;

  const player = mockPlayers.find((p) => p.idPlayer === playerId);
  const playerTeam = player ? mockTeams.find((t) => t.idTeam === player.team) : null;

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <span className="text-6xl text-gray-300 block mb-4">👤</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Player Not Found</h1>
            <p className="text-gray-600 mb-6">The player you're looking for doesn't exist.</p>
            <Link
              href="/players"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Players
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const age = player.dateBorn
    ? Math.floor((Date.now() - new Date(player.dateBorn).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">
              Home
            </Link>
            <span>›</span>
            <Link href="/players" className="hover:text-red-600">
              Players
            </Link>
            <span>›</span>
            <span className="text-gray-900">{player.name}</span>
          </div>
        </nav>

        {/* Player Header */}
        <header className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {player.thumb ? (
                  <img src={player.thumb} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-red-500 text-4xl">👤</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{player.name}</h1>
                  {player.alternateName && (
                    <p className="text-xl text-gray-600 mb-3">{player.alternateName}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        player.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {player.status}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {player.position}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {player.gender}
                    </span>
                    {player.number && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        #{player.number}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nationality</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>🌍</span>
                    {player.nationality}
                  </p>
                </div>
                {age && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>🎂</span>
                      {age} years
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Position</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>⚽</span>
                    {player.position}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>🟢</span>
                    {player.status}
                  </p>
                </div>
              </div>

              {player.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{player.description}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {player.facebook && (
                  <a
                    href={`https://facebook.com/${player.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span>📘</span>
                  </a>
                )}
                {player.twitter && (
                  <a
                    href={`https://twitter.com/${player.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span>🐦</span>
                  </a>
                )}
                {player.instagram && (
                  <a
                    href={`https://instagram.com/${player.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 p-2 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <span>📷</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📋</span>
                Personal Information
              </h2>

              <div className="space-y-4">
                {player.dateBorn && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(player.dateBorn).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {player.birthLocation && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Birth Location</p>
                    <p className="text-gray-700">{player.birthLocation}</p>
                  </div>
                )}

                {player.height && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Height</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>📏</span>
                      {player.height}
                    </p>
                  </div>
                )}

                {player.weight && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Weight</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>⚖️</span>
                      {player.weight}
                    </p>
                  </div>
                )}

                {player.signing && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contract Until</p>
                    <p className="text-gray-700">{player.signing}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Team */}
            {playerTeam && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🛡️</span>
                  Current Team
                </h2>

                <Link
                  href={`/teams/${playerTeam.idTeam}`}
                  className="block p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {playerTeam.badge ? (
                        <img
                          src={playerTeam.badge}
                          alt={playerTeam.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-red-500 text-xl">🛡️</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{playerTeam.name}</p>
                      <p className="text-sm text-gray-500">{playerTeam.country}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </section>

          {/* Career Information */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Playing Details</h3>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Primary Position</p>
                    <p className="font-semibold text-gray-900 text-lg">{player.position}</p>
                  </div>

                  {player.number && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Jersey Number</p>
                      <p className="font-semibold text-gray-900 text-lg">#{player.number}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        player.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : player.status === "Injured"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {player.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Physical Attributes</h3>

                  {player.height && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Height</span>
                      <span className="font-semibold">{player.height}</span>
                    </div>
                  )}

                  {player.weight && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-semibold">{player.weight}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-semibold">{player.gender}</span>
                  </div>

                  {age && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Age</span>
                      <span className="font-semibold">{age} years</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Images */}
            {(player.cutout || player.render) && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {player.thumb && (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={player.thumb}
                        alt={`${player.name} - Profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {player.cutout && (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={player.cutout}
                        alt={`${player.name} - Cutout`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {player.render && (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={player.render}
                        alt={`${player.name} - Render`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Player Statistics */}
        <section className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{age || "N/A"}</div>
              <div className="text-sm text-gray-600">Age</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">{player.number || "N/A"}</div>
              <div className="text-sm text-gray-600">Jersey Number</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">{playerTeam ? "1" : "0"}</div>
              <div className="text-sm text-gray-600">Current Team</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {player.status === "Active" ? "✓" : "✗"}
              </div>
              <div className="text-sm text-gray-600">Active Status</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
