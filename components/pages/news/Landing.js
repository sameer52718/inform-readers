"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, Clock, User, Tag, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import getTimeAgo from "@/lib/fromNow";

export default function NewsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const getData = useCallback(async (page, limit) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/website/article", { params: { page, limit } });
      if (!data.error) {
        setData((prev) => [...prev, ...data.categories]);
        setPagination(data.pagination);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    getData(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize]);

  const loadMore = () => {
    setPagination((prev) => ({ ...prev, currentPage: pagination.currentPage + 1 }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/website/assets/images/fallback/news2.png"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative h-[180px] rounded-xl overflow-hidden">
                    <Image
                      src={`/website/assets/images/fallback/news2.png`}
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
      </section> */}

      {/* News Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          {/* <div className="flex items-center justify-between border-b border-gray-200 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div> */}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <article key={index} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={`/website/assets/images/fallback/news2.png`}
                    alt={`Article ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute space-x-2 top-4 left-4">
                    <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {item?.category?.name}
                    </span>
                    <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {item?.source}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl line-clamp-2 font-semibold mb-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeAgo(item.pubDate)}
                      </span>
                    </div>

                    <a
                      href={item.link}
                      className="flex items-center text-red-600 font-medium hover:text-red-700"
                      target="_blank"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {pagination.totalPages !== pagination.currentPage && (
            <div className="text-center mt-12">
              <button
                className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors inline-flex items-center"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading.." : "Load more articles"}
                <ChevronDown className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
