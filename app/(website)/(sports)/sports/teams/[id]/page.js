// app/sports/teams/[id]/page.jsx
import Link from "next/link";
import { Icon } from "@iconify/react";
import axiosInstance from "@/lib/axiosInstance";

// =======================
// DYNAMIC METADATA
// =======================
export async function generateMetadata({ params }) {
  try {
    const teamResponse = await axiosInstance.get(`/website/team/${params.id}`);
    const team = teamResponse?.data?.team;

    if (!team) {
      return {
        title: "Team Not Found | Inform Readers",
        description: "The team you are looking for does not exist.",
      };
    }

    return {
      title: `${team.name} - Squad, History & Stats | Inform Readers`,
      description:
        team.description?.slice(0, 160) ||
        `Explore ${team.name}'s history, stadium details, squad list, and more.`,
      openGraph: {
        title: `${team.name} | Inform Readers`,
        description:
          team.description?.slice(0, 160) ||
          `Explore ${team.name}'s history, stadium details, squad list, and more.`,
      },
    };
  } catch {
    return {
      title: "Team | Inform Readers",
      description: "Explore team profiles, stadiums, leagues and players.",
    };
  }
}

// =======================
// SERVER COMPONENT
// =======================
export default async function TeamDetailPage({ params }) {
  let team = null;
  let teamPlayers = [];

  try {
    const teamResponse = await axiosInstance.get(`/website/team/${params.id}`);
    if (teamResponse?.data?.error) return NotFoundUI();
    team = teamResponse.data.team;

    const playersResponse = await axiosInstance.get("/website/player", {
      params: { team: team._id },
    });
    if (!playersResponse.data.error) {
      teamPlayers = playersResponse.data.players;
    }
  } catch {
    return NotFoundUI();
  }

  const playersByPosition = teamPlayers.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = [];
    acc[player.position].push(player);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/sports" className="hover:text-red-600">Sports</Link>
            <span>›</span>
            <Link href="/sports/teams" className="hover:text-red-600">Teams</Link>
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
                  {team.alternateName && (
                    <p className="text-xl text-gray-600 mb-3">{team.alternateName}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Badge text={team.gender} color="gray" />
                    {team.shortName && <Badge text={team.shortName} color="blue" />}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <InfoRow label="Country" icon="mdi:earth" value={team.country} />
                {team.formedYear && <InfoRow label="Founded" icon="mdi:calendar" value={team.formedYear} />}
                <InfoRow label="Players" icon="mdi:account-group" value={teamPlayers.length} />
                <InfoRow label="Leagues" icon="mdi:trophy" value={team.leagues?.length || 0} />
              </div>

              {team.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{team.description}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {team.website && <SocialLink href={team.website} icon="mdi:link" label="Official Website" />}
                {team.facebook && <SocialIcon href={team.facebook} icon="mdi:facebook" color="text-blue-600" />}
                {team.twitter && <SocialIcon href={team.twitter} icon="mdi:twitter" color="text-blue-400" />}
                {team.instagram && <SocialIcon href={team.instagram} icon="mdi:instagram" color="text-pink-500" />}
              </div>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stadium + Leagues */}
          <aside className="lg:col-span-1 space-y-6">
            <StadiumInfo stadium={team.stadium} />
            <Competitions leagues={team.leagues} />
          </aside>

          {/* Squad */}
          <section className="lg:col-span-2">
            <Squad playersByPosition={playersByPosition} />
          </section>
        </div>

        {/* Team Statistics */}
        <section className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value={teamPlayers.length} label="Total Players" color="text-red-500" />
            <StatCard value={teamPlayers.filter((p) => p.status === "Active").length} label="Active Players" color="text-blue-500" />
            <StatCard value={Object.keys(playersByPosition).length} label="Positions Covered" color="text-green-500" />
            <StatCard value={team.formedYear ? new Date().getFullYear() - parseInt(team.formedYear) : "N/A"} label="Years Active" color="text-purple-500" />
          </div>
        </section>
      </main>
    </div>
  );
}

// =======================
// REUSABLE COMPONENTS
// =======================
function InfoRow({ label, icon, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-900 flex items-center gap-2">
        <Icon icon={icon} className="w-5 h-5" /> {value}
      </p>
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span className={`px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm font-medium`}>
      {text}
    </span>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={`https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
    >
      <Icon icon={icon} className="w-5 h-5" />
      {label}
    </a>
  );
}

function SocialIcon({ href, icon, color }) {
  return (
    <a
      href={`https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} hover:opacity-80 p-2 rounded-lg hover:bg-gray-50 transition-colors`}
    >
      <Icon icon={icon} className="w-5 h-5" />
    </a>
  );
}

function StadiumInfo({ stadium }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon icon="mdi:stadium" className="w-6 h-6" /> Stadium Information
      </h2>
      {stadium?.name ? (
        <div className="space-y-4">
          <InfoRow label="Stadium Name" icon="mdi:stadium" value={stadium.name} />
          {stadium.location && <InfoRow label="Location" icon="mdi:map-marker" value={stadium.location} />}
          {stadium.capacity && <InfoRow label="Capacity" icon="mdi:account-group" value={stadium.capacity.toLocaleString()} />}
        </div>
      ) : (
        <p className="text-gray-500">No stadium information available</p>
      )}
    </div>
  );
}

function Competitions({ leagues }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon icon="mdi:trophy" className="w-6 h-6" /> Competitions
      </h2>
      {leagues?.length > 0 ? (
        <div className="space-y-3">
          {leagues.map((league) => (
            <Link
              key={league?.league?.idLeague}
              href={`/sports/leagues/${league.league.idLeague}`}
              className="block p-3 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  {league.league.badge ? (
                    <img src={league.league.badge} alt={league.leagueName} className="w-full h-full object-cover" />
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
  );
}

function Squad({ playersByPosition }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Squad</h2>
        <span className="text-gray-600">{Object.values(playersByPosition).flat().length} players</span>
      </div>
      {Object.keys(playersByPosition).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(playersByPosition).map(([position, players]) => (
            <div key={position}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon icon="mdi:soccer" className="w-5 h-5 text-red-500" /> {position} ({players.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {players.map((player) => (
                  <Link
                    key={player.idPlayer}
                    href={`/sports/players/${player.idPlayer}`}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 hover:border-red-200 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {player.thumb ? (
                        <img src={player.thumb} alt={player.name} className="w-full h-full object-cover" />
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
  );
}

function StatCard({ value, label, color }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function NotFoundUI() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Icon icon="mdi:shield" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Not Found</h1>
          <p className="text-gray-600 mb-6">The team you're looking for doesn't exist.</p>
          <Link href="/sports/teams" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Teams
          </Link>
        </div>
      </main>
    </div>
  );
}
