"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Icon } from "@iconify/react";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id;

  const [team, setTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        // Fetch team details
        const teamResponse = await axiosInstance.get(`/website/team/${teamId}`);
        if (teamResponse.data.error) {
          throw new Error("Team not found");
        }
        setTeam(teamResponse.data.team);

        // Fetch players for the team
        const playersResponse = await axiosInstance.get("/website/player", {
          params: { team: teamResponse?.data?.team?._id },
        });
        if (!playersResponse.data.error) {
          setTeamPlayers(playersResponse.data.players);
        }
      } catch (err) {
        setError(handleError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  const playersByPosition = teamPlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Icon icon="mdi:loading" className="w-16 h-16 text-gray-300 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Icon icon="mdi:shield" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Not Found</h1>
            <p className="text-gray-600 mb-6">The team you're looking for doesn't exist.</p>
            <Link
              href="/teams"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Teams
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/sports" className="hover:text-red-600">
              Sports
            </Link>
            <span>›</span>
            <Link href="/sports/teams" className="hover:text-red-600">
              Teams
            </Link>
            <span>›</span>
            <span className="text-gray-900">{team.name}</span>
          </div>
        </nav>

        {/* Team Header */}
        <header className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {team.badge ? (
                  <img src={team.badge} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="mdi:shield" className="w-12 h-12 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{team.name}</h1>
                  {team.alternateName && <p className="text-xl text-gray-600 mb-3">{team.alternateName}</p>}
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {team.gender}
                    </span>
                    {team.shortName && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {team.shortName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Country</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon icon="mdi:earth" className="w-5 h-5" />
                    {team.country}
                  </p>
                </div>
                {team.formedYear && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Founded</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Icon icon="mdi:calendar" className="w-5 h-5" />
                      {team.formedYear}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Players</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon icon="mdi:account-group" className="w-5 h-5" />
                    {teamPlayers.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Leagues</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon icon="mdi:trophy" className="w-5 h-5" />
                    {team.leagues.length}
                  </p>
                </div>
              </div>

              {team.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{team.description}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {team.website && (
                  <a
                    href={`https://${team.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    <Icon icon="mdi:link" className="w-5 h-5" />
                    Official Website
                  </a>
                )}
                {team.facebook && (
                  <a
                    href={`https://${team.facebook}`}
                    target="_blanks"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Icon icon="mdi:facebook" className="w-5 h-5" />
                  </a>
                )}
                {team.twitter && (
                  <a
                    href={`https://${team.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Icon icon="mdi:twitter" className="w-5 h-5" />
                  </a>
                )}
                {team.instagram && (
                  <a
                    href={`https://${team.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 p-2 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <Icon icon="mdi:instagram" className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stadium Information */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:stadium" className="w-6 h-6" />
                Stadium Information
              </h2>

              {team.stadium?.name ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Stadium Name</p>
                    <p className="font-semibold text-gray-900">{team.stadium.name}</p>
                  </div>

                  {team.stadium?.location && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-gray-700">{team.stadium.location}</p>
                    </div>
                  )}

                  {team.stadium?.capacity && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Capacity</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Icon icon="mdi:account-group" className="w-5 h-5" />
                        {team.stadium.capacity.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No stadium information available</p>
              )}
            </div>

            {/* Leagues */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:trophy" className="w-6 h-6" />
                Competitions
              </h2>

              {team.leagues?.length > 0 ? (
                <div className="space-y-3">
                  {team.leagues.map((league) => (
                    <Link
                      key={league.league}
                      href={`/leagues/${league?.league?.idLeague}`}
                      className="block p-3 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          {league.league.badge ? (
                            <img
                              src={league.league.badge}
                              alt={league.leagueName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon icon="mdi:trophy" className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{league.leagueName}</p>
                          <p className="text-sm text-gray-500">{league.league?.country}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No league information available</p>
              )}
            </div>
          </section>

          {/* Squad */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Squad</h2>
                <span className="text-gray-600">{teamPlayers.length} players</span>
              </div>

              {teamPlayers.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(playersByPosition).map(([position, players]) => (
                    <div key={position}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Icon icon="mdi:soccer" className="w-5 h-5 text-red-500" />
                        {position} ({players.length})
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {players.map((player) => (
                          <Link
                            key={player.idPlayer}
                            href={`/players/${player.idPlayer}`}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 hover:border-red-200 transition-colors group"
                          >
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
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                {player.name}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                {player.number && <span>#{player.number}</span>}
                                <span>{player.nationality}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon icon="mdi:account-group" className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No players found</h3>
                  <p className="text-gray-500">No players are currently registered for this team.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Team Statistics */}
        <section className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{teamPlayers.length}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {teamPlayers.filter((p) => p.status === "Active").length}
              </div>
              <div className="text-sm text-gray-600">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {Object.keys(playersByPosition).length}
              </div>
              <div className="text-sm text-gray-600">Positions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {team.formedYear ? new Date().getFullYear() - parseInt(team.formedYear) : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Years Active</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}