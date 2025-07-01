"use client";

import Link from "next/link";
import { Clock, Calendar, MapPin, Sun, Calculator, Book, Globe } from "lucide-react";

export default function TimeAndDatePage() {
  const features = [
    {
      name: "World Clock",
      path: "/time-and-date/world-clock",
      icon: Clock,
      description: "View current times across multiple cities and time zones worldwide, with real-time updates and customizable displays.",
    },
    {
      name: "Time Zone Converter",
      path: "/time-and-date/time-zone-converter",
      icon: MapPin,
      description: "Easily convert times between different zones, perfect for scheduling international meetings or travel planning.",
    },
    {
      name: "Calendar",
      path: "/time-and-date/calendar",
      icon: Calendar,
      description: "Access a dynamic calendar with customizable views to plan your events and track important dates.",
    },
    {
      name: "Holidays & Events",
      path: "/time-and-date/holidays",
      icon: Calendar,
      description: "Explore global holidays and events, with filters by country and category for easy reference.",
    },
    {
      name: "Astronomical Data",
      path: "/time-and-date/astronomy",
      icon: Sun,
      description: "Discover sunrise, sunset, moon phases, and other celestial events for any location.",
    },
    {
      name: "Calculators",
      path: "/time-and-date/calculators",
      icon: Calculator,
      description: "Use time and date calculators for countdowns, age calculations, and business date planning.",
    },
    {
      name: "Learn",
      path: "/time-and-date/learn",
      icon: Book,
      description: "Dive into educational resources about timekeeping, calendars, and global time systems.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Time and Date with Inform Readers</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Explore a comprehensive suite of tools and resources to manage time, plan events, and stay informed about global timekeeping.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Time and Date Tools</h2>
            <p className="text-gray-600 mt-2">Discover powerful features to stay on top of time, wherever you are.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.path}
                href={feature.path}
                className="flex flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <feature.icon className="h-8 w-8 text-red-600 mr-4" />
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}