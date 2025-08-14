"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Monitor,
  Smartphone,
  Apple,
  TabletSmartphone,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Download,
  Shield,
  Zap,
  Trophy,
  Clock,
  Users,
  Award,
  TrendingUp,
  Filter,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { formatLargeNumber } from "@/lib/functions";
import handleError from "@/lib/handleError";

const operatingSystems = [
  { name: "Windows", icon: Monitor, count: "15,000+" },
  { name: "Mac", icon: Apple, count: "8,500+" },
  { name: "Android", icon: Smartphone, count: "12,000+" },
  { name: "iOS", icon: TabletSmartphone, count: "9,200+" },
];

const tags = ["Free", "Paid", "Premium", "Trial"];

export default function SoftwarePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOS, setCurrentOS] = useState("Windows");
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentTag, setCurrentTag] = useState("Free");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/website/software?operatingSystem=${currentOS}&tag=${currentTag}&page=${currentPage}&limit=${pageSize}&search=${searchTerm}&subCategoryId=${currentCategory}`,
          { signal: controller.signal }
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchData();

    return () => controller.abort();
  }, [currentOS, currentTag, currentPage, pageSize, searchTerm, currentCategory]);

  useEffect(() => {
    const getSubCatagories = async () => {
      try {
        const { data } = await axiosInstance.get("/common/subCategory", { params: { category: currentOS } });
        if (!data.error) {
          setCategories(data?.subCategories || []);
        }
      } catch (error) {
        handleError(error);
      }
    };
    getSubCatagories();
  }, [currentOS]);

  const updateFilters = (type, value) => {
    if (type === "os") {
      setCurrentOS(value);
      setCurrentCategory("");
      setCurrentTag("");
    } else if (type === "category") {
      setCurrentCategory(value);
    } else {
      setCurrentTag(value);
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Software Downloads</h1>
              <p className="text-gray-600 mt-1">Safe, secure, and trusted by millions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">10M+</div>
                <div className="text-sm text-gray-500">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-500">Safe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and OS Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Software</label>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for software..."
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Operating Systems */}
            <div className="lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating System</label>
              <div className="grid grid-cols-2 gap-2">
                {operatingSystems.map((os) => {
                  const Icon = os.icon;
                  return (
                    <button
                      key={os.name}
                      onClick={() => updateFilters("os", os.name)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        currentOS === os.name
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{os.name}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 text-xl mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilters("category", "")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    currentCategory === ""
                      ? "bg-red-100 text-red-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Softwares</span>
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => updateFilters("category", category._id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentCategory === category._id
                        ? "bg-red-100 text-red-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* License Type */}
            <div className="bg-white rounded-lg border  border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 text-xl mb-4">License Type</h3>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="license"
                      checked={currentTag === tag}
                      onChange={() => updateFilters("tag", tag)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 text-xl">
                    {currentCategory
                      ? categories.find((item) => item._id === currentCategory)?.name
                      : "All Softwares"}{" "}
                    for {currentOS}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {data?.pagination?.totalItems || 0} software programs available
                  </p>
                </div>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  {[8, 12, 16, 20, 24].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Software List */}
            <div className="space-y-4">
              {isLoading
                ? Array(pageSize)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    ))
                : data?.data.map((software) => (
                    <div
                      key={software._id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={software.logo}
                          alt={software.name}
                          width={64}
                          height={64}
                          className="rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/software/${software._id}`}
                                className="font-semibold text-lg text-gray-900 hover:text-red-600 transition-colors"
                              >
                                {software.name}
                              </Link>
                              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                <span>v{software.version}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>4.5</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  <span>{formatLargeNumber(software.downloadCount)} downloads</span>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-2 line-clamp-2">{software.overview}</p>
                              <div className="flex items-center gap-2 mt-3">
                                {software.tag.map((t) => (
                                  <span
                                    key={t}
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      t === "Free"
                                        ? "bg-green-100 text-green-700"
                                        : t === "Premium"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {t}
                                  </span>
                                ))}
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  {currentOS}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link
                                href={`/software/${software._id}`}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm text-center"
                              >
                                Download
                              </Link>
                              <Link
                                href={`/software/${software._id}`}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm text-center"
                              >
                                Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Pagination */}
            {data && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, data.pagination.totalItems)} of{" "}
                    {data.pagination.totalItems} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                              currentPage === pageNumber
                                ? "bg-red-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      {data.pagination.totalPages > 5 && <span className="px-2 text-gray-500">...</span>}
                    </div>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === data.pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Disclaimer Section */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-6 text-sm leading-relaxed shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Disclaimer</h2>
          <p className="mb-2">
            We do <strong>not host</strong> any software or games on our server. All download links provided
            on this page redirect to third-party websites such as <strong>download.cnet.com</strong>.
          </p>
          <p className="mb-2">
            We are <strong>not responsible</strong> for the content, availability, or any damages resulting
            from the downloads.
          </p>
          <p className="mb-2">
            All rights to the software and games belong to their{" "}
            <strong>respective developers or owners</strong>.
          </p>
          <p>
            If you encounter any issues with a file or link, please{" "}
            <strong>contact the official website</strong> directly.
          </p>
        </div>
      </div>
    </div>
  );
}
