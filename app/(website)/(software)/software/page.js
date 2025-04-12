"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Monitor, Smartphone, Apple, TabletSmartphone, Search, ChevronLeft, ChevronRight, Star, Download, Shield, Zap, Trophy, Clock } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

const operatingSystems = [
  { name: "Windows", icon: Monitor },
  { name: "Mac", icon: Apple },
  { name: "Android", icon: Smartphone },
  { name: "iOS", icon: TabletSmartphone },
];

const tags = ["Free", "Paid", "Premium"];


const featuredSoftware = [
  {
    title: "Most Popular",
    icon: Star,
    items: ["Chrome", "Firefox", "VS Code", "Spotify"],
  },
  {
    title: "New Releases",
    icon: Zap,
    items: ["Brave Browser", "Discord", "Slack", "Zoom"],
  },
  {
    title: "Top Rated",
    icon: Trophy,
    items: ["Adobe CC", "Microsoft Office", "AutoCAD", "Photoshop"],
  },
];

const quickStats = [
  {
    icon: Download,
    value: "10M+",
    label: "Downloads",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Secure",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Support",
  },
];

export default function SoftwarePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentOS, setCurrentOS] = useState("Windows");
  const [currentTag, setCurrentTag] = useState("Free");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // default value, adjust as needed


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/website/software?operatingSystem=${currentOS}&tag=${currentTag}&page=${currentPage}&limit=${pageSize}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [currentOS, currentTag, currentPage, pageSize]);

  const updateFilters = (type, value) => {
    if (type === "os") {
      setCurrentOS(value);
    } else {
      setCurrentTag(value);
    }
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Discover Amazing Software
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Find the perfect tools to enhance your digital experience
            </p>
            <div className="flex justify-center gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center px-6 py-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-red-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Browse Software</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
              <input
                type="search"
                placeholder="Search software..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // reset to first page on size change
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {[8, 12, 16, 20, 24].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-3">Operating System</h2>
            <div className="flex flex-wrap gap-2">
              {operatingSystems.map((os) => {
                const Icon = os.icon;
                return (
                  <button
                    key={os.name}
                    onClick={() => updateFilters("os", os.name)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentOS === os.name
                      ? "bg-red-500 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {os.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-3">License Type</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => updateFilters("tag", tag)}
                  className={`px-4 py-2 rounded-lg transition-colors ${currentTag === tag
                    ? "bg-red-500 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array(pageSize)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              ))
            : data?.data.map((software) => (
              <Link
                href={`/software/${software._id}`}
                key={software._id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={software.logo}
                    alt={software.name}
                    width={64}
                    height={64}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-center mb-2">
                    {software.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                    {software.overview}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      v{software.version}
                    </span>
                    {software.tag.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 border border-gray-200 text-gray-600 text-sm rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Pagination */}
        {data && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === pageNumber
                      ? "bg-red-500 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {data.pagination.totalPages > 5 && (
                <span className="px-2">...</span>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === data.pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Featured Software Section */}
        <div className="mt-16 space-y-12">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Software Collections</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredSoftware.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-red-500" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 hover:text-red-500 cursor-pointer">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-16 bg-gradient-to-r from-red-500 via-red-600 to-pink-500 rounded-2xl p-8 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-lg mb-6">
              Join millions of users who trust our software directory for their digital needs.
            </p>
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Browse All Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}