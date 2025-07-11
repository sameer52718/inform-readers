"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");

  // Placeholder for news articles
  const newsArticles = [
    { id: 1, title: "Bitcoin Surges Past $100K", date: "2025-07-10", source: "CoinGecko", url: "#" },
    {
      id: 2,
      title: "Ethereum ETF Approval Boosts Market",
      date: "2025-07-09",
      source: "CoinTelegraph",
      url: "#",
    },
    // Add more placeholder articles as needed
  ];

  const filteredArticles = newsArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Crypto News</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-w-[240px]"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  <a href={article.url} className="hover:underline">
                    {article.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">
                  {article.date} • {article.source}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No news articles found</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by CoinGecko API • News updates coming soon</p>
          </div>
        </div>
      </footer>
    </>
  );
}
