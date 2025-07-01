"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Home() {
  const stats = [
    { label: "Active Leagues", value: "156", icon: "mdi:trophy" },
    { label: "Total Teams", value: "2,847", icon: "mdi:shield" },
    { label: "Registered Players", value: "45,932", icon: "mdi:account-group" },
    { label: "Countries", value: "67", icon: "mdi:earth" },
  ];

  const features = [
    {
      title: "Leagues",
      description: "Browse and manage football leagues from around the world",
      href: "/sports/leagues",
      icon: "mdi:trophy",
      stats: "156 Active Leagues",
    },
    {
      title: "Teams",
      description: "Explore team profiles, stadiums, and league affiliations",
      href: "/sports/teams",
      icon: "mdi:shield",
      stats: "2,847 Teams Worldwide",
    },
    {
      title: "Players",
      description: "Discover player profiles, positions, and career statistics",
      href: "/sports/players",
      icon: "mdi:account-group",
      stats: "45,932 Active Players",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
            Global Sports Data Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access comprehensive information about football leagues, teams, and players from around the world.
            Filter by country, explore detailed profiles, and stay updated with the latest sports data.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-red-600">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
                <Icon icon={stat.icon} className="w-10 h-10 text-red-500" />
              </div>
            </div>
          ))}
        </section>

        {/* Main Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                    <Icon icon={feature.icon} className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-base mb-6 leading-relaxed">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{feature.stats}</span>
                  <Link
                    href={feature.href}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 group-hover:shadow-md"
                  >
                    Explore
                    <Icon icon="mdi:arrow-right" className="w-5 h-5" />
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