"use client";

import Image from "next/image";
import { ChevronDown, Clock, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import getTimeAgo from "@/lib/fromNow";
import Link from "next/link";

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
      const { data } = await axiosInstance.get("/website/blog", { params: { page, limit } });
      if (!data.error) {
        setData(data.blogs);
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <article key={item?._id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={item?.image || `/website/assets/images/fallback/news2.png`}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute space-x-2 top-4 left-4">
                    <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {item?.categoryId?.name}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl line-clamp-2 font-semibold mb-2 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">{item.shortDescription}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeAgo(item.createdAt)}
                      </span>
                    </div>

                    <Link
                      href={`/blogs/${item?.slug}`}
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
