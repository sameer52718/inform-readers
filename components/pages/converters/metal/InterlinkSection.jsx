import React from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Calculator,
  TrendingUp,
  Scale,
  BarChart3,
  Sparkles,
  Globe,
  DollarSign,
} from "lucide-react";

const InterlinkSection = ({ currentMetal = null }) => {
  const metalLinks = [
    {
      name: "Gold",
      symbol: "XAU",
      icon: Sparkles,
      href: "/metals/gold",
      compareHref: "/metals/compare/gold-vs-silver",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      name: "Silver",
      symbol: "XAG",
      icon: Scale,
      href: "/metals/silver",
      compareHref: "/metals/compare/silver-vs-gold",
      color: "from-gray-400 to-gray-600",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
    {
      name: "Platinum",
      symbol: "XPT",
      icon: TrendingUp,
      href: "/metals/platinum",
      compareHref: "/metals/compare/platinum-vs-gold",
      color: "from-slate-400 to-slate-600",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600",
    },
    {
      name: "Palladium",
      symbol: "XPD",
      icon: BarChart3,
      href: "/metals/palladium",
      compareHref: "/metals/compare/palladium-vs-platinum",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  const toolLinks = [
    {
      title: "Currency Converter",
      description: "Convert between 150+ world currencies",
      icon: Globe,
      href: "/converters/currency",
      color: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Metal Comparison",
      description: "Compare prices across precious metals",
      icon: ArrowLeftRight,
      href: "/metals/compare",
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Live Metal Prices",
      description: "Real-time precious metal market rates",
      icon: TrendingUp,
      href: "/metals/prices",
      color: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Investment Calculator",
      description: "Calculate returns on metal investments",
      icon: Calculator,
      href: "/calculators/metal-investment",
      color: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  const filteredMetals = currentMetal
    ? metalLinks.filter((m) => m.name.toLowerCase() !== currentMetal.toLowerCase())
    : metalLinks;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Metal Links */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-red-100 px-4 py-2 rounded-full mb-4">
              <Scale className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">Precious Metals</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Explore Other Metals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare prices and convert currencies for all major precious metals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMetals.map((metal) => {
              const Icon = metal.icon;
              return (
                <div
                  key={metal.symbol}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`h-2 bg-gradient-to-r ${metal.color}`}></div>
                  <div className="p-6">
                    <div
                      className={`w-14 h-14 ${metal.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${metal.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{metal.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium">Symbol: {metal.symbol}</p>

                    <div className="space-y-2">
                      <Link
                        href={metal.href}
                        className="block w-full text-center bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2.5 rounded-lg font-semibold hover:from-gray-900 hover:to-black-500 transition-all text-sm"
                      >
                        View Prices
                      </Link>
                      <Link
                        href={metal.compareHref}
                        className="block w-full text-center border-2 border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
                      >
                        Compare
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Comparisons */}
        <div className="mt-16 bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">Popular Metal Comparisons</h3>
              <p className="text-white/90 max-w-2xl mx-auto">
                Quick access to the most searched precious metal price ratios
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { pair: "Gold vs Silver", href: "/metals/compare/gold-vs-silver" },
                { pair: "Gold vs Platinum", href: "/metals/compare/gold-vs-platinum" },
                { pair: "Silver vs Platinum", href: "/metals/compare/silver-vs-platinum" },
                { pair: "Platinum vs Palladium", href: "/metals/compare/platinum-vs-palladium" },
              ].map((comparison, index) => (
                <Link
                  key={index}
                  href={comparison.href}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <p className="font-semibold text-sm md:text-base">{comparison.pair}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterlinkSection;
