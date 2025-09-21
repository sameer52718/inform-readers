"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, ArrowRight, ChevronDown } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Image from "next/image";
import getTimeAgo from "@/lib/fromNow";

export default function News() {
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
      const { data } = await axiosInstance.get("/website/article", {
        params: { page, limit, type: "blog" },
      });
      if (!data.error) {
        setData((prev) => [...prev, ...data.articles]);
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
    <>
      <header className="backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Crypto News</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </>
  );
}
