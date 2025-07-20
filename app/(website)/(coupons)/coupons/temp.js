"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { couponCategories, deals } from "@/constant/data";

export default function CouponsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Deals");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredDeals = deals.filter((deal) => {
    const matchesCategory = selectedCategory === "All Deals" || deal.category === selectedCategory;
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.store.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">Latest Deals & Coupons</h1>
              <p className="text-xl text-white mb-8">
                Save money with our hand-picked deals and discount codes
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-neutral-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {couponCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals
              .filter((deal) => deal.featured)
              .map((deal) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                    {deal.verified && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 text-neutral-900 text-xs px-2 py-1 rounded-full">
                      Expires {new Date(deal.expiryDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-red-600 font-medium mb-2">{deal.store}</div>
                    <h3 className="text-xl font-semibold mb-3">{deal.title}</h3>
                    <p className="text-neutral-600 text-sm mb-4">{deal.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span>{deal.usedCount} used</span>
                      </div>
                      <button
                        onClick={() => copyCode(deal.code)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {copiedCode === deal.code ? "Copied!" : deal.code}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* All Deals */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals
              .filter((deal) => !deal.featured)
              .map((deal) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                    {deal.verified && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 text-neutral-900 text-xs px-2 py-1 rounded-full">
                      Expires {new Date(deal.expiryDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-red-600 font-medium mb-2">{deal.store}</div>
                    <h3 className="text-xl font-semibold mb-3">{deal.title}</h3>
                    <p className="text-neutral-600 text-sm mb-4">{deal.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span>{deal.usedCount} used</span>
                      </div>
                      <button
                        onClick={() => copyCode(deal.code)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {copiedCode === deal.code ? "Copied!" : deal.code}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
