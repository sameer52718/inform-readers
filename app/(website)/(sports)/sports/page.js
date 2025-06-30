"use client";

import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Active Leagues", value: "156", icon: "🏆" },
    { label: "Total Teams", value: "2,847", icon: "🛡️" },
    { label: "Registered Players", value: "45,932", icon: "👤" },
    { label: "Countries", value: "67", icon: "🌍" },
  ];

  const features = [
    {
      title: "Leagues",
      description: "Browse and manage football leagues from around the world",
      href: "/sports/leagues",
      icon: "🏆",
      stats: "156 Active Leagues",
    },
    {
      title: "Teams",
      description: "Explore team profiles, stadiums, and league affiliations",
      href: "/sports/teams",
      icon: "🛡️",
      stats: "2,847 Teams Worldwide",
    },
    {
      title: "Players",
      description: "Discover player profiles, positions, and career statistics",
      href: "/sports/players",
      icon: "👤",
      stats: "45,932 Active Players",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 ">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Sports Data Platform</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive information about football leagues, teams, and players from around the world.
            Filter by country, explore detailed profiles, and stay updated with the latest sports data.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Main Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-base mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{feature.stats}</span>
                  <Link
                    href={feature.href}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Explore
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
