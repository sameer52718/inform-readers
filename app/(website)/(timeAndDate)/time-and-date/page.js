"use client";

import Link from "next/link";
import { Clock, Calendar, MapPin, Sun, Calculator, Book } from "lucide-react";

export default function TimeAndDatePage() {
  const features = [
    { name: "World Clock", path: "/time-and-date/world-clock", icon: Clock },
    { name: "Time Zone Converter", path: "/time-and-date/time-zone-converter", icon: MapPin },
    { name: "Calendar", path: "/time-and-date/calendar", icon: Calendar },
    { name: "Holidays & Events", path: "/time-and-date/holidays", icon: Calendar },
    { name: "Astronomical Data", path: "/time-and-date/astronomy", icon: Sun },
    { name: "Calculators", path: "/time-and-date/calculators", icon: Calculator },
    { name: "Learn", path: "/time-and-date/learn", icon: Book },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Time and Date</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.path}
              href={feature.path}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors"
            >
              <feature.icon className="h-8 w-8 text-red-600 mr-4" />
              <span className="text-lg font-semibold text-gray-900">{feature.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
