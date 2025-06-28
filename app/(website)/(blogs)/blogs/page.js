"use client";

import Select from "@/components/ui/Select";
import Textinput from "@/components/ui/Textinput";
import Image from "next/image";
import { Clock, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import getTimeAgo from "@/lib/fromNow";
import Link from "next/link";

// Custom debounce hook
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

const Filters = ({ filters, setFilters, setPagination }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/common/category`, {
          params: { type: "Blog" },
        });
        if (!data.error) {
          setCategories(data.categories);
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!filters.categoryId) return;
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/common/subCategory`, {
          params: { categoryId: filters.categoryId },
        });
        if (!data.error) {
          setSubCategories(data.subCategories);
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, [filters.categoryId]);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <aside className="lg:w-1/4 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="space-y-4">
        {/* Search Filter */}
        <div>
          <Textinput
            type={"search"}
            id={"name"}
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Saerch Blogs..."
            label={"Search by Name"}
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            id="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            options={categories}
            placeholder="All Categories"
            label="Category"
          />
        </div>

        {/* SubCategory Filter */}
        <div>
          <Select
            id="subCategoryId"
            value={filters.subCategoryId}
            onChange={handleFilterChange}
            options={subCategories}
            placeholder="All Subcategories"
            label="Subcategory"
          />
        </div>

        {/* Sort By Filter */}
        <div>
          <Select
            id="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            options={[
              { _id: "createdAt", name: "Published Date" },
              { _id: "name", name: "Name" },
            ]}
            placeholder="Select Sort Field"
            label="Sort By"
          />
        </div>

        {/* Sort Order Filter */}
        <div>
          <Select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            options={[
              { _id: "asc", name: "Ascending" },
              { _id: "desc", name: "Descending" },
            ]}
            placeholder="Select Sort Order"
            label="Sort Order"
          />
        </div>
      </div>
    </aside>
  );
};

export default function NewsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    categoryId: "",
    subCategoryId: "",
    name: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch blogs with filters and pagination
  const fetchData = useCallback(async (page, limit, filters) => {
    try {
      setIsLoading(true);
      const params = { page, limit, ...filters };
      const { data } = await axiosInstance.get("/website/blog", { params });
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

  // Debounced fetch function
  const debouncedFetchData = useDebounce(fetchData, 500);

  const getData = useCallback(
    (page, limit, filters) => {
      debouncedFetchData(page, limit, filters);
    },
    [debouncedFetchData]
  );

  useEffect(() => {
    getData(pagination.currentPage, pagination.pageSize, filters);
  }, [pagination.currentPage, pagination.pageSize, filters, getData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Section */}
            <Filters filters={filters} setFilters={setFilters} setPagination={setPagination} />

            {/* News Grid */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading blogs...</p>
                  </div>
                ) : data.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <svg
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-700">No blogs found</p>
                    <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search term.</p>
                  </div>
                ) : (
                  data.map((item) => (
                    <article key={item?._id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                      <div className="relative h-48">
                        <Image
                          src={item?.image || `/website/assets/images/fallback/news2.png`}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {item?.categoryId?.name || "Uncategorized"}
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
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || isLoading}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages} (Total: {pagination.totalItems}{" "}
                  blogs)
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
