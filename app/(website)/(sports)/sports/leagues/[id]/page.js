"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Icon } from "@iconify/react";

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueId = params.id;

  const [league, setLeague] = useState(null);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        setIsLoading(true);
        // Fetch league details
        const leagueResponse = await axiosInstance.get(`/website/league/${leagueId}`);
        if (leagueResponse.data.error) {
          throw new Error("League not found");
        }
        setLeague(leagueResponse.data.league);

        // Fetch teams for the league
        const teamsResponse = await axiosInstance.get("/website/team", {
          params: { league: leagueResponse?.data?.league?._id, limit: 10000 },
        });
        if (!teamsResponse.data.error) {
          setLeagueTeams(teamsResponse.data.teams);
        }
      } catch (err) {
        setError(handleError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueData();
  }, [leagueId]);

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

  if (error || !league) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Icon icon="mdi:trophy" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">League Not Found</h1>
            <p className="text-gray-600 mb-6">The league you're looking for doesn't exist.</p>
            <Link
              href="/leagues"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Leagues
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
            <Link href="/sports/leagues" className="hover:text-red-600">
              Leagues
            </Link>
            <span>›</span>
            <span className="text-gray-900">{league.name}</span>
          </div>
        </nav>

        {/* League Header */}
        <header className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {league.badge ? (
                  <img src={league.badge} alt={league.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="mdi:trophy" className="w-12 h-12 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{league.name}</h1>
                  {league.alternateName && (
                    <p className="text-xl text-gray-600 mb-3">{league.alternateName}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        league.isCup ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {league.isCup ? "Cup Competition" : "League"}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {league.gender}
                    </span>
                    {league.division && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Division {league.division}
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
                    {league.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Season</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon icon="mdi:calendar" className="w-5 h-5" />
                    {league.currentSeason}
                  </p>
                </div>
                {league.formedYear && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Founded</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Icon icon="mdi:trophy" className="w-5 h-5" />
                      {league.formedYear}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Teams</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon icon="mdi:shield" className="w-5 h-5" />
                    {leagueTeams.length}
                  </p>
                </div>
              </div>

              {league.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{league.description}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {league.website && (
                  <a
                    href={`https://${league.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    <Icon icon="mdi:link" className="w-5 h-5" />
                    Official Website
                  </a>
                )}
                {league.facebook && (
                  <a
                    href={`https://${league.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Icon icon="mdi:facebook" className="w-5 h-5" />
                  </a>
                )}
                {league.twitter && (
                  <a
                    href={`https://${league.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Icon icon="mdi:twitter" className="w-5 h-5" />
                  </a>
                )}
                {league.instagram && (
                  <a
                    href={`https://${league.instagram}`}
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

        {/* Teams in League */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Teams in {league.name}</h2>
            <span className="text-gray-600">{leagueTeams.length} teams</span>
          </div>

          {leagueTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leagueTeams.map((team) => (
                <Link
                  key={team.idTeam}
                  href={`/sports/teams/${team.idTeam}`}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {team.badge ? (
                          <img src={team.badge} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                          <Icon icon="mdi:shield" className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-red-600 transition-colors">
                          {team.name}
                        </h3>
                        {team.shortName && <p className="text-sm text-gray-500">{team.shortName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {team.stadium?.name && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon icon="mdi:stadium" className="w-5 h-5 text-gray-400" />
                          <span>{team.stadium.name}</span>
                        </div>
                      )}
                      {team.formedYear && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-400" />
                          <span>Founded {team.formedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Icon icon="mdi:shield" className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No teams found</h3>
              <p className="text-gray-500">No teams are currently registered in this league.</p>
            </div>
          )}
        </section>

        {/* League Statistics */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">League Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{leagueTeams.length}</div>
              <div className="text-sm text-gray-600">Total Teams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {leagueTeams.reduce((sum, team) => sum + (team.stadium?.capacity || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {league.formedYear ? new Date().getFullYear() - parseInt(league.formedYear) : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {leagueTeams.filter((t) => t.stadium?.capacity && t.stadium.capacity > 50000).length}
              </div>
              <div className="text-sm text-gray-600">Large Stadiums</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}