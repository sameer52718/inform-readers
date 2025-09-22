// app/sports/players/[id]/page.jsx
import Link from "next/link";
import { Icon } from "@iconify/react";
import axiosInstance from "@/lib/axiosInstance";

// ===================
// DYNAMIC METADATA
// ===================
export async function generateMetadata({ params }) {
  try {
    const playerResponse = await axiosInstance.get(`/website/player/${params.id}`);
    const player = playerResponse?.data?.player;

    if (!player) {
      return {
        title: "Player Not Found | Inform Readers",
        description: "The player you are looking for does not exist.",
      };
    }

    return {
      title: `${player.name} - Stats, Profile & Career | Inform Readers`,
      description:
        player.description?.slice(0, 160) ||
        `Explore profile, stats, and career information of ${player.name}.`,
      openGraph: {
        title: `${player.name} | Inform Readers`,
        description:
          player.description?.slice(0, 160) ||
          `Explore profile, stats, and career information of ${player.name}.`,
      },
    };
  } catch (error) {
    return {
      title: "Player | Inform Readers",
      description: "Explore player profiles, statistics, and career information.",
    };
  }
}

// ===================
// SERVER COMPONENT
// ===================
export default async function PlayerDetailPage({ params }) {
  let player = null;
  let playerTeam = null;

  try {
    const playerResponse = await axiosInstance.get(`/website/player/${params.id}`);
    if (playerResponse?.data?.error) return NotFoundUI();

    player = playerResponse.data.player;

    // Fetch team if exists
    if (player.team?.idTeam) {
      const teamResponse = await axiosInstance.get(`/website/team/${player.team.idTeam}`);
      if (!teamResponse.data.error) {
        playerTeam = teamResponse.data.team;
      }
    }
  } catch (error) {
    return NotFoundUI();
  }

  const age = player?.dateBorn
    ? Math.floor((Date.now() - new Date(player.dateBorn).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

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
            <Link href="/sports/players" className="hover:text-red-600">
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
                  <Icon icon="mdi:account" className="w-12 h-12 text-red-500" />
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
                <InfoRow label="Nationality" icon="mdi:earth" value={player.nationality} />
                {age && <InfoRow label="Age" icon="mdi:cake" value={`${age} years`} />}
                <InfoRow label="Position" icon="mdi:soccer" value={player.position} />
                <InfoRow label="Status" icon="mdi:checkbox-marked-circle" value={player.status} />
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
                  <SocialLink href={player.facebook} icon="mdi:facebook" color="text-blue-600" />
                )}
                {player.twitter && (
                  <SocialLink href={player.twitter} icon="mdi:twitter" color="text-blue-400" />
                )}
                {player.instagram && (
                  <SocialLink href={player.instagram} icon="mdi:instagram" color="text-pink-500" />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Info */}
          <section className="lg:col-span-1">
            <PersonalInfo player={player} />
            {playerTeam && <TeamCard playerTeam={playerTeam} />}
          </section>

          {/* Career Info */}
          <section className="lg:col-span-2">
            <CareerInfo player={player} age={age} />
            {(player.cutout || player.render) && <Gallery player={player} />}
          </section>
        </div>

        {/* Quick Stats */}
        <section className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value={age || "N/A"} label="Age" color="text-red-500" />
            <StatCard value={player.number || "N/A"} label="Jersey Number" color="text-blue-500" />
            <StatCard value={playerTeam ? "1" : "0"} label="Current Team" color="text-green-500" />
            <StatCard
              value={
                player.status === "Active" ? (
                  <Icon icon="mdi:check" className="inline w-8 h-8" />
                ) : (
                  <Icon icon="mdi:close" className="inline w-8 h-8" />
                )
              }
              label="Active Status"
              color="text-purple-500"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

// ===================
// REUSABLE COMPONENTS
// ===================
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

function StatCard({ value, label, color }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function SocialLink({ href, icon, color }) {
  return (
    <a
      href={`https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} hover:opacity-80 p-2 rounded-lg hover:bg-gray-50 transition-colors`}
    >
      <Icon icon={icon} className="w-6 h-6" />
    </a>
  );
}

function NotFoundUI() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Icon icon="mdi:account" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Player Not Found</h1>
          <p className="text-gray-600 mb-6">The player you're looking for doesn't exist.</p>
          <Link
            href="/sports/players"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Players
          </Link>
        </div>
      </main>
    </div>
  );
}

// Components for Personal Info, Career Info, Team Card, and Gallery
function PersonalInfo({ player }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon icon="mdi:information" className="w-6 h-6" />
        Personal Information
      </h2>
      <div className="space-y-4">
        {player.dateBorn && (
          <InfoRow
            label="Date of Birth"
            icon="mdi:cake"
            value={new Date(player.dateBorn).toLocaleDateString()}
          />
        )}
        {player.birthLocation && (
          <InfoRow label="Birth Location" icon="mdi:map-marker" value={player.birthLocation} />
        )}
        {player.height && <InfoRow label="Height" icon="mdi:ruler" value={player.height} />}
        {player.weight && <InfoRow label="Weight" icon="mdi:scale" value={player.weight} />}
        {player.signing && <InfoRow label="Contract Until" icon="mdi:file-sign" value={player.signing} />}
      </div>
    </div>
  );
}

function TeamCard({ playerTeam }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon icon="mdi:shield" className="w-6 h-6" />
        Current Team
      </h2>
      <Link
        href={`/sports/teams/${playerTeam._id}`}
        className="block p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {playerTeam.badge ? (
              <img src={playerTeam.badge} alt={playerTeam.name} className="w-full h-full object-cover" />
            ) : (
              <Icon icon="mdi:shield" className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{playerTeam.name}</p>
            <p className="text-sm text-gray-500">{playerTeam.country}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CareerInfo({ player, age }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Information</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Playing Details</h3>
          <InfoRow label="Primary Position" icon="mdi:soccer" value={player.position} />
          {player.number && <InfoRow label="Jersey Number" icon="mdi:numeric" value={`#${player.number}`} />}
          <InfoRow label="Current Status" icon="mdi:checkbox-marked-circle" value={player.status} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Physical Attributes</h3>
          {player.height && <InfoRow label="Height" icon="mdi:ruler" value={player.height} />}
          {player.weight && <InfoRow label="Weight" icon="mdi:scale" value={player.weight} />}
          <InfoRow label="Gender" icon="mdi:gender-male-female" value={player.gender} />
          {age && <InfoRow label="Age" icon="mdi:cake" value={`${age} years`} />}
        </div>
      </div>
    </div>
  );
}

function Gallery({ player }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {player.thumb && <img src={player.thumb} alt="Profile" className="rounded-lg object-cover" />}
        {player.cutout && <img src={player.cutout} alt="Cutout" className="rounded-lg object-cover" />}
        {player.render && <img src={player.render} alt="Render" className="rounded-lg object-cover" />}
      </div>
    </div>
  );
}
