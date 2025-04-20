"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, Clock, User, Tag, ArrowRight } from "lucide-react";

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("Latest");

  const tabs = ["Latest", "Popular", "Technology", "Business", "Entertainment"];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Article */}
            <div className="relative group">
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg"
                  alt="Featured news"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block bg-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Technology
                  </span>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    The Future of AI: How Artificial Intelligence Will Transform Industries
                  </h2>
                  <div className="flex items-center text-sm space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />5 hours ago
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      John Smith
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative h-[180px] rounded-xl overflow-hidden">
                    <Image
                      src={`https://images.pexels.com/photos/51854${item}/pexels-photo-51854${item}.jpeg`}
                      alt={`News ${item}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-semibold line-clamp-2 text-white">
                        Breaking News Story {item}
                      </h3>
                      <div className="flex items-center text-sm mt-2">
                        <Clock className="h-4 w-4 mr-1" />3 hours ago
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 mb-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <article key={index} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={`https://images.pexels.com/photos/518${index + 521}/pexels-photo-518${
                      index + 521
                    }.jpeg`}
                    alt={`Article ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Technology
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-red-600 transition-colors">
                    The Rise of Remote Work and Its Impact on Modern Society
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Exploring how the shift to remote work is changing workplace dynamics and urban
                    development...
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />2 hours ago
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />5 min read
                      </span>
                    </div>

                    <Link
                      href={`/news/${index + 1}`}
                      className="flex items-center text-red-600 font-medium hover:text-red-700"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors inline-flex items-center">
              Load more articles
              <ChevronDown className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
